import { DC } from "./constants";

export const MachineHandler = {
  get baseRMCap() { return DC.E1000; },

  get hardcapRM() {
    return this.baseRMCap.times(ImaginaryUpgrade(6).effectOrDefault(1));
  },

  get distanceToRMCap() {
    return this.hardcapRM.minus(Currency.realityMachines.value);
  },

  get realityMachineMultiplier() {
    return Teresa.rmMultiplier.times(Decimal.max(1, PerkShopUpgrade.rmMult)
      .times(getAdjustedGlyphEffect("effarigrm")).times(Achievement(167).effectOrDefault(1)));
  },

  get uncappedRM() {
    let log10FinalEP = player.records.thisReality.maxEP.plus(gainedEternityPoints()).log10();
    if (!PlayerProgress.realityUnlocked()) {
      if (log10FinalEP.gt(8000)) log10FinalEP = new Decimal(8000);
      if (log10FinalEP.gt(6000)) log10FinalEP = log10FinalEP.sub((log10FinalEP.sub(6000)).times(0.75));
    }
    let rmGain = DC.E3.pow(log10FinalEP.div(4000).sub(1));
    // Increase base RM gain if <10 RM
    if (rmGain.gte(1) && rmGain.lt(10)) rmGain = new Decimal(new Decimal(27).div(log10FinalEP.minus(26).times(4000)));
    rmGain = rmGain.times(this.realityMachineMultiplier);
    return rmGain.floor();
  },

  get gainedRealityMachines() {
    return this.uncappedRM.clampMax(this.hardcapRM);
  },

  get isIMUnlocked() {
    return Currency.realityMachines.value.gte(this.hardcapRM) || Currency.imaginaryMachines.gt(0);
  },

  get baseIMCap() {
    return (Decimal.pow(Decimal.clampMin(this.uncappedRM.log10().sub(1000), 0), 2))
      .times((Decimal.pow(Decimal.clampMin(this.uncappedRM.log10().sub(100000), 1), 0.2)));
  },

  get currentIMCap() {
    return player.reality.iMCap.times(ImaginaryUpgrade(13).effectOrDefault(1));
  },

  // This is iM cap based on in-game values at that instant, may be lower than the actual cap
  get projectedIMCap() {
    return this.baseIMCap.times(ImaginaryUpgrade(13).effectOrDefault(1));
  },

  // Use iMCap to store the base cap; applying multipliers separately avoids some design issues the 3xTP upgrade has
  updateIMCap() {
    if (this.uncappedRM.gte(this.baseRMCap)) {
      if (this.baseIMCap.gt(player.reality.iMCap)) {
        player.records.bestReality.iMCapSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
        player.reality.iMCap = this.baseIMCap;
      }
    }
  },

  // Time in seconds to reduce the missing amount by a factor of two
  get scaleTimeForIM() {
    return DC.D60.div(ImaginaryUpgrade(20).effectOrDefault(1));
  },

  gainedImaginaryMachines(diff) {
    return (this.currentIMCap.sub(Currency.imaginaryMachines.value)).times(DC.D1
      .sub(Decimal.pow(2, (new Decimal(0).sub(diff).div(1000).div(this.scaleTimeForIM)))));
  },

  estimateIMTimer(cost) {
    const imCap = this.currentIMCap;
    if (imCap.lte(cost)) return DC.BEMAX;
    const currentIM = Currency.imaginaryMachines.value;
    // This is doing log(a, 1/2) - log(b, 1/2) where a is % left to imCap of cost and b is % left to imCap of current
    // iM. log(1 - x, 1/2) should be able to estimate the time taken for iM to increase from 0 to imCap * x since every
    // fixed interval the difference between current iM to max iM should decrease by a factor of 1/2.
    return Decimal.max(0, Decimal.log(imCap.div(imCap.sub(cost)), 2).sub(Decimal.log(
      imCap.div(imCap.sub(currentIM)), 2))).times(this.scaleTimeForIM);
  }
};
