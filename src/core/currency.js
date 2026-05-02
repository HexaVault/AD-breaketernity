/* eslint-disable no-multiple-empty-lines */
import { simpleCur } from "./secret-formula/currency/simple-currencies";

/* eslint-disable no-unused-vars */
/** @abstract */
class MathOperations {
  /** @abstract */
  add(left, right) { throw new NotImplementedError(); }

  /** @abstract */
  subtract(left, right) { throw new NotImplementedError(); }

  /** @abstract */
  multiply(left, right) { throw new NotImplementedError(); }

  /** @abstract */
  divide(left, right) { throw new NotImplementedError(); }

  /** @abstract */
  max(left, right) { throw new NotImplementedError(); }

  /** @abstract */
  min(left, right) { throw new NotImplementedError(); }

  /** @abstract */
  eq(left, right) { throw new NotImplementedError(); }

  /** @abstract */
  gt(left, right) { throw new NotImplementedError(); }

  /** @abstract */
  gte(left, right) { throw new NotImplementedError(); }

  /** @abstract */
  lt(left, right) { throw new NotImplementedError(); }

  /** @abstract */
  lte(left, right) { throw new NotImplementedError(); }
}

MathOperations.decimal = new class DecimalMathOperations extends MathOperations {
  add(left, right) { return Decimal.add(left, right); }
  subtract(left, right) { return left.gt("ee10") ? left : Decimal.subtract(left, right); }
  multiply(left, right) { return Decimal.multiply(left, right); }
  divide(left, right) { return Decimal.divide(left, right); }
  max(left, right) { return Decimal.max(left, right); }
  min(left, right) { return Decimal.min(left, right); }
  eq(left, right) { return Decimal.eq(left, right); }
  gt(left, right) { return Decimal.gt(left, right); }
  gte(left, right) { return Decimal.gte(left, right); }
  lt(left, right) { return Decimal.lt(left, right); }
  lte(left, right) { return Decimal.lte(left, right); }
}();

/** @abstract */
export class Currency {
  /** @abstract */
  get value() { throw new NotImplementedError(); }

  /** @abstract */
  set value(value) { throw new NotImplementedError(); }

  /**
   * @abstract
   * @type {MathOperations}
   */
  get operations() { throw new NotImplementedError(); }

  add(amount) {
    this.value = this.operations.add(this.value, amount);
  }

  subtract(amount) {
    this.value = this.operations.max(this.operations.subtract(this.value, amount), 0);
  }

  multiply(amount) {
    this.value = this.operations.multiply(this.value, amount);
  }

  divide(amount) {
    this.value = this.operations.divide(this.value, amount);
  }

  eq(amount) {
    return this.operations.eq(this.value, amount);
  }

  gt(amount) {
    return this.operations.gt(this.value, amount);
  }

  gte(amount) {
    return this.operations.gte(this.value, amount);
  }

  lt(amount) {
    return this.operations.lt(this.value, amount);
  }

  lte(amount) {
    return this.operations.lte(this.value, amount);
  }

  purchase(cost) {
    if (!this.gte(cost)) return false;
    this.subtract(cost);
    return true;
  }

  bumpTo(value) {
    this.value = this.operations.max(this.value, value);
  }

  dropTo(value) {
    this.value = this.operations.min(this.value, value);
  }

  get startingValue() { throw new NotImplementedError(); }

  reset() {
    this.value = this.startingValue;
  }

  // These need to use a default of 0 so the game does not shit itself

  /**
   * @abstract
   */
  get mult() { return new Decimal(0); }

  /**
   * @abstract
   * The gain before you include multipliers or nerfs
   */
  get pureGain() { return new Decimal(0); }

  /**
   * @abstract
   */
  get gain() { return new Decimal(0); }
}

/**
 * @abstract
 */
class DecimalCurrency extends Currency {
  get operations() { return MathOperations.decimal; }
  get sign() { return this.value.sign; }
  get mag() { return this.value.mag; }
  get layer() { return this.value.layer; }
  get startingValue() { return DC.D0; }
}
window.DecimalCurrency = DecimalCurrency;

// If you need to add more advanced code for setting or getting, remove it from here.

