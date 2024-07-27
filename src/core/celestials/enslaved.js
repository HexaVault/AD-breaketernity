import { BitUpgradeState } from "../game-mechanics";
import { GameDatabase } from "../secret-formula/game-database";

import { DC } from "../constants";

import { Quotes } from "./quotes";

export const ENSLAVED_UNLOCKS = {
  FREE_TICKSPEED_SOFTCAP: {
    id: 0,
    price: TimeSpan.fromYears(new Decimal(1e35)).totalMilliseconds,
    secondaryRequirement: () => true,
    description: () => `Increase the softcap to Tickspeed upgrades from Time Dimensions by ${formatInt(1e5)}`,
  },
  RUN: {
    id: 1,
    price: TimeSpan.fromYears(new Decimal(1e40)).totalMilliseconds,
    secondaryRequirement() {
      const hasLevelRequirement = player.records.bestReality.glyphLevel.gte(5000);
      const hasRarityRequirement = strengthToRarity(player.records.bestReality.glyphStrength).gte(100);
      return hasLevelRequirement && hasRarityRequirement;
    },
    description() {
      const hasLevelRequirement = player.records.bestReality.glyphLevel.gte(5000);
      const hasRarityRequirement = strengthToRarity(player.records.bestReality.glyphStrength).gte(100);
      return `Unlock The Nameless Ones' Reality (requires ${hasLevelRequirement ? "[✓]" : "[✗]"} a level
      ${formatInt(5000)} Glyph and ${hasRarityRequirement ? "[✓]" : "[✗]"} a ${formatRarity(new Decimal(100))} rarity Glyph)`;
    }
  }
};

