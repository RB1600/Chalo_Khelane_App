// models/SuperPlayers.js
const mongoose = require("mongoose");

const SuperPlayersSchema = new mongoose.Schema({
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tournament",
    required: true
  },
  // Multi-sport: which sport-track this super-players doc belongs to.
  // Optional during migration; becomes required in STEP 16.
  sportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sport",
    default: null,
  },
  round: { type: Number, default: 2 }, // Always round 2
  roundType: { type: String, default: "super_players" },
  players: [
    {
      playerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      playerName: String,
      category: { type: String, default: "Open" },
      points: Number,
      setsWon: Number,
      setsLost: Number,
      won: Number,
      lost: Number,
      played: Number,
      status: { type: String, default: "super_player" },
      sourceRound: Number,
      sourceGroupId: String
    }
  ]
}, { timestamps: true });

// Multi-sport scoping index. Non-unique — STEP 9a additive.
SuperPlayersSchema.index({ tournamentId: 1, sportId: 1 });

module.exports = mongoose.model("SuperPlayers", SuperPlayersSchema);