for (const store in simpleCur) {
  const loc = simpleCur[store].loc;
  const sVal = simpleCur[store].startingVal;
  Currency[store] = new class extends DecimalCurrency {
    get value() {
      if (loc.length === 1) return player[loc[0]];
      if (loc.length === 2) return player[loc[0]][loc[1]];
      return player[loc[0]][loc[1]][loc[2]];
    }

    set value(value) {
      if (loc.length === 1) player[loc[0]] = value;
      else if (loc.length === 2) player[loc[0]][loc[1]] = value;
      else player[loc[0]][loc[1]][loc[2]] = value;
    }

    get startingValue() {
      return sVal ? sVal() : DC.D0;
    }
  }();
}

// To allow for easier viewing, each currency is seperated by 4 empty lines.

Currency.antimatter = new class extends DecimalCurrency {
  get value() { return player.antimatter; }

  set value(value) {
    if (InfinityChallenges.nextIC) InfinityChallenges.notifyICUnlock(value);
    if (GameCache.cheapestAntimatterAutobuyer.value && value.gte(GameCache.cheapestAntimatterAutobuyer.value)) {
      // Clicking into the automation tab clears the trigger and prevents it from retriggering as long as the player
      // stays on the tab; leaving the tab with an available autobuyer will immediately force it to trigger again
      TabNotification.newAutobuyer.clearTrigger();
      TabNotification.newAutobuyer.tryTrigger();
    }
    player.antimatter = value;
    player.records.thisInfinity.maxAM = player.records.thisInfinity.maxAM.max(value);
    player.records.thisEternity.maxAM = player.records.thisEternity.maxAM.max(value);
    player.records.thisReality.maxAM = player.records.thisReality.maxAM.max(value);

    if (Pelle.isDoomed) {
      player.celestials.pelle.records.totalAntimatter = player.celestials.pelle.records.totalAntimatter.max(value);
    }
  }

  add(amount) {
    super.add(amount);
    if (amount.gt(0)) {
      player.records.totalAntimatter = player.records.totalAntimatter.add(amount);
      player.requirementChecks.reality.noAM = false;
    }
  }

  get productionPerSecond() {
    return NormalChallenge(12).isRunning
      ? AntimatterDimension(1).productionPerGameSecond.plus(AntimatterDimension(2).productionPerGameSecond)
      : AntimatterDimension(1).productionPerGameSecond;
  }

  get startingValue() {
    if (Pelle.isDisabled()) return new Decimal(100);
    return Effects.max(
      DC.E1,
      Perk.startAM,
      Achievement(21),
      Achievement(37),
      Achievement(54),
      Achievement(55),
      Achievement(78)
    );
  }
}();




Currency.infinitiesTotal = new class extends DecimalCurrency {
  get value() { return player.infinities.plus(player.infinitiesBanked); }
}();




Currency.infinityPoints = new class extends DecimalCurrency {
  get value() { return player.infinityPoints; }
  set value(value) {
    player.infinityPoints = value;
    player.records.thisEternity.maxIP = player.records.thisEternity.maxIP.max(value);
    player.records.thisReality.maxIP = player.records.thisReality.maxIP.max(value);

    if (Pelle.isDoomed) {
      player.celestials.pelle.records.totalInfinityPoints =
        player.celestials.pelle.records.totalInfinityPoints.max(value);
    }
  }

  get startingValue() {
    if (Pelle.isDisabled()) return new Decimal();
    return Effects.max(
      new Decimal(),
      Perk.startIP1,
      Perk.startIP2,
      Achievement(104)
    );
  }

  reset() {
    super.reset();
    player.records.thisEternity.maxIP = this.startingValue;
  }

  get mult() {
    return GameCache.totalIPMult.value;
  }

  get pureGain() {
    return GameDatabase.currencies.formulae.ip.gainFormula();
  }

  get gain() {
    let ip = this.pureGain;
    if (Pelle.isDisabled("IPMults")) {
      return ip.timesEffectsOf(PelleRifts.vacuum, GlyphInfo.infinity.pelleEffect).floor();
    }
    if (Teresa.isRunning) {
      ip = ip.pow(0.55);
    } else if (V.isRunning) {
      ip = ip.pow(0.5);
    } else if (Laitela.isRunning) {
      ip = dilatedValueOf(ip);
    }
    ip = ip.times(GameCache.totalIPMult.value);
    if (GlyphAlteration.isAdded("infinity")) {
      ip = ip.pow(getSecondaryGlyphEffect("infinityIP"));
    }
    return ip.floor();
  }
}();




