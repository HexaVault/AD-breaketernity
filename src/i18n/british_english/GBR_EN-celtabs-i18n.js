/* eslint-disable camelcase */

// All celestial tab (not the challenges, nor quotes) info (+ alchemy), i18n support
export const celTabs = {
  alchemyTabNodeInfoDestroyed: "Destroyed by Pelle",
  alchemyTabNodeInfoCappedCurrent: "Capped: $1aX/$2aX $ Current: $1aX/$2aX",
  // This uses formatting and so gets handled as html, hence " $ " and not $1aX.
  // Double space is intentional, as one space will get removed.
  alchemyTabNodeInfoRecentChange: "(Recent Change:  $ )",
  alchemyTabNodeFormattedGeneration: "None $ +$1aX/sec $ $-1aX/sec",
  alchemyTabNodeInfoUnlockReq: "Unlock requirement: $1aX",
  alchemyTabNodeInfoBaseResource: "Base Resource",
  alchemyTabNodeInfoActiveReaction: "Reaction: Active ($1aX) $ Reaction: Inactive ($1aX)",
  alchemyTabClickInfo: "Click for alchemy info",
  alchemyTabToggleReactions: "Enable all reactions $ Disable all reactions",
  alchemyTabCreateReality: "View Reality Glyph creation",
  alchemyTabCanNowRefine: "Glyphs can now be refined using your Glyph filter in the Glyphs tab.",
  alchemyTabWhenRefining: "When refining a glyph, it will only give you resources up to a cap of $1aX of its highest refinement value.",
  alchemyTabReactionPerReality: "Reactions trigger once every time you Reality, unaffected by amplification from stored real time.",
  alchemyTabDestroyed: "Destroyed by Pelle",
  alchemyTabBaseResource: "Base Resource",
  // Not $1aX since we need to split this string, as this has to be html formatted
  alchemyTabRecentChange: "(Recent change: $)",
  alcheemyTabReactionOnOff: "Reaction: Active ($1aX) $ Reaction: Inactive ($1aX)",
  alchemyTabUnlockReq: "Unlock requirement: $1aX"
};