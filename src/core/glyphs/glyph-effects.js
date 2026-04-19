import { GlyphInfo, Pelle } from "../globals";
import { GameDatabase } from "../secret-formula/game-database";
import { GameMechanicState } from "../game-mechanics/game-mechanic";
import { GlyphCombiner } from "../secret-formula/reality/glyph-effects";

class GlyphEffectState extends GameMechanicState {
  constructor(config) {
    super(config);
    this.formatEffect = config.formatEffect;
    // This is used for effects which need to display different values in single values versus combined values (eg. power effects)
    this.formatSingleEffect = config.formatSingleEffect ?? config.formatEffect;
  }

  effectValueForInput(level, strength) {
    return this.config.effectValueForInput(level, strength);
  }

  get formattedEffect() { return this.formatEffect(this.effectValue); }
  get formattedSingleEffect() { return this.formatSingleEffect(this.effectValue); }

  get isEnabledInDoomed() { return this.config.isEnabledInDoomed(); }

  get isEffectActive() {
    if (!Pelle.isDoomed) return true;
    return this.isEnabledInDoomed;
  }
}

export class GlyphEffectConfig {
  constructor(config) {
    GlyphEffectConfig.checkInputs(config);
    this.config = config;
    this.id = config.id;

    // Conversion function to produce altered (secondary) glyph effect
    this.conversion = config.conversion;

    this.primary = new GlyphEffectState({
      id: this.id,
      effect: () => GameCache.glyphEffects.value[this.id].value,
      formatEffect: config.formatEffect,
      formatSingleEffect: config.formatSingleEffect,
      effectValueForInput: (level, strength) => this.combine([this.config.effect(level, strength)]).value,
      isEnabledInDoomed: () => this.isEnabledInDoomed,
    });
    if (this.conversion) this.secondary = new GlyphEffectState({
      id: this.id,
      effect: () => this.conversion(this.primary.effectValue),
      formatEffect: config.formatSecondaryEffect,
      formatSingleEffect: config.formatSingleSecondaryEffect,
      effectValueForInput: (level, strength) => this.conversion(this.combine([this.config.effect(level, strength)]).value),
      isEnabledInDoomed: () => this.isEnabledInDoomed,
    });

    this.intID = config.intID;
    this._glyphTypes = config.glyphTypes;
    // Flag to separate "basic"/effarig glyphs from cursed/reality glyphs
    this.isGenerated = config.isGenerated;
    // Color to show numbers in glyph tooltips if boosted
    this.alteredColor = config.alteredColor;
    // String passed along to tooltip code to ensure proper formatting
    this.alterationType = config.alterationType;
    // Indicates whether the effect grows or shrinks with level
    this._biggerIsBetter = undefined;
    this._effCol = config.effectCol;
    this._effectCol = undefined;
  }

  get isEnabledInDoomed() {
    return handlePossibleFunction(this.config.enabledInDoomed) ?? false;
  }

  // Unlike most effects, glyph effects have not one, but four (!) descriptions
  // In all of these (except for generic), {value} is replaced with the actual value of the effect

  // The single description is used in places where a single glyph's effect is shown, mainly glyph tooltips
  // This uses the formatSingleEffect function for the effect value formatting
  get singleDesc() { return handlePossibleFunction(this.config.singleDesc); }

  // The total description specifies how to show the combined (total) effect of many glyphs
  // mainly the "effect summary" next to Glyphs in the Reality tab
  // If not defined, defaults to the single description
  get totalDesc() { return handlePossibleFunction(this.config.totalDesc ?? this.config.singleDesc); };

  // The generic description is a description of the effect without a specific value
  // It's used in the glyph choice info modal
  // If not defined, defaults to the single description with {value} replaced with "x"
  get genericDesc() { return handlePossibleFunction(this.config.genericDesc ?? this.config.singleDesc).replace("{value}", "x"); };

  // The short description is a short version of the glyph's effect used in glyph previews (ie. before Reality)
  get shortDesc() { return handlePossibleFunction(this.config.shortDesc); }

  get isEffectCapped() { return GameCache.glyphEffects.value[this.id].capped; }

  get biggerIsBetter() {
    if (this._biggerIsBetter === undefined) this._biggerIsBetter = this.checkBiggerIsBetter();
    return this._biggerIsBetter;
  }

