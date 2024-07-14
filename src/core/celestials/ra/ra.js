import { DC } from "../../constants";
import { GameMechanicState } from "../../game-mechanics";
import { Quotes } from "../quotes";

class RaUnlockState extends GameMechanicState {
  get bits() { return player.celestials.ra.unlockBits; }
  set bits(value) { player.celestials.ra.unlockBits = value; }

  get isUnlocked() {
    return player.celestials.ra.unlocks.includes(this.id);
  }

  get disabledByPelle() {
    return Pelle.isDoomed && this.config.disabledByPelle;
  }

  get isEffectActive() {
    return this.isUnlocked && !this.disabledByPelle;
  }

  get requirementText() {
    const pet = this.pet.name;
    return this.level === 1
      ? `Unlock ${pet}`
      : `Get ${pet} to level ${this.level}`;
  }

  get reward() {
    return typeof this.config.reward === "function"
      ? this.config.reward()
      : this.config.reward;
  }

  get displayIcon() {
    return this.disabledByPelle ? `<span class="fas fa-ban"></span>` : this.config.displayIcon;
  }

  get pet() {
    return Ra.pets[this.config.pet];
  }

  get level() {
    return this.config.level;
  }

  get canBeUnlocked() {
    return this.pet.level >= this.level && !this.isUnlocked;
  }

  unlock() {
    if (this.canBeUnlocked) player.celestials.ra.unlocks.push(this.id);
  }

  onUnlock() {
    player.celestials.ra.unlocks.push(this.id);
    this.config.onUnlock?.();
  }
}

const unlocks = mapGameDataToObject(
  GameDatabase.celestials.ra.unlocks,
  config => new RaUnlockState(config)
);

class RaPetState extends GameMechanicState {
  get data() {
    return player.celestials.ra.pets[this.id];
  }

  get name() {
    return this.config.name;
  }

  get chunkGain() {
    return this.config.chunkGain;
  }

  get memoryGain() {
    return this.config.memoryGain;
  }

  get color() {
    return this.config.color;
  }

  get requiredUnlock() {
    return this.config.requiredUnlock?.();
  }

  get rawMemoryChunksPerSecond() {
    return this.config.rawMemoryChunksPerSecond();
  }

  get memoryProductionMultiplier() {
    return this.config.memoryProductionMultiplier();
  }

  get isUnlocked() {
    return this.requiredUnlock === undefined || this.requiredUnlock.isUnlocked;
  }

  get isCapped() {
    return this.level >= Ra.levelCap;
  }

  get level() {
    return this.isUnlocked ? this.data.level : 0;
  }

  set level(value) {
    this.data.level = value;
  }

  get memories() {
    return this.data.memories;
  }

  set memories(value) {
    this.data.memories = value;
  }

  get memoryChunks() {
    return this.data.memoryChunks;
  }

  set memoryChunks(value) {
    this.data.memoryChunks = value;
  }

  get requiredMemories() {
    return Ra.requiredMemoriesForLevel(this.level);
  }

  get memoryChunksPerSecond() {
    if (!this.canGetMemoryChunks) return DC.D0;
    let res = this.rawMemoryChunksPerSecond.mul(this.chunkUpgradeCurrentMult)
      .mul(Effects.product(Ra.unlocks.continuousTTBoost.effects.memoryChunks))
      .mul(GlyphInfo.reality.sacrificeInfo.effect());
    if (this.hasRemembrance) res = res.mul(Ra.remembrance.multiplier);
    else if (Ra.petWithRemembrance) res = res.mul(Ra.remembrance.nerf);
    return res;
  }

  get canGetMemoryChunks() {
    return this.isUnlocked && Ra.isRunning;
  }

  get hasRemembrance() {
    return Ra.petWithRemembrance === this.name;
  }

  get memoryUpgradeCurrentMult() {
    return Decimal.pow(1.3, this.data.memoryUpgrades);
  }

