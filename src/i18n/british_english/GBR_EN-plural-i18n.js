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
  ip: { key: "IP", rules: [{ values: [1, -1], text: "$$$ Infinity Point" }, "$$$ Infinity Point"] },
  ep: { key: "EP", rules: [{ values: [1, -1], text: "$$$ Eternity Point" }, "$$$ Eternity Point"] },
  glyph: { key: "GLY", rules: [{ values: [1, -1], text: "$$$ Glyph" }, "$$$ Glyphs"] },
  ag: { key: "AGAL", rules: [{ values: [1, -1], text: "$$$ Antimatter Galaxy" }, "$$$ Antimatter Galaxies"] },
  rg: { key: "RGAL", rules: [{ values: [1, -1], text: "$$$ Replicanti Galaxy" }, "$$$ Replicanti Galaxies"] },
  tg: { key: "TGAL", rules: [{ values: [1, -1], text: "$$$ Tachyon Galaxy" }, "$$$ Tachyon Galaxies"] },
  eternity: { key: "ETER", rules: [{ values: [1, -1], text: "$$$ Eternity" }, "$$$ Eternities"] },
  infinity: { key: "INF", rules: [{ values: [1, -1], text: "$$$ Infinity" }, "$$$ Infinities"] },
  ad: { key: "AD", rules: [{ values: [1, -1], text: "$$$ Antimatter Dimension" }, "$$$ antimatter Dimensions"] },
};