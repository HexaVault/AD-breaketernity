import { coreGlyphInfo, glyphTypes } from "../secret-formula/reality/core-glyph-info";
import { GameMechanicState } from "../game-mechanics/game-mechanic";

class PelleGlyphEffectState extends GameMechanicState {
  get effectValue() {
    if (!this.config.requirement()) return this.config.default;
    return this.config.combine(Glyphs.activeList.filter(g => g.type === this.id)
      // TODO: strength should actually refer to Pelle.glyphStrength or something
      .map(g => (isFunction(this.config.effect) ? this.config.effect(g.level, g.strength) : this.config.effect)));
  }

  get formattedEffect() {
    return this.config.formatEffect(this.effectValue);
  }

  get description() {
    return handlePossibleFunction(this.config.description).replace("{value}", this.formattedEffect);
  }

  // Quite a specific thing (only used once) but it requires a ton of code so it's been put into this one function
  descriptionForEffectInput(level, strength) {
    return handlePossibleFunction(this.config.description)
      .replace("{value}", this.config.formatEffect(
        this.config.combine([handlePossibleFunction(this.config.effect, level, strength)])
      ));
  }

}

class GlyphType {
  constructor(config) {
    this.config = config;
    this.id = config.id;
    // Could recalculate using effects, but this has added advantage of just being faster
    this.effectIDs = config.effectIDs;
    // TODO: Extract glyph set name stuff out of GlyphSetName.vue
    this.adjective = config.adjective;
    this.noun = config.noun;
    this.isBasic = config.isBasic;
    this.regularGlyphSymbol = config.regularGlyphSymbol;
    this.cancerGlyphSymbol = config.cancerGlyphSymbol;
    this.overrides = {
      str: config.strOverride,
      level: config.levelOverride,
      effect: config.effectOverride,
    };
    this.appearanceWeight = config.appearanceWeight;
    // TODO: Make this a getter, so that it handles dynamic weights without seperate handling elsewhere
    // Also it should automatically give all other effects (that aren't listed) a weight of 1.
    // This would also occur if the glyph had no weigts defined by default.
    this.effectWeights = config.effectWeights;
    this.adjNounImportance = config.adjNounImportance;
    this.isGenerated = config.isGenerated ?? true;
    this.canCustomize = config.canCustomize ?? true;
    this.color = config.color;
    this.primaryEffects = config.primaryEffects;
    this.setColor = config.setColor;
    // TODO: Make function handling with default of true
    this.hasRarity = config.hasRarity;

    // TODO: Make this take in alot of stuff (either no input (use current sac), 1 input (use current sac + input),
    // or 2 inputs (use current sac + input, and use second input as internal cap))
    if (config.sacrificeInfo)
      this.sacrifice = new GameMechanicState({
        ...config.sacrificeInfo,
        id: this.id,
        input: () => player.reality.glyphs.sac[this.id],
      });
    if (config.pelleUniqueEffect)
      this.pelleEffect = new PelleGlyphEffectState({
        ...config.pelleUniqueEffect,
        id: this.id,
      });
  }

  // Dynamic (i18n)
  get name() { return handlePossibleFunction(this.config.name); }

  // Dynamic
  // TODO: Cache this so we only check once a game tick
  // Note: We dont need to cache any other glyph things really, since they're generally not called much, and even then they're usually very basic calls.
  get effects() {
    return handlePossibleConditional(this.config.effects());
  }

  // Needs special handling
  get allEffects() {
    return handlePossibleConditional(this.config.effects(), true);
  }

  // Needs special handling, Dynamic
  get excessEffects() {
    return this.config.excessEffects === undefined
      ? [] : handlePossibleConditional(this.config.excessEffects());
  }

  // Needs special handling
  get generationRequirement() {
    return handlePossibleFunction(this.config.generationRequirement) ?? true;
  }

  // Needs special handling, Dynamic
  get allExcessEffects() {
    return this.config.excessEffects === undefined
      ? [] : handlePossibleConditional(this.config.excessEffects(), true);
  }

  // Needs special handling, Dynamic
  get bannedEffectPairs() {
    const result = [];
    if (this.config.bannedEffectPairs === undefined) return result;
    this.config.bannedEffectPairs.forEach(p => {
      // We want anything that isnt truey to fall through, including false and undefined.
      if (!handlePossibleFunction(p[2])) result.push([p[0], p[1]]);
    });
    return result;
  }

  // Needs special handling, Dynamic
  get doomedEffects() {
    // eslint-disable-next-line no-negated-condition
    return !this.config.doomedEffectIDs ? this.effects : handlePossibleConditional(this.doomedEffectIDs);
  }

  // Needs special handling
  get alchemyResource() {
    if (this.config.alchemyResource === undefined) return undefined;
    return AlchemyResource[this.config.alchemyResource];
  }

  // Needs special handling
  get maxEquipped() {
    return handlePossibleFunction(this.config.maxEquipped) ?? Infinity;
  }

  // Dynamic, takes input
  getOverride(type) {
    return this.overrides[type] ?? (x => x);
  }
}

export const GlyphInfo = { ...coreGlyphInfo };
// TODO: find a better way to do this (there has to be one)
Object.values(glyphTypes).forEach(g => GlyphInfo[g.id] = new GlyphType(g));
