import { DC } from "../../constants";
import { DimensionState } from "../../dimensions/dimension";

/**
 * Constants for easily adjusting values
 */

const INTERVAL_COST_MULT = DC.D5;
const POWER_DM_COST_MULT = DC.E1;
const POWER_DE_COST_MULTS = [1.65, 1.6, 1.55, 1.5];

const INTERVAL_START_COST = DC.E1;
const POWER_DM_START_COST = DC.E1;
const POWER_DE_START_COST = DC.E1;

const INTERVAL_PER_UPGRADE = 0.92;

// No constant for interval since it's tied to a milestone
export const POWER_DM_PER_ASCENSION = new Decimal(500);
export const POWER_DE_PER_ASCENSION = new Decimal(500);

const COST_MULT_PER_TIER = 1200;

export class DarkMatterDimensionState extends DimensionState {

  static get dimensionCount() {
    return 4;
  }

  constructor(tier) {
    // eslint-disable-next-line no-debugger, max-statements-per-line
    super(() => player.celestials.laitela.dimensions, tier);
  }

  // Does not include DM, only DE per second
  get productionPerSecond() { return this.powerDE.mul(DC.E3.div(this.interval)); }

  get unlockUpgrade() {
    // The 15th Imaginary Upgrade unlocked Laitela and the 1st DMD
    return ImaginaryUpgrade(this.tier + 14);
  }

  get isUnlocked() {
    return this.unlockUpgrade.isBought;
  }

  get ascensions() {
    return this.data.ascensionCount;
  }

  get intervalPurchaseCap() {
    return DC.E1;
  }

  get rawInterval() {
    const perUpgrade = INTERVAL_PER_UPGRADE;
    const tierFactor = Decimal.pow(4, this.tier - 1);
    return tierFactor.mul(DC.E3).mul(Decimal.pow(perUpgrade, this.data.intervalUpgrades))
      .mul(Decimal.pow(SingularityMilestone.ascensionIntervalScaling.effectOrDefault(1200), this.ascensions))
      .mul(SingularityMilestone.darkDimensionIntervalReduction.effectOrDefault(1));
  }

  get interval() {
    return Decimal.clampMin(this.intervalPurchaseCap, this.rawInterval);
  }

  get commonDarkMult() {
    return DC.D1.timesEffectsOf(
      SingularityMilestone.darkFromTesseracts,
      SingularityMilestone.darkFromGlyphLevel,
      SingularityMilestone.darkFromTheorems,
      SingularityMilestone.darkFromDM4,
      SingularityMilestone.darkFromGamespeed,
      SingularityMilestone.darkFromDilatedTime
    );
  }

  get powerDMPerAscension() {
    return SingularityMilestone.improvedAscensionDM.effectOrDefault(DC.D0).add(POWER_DM_PER_ASCENSION);
  }

  get powerDM() {
    if (!this.isUnlocked) return DC.D0;
    return Decimal.pow(1.15, this.data.powerDMUpgrades).mul(2).add(1)
      .times(Laitela.realityReward)
      .times(Laitela.darkMatterMult)
      .times(this.commonDarkMult)
      .times(Decimal.pow(this.powerDMPerAscension, this.ascensions))
      .timesEffectsOf(SingularityMilestone.darkMatterMult, SingularityMilestone.multFromInfinitied)
      .dividedBy(Decimal.pow(1e4, Decimal.pow(this.tier - 1, 0.5)));
  }

  get powerDE() {
    if (!this.isUnlocked || Pelle.isDoomed) return DC.D0;
    const tierFactor = Decimal.pow(15, this.tier - 1);
    const destabilizeBoost = Laitela.isFullyDestabilized ? 8 : 1;
    return this.data.powerDEUpgrades.div(10).add(1)
      .mul(Decimal.pow(1.005, this.data.powerDEUpgrades)).mul(tierFactor).div(1000)
      .times(this.commonDarkMult)
      .times(Decimal.pow(POWER_DE_PER_ASCENSION, this.ascensions))
      .timesEffectsOf(
        SingularityMilestone.darkEnergyMult,
        SingularityMilestone.realityDEMultiplier,
        SingularityMilestone.multFromInfinitied
      ).mul(destabilizeBoost);
  }

  get intervalAfterAscension() {
    const purchases = this.costScaleInterval.getMaxBought(this.data.intervalUpgrades, Currency.darkMatter.value, DC.D1);
    return Decimal.clampMin(this.intervalPurchaseCap, this.rawInterval.mul(Decimal.pow(INTERVAL_PER_UPGRADE, purchases))
      .mul(SingularityMilestone.ascensionIntervalScaling.effectOrDefault(1200)));
  }

