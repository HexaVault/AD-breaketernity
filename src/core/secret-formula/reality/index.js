import { cosmeticGlyphs, GlyphInfo } from "./core-glyph-info";
import { perkConnections, perks } from "./perks";

import { automator } from "./automator";
import { glyphCosmeticSets } from "./glyph-cosmetics";
import { glyphEffects } from "./glyph-effects";
import { imaginaryUpgrades } from "./imaginary-upgrades";
import { realityUpgrades } from "./reality-upgrades";

export const reality = {
  automator,
  cosmeticGlyphs,
  glyphCosmeticSets,
  glyphEffects,
  GlyphInfo,
  imaginaryUpgrades,
  perks,
  perkConnections,
  upgrades: realityUpgrades
};
