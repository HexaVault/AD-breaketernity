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
      let ip = value;
      return DC.D1;
    },

  },
  ep: {

    gainFormula: () => {
      return DC.D1;
    },

    nerfedFinal: (value, allowCap = true) => {
      return DC.D1;
    },

    currencyReq: value => {
      return DC.D1;
    },

  },
  rm: {

    gainFormula: () => {
      return DC.D1;
    },

    nerflessFinal: (value, allowCap = true) => {
      return DC.D1;
    },

    nerfedFinal: (value, allowCap = true) => {
      return DC.D1;
    },

    currencyReq: value => {
      return DC.D1;
    },

  },
  iM: {

    gainFormula: () => {
      return DC.D1;
    },

    nerflessFinal: (value, allowCap = true) => {
      return DC.D1;
    },

    nerfedFinal: (value, allowCap = true) => {
      return DC.D1;
    },

    currencyReq: value => {
      return DC.D1;
    },

  },
  relicShards: {
    gainFormula: () => {
      return DC.D1;
    },

  }
};