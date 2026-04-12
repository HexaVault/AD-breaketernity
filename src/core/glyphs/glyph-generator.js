/**
 * It turns out reading and writing the RNG state from player is really slow, for
 * some reason. Thus, it's very advantageous to get an RNG as a local variable, and only
 * write the state back out to player when we are done with it.
 * So, this interface is implemented by a real and fake RNG class; after creating one and
 * using it, call finalize on it to write the seed out.
 */
import { GlyphInfo } from "../glyphs/glyph-types";

import { deepmerge } from "@/utility/deepmerge";

class GlyphRNG {
  static get SECOND_GAUSSIAN_DEFAULT_VALUE() {
    return 1e6;
  }

  constructor(seed, secondGaussian) {
    this.seed = seed;
    this.secondGaussian = secondGaussian;
  }

  uniform() {
    const state = xorshift32Update(this.seed);
    this.seed = state;
    return state * 2.3283064365386963e-10 + 0.5;
  }

  normal() {
    if (this.secondGaussian !== GlyphRNG.SECOND_GAUSSIAN_DEFAULT_VALUE) {
      const toReturn = this.secondGaussian;
      this.secondGaussian = GlyphRNG.SECOND_GAUSSIAN_DEFAULT_VALUE;
      return toReturn;
    }

    let u = 0, v = 0, s = 0;
    do {
      u = this.uniform() * 2 - 1;
      v = this.uniform() * 2 - 1;
      s = u * u + v * v;
    } while (s >= 1 || s === 0);
    s = Math.sqrt(-2 * Math.log(s) / s);
    this.secondGaussian = v * s;
    return u * s;
  }

  /**
   * Write the seed out to where it can be restored
   * @abstract
   */
  finalize() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  get isFake() { throw new NotImplementedError(); }
}

