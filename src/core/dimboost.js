import { DC } from "./constants";
import { EternityChallenge } from "./eternity-challenge";

class DimBoostRequirement {
  constructor(tier, amount) {
    this.tier = tier;
    this.amount = amount;
  }

  get isSatisfied() {
    const dimension = AntimatterDimension(this.tier);
    return dimension.totalAmount.gte(this.amount);
  }
}

export class DimBoost {
  static get power() {
    if (NormalChallenge(8).isRunning) {
      return DC.D1;
    }

    let boost = new Decimal(Effects.max(
      2,
      InfinityUpgrade.dimboostMult,
      InfinityChallenge(7).reward,
      InfinityChallenge(7),
      TimeStudy(81)
    ))
      .timesEffectsOf(
        TimeStudy(83),
        TimeStudy(231),
        Achievement(117),
        Achievement(142),
        GlyphEffect.dimBoostPower,
        PelleRifts.recursion.milestones[0]
      ).powEffectsOf(InfinityUpgrade.dimboostMult.chargedEffect);
    if (GlyphAlteration.isAdded("effarig")) boost = boost.pow(getSecondaryGlyphEffect("effarigforgotten"));
    return boost;
  }

  static multiplierToNDTier(tier) {
    const normalBoostMult = DimBoost.power.pow(this.purchasedBoosts.add(1).sub(tier)).clampMin(1);
    const imaginaryBoostMult = DimBoost.power.times(ImaginaryUpgrade(24).effectOrDefault(1))
      .pow(this.imaginaryBoosts).clampMin(1);
    return normalBoostMult.times(imaginaryBoostMult);
  }

  static get maxDimensionsUnlockable() {
    return NormalChallenge(10).isRunning ? 6 : 8;
  }

  static get canUnlockNewDimension() {
    return DimBoost.purchasedBoosts.add(4).lt(DimBoost.maxDimensionsUnlockable);
  }

  static get maxBoosts() {
    if (Ra.isRunning) {
      // Ra makes boosting impossible. Note that this function isn't called
      // when giving initial boosts, so the player will still get those.
      return DC.D0;
    }
    if (InfinityChallenge(1).isRunning) {
      // Usually, in Challenge 8, the only boosts that are useful are the first 5
      // (the fifth unlocks sacrifice). In IC1 (Challenge 8 and Challenge 10
      // combined, among other things), only the first 2 are useful
      // (they unlock new dimensions).
      // There's no actual problem with bulk letting the player get
      // more boosts than this; it's just that boosts beyond this are pointless.
      return DC.D2;
    }
    if (NormalChallenge(8).isRunning) {
      // See above. It's important we check for this after checking for IC1 since otherwise
      // this case would trigger when we're in IC1.
      return DC.D5;
    }
    return DC.BEMAX;
  }

  static get canBeBought() {
    if (DimBoost.purchasedBoosts.gte(this.maxBoosts)) return false;
    if (player.records.thisInfinity.maxAM.gt(Player.infinityGoal) &&
       (!player.break || Player.isInAntimatterChallenge)) return false;
    return true;
  }

  static get lockText() {
    if (DimBoost.purchasedBoosts.gte(this.maxBoosts)) {
      if (Ra.isRunning) return "Locked (Ra's Reality)";
      if (InfinityChallenge(1).isRunning) return "Locked (Infinity Challenge 1)";
      if (NormalChallenge(8).isRunning) return "Locked (8th Antimatter Dimension Autobuyer Challenge)";
    }
    return null;
  }

  static get requirement() {
    return this.bulkRequirement(1);
  }

  static bulkRequirement(bulk) {
    const targetResets = DimBoost.purchasedBoosts.add(bulk);
    const tier = Decimal.min(targetResets.add(3), this.maxDimensionsUnlockable).toNumber();
    let amount = DC.D20;
    const discount = Effects.sum(
      TimeStudy(211),
      TimeStudy(222)
    );
    if (tier === 6 && NormalChallenge(10).isRunning) {
      amount = amount.add(targetResets.sub(3).mul(DC.D20.sub(discount)).round());
    } else if (tier === 8) {
      amount = amount.add(targetResets.sub(5).mul(DC.D15.sub(discount)).round());
    }
    if (EternityChallenge(5).isRunning) {
      amount = Decimal.pow(targetResets.sub(1), 3).add(targetResets).add(amount).sub(1);
    }

    amount = amount.sub(Effects.sum(InfinityUpgrade.resetBoost));
    if (InfinityChallenge(5).isCompleted) amount = amount.sub(1);

    amount = amount.times(InfinityUpgrade.resetBoost.chargedEffect.effectOrDefault(1));

    amount = Decimal.round(amount);

    return new DimBoostRequirement(tier, amount);
  }

