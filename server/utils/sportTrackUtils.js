// server/utils/sportTrackUtils.js
//
// Helpers for accessing per-sport configuration on a Tournament. Multi-sport
// tournaments store their per-sport state in `tournament.sports[]`. Legacy
// single-sport tournaments still use the root scalars (sportsType,
// matchFormat, category, qualifyPerGroup, drawSize, currentStage,
// stageConfig, groupStageFormat, knockoutFormat, davisCupFormatId,
// sportRules, type) — these helpers fall back to a synthesized single-track
// view for those, so callers don't need to branch.

// Build a synthetic single-sport track from root scalars. Used when a
// tournament hasn't yet been migrated to the multi-sport shape.
function synthesizeLegacyTrack(tournament) {
  if (!tournament) return null;
  const stageConfig = tournament.stageConfig?.toObject?.() || tournament.stageConfig || {};
  return {
    _id: null,
    sportId: null, // unknown — Sport collection lookup needed to resolve
    sportName: tournament.sportsType || null,
    sportSlug: null,
    type: tournament.type || null,
    categories: Array.isArray(tournament.category)
      ? tournament.category.map((c) => ({ name: c.name, fee: c.fee }))
      : [],
    groupStageFormat: tournament.groupStageFormat || null,
    knockoutFormat: tournament.knockoutFormat || null,
    davisCupFormatId: tournament.davisCupFormatId || null,
    qualifyPerGroup: tournament.qualifyPerGroup ?? 2,
    drawSize: tournament.drawSize ?? null,
    matchFormat: tournament.matchFormat || null,
    sportRules: tournament.sportRules || null,
    currentStage: tournament.currentStage || "registration",
    stageConfig,
    __synthetic: true,
  };
}

// Find a sport-track on a tournament. If the tournament has `sports[]`,
// match by sportId. Otherwise synthesize from root scalars. When sportId
// is omitted on a multi-sport tournament, returns the first track (callers
// should provide sportId for correctness).
function getSportTrack(tournament, sportId) {
  if (!tournament) return null;
  const tracks = Array.isArray(tournament.sports) ? tournament.sports : [];
  if (tracks.length === 0) return synthesizeLegacyTrack(tournament);
  if (!sportId) return tracks[0];
  const sportIdStr = String(sportId);
  return tracks.find((t) => String(t.sportId) === sportIdStr) || null;
}

// All sport tracks. For legacy single-sport, returns a one-element array
// containing the synthesized track.
function listSportTracks(tournament) {
  if (!tournament) return [];
  const tracks = Array.isArray(tournament.sports) ? tournament.sports : [];
  if (tracks.length === 0) {
    const legacy = synthesizeLegacyTrack(tournament);
    return legacy ? [legacy] : [];
  }
  return tracks;
}

// Get the active stage for a specific sport on a tournament.
function getCurrentStage(tournament, sportId) {
  const track = getSportTrack(tournament, sportId);
  return track?.currentStage || "registration";
}

// Update currentStage for a specific sport. Falls back to root scalar for
// legacy tournaments. Lazy-requires Tournament to avoid circular imports.
async function setCurrentStage(tournamentId, sportId, stage) {
  const Tournament = require("../Modal/Tournament");
  if (!sportId) {
    return Tournament.findByIdAndUpdate(
      tournamentId,
      { currentStage: stage },
      { new: true }
    );
  }
  return Tournament.findOneAndUpdate(
    { _id: tournamentId, "sports.sportId": sportId },
    { $set: { "sports.$.currentStage": stage } },
    { new: true }
  );
}

// Update a stageConfig dot-path on a specific sport-track. `path` is
// relative to stageConfig (e.g., "qualifierKnockout.enabled").
async function setStageConfigPath(tournamentId, sportId, path, value) {
  const Tournament = require("../Modal/Tournament");
  if (!sportId) {
    return Tournament.findByIdAndUpdate(
      tournamentId,
      { $set: { [`stageConfig.${path}`]: value } },
      { new: true }
    );
  }
  return Tournament.findOneAndUpdate(
    { _id: tournamentId, "sports.sportId": sportId },
    { $set: { [`sports.$.stageConfig.${path}`]: value } },
    { new: true }
  );
}

// Get matchFormat for a specific sport-track. Falls back to root scalar.
function getMatchFormat(tournament, sportId) {
  const track = getSportTrack(tournament, sportId);
  return track?.matchFormat || null;
}

// Resolved sportName for a specific track. Useful where existing code
// expects `tournament.sportsType` semantics.
function getSportName(tournament, sportId) {
  const track = getSportTrack(tournament, sportId);
  return track?.sportName || tournament?.sportsType || null;
}

// Resolve which sportId to stamp on a new doc. Same fallback chain
// MatchFactory's _stamp uses, exposed for non-factory callers (controllers
// writing TopPlayers, BookingGroup, GroupStandings, SuperPlayers, etc.):
// explicit > tournament.sports[0].sportId > null.
function resolveSportId(tournament, providedSportId) {
  if (providedSportId) return providedSportId;
  return tournament?.sports?.[0]?.sportId || null;
}

module.exports = {
  synthesizeLegacyTrack,
  getSportTrack,
  listSportTracks,
  getCurrentStage,
  setCurrentStage,
  setStageConfigPath,
  getMatchFormat,
  getSportName,
  resolveSportId,
};