  get glyphTypes() {
    const glyphs = [];
    if (this._glyphTypes.length === 0) return glyphs;
    for (const item of glyphs) {
      let isValid;
      try {
        isValid = handlePossibleFunction(item[0]);
      } catch (error) {
        isValid = false;
      }
      if (isValid) {
        glyphs.push(...item.slice(1));
      }
    }
    return glyphs;
  }

  get effectCol() {
    // This basically is our "lazy" way of caching, so we dont recalculate each time.
    if (this._effectCol) return this._effectCol;
    if (!this._effCol) {
      this._effectCol = "#ffffff";
      return "#ffffff";
    }
    if (this._effCol.slice(0, 1) === "#") {
      this._effectCol = this._effCol;
      return this._effCol;
    }
    if (GlyphInfo.glyphTypes.includes(this._effCol)) {
      this._effectCol = CosmeticGlyphTypes[this._effCol].currentColor.border;
      if (this._effCol === "cursed") this._effectCol = "var(--color-celestials)";
      return this._effectCol;
    }
    this._effectCol = "#ffffff";
    return "#ffffff";
  }

  compareValues(effectValueA, effectValueB) {
    const result = Decimal.compare(effectValueA, effectValueB);
    return this.biggerIsBetter ? result : -result;
  }

  /** @private */
  checkBiggerIsBetter() {
    const baseEffect = this.primary.effectValueForInput(new Decimal(1), new Decimal(1.01));
    const biggerEffect = this.primary.effectValueForInput(new Decimal(100), new Decimal(2));
    return biggerEffect.gt(baseEffect);
  }

  combine(effects) {
    const combine = this.config.combine;
    const softcap = this.config.softcap;
    // We can assume that the result of the combine is either a number or decimal here because we check for that in checkInputs below
    const rawValue = combine(effects);
    if (softcap === undefined) return { value: rawValue, uncappedValue: rawValue, capped: false };
    const cappedValue = softcap(rawValue, effects);
    return { value: cappedValue, uncappedValue: rawValue, capped: Decimal.neq(rawValue, cappedValue) };
  }

  /** @private */
  static checkInputs(setup) {
    const KNOWN_KEYS = ["id", "intID", "glyphTypes", "singleDesc", "totalDesc", "genericDesc", "shortDesc",
      "effect", "formatEffect", "formatSingleEffect", "combine", "softcap", "conversion", "formatSecondaryEffect",
      "formatSingleSecondaryEffect", "alteredColor", "alterationType", "isGenerated", "enabledInDoomed", "effectCol"];
    const unknownField = Object.keys(setup).find(k => !KNOWN_KEYS.includes(k));
    if (unknownField !== undefined) {
      // eslint-disable-next-line no-console
      console.warn(`Glyph effect "${setup.id}" includes unrecognized field "${unknownField}"`);
    }

    const unknownGlyphType = setup.glyphTypes.find(e => !GlyphInfo.glyphTypes.includes(e));
    if (unknownGlyphType !== undefined) {
      // eslint-disable-next-line no-console
      console.warn(`Glyph effect "${setup.id}" references unknown glyphType "${unknownGlyphType}"`);
    }

    const emptyCombine = setup.combine([]);
    if (!isConstant(emptyCombine)) {
      // eslint-disable-next-line no-console
      console.warn(`The combine function for Glyph effect "${setup.id}" has an invalid return type`);
    }
  }
};

export const realityGlyphEffectLevelThresholds = [0, 9000, 15000, 25000];

export const GlyphEffects = mapGameDataToObject(
  GameDatabase.reality.glyphEffects,
  config => new GlyphEffectConfig(config)
);

export function getGlyphEffectsFromArray(array) {
  return orderedEffectList
    .map(effectName => GlyphEffects[effectName])
    .filter(effect => array.includes(effect.id));
}

// TODO: remove the three functions below
/**
 * This variant is used by GameCache
 * @param {string} effectKey
 * @return {number | Decimal}
 */
export function getAdjustedGlyphEffectUncached(effectKey) {
  return GlyphEffects[effectKey].combine(getGlyphEffectValues(effectKey));
}

/**
 * @param {string} effectKey
 * @return {Decimal}
 */
export function getAdjustedGlyphEffect(effectKey) {
  return GlyphEffects[effectKey].primary.effectValue;
}

