import { DC } from "./constants";

export function effectiveBaseGalaxies() {
  // Note that this already includes the "50% more" active path effect
  let replicantiGalaxies = new Decimal(Replicanti.galaxies.bought);
  replicantiGalaxies = replicantiGalaxies.times(1 + TimeStudy(133).effectOrDefault(1) +
    TimeStudy(132).effectOrDefault(1));
  // "extra" galaxies unaffected by the passive/idle boosts come from studies 225/226 and Effarig Infinity
  replicantiGalaxies = replicantiGalaxies.add(Replicanti.galaxies.extra);
  const nonActivePathReplicantiGalaxies = Decimal.min(Replicanti.galaxies.bought,
    ReplicantiUpgrade.galaxies.value);
  // Effects.sum is intentional here - if EC8 is not completed,
  // this value should not be contributed to total replicanti galaxies
  replicantiGalaxies = replicantiGalaxies.add(nonActivePathReplicantiGalaxies
    .times(Effects.sum(EternityChallenge(8).reward)));
  let freeGalaxies = player.dilation.totalTachyonGalaxies;
  freeGalaxies = DC.D1.add(Decimal.max(0, Replicanti.amount.log10().div(1e6))
    .times(AlchemyResource.alternation.effectValue));
  return Decimal.max(player.galaxies.add(GalaxyGenerator.galaxies).add(replicantiGalaxies).add(freeGalaxies), 0);
}

export function getTickSpeedMultiplier() {
  if (InfinityChallenge(3).isRunning) return DC.D1;
  if (Ra.isRunning) return DC.C1D1_1245;
  let galaxies = effectiveBaseGalaxies();
  const effects = Effects.product(
    InfinityUpgrade.galaxyBoost,
    InfinityUpgrade.galaxyBoost.chargedEffect,
    BreakInfinityUpgrade.galaxyBoost,
    TimeStudy(212),
    TimeStudy(232),
    Achievement(86),
    Achievement(178),
    InfinityChallenge(5).reward,
    PelleUpgrade.galaxyPower,
    PelleRifts.decay.milestones[1]
  );
  if (galaxies.lt(3)) {
    // Magic numbers are to retain balancing from before while displaying
    // them now as positive multipliers rather than negative percentages
    let baseMultiplier = DC.C1D1_1245;
    if (player.galaxies.eq(1)) baseMultiplier = DC.C1D1_11888888;
    if (player.galaxies.eq(2)) baseMultiplier = DC.C1D1_11267177;
    if (NormalChallenge(5).isRunning) {
      baseMultiplier = DC.D1.div(1.08);
      if (player.galaxies.eq(1)) baseMultiplier = DC.D1.div(1.07632);
      if (player.galaxies.eq(2)) baseMultiplier = DC.D1.div(1.072);
    }
    const perGalaxy = effects.div(50);
    if (Pelle.isDoomed) galaxies.div(2);

    galaxies = galaxies.times(Pelle.specialGlyphEffect.power);
    return DC.D0_01.clampMin(baseMultiplier.sub((galaxies.times(perGalaxy))));
  }
  let baseMultiplier = 0.8;
  if (NormalChallenge(5).isRunning) baseMultiplier = 0.83;
  galaxies = galaxies.sub(2);
  galaxies = galaxies.times(effects);
  galaxies = galaxies.times(getAdjustedGlyphEffect("cursedgalaxies"));
  galaxies = galaxies.times(getAdjustedGlyphEffect("realitygalaxies"));
  galaxies = galaxies.times(ImaginaryUpgrade(9).effectOrDefault(DC.D0).add(1));
  if (Pelle.isDoomed) galaxies = galaxies.div(2);

  galaxies = galaxies.times(Pelle.specialGlyphEffect.power);
  const perGalaxy = DC.D0_965;
  return perGalaxy.pow(galaxies.sub(2)).times(baseMultiplier);
}