export const Enslaved = {
  displayName: "The Nameless Ones",
  possessiveName: "The Nameless Ones'",
  boostReality: false,
  BROKEN_CHALLENGES: [2, 3, 4, 5, 7, 8, 10, 11, 12],
  nextTickDiff: new Decimal(50),
  isReleaseTick: false,
  autoReleaseTick: 0,
  autoReleaseSpeed: 0,
  timeCap: DC.BEMAX,
  glyphLevelMin: 5000,
  currentBlackHoleStoreAmountPerMs: DC.D0,
  tachyonNerf: 0.3,
  toggleStoreBlackHole() {
    if (!this.canModifyGameTimeStorage) return;
    player.celestials.enslaved.isStoring = !player.celestials.enslaved.isStoring;
    player.celestials.enslaved.isStoringReal = false;
  },
  toggleStoreReal() {
    if (!this.canModifyRealTimeStorage && !this.isStoredRealTimeCapped) return;
    player.celestials.enslaved.isStoringReal = !player.celestials.enslaved.isStoringReal;
    player.celestials.enslaved.isStoring = false;
  },
  toggleAutoStoreReal() {
    if (!this.canModifyRealTimeStorage) return;
    player.celestials.enslaved.autoStoreReal = !player.celestials.enslaved.autoStoreReal;
  },
  get canModifyGameTimeStorage() {
    return Enslaved.isUnlocked && !Pelle.isDoomed && !BlackHoles.arePaused && !EternityChallenge(12).isRunning &&
      !Enslaved.isRunning && !Laitela.isRunning;
  },
  get canModifyRealTimeStorage() {
    return Enslaved.isUnlocked && !Pelle.isDoomed;
  },
  get isStoredRealTimeCapped() {
    return player.celestials.enslaved.storedReal < this.storedRealTimeCap;
  },
  // We assume that the situations where you can't modify time storage settings (of either type) are exactly the cases
  // where they have also been explicitly disabled via other game mechanics. This also reduces UI boilerplate code.
  // Note that we force time storage when auto-releasing, as not doing so caused a lot of poor usability issues
  get isStoringGameTime() {
    return this.canModifyGameTimeStorage && (this.isAutoReleasing || player.celestials.enslaved.isStoring);
  },
  get isStoringRealTime() {
    return this.canModifyRealTimeStorage && player.celestials.enslaved.isStoringReal;
  },
  get storedRealTimeEfficiency() {
    return 0.7;
  },
  get storedRealTimeCap() {
    const addedCap = Ra.unlocks.improvedStoredTime.effects.realTimeCap.effectOrDefault(0);
    return new Decimal(3600 * 1000 * 8).add(addedCap);
  },
  get isAutoReleasing() {
    return player.celestials.enslaved.isAutoReleasing && !BlackHoles.areNegative && !Pelle.isDisabled("blackhole");
  },
  storeRealTime(diffVal) {
    if (Pelle.isDoomed) return;
    const thisUpdate = Date.now();
    const diff = diffVal === undefined ? Decimal.max(thisUpdate - player.lastUpdate, 0) : diffVal;
    const efficiency = this.storedRealTimeEfficiency;
    const maxTime = this.storedRealTimeCap;
    player.celestials.enslaved.storedReal = player.celestials.enslaved.storedReal.add(diff.mul(efficiency));
    if (player.celestials.enslaved.storedReal.gt(maxTime)) {
      player.celestials.enslaved.isStoringReal = false;
      player.celestials.enslaved.storedReal = maxTime;
    }
    // More than 24 hours in milliseconds
    if (player.celestials.enslaved.storedReal.gte(24 * 60 * 60 * 1000)) SecretAchievement(46).unlock();
    player.lastUpdate = thisUpdate;
  },
  autoStoreRealTime(diffMs) {
    const maxGain = this.storedRealTimeCap - player.celestials.enslaved.storedReal;
    const used = Math.min(diffMs, Math.max(0, maxGain / this.storedRealTimeEfficiency));
    player.celestials.enslaved.storedReal += used * this.storedRealTimeEfficiency;
    player.lastUpdate += used;
    return diffMs - used;
  },
  canRelease(auto) {
    return !Enslaved.isStoringRealTime && !EternityChallenge(12).isRunning && !Laitela.isRunning &&
      !(Enslaved.isRunning && auto) && !Pelle.isDoomed;
  },
  // "autoRelease" should only be true when called with the Ra upgrade
  useStoredTime(autoRelease) {
    if (!this.canRelease(autoRelease)) return;
    const maxInversion = player.requirementChecks.reality.slowestBH.lte(1e-300);
    if (ImaginaryUpgrade(24).isLockingMechanics && Ra.isRunning && maxInversion) {
      if (!autoRelease) ImaginaryUpgrade(24).tryShowWarningModal("discharge your Black Hole");
      return;
    }
    player.requirementChecks.reality.slowestBH = DC.D1;
    let release = player.celestials.enslaved.stored;
    if (Enslaved.isRunning) {
      release = Enslaved.storedTimeInsideEnslaved(release);
      if (Time.thisReality.totalYears.add(TimeSpan.fromMilliseconds(release).totalYears.gt(1))) {
        EnslavedProgress.storedTime.giveProgress();
      }
    }
    if (autoRelease) release = release.mul(0.01);
    this.nextTickDiff = Decimal.clampMax(release, this.timeCap);
    this.isReleaseTick = true;
    // Effective gamespeed from stored time assumes a "default" 50 ms update rate for consistency
    const effectiveGamespeed = release.div(50);
    player.celestials.ra.peakGamespeed = Decimal.max(player.celestials.ra.peakGamespeed, effectiveGamespeed);
    this.autoReleaseSpeed = release.div(player.options.updateRate).div(5);
    player.celestials.enslaved.stored = player.celestials.enslaved.stored.mul(autoRelease ? 0.99 : 0);
  },
  has(info) {
    return player.celestials.enslaved.unlocks.includes(info.id);
  },
  canBuy(info) {
    return player.celestials.enslaved.stored.gte(info.price) && info.secondaryRequirement() && !this.has(info);
  },
  buyUnlock(info) {
    if (!this.canBuy(info)) return false;
    if (info.id === ENSLAVED_UNLOCKS.RUN.id) this.quotes.unlockRun.show();
    player.celestials.enslaved.stored = player.celestials.enslaved.stored.sub(info.price);
    player.celestials.enslaved.unlocks.push(info.id);
    return true;
  },
  initializeRun() {
    clearCelestialRuns();
    player.celestials.enslaved.run = true;
    player.celestials.enslaved.hasSecretStudy = false;
    this.feltEternity = false;

    // Re-validation needs to be done here because this code gets called after the automator attempts to start.
    // This is a special case for Nameless because it's one of the only two cases where a command becomes locked
    // again (the other being Pelle entry, which just force-stops the automator entirely).
    AutomatorData.recalculateErrors();
    if (AutomatorBackend.state.mode === AUTOMATOR_MODE.RUN && AutomatorData.currentErrors().length) {
      AutomatorBackend.stop();
      GameUI.notify.error("This Reality forbids Black Holes! (Automator stopped)");
    }

    this.quotes.startRun.show();
  },
  get isRunning() {
    return player.celestials.enslaved.run;
  },
  completeRun() {
    player.celestials.enslaved.completed = true;
    this.quotes.completeReality.show();
  },
  get isCompleted() {
    return player.celestials.enslaved.completed;
  },
  get canTickHintTimer() {
    return !EnslavedProgress.hintsUnlocked.hasProgress && Enslaved.has(ENSLAVED_UNLOCKS.RUN) && !Enslaved.isCompleted;
  },
  get isUnlocked() {
    return EffarigUnlock.eternity.isUnlocked;
  },
  get realityBoostRatio() {
    return Decimal.max(1, Decimal.floor(player.celestials.enslaved.storedReal
      .div(Decimal.max(1000, Time.thisRealityRealTime.totalMilliseconds))));
  },
  get canAmplify() {
    return this.realityBoostRatio.gt(1) && !Pelle.isDoomed && !isInCelestialReality();
  },
  storedTimeInsideEnslaved(stored) {
    if (stored.lte(1e3)) return stored;
    return Decimal.pow(10, Decimal.pow(Decimal.log10(stored.div(1e3)), 0.55)).times(1e3);
  },
  feelEternity() {
    if (this.feltEternity) {
      Modal.message.show(`You have already exposed this crack in the Reality. Time in this Eternity is being multiplied
        by your Eternity count, up to a maximum of ${formatX(1e66)}.`,
      { closeEvent: GAME_EVENT.REALITY_RESET_AFTER }, 1);
    } else {
      EnslavedProgress.feelEternity.giveProgress();
      this.feltEternity = true;
      Modal.message.show(`Time in this Eternity will be multiplied by your Eternity count,
        up to a maximum of ${formatX(1e66)}.`, { closeEvent: GAME_EVENT.REALITY_RESET_AFTER }, 1);
    }
  },
  get feltEternity() {
    return player.celestials.enslaved.feltEternity;
  },
  set feltEternity(value) {
    player.celestials.enslaved.feltEternity = value;
  },
  get nextHintCost() {
    return TimeSpan.fromYears(new Decimal(1e40 * Math.pow(3, this.hintCostIncreases))).totalMilliseconds;
  },
  get hintCostIncreases() {
    const hintTime = player.celestials.enslaved.zeroHintTime - Date.now();
    return Math.clampMin(hintTime / TimeSpan.fromDays(new Decimal(1)).totalMilliseconds.toNumber(), 0);
  },
  spendTimeForHint() {
    if (player.celestials.enslaved.stored < this.nextHintCost) return false;
    player.celestials.enslaved.stored -= this.nextHintCost;
    if (Enslaved.hintCostIncreases === 0) {
      player.celestials.enslaved.zeroHintTime = Date.now() + TimeSpan.fromDays(1).totalMilliseconds.toNumber();
    } else {
      player.celestials.enslaved.zeroHintTime += TimeSpan.fromDays(1).totalMilliseconds.toNumber();
    }
    return true;
  },
  quotes: Quotes.enslaved,
  // Unicode f0c1.
  symbol: "\uf0c1",

  reset() {
    player.celestials.enslaved.isStoring = false;
    player.celestials.enslaved.stored = DC.D0;
    player.celestials.enslaved.isStoringReal = false;
    player.celestials.enslaved.storedReal = DC.D0;
    player.celestials.enslaved.autoStoreReal = false;
    player.celestials.enslaved.isAutoReleasing = false;
    player.celestials.enslaved.unlocks = [];
    player.celestials.enslaved.run = false;
    player.celestials.enslaved.completed = false;
    player.celestials.enslaved.tesseracts = DC.D0;
    player.celestials.enslaved.hasSecretStudy = false;
    player.celestials.enslaved.feltEternity = false;
    player.celestials.enslaved.progressBits = 0;
  },
};

