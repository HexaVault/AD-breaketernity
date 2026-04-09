/* eslint-disable max-len */

import wordShift from "../../word-shift";

import { GlyphCombiner } from "./glyph-effects";

// The name of each object should be the same as it is in glyph types, so that we can easily check all glyphs
// --- Some glyphs are specially handled in GlyphSetName.vue - You should make sure your glyph is working here aswell
// GLYPH INFO
// name is the name of the Glyph. This can be a function (i.e. i18n) but should be CONSTANT at all times.
// id is just the glyph type - its used in a couple places, mainly glyph cosmetics. Must be the same as name of glyph type object
// effects - This just grabs the effects from glyph-effects, you can just put in your glyphs name and leave it, don't worry about it
// effectIDs - This needs to be done manually - A list of all the ids of the effects that can generate on that glyph.
// excessEffects allows you to add extra effects to glyphs (independant of other generation criteria) similar to Nameless 25.
// adjective is whats used for GlyphSetName.vue - If undefined, will default to ""
// noun is also used by GlyphSetName.vue - The word at the end of the set name (the "Infinity" in "Boundless Infinity")
// isBasic states whether the glyph is classed as a basic glyph.
// regularGlyphSymbol is the symbol shown when not using design theme
// cancerGlyphSymbol is the symbol show when you are using design (cancer) theme
// strOverride is the override for strength. Does not have to exist, but if it does, it should take the STRENGTH (str = rarity/40 + 1) and return a value based on that
// levelOverride is the override for level. Same as strOverride, but the input is level.
// effectOverride is the override for effect count. Same as above, but input is the number of effects - Returned value should be a whole number, but it will be rounded down otherwise.
// appearanceWeight is how likely it is to appear. 1 is the default value, but 0.5 would make your glyph 2x rarer, while 2 would make your glyph 2x more common. Not required.
// bannedEffectPairs - An array of arrays [effectA, effectB, override]. effectA and effectB are the two effects, and override means if true, ignore the ban. Not required.
// effectWeights is the likelyhood of effects. Not required, same as appearanceWeight
// sacrificeInfo holds information about the sacrifice, if it exists
// - id: The id of the sacrifice. Only really used in cases where we need this legacy info
// - effect: the effect of the sacrifice
// - description: the description shown in the glyph tab, under glyph sacrifice
// - cap: the cap of the effect
// - unlock: when is the sacrifice unlocked, defaults to ru19
// adjNounImportance dictates which noun to use - Lower means itll be used earlier for noun if it exists, higher is later
// isGenerated states whether or not the glyph is naturally generated
// generationRequirement states the requirement to generate the glyph. Not needed on glyphs where isGenerated is false. Defaults to true.
// canCustomize gives the requirement to customize. Defaults to true.
// hasAlchemyResource states whether or not the glyph can be refined into it's appropriate alchemy resource (if it exists)
// pelleUniqueEffect states whether or not the glyph has a unique effect in Pelle due to rift 3. Not required
// color gives the base color of the glyph
// primaryEffects gives the primary effects, which should always appear on glyphs of that type. Not required.
// alchemyResource gives the alchemy resource of that glyph, where applicable
// setColor states whether or not the color of that glyph can be modified. Not required.
// hasRarity states whether it should display (has) rarity or not. Cursed glyphs and reality glyphs, for example, have this as false in vanilla. Defaults to false.
// maxEquipped is how many of a glyph can be equipped at once. Defaults to infinite
//
// To prevent issues, make sure there is always as many note().mp4 files (with the numbers 1-x) as there are glyph types, else you might get errors with music glyphs and audio
// It's not perfect, you will likely still need to touch GlyphSetName.vue to implement new glyphs completely, but I tried my best :P
// PS. There is a sample glyph below to show you how the structure of your glyph might look

// TODO: Move to glyph-types.js
const complexIncludes = (x, filterItem) => x.some(n => n === filterItem);

