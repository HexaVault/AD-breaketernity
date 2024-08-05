import { DC } from "./constants";

export function effectiveBaseGalaxies() {
  // Note that this already includes the "50% more" active path effect
  let replicantiGalaxies = Replicanti.galaxies.bought;
  replicantiGalaxies = replicantiGalaxies.times(1 + TimeStudy(133).effectOrDefault(0) +
    TimeStudy(132).effectOrDefault(0));
  // "extra" galaxies unaffected by the passive/idle boosts come from studies 225/226 and Effarig Infinity
  replicantiGalaxies = replicantiGalaxies.add(Replicanti.galaxies.extra);
  const nonActivePathReplicantiGalaxies = Decimal.min(Replicanti.galaxies.bought,
    ReplicantiUpgrade.galaxies.value);
  // Effects.sum is intentional here - if EC8 is not completed,
  // this value should not be contributed to total replicanti galaxies
  replicantiGalaxies = replicantiGalaxies.add(nonActivePathReplicantiGalaxies
    .times(Effects.sum(EternityChallenge(8).reward)));
  let freeGalaxies = player.dilation.totalTachyonGalaxies;
  freeGalaxies = freeGalaxies.mul(DC.D1.add(Decimal.max(0, Replicanti.amount.max(1).log10().div(1e6))
    .times(AlchemyResource.alternation.effectValue)));
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
    if (purchases !== null) {
      if (purchases.logPrice.eq(player.antimatter.max(1).log10()) && player.dimensions.antimatter[0].amount.eq(0)) {
        purchases.logPrice = Tickspeed.costScale.calculateCost(purchases.quantity.sub(1));
        purchases.quantity = purchases.quantity.sub(1);
      }
      Currency.antimatter.subtract(Decimal.pow10(purchases.logPrice));
      player.totalTickBought = player.totalTickBought.add(purchases.quantity);
    }

    // eslint-disable-next-line max-len
    for (let i = 0; i < 5 && (player.antimatter.neq(Tickspeed.cost) && player.dimensions.antimatter[0].amount.neq(0)); i++) {
      buyTickSpeed();
    }

    boughtTickspeed = true;
  }

  if (boughtTickspeed) {
    player.records.thisInfinity.lastBuyTime = player.records.thisInfinity.time;
    if (NormalChallenge(2).isRunning) player.chall2Pow = DC.D0;
  }
  // eslint-disable-next-line max-statements-per-line
  if (player.dimensions.antimatter[0].amount.eq(0)) { Currency.antimatter.bumpTo(100); }
}

export function resetTickspeed() {
  player.totalTickBought = DC.D0;
  player.chall9TickspeedCostBumps = DC.D0;
}

export const Tickspeed = {

  get isUnlocked() {
    return AntimatterDimension(2).bought.gt(0) || EternityMilestone.unlockAllND.isReached ||
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
    return player.dilation.active || PelleStrikes.dilation.hasStrike ? dilatedValueOf(tickspeed.recip()).recip() : tickspeed;
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
  BASE_SOFTCAP: new Decimal(3e5),
  GROWTH_RATE: new Decimal(6e-6).add(1),
  GROWTH_EXP: DC.D2,
  tickmult: () => DC.D1.add(Effects.min(1.33, TimeStudy(171)).sub(1)).mul(
    Decimal.max(getAdjustedGlyphEffect("cursedtickspeed"), 1)),

  get amount() {
    return player.totalTickGained;
  },

  get softcap() {
    let softcap = FreeTickspeed.BASE_SOFTCAP;
    if (Enslaved.has(ENSLAVED_UNLOCKS.FREE_TICKSPEED_SOFTCAP)) {
      softcap = softcap.add(1e5);
    }
    return softcap;
  },

  get multToNext() {
    if (this.amount.lt(this.softcap)) return new Decimal(this.tickmult());
    return this.tickmult().mul(this.GROWTH_RATE.pow(this.amount.sub(this.softcap)));
  },

  get tickExpo() {
    return new ExponentialCostScaling({
      baseCost: DC.D1,
      baseIncrease: this.tickmult(),
      costScale: FreeTickspeed.GROWTH_RATE,
      purchasesBeforeScaling: FreeTickspeed.softcap
    });
  },

  fromShards(shards) {
    if (shards.lt(1)) {
      return { newAmount: DC.D0, nextShards: DC.D1 };
    }
    const quant = this.tickExpo.getMaxBought(DC.D0, shards, DC.D1);
    return { newAmount: quant.quantity, nextShards: this.tickExpo.calculateCost(quant.quantity.add(1)) };
  }
};
