/* eslint-disable no-inline-comments */
/* eslint-disable line-comment-position */
/* eslint-disable max-len */
/* eslint-disable camelcase */

// This handles all our plurals.
// Unlike all the other i18n, this part is non-trivial.
// Each thing is in the format
// element: { key: "key", rules: ["value"] }
// If you need help sorting this out for your language, feel free to ask.

// Note to self - Each values can either be {min: a, max: b, text: text}, {values: [a, b, c], text: text } or { condition: x.mod(10).eq(1), text: text }
// Note to others: Above 1e4/1e9 (for formatInt), we will always use the "default" (other) key value

// Key format:
// $$key$$ - Use key as other
// $1aX$key$$ - Take input, and use pluralisation rules.
// $1aX$key$$!$ - Take input, and use pluralisation rules. Lowercase the text
// Each text has a $$$ which is what will be replaced by a number. Move this as nessecary (i.e. for value num rather than num value)

// PS: We can lowercase after the fact pretty trivially, so you are better making all words capital (i.e. Replicanti Galaxy) than lower (i.e. replicanti galaxy)
export const plurals = {
  antimatter: { key: "AM", rules: ["$$$ Antimatter"] },
  ip: { key: "IP", rules: [{ values: [1, -1], text: "$$$ Infinity Point" }, "$$$ Infinity Points"] },
  ep: { key: "EP", rules: [{ values: [1, -1], text: "$$$ Eternity Point" }, "$$$ Eternity Points"] },
  glyph: { key: "GLY", rules: [{ values: [1, -1], text: "$$$ Glyph" }, "$$$ Glyphs"] },
  ag: { key: "AGAL", rules: [{ values: [1, -1], text: "$$$ Antimatter Galaxy" }, "$$$ Antimatter Galaxies"] },
  rg: { key: "RGAL", rules: [{ values: [1, -1], text: "$$$ Replicanti Galaxy" }, "$$$ Replicanti Galaxies"] },
  tg: { key: "TGAL", rules: [{ values: [1, -1], text: "$$$ Tachyon Galaxy" }, "$$$ Tachyon Galaxies"] },
  eternity: { key: "ETER", rules: [{ values: [1, -1], text: "$$$ Eternity" }, "$$$ Eternities"] },
  infinity: { key: "INF", rules: [{ values: [1, -1], text: "$$$ Infinity" }, "$$$ Infinities"] },
  ad: { key: "AD", rules: [{ values: [1, -1], text: "$$$ Antimatter Dimension" }, "$$$ Antimatter Dimensions"] },
  symbol: { key: "SYM", rules: [{ values: [1, -1], text: "$$$ Symbol" }, "$$$ Symbols"] },
  colorScheme: { key: "CSC", rules: [{ values: [1, -1], text: "$$$ Colour Scheme" }, "$$$ Colour Schemes"] },
  remnants: { key: "REM", rules: [{ values: [1, -1], text: "$$$ Remnant" }, "$$$ Remnants"] },
  realityShards: { key: "REALSHARD", rules: [{ values: [1, -1], text: "$$$ Reality Shard" }, "$$$ Reality Shards"] },
  dimboosts: { key: "DB", rules: [{ values: [1, -1], text: "$$$ Dimension Boost" }, "$$$ Dimension Boosts"] },
  completions: { key: "COMP", rules: [{ values: [1, -1], text: "$$$ Completion" }, "$$$ Completions"] },
  tp: { key: "TP", rules: [{ values: [1, -1], text: "$$$ Tachyon Particle" }, "$$$ Tachyon Particles"] },
  realityMachines: { key: "RM", rules: [{ values: [1, -1], text: "$$$ Reality Machines" }, "$$$ Reality Machines"] },
  perkPoints: { key: "PP", rules: [{ values: [1, -1], text: "$$$ Perk Point" }, "$$$ Perk Points"] },
  realities: { key: "REAL", rules: [{ values: [1, -1], text: "$$$ Reality" }, "$$$ Realities"] },
  relicShards: { key: "RELIC", rules: [{ values: [1, -1], text: "$$$ Relic Shard" }, "$$$ Relic Shards"] },
  invalidInput: { key: "INVINP", rules: [{ values: [1, -1], text: "$$$ Invalid Input" }, "$$$ Invalid Inputs"] },
  times: { key: "TIME", rules: [{ values: [1, -1], text: "$$$ Time" }, "$$$ Times"] },
  constants: { key: "CONST", rules: [{ values: [1, -1], text: "$$$ Constant" }, "$$$ Constants"] },
  years: { key: "YEAR", rules: [{ values: [1, -1], text: "$$$ Year" }, "$$$ Years"] },
  days: { key: "DAY", rules: [{ values: [1, -1], text: "$$$ Day" }, "$$$ Days"] },
  hours: { key: "HOUR", rules: [{ values: [1, -1], text: "$$$ Hour" }, "$$$ Hours"] },
  minutes: { key: "MIN", rules: [{ values: [1, -1], text: "$$$ Minute" }, "$$$ Minutes"] },
  seconds: { key: "SEC", rules: [{ values: [1, -1], text: "$$$ Second" }, "$$$ Seconds"] },
  presets: { key: "PRESET", rules: [{ values: [1, -1], text: "$$$ Preset" }, "$$$ Presets"] },
  // TODO: Remove these - These are the same in english, and pluralisation works on a per-language basis so these keys dont need to exist
  // Note we will need to add handling for pluralisation cases where the output is only plural in some languages
  // There might be a small case where "TT" is different for pluralisation soooooo
  ttShort: { key: "TTSHORT", rules: ["SSS TT"] },
  stShort: { key: "STSHORT", rules: ["SSS ST"] }
};