// TODO: Add special glyph removal handlers here.
export const glyphTypes = {
  // eslint-disable-next-line capitalized-comments, multiline-comment-style
  /*
  sampleGlyph: {
    name: "Glyph of Magic"
    id: "sampleGlyph",
    effects: () => GlyphEffects.all.filter(e => complexIncludes(e.glyphTypes, "sampleGlyph")),
    effectIDs: ["sampleEffectA", "sampleEffectB", "sampleEffectC", "sampleEffectD", "sampleEffectE", "sampleEffectF"],
    excessEffects: () => [
      [Ra.unlocks.allGamespeedGlyphs.canBeApplied, "timespeed"]
    ],
    doomedEffectIDs: [
      [() => true, "sampleEffectA"]
      [() => true, "sampleEffectB"]
      [() => true, "sampleEffectC"]
      [() => player.realities.log10().gt(1000), "sampleEffectD"]
    ]
    adjective: { high: "Big", mid: "Medium", low: "Small" },
    noun: "Glyph",
    isBasic: false,
    regularGlyphSymbol: "S",
    cancerGlyphSymbol: "$",
    strOverride: x => cbrt(x.sub(1)).add(1),
    levelOverride: x => x.div(3).add(x.cbrt()),
    effectOverride: x => Math.max(4, x/3)
    appearanceWeight: () => 0.2,
    bannedEffectPairs: [
      ["sampleEffectA", "sampleEffectD", () => player.realities.log10() > 1000],
      ["sampleEffectA", "sampleEffectB", () => false],
      ["sampleEffectD", "sampleEffectE"]
    ],
    effectWeights: {
      sampleEffectA: () => 0.5,
      sampleEffectB: 1.4,
      sampleEffectC: 2.5,
      sampleEffectD: 2,
      sampleEffectE: () => (player.realities.gt("1e750") ? 2 : 1.5),
      sampleEffectF: 0.5
    },
    sacrificeInfo: {
      id: "sampleGlyph",
      effect: added => {
        if (Pelle.isDisabled("glyphsac")) return DC.D0;
        const sac = player.reality.glyphs.sac.sample.add(added ?? 0);
        return sac.log10().pow(3).add(1);
      },
      description: amount => `Boost something by ${formatX(amount, 2, 3)}`,
      cap: () => GlyphSacrificeHandler.maxSacrificeForEffects,
      unlock: () => player.eternities.gt("ee45")
    },
    hasAlchemyResource: true,
    pelleUniqueEffect: {
      condition: () => player.challenge.eternity.current <= 8,
      effect: 0.05.
      formatEffect: effect => formatPercents(effect)
      combine: GlyphCombiner.add,
      description: "All glyphs are {value} stronger"
    }
    isGenerated: true,
    generationRequirement: () => player.realities.log10() > 777,
    canCustomize: () => player.version > 455,
    adjNounImportance: 9,
    alchemyResource: ALCHEMY_RESOURCE.SAMPLE,
    hasRarity: true,
    color: "#ABCDEF",
    setColor: true,
    maxEquipped: () => 3,
  }
  */
  cursed: {
    name: "Cursed Glyph",
    id: "cursed",
    effects: () => GlyphEffects.all.filter(e => complexIncludes(e.glyphTypes, "cursed")),
    effectIDs: ["cursedgalaxies", "curseddimensions", "cursedtickspeed", "cursedEP"],
    adjective: { high: "Cursed", mid: "Hexed", low: "Jinxed" },
    noun: "Curse",
    isBasic: false,
    regularGlyphSymbol: "⸸",
    cancerGlyphSymbol: "☠",
    isGenerated: false,
    canCustomize: () => V.isFlipped,
    adjNounImportance: 6,
    color: "#000000",
    setColor: true,
  },

  reality: {
    name: "Glyph of Reality",
    id: "reality",
    effects: () => GlyphEffects.all.filter(e => complexIncludes(e.glyphTypes, "reality")),
    effectIDs: ["realityglyphlevel", "realitygalaxies", "realityrow1pow", "realityDTglyph"],
    adjective: "Real",
    noun: "Reality",
    isBasic: false,
    regularGlyphSymbol: "Ϟ",
    cancerGlyphSymbol: "⛧",
    sacrificeInfo: {
      id: "reality",
      effect: sac => {
        if (Pelle.isDisabled("glyphsac")) return DC.D0;
        // This cap is only feasibly reached with the imaginary upgrade, but we still want to cap it at a nice number
        return Decimal.sqrt(sac).div(15).add(1).clampMax(100);
      },
      description: amount => `Multiply Memory Chunk gain by ${formatX(amount, 2, 3)}`,
      cap: () => GlyphSacrificeHandler.maxSacrificeForEffects
    },
    alchemyResource: "reality",
    isGenerated: false,
    canCustomize: () => player.reality.glyphs.createdRealityGlyph,
    adjNounImportance: 4,
    setColor: true,
    maxEquipped: 1,
  },

  effarig: {
    name: "Glyph of Effarig",
    id: "effarig",
    effects: () => GlyphEffects.all.filter(e => complexIncludes(e.glyphTypes, "effarig")),
    effectIDs: ["effarigrm", "effarigglyph", "effarigblackhole", "effarigachievement", "effarigforgotten", "effarigdimensions", "effarigantimatter"],
    adjective: { both: "Meta", glyph: "Stable", rm: "Mechanical", none: "Fragmented" },
    noun: { both: "Effarig", glyph: "Stability", rm: "Mechanism", none: "Fragmentation" },
    isBasic: false,
    regularGlyphSymbol: "Ϙ",
    cancerGlyphSymbol: "🦒",
    bannedEffectPairs: [
      ["effarigrm", "effarigglyph", () => Ra.unlocks.glyphEffectCount.canBeApplied]
    ],
    sacrificeInfo: {
      effect: sac => {
        if (Pelle.isDisabled("glyphsac")) return 0;
        // This doesn't use the GlyphSacrificeHandler cap because it hits its cap (+100%) earlier
        const capped = Decimal.min(sac, 1e70);
        return Decimal.log10(capped.div(1e20).add(1)).times(2);
      },
      description: amount => `+${formatPercents(amount.div(100), 2)} additional Glyph rarity`,
      cap: () => 1e70
    },
    alchemyResource: "effarig",
    isGenerated: true,
    generationRequirement: () => EffarigUnlock.reality.isUnlocked,
    canCustomize: () => EffarigUnlock.reality.isUnlocked,
    adjNounImportance: 2,
    color: "#e21717",
    hasRarity: true,
    maxEquipped: 1,
  },

  companion: {
    name: "Companion Glyph",
    id: "companion",
    effects: () => GlyphEffects.all.filter(e => complexIncludes(e.glyphTypes, "companion")),
    effectIDs: ["companiondescription", "companionEP"],
    adjective: "Huggable",
    noun: "Companion",
    isBasic: false,
    regularGlyphSymbol: "♥",
    cancerGlyphSymbol: "³",
    pelleUniqueEffect: {
      effect: 1.34,
      formatEffect: effect => formatPercents(effect.sub(1)),
      description: "You feel {value} better",
      combine: GlyphCombiner.addExponents,
    },
    isGenerated: false,
    canCustomize: false,
    adjNounImportance: 5,
    color: "#feaec9",
    setColor: true,
  },

  power: {
    name: "Glyph of Power",
    id: "power",
    effects: () => GlyphEffects.all.filter(e => complexIncludes(e.glyphTypes, "power")),
    effectIDs: ["powerpow", "powermult", "powerdimboost", "powerbuy10"],
    excessEffects: () => [
      [Ra.unlocks.allGamespeedGlyphs.canBeApplied, "timespeed"]
    ],
    adjective: { high: "Powerful", mid: "Mastered", low: "Potential" },
    noun: "Power",
    isBasic: true,
    regularGlyphSymbol: "Ω",
    cancerGlyphSymbol: "⚡",
    sacrificeInfo: {
      id: "power",
      effect: sac => {
        if (Pelle.isDisabled("glyphsac")) return DC.D0;
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
    alchemyResource: "power",
    pelleUniqueEffect: {
      effect: 1.02,
      formatEffect: effect => formatPercents(effect.sub(1)),
      description: "Galaxies are {value} stronger",
      combine: GlyphCombiner.addExponents,
      requirement: () => PelleRifts.chaos.milestones[1].canBeApplied,
      default: DC.D1
    },
    isGenerated: true,
    adjNounImportance: 1,
    color: "#22aa48",
    primaryEffects: ["powerpow"],
    hasRarity: true
  },

  infinity: {
    name: "Glyph of Infinity",
    id: "infinity",
    effects: () => GlyphEffects.all.filter(e => complexIncludes(e.glyphTypes, "infinity")),
    effectIDs: ["infinitypow", "infinityrate", "infinityIP", "infinityinfmult"],
    excessEffects: () => [
      [Ra.unlocks.allGamespeedGlyphs.canBeApplied, "timespeed"]
    ],
    adjective: { high: "Infinite", mid: "Boundless", low: "Immense" },
    noun: "Infinity",
    isBasic: true,
    regularGlyphSymbol: "∞",
    cancerGlyphSymbol: "8",
    sacrificeInfo: {
      id: "infinity",
      effect: sac => {
        if (Pelle.isDisabled("glyphsac")) return DC.D1;
        const capped = Decimal.min(sac, GlyphSacrificeHandler.maxSacrificeForEffects);
        return Decimal.log10(Decimal.pow(capped, 0.2).div(100).add(1)).add(1);
      },
      description: amount => `${formatX(amount, 2, 2)} bigger multiplier when buying 8th Infinity Dimension`,
      cap: () => GlyphSacrificeHandler.maxSacrificeForEffects
    },
    pelleUniqueEffect: {
      effect: () => Currency.infinityPoints.value.plus(1).pow(0.2),
      formatEffect: effect => formatX(effect, 2),
      description: "Infinity Point gain {value} (based on current IP)",
      combine: GlyphCombiner.multiply,
      requirement: () => PelleRifts.chaos.milestones[1].canBeApplied,
      default: DC.D1
    },
    isGenerated: true,
    adjNounImportance: 1,
    color: "#b67f33",
    primaryEffects: ["infinitypow"],
    alchemyResource: "infinity",
    hasRarity: true
  },

  replication: {
    name: "Glyph of Replication",
    id: "replication",
    effects: () => GlyphEffects.all.filter(e => complexIncludes(e.glyphTypes, "replication")),
    effectIDs: ["replicationspeed", "replicationpow", "replicationdtgain", "replicationglyphlevel"],
    excessEffects: () => [
      [Ra.unlocks.allGamespeedGlyphs.canBeApplied, "timespeed"]
    ],
    adjective: { high: "Replicated", mid: "Simulated", low: "Duplicated" },
    noun: "Replication",
    isBasic: true,
    regularGlyphSymbol: "Ξ",
    cancerGlyphSymbol: "⚤",
    sacrificeInfo: {
      id: "replication",
      effect: sac => {
        if (Pelle.isDisabled("glyphsac")) return DC.D0;
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
    alchemyResource: "replication",
    pelleUniqueEffect: {
      effect: () => Decimal.pow(53, PelleRifts.vacuum.percentage).pow10(),
      formatEffect: effect => formatX(effect, 2),
      description: () => `Replication speed {value} (based on ${wordShift.wordCycle(PelleRifts.vacuum.name)})`,
      combine: GlyphCombiner.multiply,
      requirement: () => PelleRifts.chaos.milestones[1].canBeApplied,
      default: DC.D1
    },
    isGenerated: true,
    adjNounImportance: 1,
    color: "#03a9f4",
    hasRarity: true
  },

  time: {
    name: "Glyph of Time",
    id: "time",
    effects: () => GlyphEffects.all.filter(e => complexIncludes(e.glyphTypes, "time")),
    effectIDs: ["timepow", "timespeed", "timeetermult", "timeEP"],
    excessEffects: () => [
      [Ra.unlocks.allGamespeedGlyphs.canBeApplied, "timespeed"]
    ],
    adjective: { high: "Temporal", mid: "Chronal", low: "Transient" },
    noun: "Time",
    isBasic: true,
    regularGlyphSymbol: "Δ",
    cancerGlyphSymbol: "🕟",
    sacrificeInfo: {
      id: "time",
      effect: sac => {
        if (Pelle.isDisabled("glyphsac")) return DC.D1;
        const capped = Decimal.min(sac, GlyphSacrificeHandler.maxSacrificeForEffects);
        return Decimal.pow(Decimal.pow(capped, 0.2).div(100).add(1), 2);
      },
      description: amount => `${formatX(amount, 2, 2)} bigger multiplier when buying 8th Time Dimension`,
      cap: () => GlyphSacrificeHandler.maxSacrificeForEffects
    },
    alchemyResource: "time",
    pelleUniqueEffect: {
      effect: () => Currency.eternityPoints.value.plus(1).pow(0.3),
      formatEffect: effect => formatX(effect, 2),
      description: "Eternity Point gain {value} (based on current EP)",
      combine: GlyphCombiner.multiply,
      requirement: () => PelleRifts.chaos.milestones[1].canBeApplied,
      default: DC.D1
    },
    isGenerated: true,
    adjNounImportance: 1,
    color: "#b241e3",
    primaryEffects: ["timepow"],
    hasRarity: true
  },

  dilation: {
    name: "Glyph of Dilation",
    id: "dilation",
    effects: () => GlyphEffects.all.filter(e => complexIncludes(e.glyphTypes, "dilation")),
    effectIDs: ["dilationDT", "dilationgalaxyThreshold", "dilationTTgen", "dilationpow"],
    excessEffects: () => [
      [Ra.unlocks.allGamespeedGlyphs.canBeApplied, "timespeed"]
    ],
    adjective: { high: "Dilated", mid: "Attenuated", low: "Diluted" },
    noun: "Dilation",
    isBasic: true,
    regularGlyphSymbol: "Ψ",
    cancerGlyphSymbol: "☎",
    sacrificeInfo: {
      effect: sac => {
        if (Pelle.isDisabled("glyphsac")) return DC.D1;
        const capped = Decimal.clampMax(sac, GlyphSacrificeHandler.maxSacrificeForEffects);
        const exponent = Decimal.pow(Decimal.log10(capped.add(1))
          .div(Decimal.log10(GlyphSacrificeHandler.maxSacrificeForEffects)), 0.1).mul(0.32);
        return Decimal.pow(Decimal.max(capped, 1), exponent);
      },
      description: amount => `Multiply Tachyon Particle gain by ${formatX(amount, 2, 2)}`,
      cap: () => GlyphSacrificeHandler.maxSacrificeForEffects
    },
    alchemyResource: "dilation",
    pelleUniqueEffect: {
      effect: () => Decimal.pow(player.dilation.totalTachyonGalaxies, 1.5).max(1),
      formatEffect: effect => formatX(effect, 2),
      description: "Dilated Time gain {value} (based on Tachyon Galaxies)",
      combine: GlyphCombiner.multiply,
      requirement: () => PelleRifts.chaos.milestones[1].canBeApplied,
      default: DC.D1
    },
    isGenerated: true,
    adjNounImportance: 1,
    color: "#64dd17",
    hasRarity: true
  }
};

// eslint-disable-next-line capitalized-comments
// glyphTypes is not only used to actually make glyphs exist, it's also the used sort order
// basicGlyphTypes is used throughout the code for taking basic glyphs.
// alchemyGlyphTypes is used throughout the code for taking all the glyphs that can be refined (alchemy)
// sacrificeGlyphTypes is used throughout the code for taking all the glyphs that can be sacrificed.
// rarities are just the rarities. They must be descending in rarity, and must use hex codes
export const coreGlyphInfo = {
  glyphTypes: [
    "cursed",
    "reality",
    "effarig",
    "power",
    "infinity",
    "replication",
    "time",
    "dilation",
    "companion",
  ],

  basicGlyphTypes: [
    "power",
    "infinity",
    "replication",
    "time",
    "dilation"
  ],

  alchemyGlyphTypes: [
    "power",
    "infinity",
    "replication",
    "time",
    "dilation",
    "effarig"
  ],

  sacrificeGlyphTypes: [
    "power",
    "infinity",
    "replication",
    "time",
    "dilation",
    "effarig",
    "reality"
  ],

  generatedGlyphTypes: [
    "power",
    "infinity",
    "replication",
    "time",
    "dilation",
    "effarig"
  ],

  rarities: [
    {
      minStrength: 3.5,
      name: "Celestial",
      darkColor: "#3d3dec",
      lightColor: "#9696ff",
      darkHighContrast: "#ffff00",
      lightHighContrast: "#c0c000"
    }, {
      minStrength: 3.25,
      name: "Transcendent",
      darkColor: "#03ffec",
      lightColor: "#00c3c3",
      darkHighContrast: "#00ffff",
      lightHighContrast: "#00c0c0"
    }, {
      minStrength: 3,
      name: "Mythical",
      darkColor: "#d50000",
      lightColor: "#d50000",
      darkHighContrast: "#c00000",
      lightHighContrast: "#ff0000"
    }, {
      minStrength: 2.75,
      name: "Legendary",
      darkColor: "#ff9800",
      lightColor: "#d68100",
      darkHighContrast: "#ff8000",
      lightHighContrast: "#ff8000"
    }, {
      minStrength: 2.5,
      name: "Epic",
      darkColor: "#9c27b0",
      lightColor: "#9c27b0",
      darkHighContrast: "#ff00ff",
      lightHighContrast: "#ff00ff"
    }, {
      minStrength: 2,
      name: "Rare",
      darkColor: "#5096f3",
      lightColor: "#0d40ff",
      darkHighContrast: "#6060ff",
      lightHighContrast: "#0000ff"
    }, {
      minStrength: 1.5,
      name: "Uncommon",
      darkColor: "#43a047",
      lightColor: "#1e8622",
      darkHighContrast: "#00ff00",
      lightHighContrast: "#00b000"
    }, {
      minStrength: 1,
      name: "Common",
      darkColor: "#ffffff",
      lightColor: "#000000",
      darkHighContrast: "#ffffff",
      lightHighContrast: "#000000"
    }
  ],
};
// No point having a seperate file for this, so we'll extract it and place it here since these are purely cosmetic
export const cosmeticGlyphs = {
  music: {
    id: "music",
    symbol: "♫",
    color: "#FF80AB",
    isUnlocked: () => TeresaUnlocks.shop.isUnlocked,
  },
  blob: {
    id: "blob",
    symbol: "\uE010",
    color: "#E4B51A",
    preventBlur: true,
    isUnlocked: () => Themes.available().map(t => t.name).includes("S11"),
    canCustomize: () => false,
  },
};