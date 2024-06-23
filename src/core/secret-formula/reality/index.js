import { cosmeticGlyphs, glyphTypes } from "./glyph-types";
import { perkConnections, perks } from "./perks";

import { automator } from "./automator";
import { glyphCosmeticSets } from "./glyph-cosmetics";
import { glyphEffects } from "./glyph-effects";
import { GlyphInfo } from "./core-glyph-info";
import { imaginaryUpgrades } from "./imaginary-upgrades";
import { realityUpgrades } from "./reality-upgrades";

export const reality = {
  automator,
  cosmeticGlyphs,
  glyphCosmeticSets,
  glyphEffects,
  GlyphInfo,
  glyphTypes,
  imaginaryUpgrades,
  perks,
  perkConnections,
  upgrades: realityUpgrades
};
