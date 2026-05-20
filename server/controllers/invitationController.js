const Invitation = require("../Modal/Invitation");
const User = require("../Modal/User");
const Tournament = require("../Modal/Tournament");
const mongoose = require("mongoose");

const invitationController = {
  /**
   * POST /api/invitations/send
   * Send a tournament invitation to another player.
   */
  send: async (req, res) => {
    try {
      const {
        sender_id,
        receiver_id,
        receiver_ids, // Handle array of IDs
        tournament_id,
        message,
        sport,
        eventDate,
        startTime,
        endTime,
        venue,
        tournamentName,
      } = req.body;

      if (!sender_id || (!receiver_id && (!receiver_ids || receiver_ids.length === 0))) {
        return res.status(400).json({
          success: false,
          message: "sender_id and at least one receiver are required",
        });
      }

      // IDs to process
      const targetIds = receiver_ids && Array.isArray(receiver_ids) ? receiver_ids : [receiver_id];
      const batchId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Validate IDs
      if (!mongoose.Types.ObjectId.isValid(sender_id)) {
        return res.status(400).json({ success: false, message: "Invalid sender ID format" });
      }

      // Validate sender exists
      const sender = await User.findById(sender_id).select("name");
      if (!sender) {
        return res.status(404).json({ success: false, message: "Sender not found" });
      }

      // Validate tournament exists if provided
      let tournamentData = null;
      if (tournament_id && mongoose.Types.ObjectId.isValid(tournament_id)) {
        tournamentData = await Tournament.findById(tournament_id).select("title startDate endDate status");
      }

      const results = [];
      const io = req.app.get("io");

      for (const rId of targetIds) {
        if (!mongoose.Types.ObjectId.isValid(rId)) continue;
        if (sender_id === rId.toString()) continue;

        const receiver = await User.findById(rId).select("name");
        if (!receiver) continue;

        // Duplicate check
        const existing = await Invitation.findOne({
          senderId: sender_id,
          receiverId: rId,
          tournamentId: tournament_id || null,
          sport: sport || "",
          eventDate: eventDate || null,
        });

        if (existing) continue;

        const invitation = await Invitation.create({
          senderId: sender_id,
          senderName: sender.name,
          receiverId: rId,
          receiverName: receiver.name,
          tournamentId: tournament_id || null,
          tournamentName: tournamentData?.title || tournamentName || "General Invitation",
          message: message?.trim() || "",
          sport: sport || "",
          eventDate: eventDate || null,
          startTime: startTime || "",
          endTime: endTime || "",
          venue: venue || "",
          batchId,
        });

        results.push(invitation);

        if (io) {
          io.to(`user_${rId}`).emit("invitation:new", {
            _id: invitation._id,
            senderName: sender.name,
            tournamentName: invitation.tournamentName,
            message: message?.trim() || "",
          });
        }
      }

      res.status(201).json({
        success: true,
        message: `${results.length} invitations sent successfully`,
        batchId,
        count: results.length,
      });
    } catch (err) {
      console.error("[INVITATION] Send error:", err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/invitations/received/:playerId
   * Get all invitations received by a player.
   */
  getReceived: async (req, res) => {
    try {
      const { playerId } = req.params;
      const { status } = req.query;

      const filter = { receiverId: playerId };
      if (status && ["pending", "accepted", "rejected"].includes(status)) {
        filter.status = status;
      }

      const invitations = await Invitation.find(filter)
        .populate("senderId", "name profileImage")
        .populate("tournamentId", "title startDate endDate sportsType entryFee")
        .sort({ createdAt: -1 })
        .lean();

      // Count unread (pending)
      const pendingCount = await Invitation.countDocuments({
        receiverId: playerId,
        status: "pending",
      });

      res.json({
        success: true,
        invitations,
        pendingCount,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/invitations/sent/:playerId
   * Get all invitations sent by a player.
   */
  getSent: async (req, res) => {
    try {
      const { playerId } = req.params;

      const invitations = await Invitation.find({ senderId: playerId })
        .populate("receiverId", "name profileImage")
        .populate("tournamentId", "title startDate endDate sportsType")
        .sort({ createdAt: -1 })
        .lean();

      res.json({ success: true, invitations });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/invitations/respond
   * Accept or reject an invitation.
   */
  respond: async (req, res) => {
    try {
      const { invitation_id, status } = req.body;

      if (!invitation_id || !status) {
        return res.status(400).json({
          success: false,
          message: "invitation_id and status are required",
        });
      }

      if (!["accepted", "rejected"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'status must be "accepted" or "rejected"',
        });
      }

      const invitation = await Invitation.findById(invitation_id);
      if (!invitation) {
        return res.status(404).json({ success: false, message: "Invitation not found" });
      }

      if (invitation.status !== "pending") {
        return res.status(400).json({
          success: false,
          message: `Invitation already ${invitation.status}`,
        });
      }

      invitation.status = status;
      invitation.respondedAt = new Date();
      await invitation.save();

      // Notify sender via socket
      const io = req.app.get("io");
      if (io) {
        io.to(`user_${invitation.senderId}`).emit("invitation:response", {
          _id: invitation._id,
          receiverName: invitation.receiverName,
          tournamentName: invitation.tournamentName,
          status,
        });
      }

      res.json({
        success: true,
        message: `Invitation ${status}`,
        invitation,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/invitations/tournament/:tournamentId
   * Get all invitations for a tournament (for managers/organizers).
   */
  getByTournament: async (req, res) => {
    try {
      const { tournamentId } = req.params;

      const invitations = await Invitation.find({ tournamentId })
        .populate("senderId", "name")
        .populate("receiverId", "name profileImage")
        .sort({ createdAt: -1 })
        .lean();

      res.json({ success: true, invitations });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/invitations/pending-count/:playerId
   * Get count of pending invitations (for badge).
   */
  getPendingCount: async (req, res) => {
    try {
      const count = await Invitation.countDocuments({
        receiverId: req.params.playerId,
        status: "pending",
      });
      res.json({ success: true, count });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};

module.exports = invitationController;