export function buyTickSpeed() {
  if (!Tickspeed.isAvailableForPurchase || !Tickspeed.isAffordable) return false;

  if (NormalChallenge(9).isRunning) {
    Tickspeed.multiplySameCosts();
  }
  Tutorial.turnOffEffect(TUTORIAL_STATE.TICKSPEED);
  Currency.antimatter.subtract(Tickspeed.cost);
  player.totalTickBought = player.totalTickBought.add(1);
  player.records.thisInfinity.lastBuyTime = player.records.thisInfinity.time;
  player.requirementChecks.permanent.singleTickspeed++;
  if (NormalChallenge(2).isRunning) player.chall2Pow = DC.D0;
  GameUI.update();
  return true;
}

export function buyMaxTickSpeed() {
  if (!Tickspeed.isAvailableForPurchase || !Tickspeed.isAffordable) return;
  let boughtTickspeed = false;

  Tutorial.turnOffEffect(TUTORIAL_STATE.TICKSPEED);
  if (NormalChallenge(9).isRunning) {
    const goal = Player.infinityGoal;
    let cost = Tickspeed.cost;
    while (Currency.antimatter.gt(cost) && cost.lt(goal)) {
      Tickspeed.multiplySameCosts();
      Currency.antimatter.subtract(cost);
      player.totalTickBought = player.totalTickBought.add(1);
      boughtTickspeed = true;
      cost = Tickspeed.cost;
    }
  } else {
    const purchases = Tickspeed.costScale.getMaxBought(player.totalTickBought, Currency.antimatter.value, DC.D1, true);
    if (purchases === null) {
      return;
    }
    Currency.antimatter.subtract(Decimal.pow10(purchases.logPrice));
    player.totalTickBought = player.totalTickBought.add(purchases.quantity);

    for (let i = 0; i < 5; i++) {
      buyTickSpeed();
    }

    boughtTickspeed = true;
  }

  if (boughtTickspeed) {
    player.records.thisInfinity.lastBuyTime = player.records.thisInfinity.time;
    if (NormalChallenge(2).isRunning) player.chall2Pow = DC.D0;
  }
  // eslint-disable-next-line max-statements-per-line
  if (player.dimensions.antimatter[0].amount.eq(0)) { Currency.antimatter.bumpto(10); }
}

export function resetTickspeed() {
  player.totalTickBought = DC.D0;
  player.chall9TickspeedCostBumps = 0;
}

export const Tickspeed = {

  get isUnlocked() {
    return AntimatterDimension(2).bought.gte(0) || EternityMilestone.unlockAllND.isReached ||
      PlayerProgress.realityUnlocked();
  },

  get isAvailableForPurchase() {
    return this.isUnlocked &&
      !EternityChallenge(9).isRunning &&
      !Laitela.continuumActive &&
      (player.break || this.cost.lt(DC.NUMMAX));
  },

  get isAffordable() {
    return Currency.antimatter.gte(this.cost);
  },

  get multiplier() {
    return getTickSpeedMultiplier();
  },

  get current() {
    const tickspeed = Effarig.isRunning
      ? Effarig.tickspeed
      : this.baseValue.powEffectOf(DilationUpgrade.tickspeedPower);
    return player.dilation.active || PelleStrikes.dilation.hasStrike ? dilatedValueOf(tickspeed) : tickspeed;
  },

  get cost() {
    return this.costScale.calculateCost(player.totalTickBought.add(player.chall9TickspeedCostBumps));
  },

  get costScale() {
    return new ExponentialCostScaling({
      baseCost: DC.E3,
      baseIncrease: DC.E1,
      costScale: new Decimal(Player.tickSpeedMultDecrease),
      scalingCostThreshold: DC.NUMMAX
    });
  },

  get continuumValue() {
    if (!this.isUnlocked) return DC.D0;
    const contVal = this.costScale.getContinuumValue(Currency.antimatter.value, DC.D1);
    return contVal ? contVal.times(Laitela.matterExtraPurchaseFactor) : DC.D0;
  },

  get baseValue() {
    return DC.E3.timesEffectsOf(
      Achievement(36),
      Achievement(45),
      Achievement(66),
      Achievement(83)
    )
      .times(getTickSpeedMultiplier().pow(this.totalUpgrades));
  },

  get totalUpgrades() {
    let boughtTickspeed;
    if (Laitela.continuumActive) boughtTickspeed = new Decimal(this.continuumValue);
    else boughtTickspeed = new Decimal(player.totalTickBought);
    return boughtTickspeed.plus(player.totalTickGained);
  },

  get perSecond() {
    return Decimal.divide(1000, this.current);
  },

  multiplySameCosts() {
    for (const dimension of AntimatterDimensions.all) {
      if (dimension.cost.e === this.cost.e) dimension.costBumps = dimension.costBumps.add(1);
    }
  }
};