  get chunkUpgradeCurrentMult() {
    return Decimal.pow(1.5, this.data.chunkUpgrades);
  }

  get memoryUpgradeCost() {
    return Decimal.pow(5, this.data.memoryUpgrades).mul(DC.E3);
  }

  get chunkUpgradeCost() {
    return Decimal.pow(25, this.data.chunkUpgrades).mul(5000);
  }

  get canBuyMemoryUpgrade() {
    return this.memoryUpgradeCost.lte(this.memories);
  }

  get canBuyChunkUpgrade() {
    return this.chunkUpgradeCost.lte(this.memories);
  }

  get memoryUpgradeCapped() {
    return this.memoryUpgradeCost.gte(Ra.requiredMemoriesForLevel(Ra.levelCap - 1).div(2));
  }

  get chunkUpgradeCapped() {
    return this.chunkUpgradeCost.gte(Ra.requiredMemoriesForLevel(Ra.levelCap - 1).div(2));
  }

  purchaseMemoryUpgrade() {
    if (!this.canBuyMemoryUpgrade || this.memoryUpgradeCapped) return;

    this.memories = this.memories.sub(this.memoryUpgradeCost);
    this.data.memoryUpgrades++;
  }

  purchaseChunkUpgrade() {
    if (!this.canBuyChunkUpgrade || this.chunkUpgradeCapped) return;

    this.memories = this.memories.sub(this.chunkUpgradeCost);
    this.data.chunkUpgrades++;
  }

  levelUp() {
    if (this.memories.lt(this.requiredMemories)) return;

    this.memories = this.memories.sub(this.requiredMemories);
    this.level++;
    Ra.checkForUnlocks();
  }

  get unlocks() {
    return Ra.unlocks.all
      .filter(x => x.pet === this)
      .sort((a, b) => a.level - b.level);
  }

  tick(realDiff, generateChunks) {
    const seconds = realDiff.div(1000);
    const newMemoryChunks = generateChunks
      ? seconds.mul(this.memoryChunksPerSecond)
      : 0;
    // Adding memories from half of the gained chunks this tick results in the best mathematical behavior
    // for very long simulated ticks
    const newMemories = seconds.mul(this.memoryChunks.add(newMemoryChunks.div(2)))
      .mul(Ra.productionPerMemoryChunk).mul(this.memoryUpgradeCurrentMult);
    this.memoryChunks = this.memoryChunks.add(newMemoryChunks);
    this.memories = this.memories.add(newMemories);
  }

  reset() {
    this.data.level = 1;
    this.data.memories = DC.D0;
    this.data.memoryChunks = DC.D0;
    this.data.memoryUpgrades = 0;
    this.data.chunkUpgrades = 0;
  }
}

const pets = mapGameDataToObject(
  GameDatabase.celestials.ra.pets,
  config => new RaPetState(config)
);

