/* eslint-disable complexity */
export function gainedPrestigeCurrency(currency) {
  switch (currency.toLowerCase()) {
    case "ip": {
      const div = Effects.min(
        308,
        Achievement(103),
        TimeStudy(111)
      );
      if (Pelle.isDisabled("IPMults")) {
        return Decimal.pow10(player.records.thisInfinity.maxAM.max(1).log10().div(div).sub(0.75))
          .timesEffectsOf(PelleRifts.vacuum)
          .times(Pelle.specialGlyphEffect.infinity)
          .floor();
      }
      let ip = player.break
        ? Decimal.pow10(player.records.thisInfinity.maxAM.max(1).log10().div(div).sub(0.75))
        : Decimal.div(308, div);
      if (Effarig.isRunning && Effarig.currentStage === EFFARIG_STAGES.ETERNITY) {
        ip = ip.min(DC.E200);
      }
      ip = ip.times(GameCache.totalIPMult.value);
      if (Teresa.isRunning) {
        ip = ip.pow(0.55);
      } else if (V.isRunning) {
        ip = ip.pow(0.5);
      } else if (Laitela.isRunning) {
        ip = dilatedValueOf(ip);
      }
      if (GlyphAlteration.isAdded("infinity")) {
        ip = ip.pow(getSecondaryGlyphEffect("infinityIP"));
      }

      return ip.floor();
    }


    case "ep": {
      let ep = DC.D5.pow(player.records.thisEternity.maxIP.plus(
        gainedInfinityPoints()).max(1).log10().div(Decimal.sub(308, PelleRifts.recursion.effectValue)).sub(0.7))
        .times(prestigeCurrencyMultiplier("ep"));

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

    case "urm":
    case "uncappedrm": {
      let log10FinalEP = player.records.thisReality.maxEP.plus(gainedPrestigeCurrency("ep")).max(1).log10();
      if (!PlayerProgress.realityUnlocked()) {
        if (log10FinalEP.gt(8000)) log10FinalEP = new Decimal(8000);
        if (log10FinalEP.gt(6000)) log10FinalEP = log10FinalEP.sub(log10FinalEP.sub(6000).times(0.75));
      }
      let rmGain = DC.E3.pow(log10FinalEP.div(4000).sub(1));
      // Increase base RM gain if <10 RM
      if (rmGain.gte(1) && rmGain.lt(10)) rmGain = (log10FinalEP).minus(26).mul(27).div(4000);
      rmGain = rmGain.times(prestigeCurrencyMultiplier("rm"));
      return rmGain.floor();
    }
    default:
      return new Decimal(0);
  }
}

export function prestigeCurrencyMultiplier(currency) {
  switch (currency) {
    case "ip":
      return GameCache.totalIPMult.value;
    case "ep":
      return Pelle.isDisabled("EPMults")
        ? Pelle.specialGlyphEffect.time.timesEffectOf(PelleRifts.vacuum.milestones[2])
        : getAdjustedGlyphEffect("cursedEP")
          .timesEffectsOf(
            EternityUpgrade.epMult,
            TimeStudy(61),
            TimeStudy(122),
            TimeStudy(121),
            TimeStudy(123),
            RealityUpgrade(12),
            GlyphEffect.epMult
          );
    case "rm":
      return Teresa.rmMultiplier.times(PerkShopUpgrade.rmMult.effectOrDefault(DC.D1))
        .times(getAdjustedGlyphEffect("effarigrm")).times(Achievement(167).effectOrDefault(1));
    case "rmcap":
      return ImaginaryUpgrade(6).effectOrDefault(DC.D1);
    case "imcap":
      return ImaginaryUpgrade(13).effectOrDefault(DC.D1);
    default:
      return DC.D1;
  }
}

export function gainedInfinityPoints() {
  return gainedPrestigeCurrency("ip");
}

function totalEPMult() {
  return prestigeCurrencyMultiplier("ep");
}

export function gainedEternityPoints() {
  return gainedPrestigeCurrency("ep");
}

export function requiredIPForEP(epAmount) {
  return Decimal.pow10(Decimal.log10(Decimal.div(epAmount, totalEPMult()), 5).times(308).plus(0.7))
    .clampMin(Number.MAX_VALUE);
}