export const FreeTickspeed = {
  BASE_SOFTCAP: 300000,
  GROWTH_RATE: new Decimal(6e-6),
  GROWTH_EXP: DC.D2,
  multToNext: 1.33,

  get amount() {
    return player.totalTickGained;
  },

  get softcap() {
    let softcap = FreeTickspeed.BASE_SOFTCAP;
    if (Enslaved.has(ENSLAVED_UNLOCKS.FREE_TICKSPEED_SOFTCAP)) {
      softcap += 100000;
    }
    return softcap;
  },

  fromShards(shards) {
    const tickmult = DC.D1.add(Effects.min(1.33, TimeStudy(171)).sub(1)).mul(
      Decimal.max(getAdjustedGlyphEffect("cursedtickspeed"), 1));
    const logTickmult = tickmult.ln();
    const logShards = shards.clampMin(1).ln();
    const uncapped = logShards.div(logTickmult).max(0);
    if (uncapped.lte(FreeTickspeed.softcap)) {
      this.multToNext = tickmult;
      return {
        newAmount: Decimal.ceil(uncapped),
        nextShards: Decimal.pow(tickmult, Decimal.ceil(uncapped))
      };
    }
    // Log of (cost - cost up to softcap)
    const priceToCap = logTickmult.mul(FreeTickspeed.softcap);
    // In the following we're implicitly applying the function (ln(x) - priceToCap) / logTickmult to all costs,
    // so, for example, if the cost is 1 that means it's actually exp(priceToCap) * tickmult.
    const desiredCost = logShards.sub(priceToCap).div(logTickmult);
    const costFormulaCoefficient = FreeTickspeed.GROWTH_RATE.div(FreeTickspeed.GROWTH_EXP).div(logTickmult);
    // In the following we're implicitly subtracting softcap from bought,
    // so, for example, if bought is 1 that means it's actually softcap + 1.
    // The first term (the big one) is the asymptotically more important term (since FreeTickspeed.GROWTH_EXP > 1),
    // but is small initially. The second term allows us to continue the pre-cap free tickspeed upgrade scaling
    // of tickmult per upgrade.
    const boughtToCost = bought => costFormulaCoefficient.mul(
      bought.max(0).pow(FreeTickspeed.GROWTH_EXP)).add(bought);
    const derivativeOfBoughtToCost = x => FreeTickspeed.GROWTH_EXP.mul(costFormulaCoefficient).mul(
      x.max(0).pow(FreeTickspeed.GROWTH_EXP.sub(1))).add(1);
    const newtonsMethod = bought => bought.sub(boughtToCost(bought).div(desiredCost)).div(
      derivativeOfBoughtToCost(bought));
    let oldApproximation;
    let approximation = desiredCost.min(
      desiredCost.div(costFormulaCoefficient).pow(DC.D1.div(FreeTickspeed.GROWTH_EXP))
    );
    let counter = 0;
    // The bought formula is concave upwards. We start with an over-estimate; when using newton's method,
    // this means that successive iterations are also over-etimates. Thus, we can just check for continued
    // progress with the approximation < oldApproximation check. The counter is a fallback.
    do {
      oldApproximation = approximation;
      approximation = newtonsMethod(approximation);
    } while (approximation.lt(oldApproximation) && ++counter < 100);
    const purchases = approximation.floor();
    // This undoes the function we're implicitly applying to costs (the "+ 1") is because we want
    // the cost of the next upgrade.
    const next = Decimal.exp(priceToCap.add(boughtToCost(purchases.add(1)).mul(logTickmult)));
    this.multToNext = Decimal.exp((boughtToCost(purchases.add(1)).sub(boughtToCost(purchases))).mul(logTickmult));
    return {
      newAmount: purchases.add(FreeTickspeed.softcap),
      nextShards: next,
    };
  }
};
