/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */

// This file is intended to store the formulae to calculate things like multipliers, currency gain and nerfs.
// The hope is to end up making it far easier to add, remove and modify formulae.

export const formulae = {
  ip: {

    gainFormula: () => {
      const div = Effects.min(
        308,
        Achievement(103),
        TimeStudy(111)
      );
      const ip = player.break
        ? Decimal.pow10(player.records.thisInfinity.maxAM.max(1).log10().div(div).sub(0.75))
        : Decimal.div(308, div);
      return ip;
    },

    nerfedFinal: (value, allowCap = true) => {
      let ip = value;
      if (allowCap) ip = (Effarig.isRunning && Effarig.currentStage === EFFARIG_STAGES.ETERNITY) ? ip.max(1e200) : ip;
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
      return ip;
    },

    currencyReq: value => {
      const div = Effects.min(
        308,
        Achievement(103),
        TimeStudy(111)
      );
      // eslint-disable-next-line prefer-const
      let am = new Decimal(value);
      if (GlyphAlteration.isAdded("infinity")) {
        am = am.root(getSecondaryGlyphEffect("infinityIP"));
      }
      am = am.div(GameCache.totalIPMult.value);
      if (Teresa.isRunning) {
        am = am.root(0.55);
      } else if (V.isRunning) {
        am = am.pow(2);
      } else if (Laitela.isRunning) {
        am = stackedLogPower(am, 1, dilatedPenalty);
      }

      am = am.log10().add(0.75).mul(div).pow10().clampMin(1);
      return am;
    },

  },
  ep: {

    gainFormula: () => {
      const div = Decimal.sub(308, PelleRifts.recursion.effectValue);
      const ep = DC.D5.pow(player.records.thisEternity.maxIP.plus(Currency.infinityPoints.gain)
        .max(1).log10().div(div).sub(0.7));
      return ep;
    },

    nerfedFinal: (value, allowCap = true) => {
      let ep = value;
      if (Pelle.isDisabled("IPMults")) {
        return ep.timesEffectsOf(GlyphInfo.time.pelleEffect, PelleRifts.vacuum.milestones[2]).floor();
      }
      ep = ep.times(GameCache.totalEPMult.value);
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
      return ep;
    },

    currencyReq: value => {
      let ip = new Decimal(value);
      ip = ip.div(GameCache.totalEPMult.value);
      if (GlyphAlteration.isAdded("time")) {
        ip = ip.root(getSecondaryGlyphEffect("timeEP"));
      }
      if (Teresa.isRunning) {
        ip = ip.root(0.55);
      } else if (V.isRunning) {
        ip = ip.pow(2);
      } else if (Laitela.isRunning) {
        ip = stackedLogPower(ip, 1, dilatedPenalty);
      }
      return Decimal.pow10(Decimal.log(ip, 5).plus(0.7).times(308))
        .clampMin(Number.MAX_VALUE);
    },

  },
  rm: {

    gainFormula: () => {
      const log10FinalEP = player.records.thisReality.maxEP.plus(Currency.eternityPoints.gain).max(1).log10();
      let rmGain = DC.E3.pow(log10FinalEP.div(4000).sub(1));
      // Increase base RM gain if <10 RM
      if (rmGain.gte(1) && rmGain.lt(10)) rmGain = log10FinalEP.minus(26).mul(27).div(4000);
      return rmGain;
    },

    nerfedFinal: (value, allowCap = true) => {
      let rm = value;
      if (!PlayerProgress.realityUnlocked() && rm.gt(10) && allowCap) {
        let nerfRM = rm.log(1e3).add(1).mul(4000);
        if (nerfRM.gt(8000)) nerfRM = new Decimal(8000);
        if (nerfRM.gt(6000)) nerfRM = nerfRM.sub(nerfRM.sub(6000).times(0.75));
        // This basically lets us finnick around the fact that gainFormula doesn't have a cap, but this might need a cap.
        rm = DC.E3.pow(nerfRM.div(4000).sub(1));
      }
      rm = rm.mul(GameCache.totalRMMult.value);
      if (allowCap) rm = rm.clampMax(Currency.realityMachines.hardcap);
      return rm;
    },

    currencyReq: value => {
      let ep = new Decimal(value);
      ep = ep.div(GameCache.totalRMMult.value);
      ep = ep.log(1e3).add(1).mul(4000);
      return ep;
    },

  },

  relicShards: {

    gainFormula: () => {
      if (!TeresaUnlocks.effarig.canBeApplied) return DC.D0;
      return Decimal.floor(Decimal.pow(Currency.eternityPoints.value.max(1).log10().div(7500),
        getActiveGlyphEffects().length)).times(AlchemyResource.effarig.effectValue);
    },

  }
};