Currency.eternityPoints = new class extends DecimalCurrency {
  get value() { return player.eternityPoints; }
  set value(value) {
    player.eternityPoints = value;
    player.records.thisReality.maxEP = player.records.thisReality.maxEP.max(value);
    if (player.records.bestReality.bestEP.lt(value)) {
      player.records.bestReality.bestEP = value;
      player.records.bestReality.bestEPSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
    }

    if (Pelle.isDoomed) {
      player.celestials.pelle.records.totalEternityPoints =
        player.celestials.pelle.records.totalEternityPoints.max(value);
    }
  }

  get startingValue() {
    if (Pelle.isDisabled()) return DC.D0;
    return Effects.max(
      0,
      Perk.startEP1,
      Perk.startEP2,
      Perk.startEP3
    );
  }

  reset() {
    super.reset();
    player.records.thisReality.maxEP = this.startingValue;
  }

  requiredIPforEP(epAmount) {
    return Decimal.pow10(Decimal.log(Decimal.div(epAmount, Currency.eternityPoints.mult), 5).plus(0.7).times(308))
      .clampMin(Number.MAX_VALUE);
  }

  get mult() {
    return Pelle.isDisabled("EPMults")
      ? DC.D1.timesEffectsOf(GlyphInfo.time.pelleEffect, PelleRifts.vacuum.milestones[2])
      : DC.D1.timesEffectsOf(
        EternityUpgrade.epMult,
        TimeStudy(61),
        TimeStudy(122),
        TimeStudy(121),
        TimeStudy(123),
        RealityUpgrade(12),
        GlyphEffects.timeEP.primary,
        GlyphEffects.cursedEP.primary,
      );
  }

  get pureGain() {
    const div = Decimal.sub(308, PelleRifts.recursion.effectValue);
    const ep = DC.D5.pow(player.records.thisEternity.maxIP.plus(Currency.infinityPoints.gain)
      .max(1).log10().div(div).sub(0.7));

    return ep;
  }

  get gain() {
    let ep = this.pureGain;
    ep = ep.times(this.mult);
    if (Teresa.isRunning) {
      ep = ep.pow(0.55);
    } else if (V.isRunning) {
      ep = ep.pow(0.5);
    } else if (Laitela.isRunning) {
      ep = dilatedValueOf(ep);
    }
    if (GlyphAlteration.isAdded("time")) {
      ep = ep.pow(getSecondaryGlyphEffect("timeEP"));
    }
    return ep.floor();
  }
}();




Currency.timeTheorems = new class extends DecimalCurrency {
  get value() { return player.timestudy.theorem; }
  set value(value) {
    player.timestudy.theorem = value;
    player.timestudy.maxTheorem = value.plus(TimeTheorems.calculateTimeStudiesCost());
  }

  get max() { return player.timestudy.maxTheorem; }

  add(amount) {
    super.add(amount);
    player.timestudy.maxTheorem = player.timestudy.maxTheorem.plus(amount);
  }

  reset() {
    respecTimeStudies(true);
    super.reset();
    TimeTheoremPurchaseType.am.reset();
    TimeTheoremPurchaseType.ip.reset();
    TimeTheoremPurchaseType.ep.reset();
    player.timestudy.maxTheorem = this.startingValue;
  }
}();

Currency.realityMachines = new class extends DecimalCurrency {
  get value() { return player.reality.realityMachines; }
  set value(value) {
    const newValue = Decimal.min(value, Currency.realityMachines.hardcap);
    const addedThisReality = newValue.minus(player.reality.realityMachines);
    player.reality.realityMachines = newValue;
    player.reality.maxRM = Decimal.max(player.reality.maxRM, newValue);
    if (player.records.bestReality.RM.lt(addedThisReality)) {
      player.records.bestReality.RM = addedThisReality;
      player.records.bestReality.RMSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
    }
  }

  get mult() {
    return Teresa.rmMultiplier.timesEffectsOf(
      PerkShopUpgrade.rmMult,
      GlyphEffects.effarigrm.primary,
      Achievement(167),
    );
  }

  get pureGain() {
    const ep = () => Currency.eternityPoints.gain;
    let log10FinalEP = player.records.thisReality.maxEP.plus(ep()).max(1).log10();
    if (!PlayerProgress.realityUnlocked()) {
      if (log10FinalEP.gt(8000)) log10FinalEP = new Decimal(8000);
      if (log10FinalEP.gt(6000)) log10FinalEP = log10FinalEP.sub(log10FinalEP.sub(6000).times(0.75));
    }
    let rmGain = DC.E3.pow(log10FinalEP.div(4000).sub(1));
    // Increase base RM gain if <10 RM
    if (rmGain.gte(1) && rmGain.lt(10)) rmGain = log10FinalEP.minus(26).mul(27).div(4000);
    return rmGain;
  }

  get gain() {
    let rmGain = this.pureGain;
    rmGain = rmGain.mul(this.mult);
    return rmGain;
  }

  get cappedGain() {
    return Decimal.min(this.gain, this.hardcap);
  }

  get hardcapMult() {
    return ImaginaryUpgrade(6).effectOrDefault(1);
  }

  get baseHardcap() {
    return DC.E1000;
  }

  get hardcap() {
    const base = this.baseHardcap;
    return base.mul(this.hardcapMult);
  }
}();



