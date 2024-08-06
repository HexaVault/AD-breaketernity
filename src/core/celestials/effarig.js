import { BitUpgradeState } from "../game-mechanics";
import { GameDatabase } from "../secret-formula/game-database";

import { DC } from "../constants";

import { Quotes } from "./quotes";

export const EFFARIG_STAGES = {
  INFINITY: 1,
  ETERNITY: 2,
  REALITY: 3,
  COMPLETED: 4
};

export const Effarig = {
  displayName: "Effarig",
  possessiveName: "Effarig's",
  initializeRun() {
    clearCelestialRuns();
    player.celestials.effarig.run = true;
    recalculateAllGlyphs();
    Tab.reality.glyphs.show(false);
  },
  get isRunning() {
    return player.celestials.effarig.run;
  },
  get currentStage() {
    if (!EffarigUnlock.infinity.isUnlocked) {
      return EFFARIG_STAGES.INFINITY;
    }
    if (!EffarigUnlock.eternity.isUnlocked) {
      return EFFARIG_STAGES.ETERNITY;
    }
    if (!EffarigUnlock.reality.isUnlocked) {
      return EFFARIG_STAGES.REALITY;
    }
    return EFFARIG_STAGES.COMPLETED;
  },
  get currentStageName() {
    switch (this.currentStage) {
      case EFFARIG_STAGES.INFINITY:
        return "Infinity";
      case EFFARIG_STAGES.ETERNITY:
        return "Eternity";
      case EFFARIG_STAGES.REALITY:
      default:
        return "Reality";
    }
  },
  get eternityCap() {
    return this.isRunning && this.currentStage === EFFARIG_STAGES.ETERNITY ? DC.E50 : undefined;
  },
  get glyphLevelCap() {
    switch (this.currentStage) {
      case EFFARIG_STAGES.INFINITY:
        return new Decimal(DC.E2);
      case EFFARIG_STAGES.ETERNITY:
        return new Decimal(1500);
      case EFFARIG_STAGES.REALITY:
      default:
        return new Decimal(2000);
    }
  },

  get shardsGained() {
    if (!TeresaUnlocks.effarig.canBeApplied) return DC.D0;
    return Decimal.floor(Decimal.pow(Currency.eternityPoints.value.add(1).log10().div(7500),
      getActiveGlyphEffects().length)).times(AlchemyResource.effarig.effectValue);
  },
  get maxRarityBoost() {
    return Decimal.log10(Decimal.log10(Currency.relicShards.value.add(10))).times(5);
  },
  nerfFactor(power) {
    let c;
    switch (this.currentStage) {
      case EFFARIG_STAGES.INFINITY:
        c = 1500;
        break;
      case EFFARIG_STAGES.ETERNITY:
        c = 29.29;
        break;
      case EFFARIG_STAGES.REALITY:
      default:
        c = 25;
        break;
    }
    return (DC.D1.sub(new Decimal(c).div(Decimal.sqrt(power.add(1).absLog10()).add(c)))).times(3);
  },
  get tickDilation() {
    return this.nerfFactor(Currency.timeShards.value).div(10).add(0.7);
  },
  get multDilation() {
    return this.nerfFactor(Currency.infinityPower.value).div(4).add(0.25);
  },
  get tickspeed() {
    const base = Tickspeed.baseValue.reciprocal().log10().add(3);
    return Decimal.pow10(Decimal.pow(base, this.tickDilation)).reciprocal();
  },
  multiplier(mult) {
    const base = new Decimal(mult).add(1).absLog10();
    return Decimal.pow10(Decimal.pow(base, this.multDilation));
  },
  get bonusRG() {
    // Will return 0 if Effarig Infinity is uncompleted
    return Decimal.floor(replicantiCap().max(1).log10().div(LOG10_MAX_VALUE).sub(1));
  },
  quotes: Quotes.effarig,
  symbol: "Ϙ",

  reset() {
    player.celestials.effarig.relicShards = DC.D0;
    player.celestials.effarig.unlockBits = 0;
    player.celestials.effarig.run = false;
    player.celestials.effarig.glyphWeights.ep = 25;
    player.celestials.effarig.glyphWeights.repl = 25;
    player.celestials.effarig.glyphWeights.dt = 25;
    player.celestials.effarig.glyphWeights.eternities = 25;
    player.celestials.effarig.autoAdjustGlyphWeights = false;
  },
};

class EffarigUnlockState extends BitUpgradeState {
  get bits() { return player.celestials.effarig.unlockBits; }
  set bits(value) { player.celestials.effarig.unlockBits = value; }

  get cost() {
    return this.config.cost;
  }

  get isEffectActive() {
    return !Pelle.isDisabled("effarig");
  }

  purchase() {
    if (this.isUnlocked || !Currency.relicShards.purchase(this.cost)) return;
    this.unlock();
    this.config.onPurchased?.();
  }
}

export const EffarigUnlock = mapGameDataToObject(
  GameDatabase.celestials.effarig.unlocks,
  config => new EffarigUnlockState(config)
);

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  if (Tab.celestials.effarig.isOpen) Effarig.quotes.initial.show();
});

EventHub.logic.on(GAME_EVENT.BIG_CRUNCH_BEFORE, () => {
  if (!Effarig.isRunning) return;
  Effarig.quotes.completeInfinity.show();
});

EventHub.logic.on(GAME_EVENT.ETERNITY_RESET_BEFORE, () => {
  if (!Effarig.isRunning) return;
  Effarig.quotes.completeEternity.show();
});