  static get unlockedByBoost() {
    if (DimBoost.lockText !== null) return DimBoost.lockText;
    const boosts = DimBoost.purchasedBoosts;
    const allNDUnlocked = EternityMilestone.unlockAllND.isReached;

    let newUnlock = "";
    if (!allNDUnlocked && boosts.lt(DimBoost.maxDimensionsUnlockable - 4)) {
      newUnlock = `unlock the ${formatInt(boosts.add(5))}th Dimension`;
    } else if (boosts.eq(4) && !NormalChallenge(10).isRunning && !EternityChallenge(3).isRunning) {
      newUnlock = "unlock Sacrifice";
    }

    const formattedMultText = `give a ${formatX(DimBoost.power, 2, 1)} multiplier `;
    let dimensionRange = `to the 1st Dimension`;
    if (boosts.gt(0)) dimensionRange = `to Dimensions 1-${Decimal.min(boosts.add(1), 8)}`;
    if (boosts.gte(DimBoost.maxDimensionsUnlockable - 1)) dimensionRange = `to all Dimensions`;

    let boostEffects;
    if (NormalChallenge(8).isRunning) boostEffects = newUnlock;
    else if (newUnlock === "") boostEffects = `${formattedMultText} ${dimensionRange}`;
    else boostEffects = `${newUnlock} and ${formattedMultText} ${dimensionRange}`;

    if (boostEffects === "") return "Dimension Boosts are currently useless";
    const areDimensionsKept = (Perk.antimatterNoReset.isBought || Achievement(111).canBeApplied) &&
      (!Pelle.isDoomed || PelleUpgrade.dimBoostResetsNothing.isBought);
    if (areDimensionsKept) return boostEffects[0].toUpperCase() + boostEffects.substring(1);
    return `Reset your Dimensions to ${boostEffects}`;
  }

  static get purchasedBoosts() {
    return Decimal.fromDecimal(player.dimensionBoosts.floor());
  }

  static get imaginaryBoosts() {
    return Ra.isRunning
      ? DC.D0
      : ImaginaryUpgrade(12).effectOrDefault(DC.D0).mul(ImaginaryUpgrade(23).effectOrDefault(DC.D1));
  }

  static get totalBoosts() {
    return Decimal.floor(this.purchasedBoosts.add(this.imaginaryBoosts));
  }

  static get startingDimensionBoosts() {
    if (InfinityUpgrade.skipResetGalaxy.isBought) return DC.D4;
    if (InfinityUpgrade.skipReset3.isBought) return DC.D3;
    if (InfinityUpgrade.skipReset2.isBought) return DC.D2;
    if (InfinityUpgrade.skipReset1.isBought) return DC.D1;
    return DC.D0;
  }
}

// eslint-disable-next-line max-params
export function softReset(tempBulk, forcedADReset = false, forcedAMReset = false, enteringAntimatterChallenge = false) {
  if (Currency.antimatter.gt(Player.infinityLimit)) return;
  const bulk = Decimal.min(tempBulk, DimBoost.maxBoosts.sub(player.dimensionBoosts));
  EventHub.dispatch(GAME_EVENT.DIMBOOST_BEFORE, bulk);
  player.dimensionBoosts = (Decimal.max(DC.D0, player.dimensionBoosts.add(bulk)));
  resetChallengeStuff();
  const canKeepDimensions = Pelle.isDoomed
    ? PelleUpgrade.dimBoostResetsNothing.canBeApplied
    : Perk.antimatterNoReset.canBeApplied;
  if (forcedADReset || !canKeepDimensions) {
    AntimatterDimensions.reset();
    player.sacrificed = DC.D0;
    resetTickspeed();
  }
  skipResetsIfPossible(enteringAntimatterChallenge);
  const canKeepAntimatter = Pelle.isDoomed
    ? PelleUpgrade.dimBoostResetsNothing.canBeApplied
    : (Achievement(111).isUnlocked || Perk.antimatterNoReset.canBeApplied);
  if (!forcedAMReset && canKeepAntimatter) {
    Currency.antimatter.bumpTo(Currency.antimatter.startingValue);
  } else {
    Currency.antimatter.reset();
  }
  EventHub.dispatch(GAME_EVENT.DIMBOOST_AFTER, bulk);
}

