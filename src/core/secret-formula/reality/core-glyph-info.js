/* eslint-disable max-len */

// To help adding new glyphs to the game, we can concentrate a ton of information to this file.
// The name of each object should be the same as it is in glyph types, so that we can easily check all glyphs
// glyphTypes is not only used to actually make glyphs exist, it's also the used sort order
// Adjective is whats used for GlyphSetName.vue - If undefined, will default to ""
// Noun is also used by GlyphSetName.vue - The word at the end of the set name (the "Infinity" in "Boundless Infinity")
// adjNounImportance dictates which noun to use - Lower means itll be used earlier for noun if it exists, higher is later
// isGenerated states whether or not the glyph is naturally generated
// generationRequirement states the requirement to generate the glyph. Not needed on glyphs where isGenerated is false. Defaults to true.
// canCustomize gives the requirement to customize. Defaults to true.
// isBasic states whether the glyph is classed as a basic glyph.
// regularGlyphSymbol is the symbol shown when not using design theme, else cancerGlyphSymbol is used
// hasSacrifice states whether or not the glyph has a sacrifice.
// sacrificeInfo holds information about the sacrifice, if it exists
// hasAlchemyResource states whether or not the glyph can be refined into it's appropriate alcheemy resource (if it exists)
// pelleUniqueEffect states whether or not the glyph has a unique effect in Pelle due to rift 3
// color gives the base color of the glyph
// primaryEffect gives the primary effect, which should always appear on glyphs of that type
// alchemyResource gives the alchemy resource of that glyph, where applicable
// setColor states whether or not the color of that glyph can be modified

export const GlyphInfo = {
  glyphTypes: [
    "power",
    "infinity",
    "replication",
    "time",
    "dilation",
    "reality",
    "effarig",
    "cursed",
    "companion",
  ],

  cursed: {
    adjective: { high: "Cursed", mid: "Hexed", low: "Jinxed" },
    noun: "Curse",
    isBasic: false,
    regularGlyphSymbol: "⸸",
    cancerGlyphSymbol: "☠",
    hasSacrifice: false,
    hasAlchemyResource: false,
    pelleUniqueEffect: false,
    isGenerated: false,
    canCustomize: () => V.isFlipped,
    adjNounImportance: 6,
    color: "#000000",
    setColor: true,
  },

  reality: {
    adjective: "Real",
    noun: "Reality",
    isBasic: false,
    regularGlyphSymbol: "Ϟ",
    cancerGlyphSymbol: "⛧",
    hasSacrifice: true,
    sacrificeInfo: {
      id: "reality",
      effect: added => {
        if (Pelle.isDisabled("glyphsac")) return DC.D0;
        const sac = player.reality.glyphs.sac.reality.add(added ?? 0);
        // This cap is only feasibly reached with the imaginary upgrade, but we still want to cap it at a nice number
        return Decimal.min(Decimal.sqrt(sac).div(15).add(1), 100);
      },
      description: amount => `Multiply Memory Chunk gain by ${formatX(amount, 2, 3)}`,
      cap: () => GlyphSacrificeHandler.maxSacrificeForEffects
    },
    hasAlchemyResource: true,
    pelleUniqueEffect: false,
    isGenerated: false,
    canCustomize: () => player.reality.glyphs.createdRealityGlyph,
    adjNounImportance: 4,
    alchemyResource: ALCHEMY_RESOURCE.REALITY,
    setColor: true
  },

  effarig: {
    adjective: { both: "Meta", glyph: "Stable", rm: "Mechanical", none: "Fragmented" },
    noun: { both: "Effarig", glyph: "Stability", rm: "Mechanism", none: "Fragmentation" },
    isBasic: false,
    regularGlyphSymbol: "Ϙ",
    cancerGlyphSymbol: "🦒",
    hasSacrifice: true,
    sacrificeInfo: {
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
    hasAlchemyResource: true,
    pelleUniqueEffect: false,
    isGenerated: true,
    generationRequirement: () => EffarigUnlock.reality.isUnlocked,
    canCustomize: () => EffarigUnlock.reality.isUnlocked,
    adjNounImportance: 2,
    color: "#e21717",
    alchemyResource: ALCHEMY_RESOURCE.EFFARIG,
    hasRarity: true
  },

  companion: {
    adjective: "Huggable",
    noun: "Companion",
    isBasic: false,
    regularGlyphSymbol: "♥",
    cancerGlyphSymbol: "³",
    hasSacrifice: false,
    hasAlchemyResource: false,
    pelleUniqueEffect: true,
    isGenerated: false,
    canCustomize: false,
    adjNounImportance: 5,
    color: "#feaec9",
    setColor: true,
  },

  power: {
    adjective: { high: "Powerful", mid: "Mastered", low: "Potential" },
    noun: "Power",
    isBasic: false,
    regularGlyphSymbol: "Ω",
    cancerGlyphSymbol: "⚡",
    hasSacrifice: true,
    sacrificeInfo: {
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
    hasAlchemyResource: true,
    pelleUniqueEffect: true,
    isGenerated: true,
    adjNounImportance: 1,
    color: "#22aa48",
    primaryEffect: "powerpow",
    alchemyResource: ALCHEMY_RESOURCE.POWER,
    hasRarity: true
  },

  infinity: {
    adjective: { high: "Infinite", mid: "Boundless", low: "Immense" },
    noun: "Infinity",
    isBasic: false,
    regularGlyphSymbol: "∞",
    cancerGlyphSymbol: "8",
    hasSacrifice: true,
    sacrificeInfo: {
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
    hasAlchemyResource: true,
    pelleUniqueEffect: true,
    isGenerated: true,
    adjNounImportance: 1,
    color: "#b67f33",
    primaryEffect: "infinitypow",
    alchemyResource: ALCHEMY_RESOURCE.INFINITY,
    hasRarity: true
  },

  replication: {
    adjective: { high: "Replicated", mid: "Simulated", low: "Duplicated" },
    noun: "Replication",
    isBasic: false,
    regularGlyphSymbol: "Ξ",
    cancerGlyphSymbol: "⚤",
    hasSacrifice: true,
    sacrificeInfo: {
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
    hasAlchemyResource: true,
    pelleUniqueEffect: true,
    isGenerated: true,
    adjNounImportance: 1,
    color: "#03a9f4",
    alchemyResource: ALCHEMY_RESOURCE.REPLICATION,
    hasRarity: true
  },

  time: {
    adjective: { high: "Temporal", mid: "Chronal", low: "Transient" },
    noun: "Time",
    isBasic: false,
    regularGlyphSymbol: "Δ",
    cancerGlyphSymbol: "🕟",
    hasSacrifice: true,
    sacrificeInfo: {
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
    hasAlchemyResource: true,
    pelleUniqueEffect: true,
    isGenerated: true,
    adjNounImportance: 1,
    color: "#b241e3",
    primaryEffect: "timepow",
    alchemyResource: ALCHEMY_RESOURCE.TIME,
    hasRarity: true
  },

  dilation: {
    adjective: { high: "Dilated", mid: "Attenuated", low: "Diluted" },
    noun: "Dilation",
    isBasic: false,
    regularGlyphSymbol: "Ψ",
    cancerGlyphSymbol: "☎",
    hasSacrifice: true,
    sacrificeInfo: {
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
    hasAlchemyResource: true,
    pelleUniqueEffect: true,
    isGenerated: true,
    adjNounImportance: 1,
    color: "#64dd17",
    alchemyResource: ALCHEMY_RESOURCE.DILATION,
    hasRarity: true
  }
};