// Technically this is depreciated, but the official method is finnicky at best.
Currency.relicShards.__defineGetter__("gain", () => {
  if (!TeresaUnlocks.effarig.canBeApplied) return DC.D0;
  return Decimal.floor(Decimal.pow(Currency.eternityPoints.value.max(1).log10().div(7500),
    getActiveGlyphEffects().length)).times(AlchemyResource.effarig.effectValue);
});



Currency.imaginaryMachines = new class extends DecimalCurrency {
  get value() { return player.reality.imaginaryMachines; }
  set value(value) {
    player.reality.imaginaryMachines = Decimal.clampMax(value, Currency.imaginaryMachines.cap);
  }

  get capMults() {
    return ImaginaryUpgrade(13).effectOrDefault(1);
  }

  get cap() {
    return player.reality.iMCap.times(this.capMults);
  }

  get isUnlocked() {
    return Currency.realityMachines.value.gte(Currency.realityMachines.hardcap);
  }

  get projCapBase() {
    return (Decimal.pow(Decimal.clampMin(Currency.realityMachines.gain.max(1).log10().sub(1000), 0), 2))
      .times((Decimal.pow(Decimal.clampMin(Currency.realityMachines.gain.max(1).log10().sub(100000), 1), 0.2)));
  }

  get projCap() {
    return this.projCapBase.mul(this.capMults);
  }

  get baseCap() {
    return player.reality.iMCap;
  }

  get scaleTime() {
    return DC.D60.div(ImaginaryUpgrade(20).effectOrDefault(1)).div(getRealSpeedupForDisplay());
  }

  iMTimerEstimate(cost) {
    const imCap = Currency.imaginaryMachines.cap;
    if (imCap.lte(cost)) return DC.BEMAX;
    const currentIM = Currency.imaginaryMachines.value;
    // This is doing log(a, 1/2) - log(b, 1/2) where a is % left to imCap of cost and b is % left to imCap of current
    // iM. log(1 - x, 1/2) should be able to estimate the time taken for iM to increase from 0 to imCap * x since every
    // fixed interval the difference between current iM to max iM should decrease by a factor of 1/2.
    return Decimal.max(0, Decimal.log(imCap.div(imCap.sub(cost)), 2).sub(Decimal.log(
      imCap.div(imCap.sub(currentIM)), 2))).times(Currency.imaginaryMachines.scaleTime);
  }

  gain(diff) {
    return (Currency.imaginaryMachines.cap.sub(Currency.imaginaryMachines.value)).times(DC.D1
      .sub(Decimal.pow(2, (new Decimal(0).sub(diff).div(1000).div(Currency.imaginaryMachines.scaleTime)))));
  }
}();




Currency.darkMatter = new class extends DecimalCurrency {
  get value() { return player.celestials.laitela.darkMatter; }
  set value(value) {
    const capped = Decimal.min(value, Number.MAX_VALUE);
    player.celestials.laitela.darkMatter = capped;
    player.celestials.laitela.maxDarkMatter = player.celestials.laitela.maxDarkMatter.max(capped);
  }

  get max() { return player.celestials.laitela.maxDarkMatter; }
  set max(value) { player.celestials.laitela.maxDarkMatter = value; }
}();




// Technically this is depreciated, but the official method is finnicky at best.
Currency.darkEnergy.__defineGetter__("productionPerSecond", () => DarkMatterDimensions.all
  .map(d => d.productionPerSecond).sum());




Currency.galaxyGeneratorGalaxies = new class extends DecimalCurrency {
  get value() {
    return player.galaxies.add(GalaxyGenerator.galaxies);
  }

  set value(value) {
    const spent = player.galaxies.add(GalaxyGenerator.galaxies).sub(value);
    player.celestials.pelle.galaxyGenerator.spentGalaxies =
      player.celestials.pelle.galaxyGenerator.spentGalaxies.add(spent);
  }
}();
