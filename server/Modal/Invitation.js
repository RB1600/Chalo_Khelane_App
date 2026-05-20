const mongoose = require("mongoose");

const invitationSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName: {
      type: String,
      required: true,
      trim: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverName: {
      type: String,
      required: true,
      trim: true,
    },
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: false,
    },
    tournamentName: {
      type: String,
      required: false,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    sport: {
      type: String,
      trim: true,
      default: "",
    },
    eventDate: {
      type: Date,
      default: null,
    },
    startTime: {
      type: String,
      default: "",
    },
    endTime: {
      type: String,
      default: "",
    },
    venue: {
      type: String,
      trim: true,
      default: "",
    },
    batchId: {
      type: String,
      default: null,
    },
    respondedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate invitations (same sender → receiver → tournament → date → sport)
invitationSchema.index({ senderId: 1, receiverId: 1, tournamentId: 1, eventDate: 1, sport: 1 }, { unique: true });
invitationSchema.index({ receiverId: 1, status: 1 });
invitationSchema.index({ senderId: 1 });
invitationSchema.index({ tournamentId: 1 });

module.exports = mongoose.model("Invitation", invitationSchema);