class EnslavedProgressState extends BitUpgradeState {
  get bits() { return player.celestials.enslaved.hintBits; }
  set bits(value) { player.celestials.enslaved.hintBits = value; }

  get hasProgress() {
    return Boolean(player.celestials.enslaved.progressBits & (1 << this.id));
  }

  get hasHint() {
    return this.hasProgress || this.isUnlocked;
  }

  get hintInfo() {
    return this.config.hint;
  }

  get completedInfo() {
    return typeof this.config.condition === "function" ? this.config.condition() : this.config.condition;
  }

  giveProgress() {
    // Bump the last hint time appropriately if the player found the hint
    if (this.hasHint && !this.hasProgress) {
      player.celestials.enslaved.zeroHintTime -= Math.log(2) /
        Math.log(3) * TimeSpan.fromDays(1).totalMilliseconds.toNumber();
      GameUI.notify.success("You found a crack in The Nameless Ones' Reality!", 10000);
    }
    player.celestials.enslaved.progressBits |= (1 << this.id);
  }
}

export const EnslavedProgress = mapGameDataToObject(
  GameDatabase.celestials.enslaved.progress,
  config => new EnslavedProgressState(config)
);

export const Tesseracts = {
  get bought() {
    return player.celestials.enslaved.tesseracts;
  },

  get extra() {
    return this.bought.times(DC.DM1.add(SingularityMilestone.tesseractMultFromSingularities.effectOrDefault(1)));
  },
  // -1 + x = x - 1, so do this to reduce making more decimals than necessary

  get effectiveCount() {
    return this.bought.add(this.extra);
  },

  buyTesseract() {
    if (!this.canBuyTesseract) return;
    if (GameEnd.creditsEverClosed) return;
    player.celestials.enslaved.tesseracts = player.celestials.enslaved.tesseracts.add(1);
  },

  // This used to be an array, but tess costs are just a super easy thing to calculate in BE so i dont care

  costs(index) {
    // eslint-disable-next-line no-param-reassign
    index = index.add(1);
    if (index.lte(3)) return Decimal.pow10(index.times(2e7));
    return Decimal.pow10((index.sub(3)).factorial().times(Decimal.pow(2, index.sub(3))).times(6e7));
  },

  get nextCost() {
    return this.costs(this.bought);
  },

  get canBuyTesseract() {
    return Enslaved.isCompleted && Currency.infinityPoints.gte(Tesseracts.nextCost);
  },

  capIncrease(count = this.bought) {
    const totalCount = count.times(SingularityMilestone.tesseractMultFromSingularities.effectOrDefault(1));
    const base = totalCount.lt(1) ? DC.D0 : Decimal.pow(2, totalCount).times(2.5e5);
    return base.times(DC.D1.add(AlchemyResource.boundless.effectValue));
  },

  get nextTesseractIncrease() {
    return this.capIncrease(this.bought.add(1)).sub(this.capIncrease(this.bought));
  },
};

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  if (Tab.celestials.enslaved.isOpen) Enslaved.quotes.initial.show();
});
