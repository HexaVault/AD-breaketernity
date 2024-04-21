import { DC } from "../../constants";

export const glyphSacrifice = {
  "power": {
    id: "power",
    effect: added => {
      if (Pelle.isDisabled("glyphsac")) return DC.D0;
      const sac = player.reality.glyphs.sac.power.add(added ?? 0);
      const capped = Decimal.min(sac, GlyphSacrificeHandler.maxSacrificeForEffects);
      const base = Decimal.log10(capped.add(1)).div(Decimal.log10(GlyphSacrificeHandler.maxSacrificeForEffects));
      return Decimal.floor(Decimal.pow(base, 1.2).times(750));
    },
    description: amount => {
      const sacCap = GlyphSacrificeHandler.maxSacrificeForEffects;
      const nextDistantGalaxy = Decimal.pow10(Decimal.root(amount.add(1).div(750), 1.2)
        .times(Decimal.log10(sacCap))).sub(1);
      const nextGalaxyText = amount.lt(750)
        ? ` (next at ${format(nextDistantGalaxy, 2, 2)})`
        : "";
      return `Distant Galaxy scaling starts ${formatInt(amount)} later${nextGalaxyText}`;
    },
    cap: () => GlyphSacrificeHandler.maxSacrificeForEffects
  },
  "infinity": {
    id: "infinity",
    effect: added => {
      if (Pelle.isDisabled("glyphsac")) return DC.D1;
      const sac = player.reality.glyphs.sac.infinity.add(added ?? 0);
      const capped = Decimal.min(sac, GlyphSacrificeHandler.maxSacrificeForEffects);
      return Decimal.log10(Decimal.pow(capped, 0.2).div(100).add(1)).add(1);
    },
    description: amount => `${formatX(amount, 2, 2)} bigger multiplier when buying 8th Infinity Dimension`,
    cap: () => GlyphSacrificeHandler.maxSacrificeForEffects
  },
  "time": {
    id: "time",
    effect: added => {
      if (Pelle.isDisabled("glyphsac")) return DC.D1;
      const sac = player.reality.glyphs.sac.time.add(added ?? 0);
      const capped = Decimal.min(sac, GlyphSacrificeHandler.maxSacrificeForEffects);
      return Decimal.pow(Decimal.pow(capped, 0.2).div(100).add(1), 2);
    },
    description: amount => `${formatX(amount, 2, 2)} bigger multiplier when buying 8th Time Dimension`,
    cap: () => GlyphSacrificeHandler.maxSacrificeForEffects
  },
  "replication": {
    id: "replication",
    effect: added => {
      if (Pelle.isDisabled("glyphsac")) return DC.D0;
      const sac = player.reality.glyphs.sac.replication.add(added ?? 0);
      const capped = Decimal.min(sac, GlyphSacrificeHandler.maxSacrificeForEffects);
      const base = Decimal.log10(capped.add(1)).div(Decimal.log10(GlyphSacrificeHandler.maxSacrificeForEffects));
      return Decimal.floor(Decimal.pow(base, 1.2).times(1500));
    },
    description: amount => {
      const sacCap = GlyphSacrificeHandler.maxSacrificeForEffects;
      const nextDistantGalaxy = Decimal.pow10(Decimal.root((amount.add(1)).div(1500), 1.2)
        .times(Decimal.log10(sacCap))).sub(1);
      const nextGalaxyText = amount.lt(1.5e3)
        ? ` (next at ${format(nextDistantGalaxy, 2, 2)})`
        : "";
      return `Replicanti Galaxy scaling starts ${formatInt(amount)} later${nextGalaxyText}`;
    },
    cap: () => GlyphSacrificeHandler.maxSacrificeForEffects
  },
  "dilation": {
    id: "dilation",
    effect: added => {
      if (Pelle.isDisabled("glyphsac")) return DC.D1;
      const sac = player.reality.glyphs.sac.dilation.add(added ?? 0);
      const capped = Decimal.min(sac, GlyphSacrificeHandler.maxSacrificeForEffects);
      const exponent = Decimal.pow(Decimal.log10(capped.add(1)).times(0.32)
        .div(Decimal.log10(GlyphSacrificeHandler.maxSacrificeForEffects)), 0.1);
      return Decimal.pow(Decimal.max(capped, 1), exponent);
    },
    description: amount => `Multiply Tachyon Particle gain by ${formatX(amount, 2, 2)}`,
    cap: () => GlyphSacrificeHandler.maxSacrificeForEffects
  },
  "effarig": {
    id: "effarig",
    effect: added => {
      if (Pelle.isDisabled("glyphsac")) return 0;
      const sac = player.reality.glyphs.sac.effarig.add(added ?? 0);
      // This doesn't use the GlyphSacrificeHandler cap because it hits its cap (+100%) earlier
      const capped = Decimal.min(sac, 1e70);
      return Decimal.log10(capped.div(1e20).add(1)).times(2);
    },
    description: amount => `+${formatPercents(amount.div(100), 2)} additional Glyph rarity`,
    cap: () => 1e70
  },
  "reality": {
    id: "reality",
    effect: added => {
      if (Pelle.isDisabled("glyphsac")) return DC.D0;
      const sac = player.reality.glyphs.sac.reality.add(added ?? 0);
      // This cap is only feasibly reached with the imaginary upgrade, but we still want to cap it at a nice number
      return Decimal.min(Decimal.sqrt(sac).div(15).add(1), 100);
    },
    description: amount => `Multiply Memory Chunk gain by ${formatX(amount, 2, 3)}`,
    cap: () => GlyphSacrificeHandler.maxSacrificeForEffects
  }
};