  get adjustedStartingCost() {
    const tiers = [null, 0, 2, 5, 13];
    return Decimal.pow(COST_MULT_PER_TIER, tiers[this.tier]).mul(10)
      .mul(SingularityMilestone.darkDimensionCostReduction.effectOrDefault(1));
  }

  get rawIntervalCost() {
    return Decimal.pow(this.intervalCostIncrease, this.data.intervalUpgrades)
      .times(this.adjustedStartingCost).times(INTERVAL_START_COST);
  }

  get intervalCost() {
    return this.costScaleInterval.calculateCost(this.data.intervalUpgrades);
  }

  get intervalCostIncrease() {
    return Decimal.pow(INTERVAL_COST_MULT, SingularityMilestone.intervalCostScalingReduction.effectOrDefault(1));
  }

  get rawPowerDMCost() {
    return Decimal.pow(this.powerDMCostIncrease, this.data.powerDMUpgrades)
      .times(this.adjustedStartingCost).times(POWER_DM_START_COST);
  }

  get powerDMCost() {
    return this.rawPowerDMCost.floor();
  }

  get powerDMCostIncrease() {
    return POWER_DM_COST_MULT;
  }

  get rawPowerDECost() {
    return Decimal.pow(this.powerDECostIncrease, this.data.powerDEUpgrades)
      .times(this.adjustedStartingCost).times(POWER_DE_START_COST);
  }

  get powerDECost() {
    return this.rawPowerDECost.floor();
  }

  get powerDECostIncrease() {
    return new Decimal(POWER_DE_COST_MULTS[this.tier - 1]);
  }

  get costScaleDE() {
    return new ExponentialCostScaling({
      baseCost: this.adjustedStartingCost.mul(SingularityMilestone.darkDimensionCostReduction.effectOrDefault(1))
        .times(POWER_DE_START_COST),
      baseIncrease: this.powerDECostIncrease,
      costScale: new Decimal(10),
      scalingCostThreshold: DC.NUMMAX.div(SingularityMilestone.darkDimensionCostReduction.effectOrDefault(1))
    });
  }

  get costScaleDM() {
    return new ExponentialCostScaling({
      baseCost: this.adjustedStartingCost.mul(SingularityMilestone.darkDimensionCostReduction.effectOrDefault(1))
        .times(POWER_DM_START_COST),
      baseIncrease: this.powerDMCostIncrease,
      costScale: new Decimal(10),
      scalingCostThreshold: DC.NUMMAX.div(SingularityMilestone.darkDimensionCostReduction.effectOrDefault(1))
    });
  }

  get costScaleInterval() {
    return new ExponentialCostScaling({
      baseCost: this.adjustedStartingCost.mul(SingularityMilestone.darkDimensionCostReduction.effectOrDefault(1))
        .times(INTERVAL_START_COST),
      baseIncrease: this.intervalCostIncrease,
      costScale: new Decimal(10),
      scalingCostThreshold: DC.NUMMAX.div(SingularityMilestone.darkDimensionCostReduction.effectOrDefault(1))
    });
  }

  get realDiff() {
    return this.data.realDiff;
  }

  set realDiff(ms) {
    this.data.realDiff = ms;
  }

  get canBuyInterval() {
    return Currency.darkMatter.gte(this.intervalCost) && this.interval.gt(this.intervalPurchaseCap);
  }

  get canBuyPowerDM() {
    return Currency.darkMatter.gte(this.powerDMCost);
  }

  get canBuyPowerDE() {
    return Currency.darkMatter.gte(this.powerDECost);
  }

  get maxIntervalPurchases() {
    return Decimal.ceil(Decimal.log10(this.intervalPurchaseCap.div(this.interval))
      .div(Decimal.log10(INTERVAL_PER_UPGRADE)));
  }

  buyManyInterval(x) {
    // eslint-disable-next-line max-len
    const calc = this.costScaleInterval.getMaxBought(this.data.intervalUpgrades, Currency.darkMatter.value, DC.D1);
    const quant = calc?.quantity;
    if (calc === null) return;
    if (Decimal.lte(x, quant.clampMax(this.maxIntervalPurchases))) {
      // eslint-disable-next-line max-len
      Currency.darkMatter.purchase(this.costScaleInterval.calculateCost(this.data.intervalUpgrades.add(Decimal.min(x, this.maxIntervalPurchases)).sub(1)));
      this.data.intervalUpgrades = this.data.intervalUpgrades.add(Decimal.min(x, this.maxIntervalPurchases));
    }
    // eslint-disable-next-line max-len
    Currency.darkMatter.purchase(this.costScaleInterval.calculateCost(this.data.intervalUpgrades.add(quant.clampMax(this.maxIntervalPurchases)).sub(1)));
    this.data.intervalUpgrades = this.data.intervalUpgrades.add(quant.clampMax(this.maxIntervalPurchases));
    // S this.data.intervalUpgrades
  }