export const Ra = {
  displayName: "Ra",
  possessiveName: "Ra's",
  unlocks,
  pets,
  remembrance: {
    multiplier: 5,
    nerf: 0.5,
    requiredLevels: 20,
    get isUnlocked() {
      return Ra.totalPetLevel >= this.requiredLevels;
    }
  },
  // Dev/debug function for easier testing
  reset() {
    const data = player.celestials.ra;
    data.unlockBits = 0;
    data.run = false;
    data.charged = new Set();
    data.disCharge = false;
    data.peakGamespeed = DC.D1;
    for (const pet of Ra.pets.all) pet.reset();
  },
  memoryTick(realDiff, generateChunks) {
    if (!this.isUnlocked) return;
    for (const pet of Ra.pets.all) pet.tick(realDiff, generateChunks);
  },
  get productionPerMemoryChunk() {
    let res = Effects.product(Ra.unlocks.continuousTTBoost.effects.memories, Achievement(168));
    for (const pet of Ra.pets.all) {
      if (pet.isUnlocked) res = res.mul(pet.memoryProductionMultiplier);
    }
    return res;
  },
  get memoryBoostResources() {
    const boostList = [];
    for (const pet of Ra.pets.all) {
      if (new Decimal(pet.memoryProductionMultiplier).neq(1)) boostList.push(pet.memoryGain);
    }
    if (Achievement(168).isUnlocked) boostList.push("Achievement 168");
    if (Ra.unlocks.continuousTTBoost.canBeApplied) boostList.push("current TT");

    if (boostList.length === 1) return `${boostList[0]}`;
    if (boostList.length === 2) return `${boostList[0]} and ${boostList[1]}`;
    return `${boostList.slice(0, -1).join(", ")}, and ${boostList[boostList.length - 1]}`;
  },
  // This is the exp required ON "level" in order to reach "level + 1"
  requiredMemoriesForLevel(level) {
    if (level >= Ra.levelCap) return DC.BEMAX;
    const adjustedLevel = Decimal.pow(level, 2).div(10).add(level);
    const post15Scaling = Decimal.pow(1.5, Decimal.max(0, level - 15));
    return Decimal.floor(Decimal.pow(adjustedLevel, 5.52).mul(post15Scaling).mul(DC.E6));
  },
  // Returns a string containing a time estimate for gaining a specific amount of exp (UI only)
  timeToGoalString(pet, expToGain) {
    // Quadratic formula for growth (uses constant growth for a = 0)
    const a = Enslaved.isStoringRealTime
      ? DC.D0
      : Ra.productionPerMemoryChunk.mul(pet.memoryUpgradeCurrentMult).mul(pet.memoryChunksPerSecond).div(2);
    const b = Ra.productionPerMemoryChunk.mul(pet.memoryUpgradeCurrentMult).mul(pet.memoryChunks);
    const c = expToGain.neg();
    const estimate = a === 0
      ? c.neg().div(b)
      : decimalQuadraticSolution(a, b, c);
    if (Number.isFinite(estimate)) {
      return `in ${TimeSpan.fromSeconds(new Decimal(estimate)).toStringShort()}`;
    }
    return "";
  },
  get totalPetLevel() {
    return this.pets.all.map(pet => (pet.isUnlocked ? pet.level : 0)).nSum();
  },
  get levelCap() {
    return 25;
  },
  get maxTotalPetLevel() {
    return this.levelCap * this.pets.all.length;
  },
  checkForUnlocks() {
    if (!VUnlocks.raUnlock.canBeApplied) return;
    for (const unl of Ra.unlocks.all) {
      unl.unlock();
    }

    Ra.checkForQuotes();
  },
  checkForQuotes() {
    for (const quote of Ra.quotes.all) {
      // Quotes without requirements will be shown in other ways
      if (quote.requirement) {
        quote.show();
      }
    }
  },
  initializeRun() {
    clearCelestialRuns();
    player.celestials.ra.run = true;
    this.quotes.realityEnter.show();
  },
  toggleMode() {
    player.celestials.ra.activeMode = !player.celestials.ra.activeMode;
  },
  // This gets widely used in lots of places since the relevant upgrade is "all forms of continuous non-dimension
  // production", which in this case is infinities, eternities, replicanti, dilated time, and time theorem generation.
  // It also includes the 1% IP time study, Teresa's 1% EP upgrade, and the charged RM generation upgrade. Note that
  // removing the hardcap of 10 may cause runaways.
  theoremBoostFactor() {
    return Decimal.min(10, Decimal.max(0, Currency.timeTheorems.value.add(1).log10().sub(350)).div(50));
  },
  get isUnlocked() {
    return V.spaceTheorems >= 36;
  },
  get isRunning() {
    return player.celestials.ra.run;
  },
  get totalCharges() {
    return Ra.unlocks.chargedInfinityUpgrades.effectOrDefault(0);
  },
  get chargesLeft() {
    return this.totalCharges - player.celestials.ra.charged.size;
  },
  get canBuyTriad() {
    return Ra.unlocks.unlockHardV.canBeApplied;
  },
  get petWithRemembrance() {
    return player.celestials.ra.petWithRemembrance;
  },
  set petWithRemembrance(name) {
    player.celestials.ra.petWithRemembrance = name;
  },
  updateAlchemyFlow(realityRealTime) {
    const perSecond = DC.E3.div(realityRealTime);
    for (const resource of AlchemyResources.all) {
      resource.ema.addValue((resource.amount.sub(resource.before)).mul(perSecond));
      resource.before = resource.amount;
    }
  },
  applyAlchemyReactions(realityRealTime) {
    if (!Ra.unlocks.effarigUnlock.canBeApplied) return;
    const sortedReactions = AlchemyReactions.all
      .compact()
      .sort((r1, r2) => Decimal.compare(r2.priority, r1.priority));
    for (const reaction of sortedReactions) {
      reaction.combineReagents();
    }
    this.updateAlchemyFlow(realityRealTime);
  },
  get alchemyResourceCap() {
    return 25000;
  },
  get momentumValue() {
    const hoursFromUnlock = TimeSpan.fromMilliseconds(player.celestials.ra.momentumTime).totalHours;
    return Decimal.min(hoursFromUnlock.times(0.005).add(1), AlchemyResource.momentum.effectValue);
  },
  quotes: Quotes.ra,
  symbol: "<i class='fas fa-sun'></i>"
};