export const GlyphGenerator = {
  // Glyph choices will have more uniformly-distributed properties up for this many groups
  // of uniform glyphs. The size of a uniformity group is 5, so this gives uniformly-distributed
  // properties up to a reality count one more than 5x this value; the modified RNG for uniform
  // glyphs excludes the first fixed glyph and only starts from the 2nd one onward
  uniformityGroups: GlyphInfo.basicGlyphTypes.length,
  get isUniformityActive() {
    return player.realities.lte(5 * this.uniformityGroups);
  },

  fakeSeed: Date.now() % Math.pow(2, 32),
  fakeSecondGaussian: null,
  /* eslint-disable lines-between-class-members */
  RealGlyphRNG: class extends GlyphRNG {
    constructor() { super(player.reality.seed, player.reality.secondGaussian); }
    finalize() {
      player.reality.seed = this.seed;
      player.reality.secondGaussian = this.secondGaussian;
    }
    get isFake() { return false; }
  },

  FakeGlyphRNG: class extends GlyphRNG {
    constructor() { super(GlyphGenerator.fakeSeed, GlyphGenerator.fakeSecondGaussian); }
    finalize() {
      GlyphGenerator.fakeSeed = this.seed;
      GlyphGenerator.fakeSecondGaussian = this.secondGaussian;
    }
    get isFake() { return true; }
  },

  MusicGlyphRNG: class extends GlyphRNG {
    constructor() { super(player.reality.musicSeed, player.reality.musicSecondGaussian); }
    finalize() {
      player.reality.musicSeed = this.seed;
      player.reality.musicSecondGaussian = this.secondGaussian;
    }
    get isFake() { return false; }
  },
  /* eslint-enable lines-between-class-members */

  startingGlyph(level) {
    const initialStrength = 1.5;
    return {
      id: undefined,
      idx: null,
      type: "power",
      // The initial strength is very slightly above average.
      strength: initialStrength,
      level: level.actualLevel,
      rawLevel: level.rawLevel,
      effects: ["powerpow"],
    };
  },

  // eslint-disable-next-line max-params
  randomGlyph(level, rngIn, typeIn = null, effectsIn = []) {
    const rng = rngIn || new GlyphGenerator.RealGlyphRNG();
    const type = typeIn || this.randomType(rng);
    const strength = this.randomStrength(type, rng);
    let numEffects = this.randomNumberOfEffects(type, strength, level.actualLevel, rng);
    let actualLevel = level.actualLevel;
    if (GlyphInfo[type].levelOverride) actualLevel = GlyphInfo[type].levelOverride(actualLevel);
    const maxEffects = GlyphInfo[type].effects.length;
    if (type !== "effarig" && numEffects > maxEffects) numEffects = maxEffects;
    const effects = this.generateEffects(type, numEffects, rng, effectsIn);
    if (rngIn === undefined) rng.finalize();
    return {
      id: undefined,
      idx: null,
      type,
      strength,
      level: actualLevel,
      rawLevel: level.rawLevel,
      effects,
    };
  },

  realityGlyph(level = undefined) {
    // eslint-disable-next-line no-param-reassign
    level = level ?? AlchemyResource.reality.effectValue;
    const str = rarityToStrength(100);
    const effects = this.generateRealityEffects(level);
    return {
      id: undefined,
      idx: null,
      type: "reality",
      strength: str,
      level,
      rawLevel: level,
      effects,
    };
  },

  cursedGlyph() {
    const str = rarityToStrength(100);
    const effects = GlyphInfo.cursed.effects.map(n => n.id);
    return {
      id: undefined,
      idx: null,
      type: "cursed",
      strength: str,
      level: new Decimal(6666),
      rawLevel: new Decimal(6666),
      effects,
    };
  },

  // These Glyphs are given on entering Doomed to prevent the player
  // from having none of each basic glyphs which are requied to beat pelle
  // TODO: Change to taking doomed effect list from glyph-types.js
  doomedGlyph(type) {
    const effects = GlyphEffects.all.filter(e => e.id.startsWith(type)).map(n => n.id);
    effects.push(GlyphEffects.timespeed);
    const glyphLevel = Decimal.max(player.records.bestReality.glyphLevel, 5000);
    return {
      id: undefined,
      idx: null,
      type,
      strength: 3.5,
      level: glyphLevel,
      rawLevel: glyphLevel,
      effects,
    };
  },

  companionGlyph(eternityPoints) {
    // Store the pre-Reality EP value in the glyph's rarity
    const str = rarityToStrength(eternityPoints.max(1).log10().div(1e6));
    const effects = GlyphInfo.companion.effects;
    return {
      id: undefined,
      idx: null,
      type: "companion",
      strength: str,
      level: DC.D1,
      rawLevel: DC.D1,
      effects,
    };
  },

  musicGlyph() {
    const rng = new GlyphGenerator.MusicGlyphRNG();
    const glyph =
      this.randomGlyph({ actualLevel: player.records.bestReality.glyphLevel.mul(0.8).floor(), rawLevel: DC.D1 }, rng);
    rng.finalize();
    glyph.cosmetic = "music";
    glyph.fixedCosmetic = "music";
    return glyph;
  },

  // Generates a unique ID for glyphs, used for deletion and drag-and-drop.  Non-unique IDs can cause buggy behavior.
  makeID() {
    return this.maxID + 1;
  },

  get maxID() {
    return player.reality.glyphs.active
      .concat(player.reality.glyphs.inventory)
      .reduce((max, glyph) => Math.max(max, glyph.id), 0);
  },

  get strengthMultiplier() {
    return Effects.max(new Decimal(1), RealityUpgrade(16));
  },

  randomStrength(type, rng) {
    // Technically getting this upgrade really changes glyph gen but at this point almost all
    // the RNG is gone anyway.
    if (Ra.unlocks.maxGlyphRarityAndShardSacrificeBoost.canBeApplied && !GlyphInfo[type].strOverride) return rarityToStrength(100);
    let result = GlyphGenerator.strengthMultiplier.mul(GlyphGenerator.gaussianBellCurve(rng));
    const relicShardFactor = Ra.unlocks.extraGlyphChoicesAndRelicShardRarityAlwaysMax.canBeApplied
      ? DC.D1 : rng.uniform();
    const increasedRarity = Effarig.maxRarityBoost.mul(relicShardFactor)
      .plusEffectsOf(
        Achievement(146),
        GlyphInfo.effarig.sacrifice
      );
    // Each rarity% is 0.025 strength.
    result = result.add(increasedRarity.div(40));
    // Raise the result to the next-highest 0.1% rarity.
    result = Decimal.ceil(result.times(400)).div(400);
    if (GlyphInfo[type].strOverride) result = GlyphInfo[type].strOverride(result);
    return Decimal.min(result, rarityToStrength(100));
  },

  // eslint-disable-next-line max-params
  randomNumberOfEffects(type, strength, level, rng) {
    // Call the RNG twice before anything else to advance the RNG seed properly, even if the whole method returns early.
    // This prevents the position of effarig glyphs in the choice list from affecting the choices themselves, as well
    // as preventing all of the glyphs changing drastically when RU17 is purchased.
    const random1 = rng.uniform();
    const random2 = rng.uniform();
    if (GlyphInfo[type].effects.length <= 4 && Ra.unlocks.glyphEffectCount.canBeApplied)
      return GlyphInfo[type].effects.length;
    const maxEffects = !Ra.unlocks.glyphEffectCount.canBeApplied && type === "effarig" ? 4
      : GlyphInfo[type].effects.length;
    let num = Decimal.floor(Decimal.pow(random1, DC.D1.sub((Decimal.pow(level.times(strength), 0.5)).div(100))).times(1.5).add(1))
    // Catchall min function.
      .min(1e8).toNumber();
    // If we do decide to add anything else that boosts chance of an extra effect, keeping the code like this
    // makes it easier to do (add it to the Effects.max).
    if (RealityUpgrade(17).isBought && random2 < Effects.max(0, RealityUpgrade(17)).toNumber()) {
      num = Math.min(num + 1, maxEffects);
    }
    if (GlyphInfo[type].effectOverride) {
      num = Math.floor(GlyphInfo[type].effectOverride(num));
      return Math.clampMax(num, maxEffects);
    }
    num = Math.clampMax(num, maxEffects);
    return Ra.unlocks.glyphEffectCount.canBeApplied ? Math.max(num, 4) : num;
  },

  // Populate a list of reality glyph effects based on level
  generateRealityEffects(level) {
    const numberOfEffects = realityGlyphEffectLevelThresholds.filter(lv => level.gte(lv)).length;
    const sortedRealityEffects = GlyphInfo.reality.effects()
      .sort((a, b) => a.intID - b.intID)
      .map(eff => eff.id);
    return sortedRealityEffects.slice(0, numberOfEffects);
  },

  // eslint-disable-next-line max-params
  generateEffects(type, count, rng, guarenteedEffects = []) {
    const glyphTypeEffects = GlyphInfo[type].effects;
    const effectValues = glyphTypeEffects.mapToObject(x => x.id, () => rng.uniform());
    // TODO: Change this to instead of always being 250, it should always be the amount of effects the glyph with the most effects could ever have
    // This would mean in vanilla, it would be 7, but in a mod with a glyph of 12 effects, it would be 12, etc.
    // Call the RNG code the same number of times regardless of glyph (by overcalling) to improve determinism
    Array.range(0, 250 - glyphTypeEffects.length).forEach(() => rng.uniform());

    if (GlyphInfo[type].effectWeights) {
      for (const i of glyphTypeEffects) {
        // This should be .root not .pow
        effectValues[i] = Math.root(effectValues[i], GlyphInfo[type].effectWeights[i]);
      }
    }

    if (GlyphInfo[type].bannedEffectPairs) {
      for (const i of GlyphInfo[type].bannedEffectPairs) {
        if (i[3] === undefined || (!i[3] && !(i[3] instanceof Function))) {
          if (effectValues[i[1]] >= effectValues[i[2]]) {
            effectValues[i[2]] = -1;
          } else {
            effectValues[i[1]] = -1;
          }
        }
      }
    }

    if (GlyphInfo[type].primaryEffects) {
      for (const i of GlyphInfo[type].primaryEffects) {
        effectValues[i] = 2;
      }
    }

    for (let i = 0; i < guarenteedEffects.length; i++) {
      effectValues[GlyphInfo[type].effects.filter(e => e.id === guarenteedEffects[i])[0].id] = 2;
    }

    let fcount = count;
    if (GlyphInfo[type].primaryEffects !== undefined) {
      fcount = Math.max(count, guarenteedEffects.length + GlyphInfo[type].primaryEffects.length);
    }
    // Sort from highest to lowest value.
    let effects = Object.keys(effectValues).sort((a, b) => effectValues[b] - effectValues[a]).slice(0, fcount);
    if (GlyphInfo[type].excessEffects.length > 0) effects = effects.concat(GlyphInfo[type].excessEffects);

    return effects;
  },

  randomType(rng) {
    const generatable = generatedTypes.filter(x => (GlyphInfo[x].isGenerated ?? false) && GlyphInfo[x].generationRequirement);
    const typesArray = generatedTypes.filter(x => generatable.includes(x));
    const types = typesArray.mapToObject(x => x, () => 1);
    let sum = 0;
    for (const type in types) {
      types[type] = (GlyphInfo[type].appearanceWeight ?? 1);
      sum += types[type];
    }
    const chosen = rng.uniform() * sum;
    sum = 0;
    for (const value in types) {
      sum += types[value];
      if (sum >= chosen) return value;
    }
    return types[Math.floor(rng.uniform() * types.length)];
  },

  uniformGlyphSelections(level, rng, realityCount) {
    const basics = GlyphInfo.basicGlyphTypes.length;
    const groupNum = Decimal.floor(realityCount.sub(1).max(0).div(basics))
      .clampMax(basics * this.uniformityGroups + 1).toNumber();
    let groupIndex = realityCount.floor().sub(1).mod(basics).toNumber();
    // Mod here returns negative for negative numbers, so turn into positive mod if lt 0
    if (groupIndex < 0) groupIndex += basics;

    const initSeed = player.reality.initialSeed;
    const typePerm = permutationIndex(basics, groupNum * (31 + initSeed % 7) + (initSeed % 1123));

    let glyphsChosen = [...GlyphInfo.basicGlyphTypes];
    while (glyphsChosen.length < GlyphSelection.choiceCount) {
      glyphsChosen = [...glyphsChosen, ...GlyphInfo.basicGlyphTypes];
    }
    while (glyphsChosen.length > GlyphSelection.choiceCount) {
      while (groupIndex.length <= groupIndex) {
        groupIndex--;
      }
      glyphsChosen.splice(typePerm[groupIndex], 1);
      groupIndex--;
    }

    const effectsAsIds = [];
    for (let i = 0; i <= (GlyphSelection.choiceCount - 1); i++) {
      // eslint-disable-next-line max-len
      const effectPerm = permutationIndex(GlyphInfo[glyphsChosen[i]].effects.length, (7 + initSeed % 5) * groupNum + initSeed % 11);
      // Why add n - 1?
      // Well, +(n-1) = -1, since in modulo n arithmetic +n = +0. This way also prevents negatives, read above comments
      // eslint-disable-next-line max-len
      groupIndex = effectPerm[realityCount.add(GlyphInfo[glyphsChosen[i]].effects.length - 1).mod(GlyphInfo[glyphsChosen[i]].effects.length).toNumber()];
      effectsAsIds.push(GlyphInfo[glyphsChosen[i]].effects[groupIndex].id);
    }

    const glyphs = [];
    for (let i = 0; i <= (GlyphSelection.choiceCount - 1); i++) {
      glyphs.push(this.randomGlyph(level, rng, glyphsChosen[i], [effectsAsIds[i]]));
    }

    return glyphs;

  },

  getRNG(fake) {
    return fake ? new GlyphGenerator.FakeGlyphRNG() : new GlyphGenerator.RealGlyphRNG();
  },

  /**
   * More than 3 approx 0.001%
   * More than 2.5 approx 0.2%
   * More than 2 approx 6%
   * More than 1.5 approx 38.43%
   */
  gaussianBellCurve(rng) {
    // Old code used max, instead of abs -- but we rejected any samples that were
    // at the boundary anyways. Might as well use abs, and not cycle as many times.
    // The function here is an approximation of ^0.65, here is the old code:
    //     return Math.pow(Math.max(rng.normal() + 1, 1), 0.65);
    const x = Math.sqrt(Math.abs(rng.normal(), 0) + 1);
    return -0.111749606737000 + x * (0.900603878243551 + x * (0.229108274476697 + x * -0.017962545983249));
  },

  copy(glyph) {
    return glyph ? deepmerge({}, glyph) : glyph;
  },
};