/**
 * Takes the glyph effect value and feeds it through the conversion function that gives the value of the secondary
 * effect from glyph alteration.
 * @param {string} effectKey
 * @return {number | Decimal}
 */
export function getSecondaryGlyphEffect(effectKey) {
  return GlyphEffects[effectKey].secondary.effectValue;

}

/**
 * Finds all equipped glyphs with the specified effect and returns an array of effect values.
 * @param {string} effectKey
 * @returns {number[]}
 */
export function getGlyphEffectValues(effectKey) {
  if (!orderedEffectList.includes(effectKey)) {
    throw new Error(`Unknown Glyph effect requested "${effectKey}"'`);
  }
  const r = player.reality.glyphs.active
    .filter(glyph => glyph.effects.includes(effectKey))
    .map(glyph => getSingleGlyphEffectFromArray(effectKey, glyph));
  return r;
}

/**
 * Key is type+effect
 */
export function separateEffectKey(effectKey) {
  let type = "";
  let effect = "";
  for (let i = 0; i < GlyphInfo.glyphTypes.length; i++) {
    if (effectKey.substring(0, GlyphInfo.glyphTypes[i].length) === GlyphInfo.glyphTypes[i]) {
      type = GlyphInfo.glyphTypes[i];
      effect = effectKey.substring(GlyphInfo.glyphTypes[i].length);
      break;
    }
  }
  return [type, effect];
}

// Turns a glyph effect list into an effect list and corresponding values. This also picks up non-generated effects,
// since there is some id overlap. Those should be filtered out as needed after calling this function.
// eslint-disable-next-line max-params
export function getGlyphEffectValuesFromArray(array, level, baseStrength, type) {
  // If we don't specifically exclude companion glyphs, the first-reality EP record is wrong within Doomed since its
  // value is encoded in the rarity field
  const strength = (Pelle.isDoomed && type !== "companion") ? Pelle.glyphStrength : baseStrength;
  return getGlyphEffectsFromArray(array)
    .map(effect => ({
      id: effect.id,
      value: effect.primary.effectValueForInput(level, strength)
    }));
}

// Pulls out a single effect value from a glyph's bitmask, returning just the value (nothing for missing effects)
export function getSingleGlyphEffectFromArray(effectName, glyph) {
  if (!glyph.effects.includes(effectName)) return undefined;
  return GlyphEffects[effectName].primary
    .effectValueForInput(getAdjustedGlyphLevel(glyph), Pelle.isDoomed ? Pelle.glyphStrength : glyph.strength);
}

// Note this function is used for news ticker bitmasks and offline achievements
export function countValuesFromBitmask(bitmask) {
  let numEffects = 0;
  let bits = bitmask;
  while (bits !== 0) {
    numEffects += bits & 1;
    bits >>= 1;
  }
  return numEffects;
}

// Returns both effect value and softcap status
export function getActiveGlyphEffects() {
  let effectValues = orderedEffectList
    .map(effect => ({ effect, values: getGlyphEffectValues(effect) }))
    .filter(ev => ev.values.length > 0)
    .map(ev => ({
      id: ev.effect,
      value: GlyphEffects[ev.effect].combine(ev.values).value,
    }));
  const effectNames = effectValues.map(e => e.id);

  // Numerically combine cursed effects with other glyph effects which directly conflict with them
  const cursedEffects = ["cursedgalaxies", "curseddimensions", "cursedEP"];
  const conflictingEffects = ["realitygalaxies", "effarigdimensions", "timeEP"];
  const combineFunction = [GlyphCombiner.multiply, GlyphCombiner.multiply, GlyphCombiner.multiply];
  for (let i = 0; i < cursedEffects.length; i++) {
    if (effectNames.includes(cursedEffects[i]) && effectNames.includes(conflictingEffects[i])) {
      const combined = combineFunction[i]([getAdjustedGlyphEffect(cursedEffects[i]),
        getAdjustedGlyphEffect(conflictingEffects[i])]);
      if (Decimal.lt(combined, 1)) {
        effectValues = effectValues.filter(e => e.id !== conflictingEffects[i]);
        effectValues.filter(e => e.id === cursedEffects[i])[0].value.value = combined;
      } else {
        effectValues = effectValues.filter(e => e.id !== cursedEffects[i]);
        effectValues.filter(e => e.id === conflictingEffects[i])[0].value.value = combined;
      }
    }
  }

  return effectValues;
}