export const GlyphAlteration = {
  // Adding a secondary effect to some effects
  get additionThreshold() {
    return 1e36;
  },
  // One-time massive boost of a single effect
  get empowermentThreshold() {
    return 1e43;
  },
  // Scaling boost from sacrifice quantity
  get boostingThreshold() {
    return 1e60;
  },
  getSacrificePower(type) {
    if (Pelle.isDisabled("alteration")) return DC.D0;
    const sacPower = player.reality.glyphs.sac[type];
    if (sacPower === undefined) {
      throw new Error("Unknown sacrifice type");
    }
    return sacPower;
  },
  get isUnlocked() {
    if (Pelle.isDisabled("alteration")) return false;
    return Ra.unlocks.alteredGlyphs.canBeApplied;
  },
  isAdded(type) {
    return this.isUnlocked && this.getSacrificePower(type).gte(this.additionThreshold);
  },
  isEmpowered(type) {
    return this.isUnlocked && this.getSacrificePower(type).gte(this.empowermentThreshold);
  },
  isBoosted(type) {
    return this.isUnlocked && this.getSacrificePower(type).gte(this.boostingThreshold);
  },
  sacrificeBoost(type) {
    const capped = this.getSacrificePower(type).clampMax(GlyphSacrificeHandler.maxSacrificeForEffects);
    return capped.div(this.boostingThreshold).clampMin(1).log10().div(2);
  },
  baseAdditionColor(isDark = Theme.current().isDark()) {
    return isDark ? "#CCCCCC" : "black";
  },
  baseEmpowermentColor(isDark = Theme.current().isDark()) {
    return isDark ? "#EEEE30" : "#C6C610";
  },
  baseBoostColor(isDark = Theme.current().isDark()) {
    return isDark ? "#60DDDD" : "#28BDBD";
  },
  getAdditionColor(type) {
    const isDark = CosmeticGlyphTypes[type].currentColor.bg === "black";
    return this.isAdded(type) ? this.baseAdditionColor(isDark) : undefined;
  },
  getEmpowermentColor(type) {
    const isDark = CosmeticGlyphTypes[type].currentColor.bg === "black";
    return this.isEmpowered(type) ? this.baseEmpowermentColor(isDark) : undefined;
  },
  getBoostColor(type) {
    const isDark = CosmeticGlyphTypes[type].currentColor.bg === "black";
    return this.isBoosted(type) ? this.baseBoostColor(isDark) : undefined;
  }
};

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  if (Tab.celestials.ra.isOpen) Ra.quotes.unlock.show();
});