export function skipResetsIfPossible(enteringAntimatterChallenge) {
  if (enteringAntimatterChallenge || Player.isInAntimatterChallenge) return;
  if (InfinityUpgrade.skipResetGalaxy.isBought && player.dimensionBoosts.lt(4)) {
    player.dimensionBoosts = DC.D4;
    if (player.galaxies.lt(1)) player.galaxies = DC.D1;
  } else if (InfinityUpgrade.skipReset3.isBought && player.dimensionBoosts.lt(3)) player.dimensionBoosts = DC.D3;
  else if (InfinityUpgrade.skipReset2.isBought && player.dimensionBoosts.lt(2)) player.dimensionBoosts = DC.D2;
  else if (InfinityUpgrade.skipReset1.isBought && player.dimensionBoosts.lt(1)) player.dimensionBoosts = DC.D1;
}

export function manualRequestDimensionBoost(bulk) {
  if (Currency.antimatter.gt(Player.infinityLimit) || !DimBoost.requirement.isSatisfied) return;
  if (!DimBoost.canBeBought) return;
  if (GameEnd.creditsEverClosed) return;
  if (player.options.confirmations.dimensionBoost) {
    Modal.dimensionBoost.show({ bulk });
    return;
  }
  requestDimensionBoost(bulk);
}

export function requestDimensionBoost(bulk) {
  if (Currency.antimatter.gt(Player.infinityLimit) || !DimBoost.requirement.isSatisfied) return;
  if (!DimBoost.canBeBought) return;
  Tutorial.turnOffEffect(TUTORIAL_STATE.DIMBOOST);
  if (BreakInfinityUpgrade.autobuyMaxDimboosts.isBought && bulk) maxBuyDimBoosts();
  else softReset(1);
}

function maxBuyDimBoosts() {
  // Boosts that unlock new dims are bought one at a time, unlocking the next dimension
  if (DimBoost.canUnlockNewDimension) {
    if (DimBoost.requirement.isSatisfied) softReset(1);
    return;
  }
  const req1 = DimBoost.bulkRequirement(1);
  if (!req1.isSatisfied) return;
  const req2 = DimBoost.bulkRequirement(2);
  if (!req2.isSatisfied) {
    softReset(1);
    return;
  }

  const tier = DimBoost.maxDimensionsUnlockable;
  let amount = DC.D20;
  const discount = Effects.sum(
    TimeStudy(211),
    TimeStudy(222)
  );
  let multiplierPerDB;
  if (tier === 6) {
    multiplierPerDB = DC.D20.sub(discount);
  } else if (tier === 8) {
    multiplierPerDB = DC.D15.sub(discount);
  }

  amount = amount.sub(Effects.sum(InfinityUpgrade.resetBoost));
  if (InfinityChallenge(5).isCompleted) amount = amount.sub(1);

  multiplierPerDB = multiplierPerDB.times(InfinityUpgrade.resetBoost.chargedEffect.effectOrDefault(1));
  amount = amount.times(InfinityUpgrade.resetBoost.chargedEffect.effectOrDefault(1));

  const ad = AntimatterDimension(tier).totalAmount;
  let calcBoosts;
  calcBoosts = ad.sub(amount).div(multiplierPerDB);


  if (EternityChallenge(5).isRunning) {
    calcBoosts = decimalCubicSolution(DC.D1, DC.D1.neg(), multiplierPerDB.add(2), ad.add(18).neg());
  }

  calcBoosts = calcBoosts.add(NormalChallenge(10).isRunning ? 2 : 4);
  // Dimension boosts 1-4 dont use 8th dims, 1-2 dont use 6th dims, so add those extras afterwards.

  // Add one cause (x-b)/i is off by one otherwise
  if (calcBoosts.floor().add(1).lte(DimBoost.purchasedBoosts)) return;
  calcBoosts = calcBoosts.sub(DimBoost.purchasedBoosts);
  const minBoosts = Decimal.min(DC.BEMAX, calcBoosts.floor().add(1));

  softReset(minBoosts);
}