  buyManyPowerDM(x) {
    const calc = this.costScaleDM.getMaxBought(this.data.powerDMUpgrades, Currency.darkMatter.value, DC.D1);
    if (calc === null) return;
    if (Decimal.lte(x, calc.quantity)) {
      Currency.darkMatter.purchase(this.costScaleDM.calculateCost(this.data.powerDMUpgrades.add(x).sub(1)));
      this.data.powerDMUpgrades = this.data.powerDMUpgrades.add(x);
    }
    Currency.darkMatter.purchase(this.costScaleDM.calculateCost(this.data.powerDMUpgrades.add(calc.quantity.sub(1))));
    this.data.powerDMUpgrades = this.data.powerDMUpgrades.add(calc.quantity);
    // S this.data.powerDMUpgrades
  }

  buyManyPowerDE(x) {
    const calc = this.costScaleDE.getMaxBought(this.data.powerDEUpgrades, Currency.darkMatter.value, DC.D1);
    if (calc === null) return;
    if (Decimal.lte(x, calc.quantity)) {
      Currency.darkMatter.purchase(this.costScaleDE.calculateCost(this.data.powerDEUpgrades.add(x).sub(1)));
      this.data.powerDEUpgrades = this.data.powerDEUpgrades.add(x);
    }
    Currency.darkMatter.purchase(this.costScaleDE.calculateCost(this.data.powerDEUpgrades.add(calc.quantity.sub(1))));
    this.data.powerDEUpgrades = this.data.powerDEUpgrades.add(calc.quantity);
    // S this.data.powerDEUpgrades
  }

  buyInterval() {
    return this.buyManyInterval(DC.D1);
  }

  buyPowerDM() {
    return this.buyManyPowerDM(DC.D1);
  }

  buyPowerDE() {
    return this.buyManyPowerDE(DC.D1);
  }

  ascend() {
    if (this.interval.gt(this.intervalPurchaseCap)) return;
    this.data.ascensionCount = this.data.ascensionCount.add(1);

    this.buyManyInterval(Infinity);
  }

  reset() {
    this.data.amount = DC.D1;
    this.data.intervalUpgrades = DC.D0;
    this.data.powerDMUpgrades = DC.D0;
    this.data.powerDEUpgrades = DC.D0;
    this.data.realDiff = DC.D0;
    this.data.ascensionCount = DC.D0;
  }
}

/**
 * @function
 * @param {number} tier
 * @return {DarkMatterDimensionState}
 */
export const DarkMatterDimension = DarkMatterDimensionState.createAccessor();

export const DarkMatterDimensions = {
  /**
   * @type {DarkMatterDimension[]}
   */
  all: DarkMatterDimension.index.compact(),

  tick(realDiff) {
    if (!Laitela.isUnlocked) return;
    for (let tier = 4; tier >= 1; tier--) {
      const dim = DarkMatterDimension(tier);
      if (!dim.isUnlocked) continue;
      dim.realDiff = dim.realDiff.add(realDiff);
      if (dim.interval.lt(dim.realDiff)) {
        const ticks = Decimal.floor(dim.realDiff.div(dim.interval));
        const productionDM = dim.amount.times(ticks).times(dim.powerDM);
        if (tier === 1) {
          Currency.darkMatter.add(productionDM);
        } else {
          DarkMatterDimension(tier - 1).amount = DarkMatterDimension(tier - 1).amount.plus(productionDM);
        }
        Currency.darkEnergy.add(ticks.mul(dim.powerDE));
        dim.realDiff = dim.realDiff.sub(dim.interval.mul(ticks));
      }
    }
    if (SingularityMilestone.dim4Generation.canBeApplied && Laitela.annihilationUnlocked) {
      DarkMatterDimension(4).amount = DarkMatterDimension(4).amount
        .plus(SingularityMilestone.dim4Generation.effectValue.mul(realDiff.div(1000)));
    }
  },

  reset() {
    for (const dimension of DarkMatterDimensions.all) {
      dimension.reset();
    }
    Currency.darkMatter.reset();
  },
};
