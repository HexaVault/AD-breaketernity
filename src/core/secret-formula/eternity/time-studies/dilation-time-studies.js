export const dilationTimeStudies = [
  {
    id: 1,
    description: () => i18n("studies", "ds1"),
    cost: new Decimal(5000),
    requirement: () => {
      const ttRequirement = Currency.timeTheorems.max.gte(TimeStudy.dilation.totalTimeTheoremRequirement);
      if (Ra.unlocks.autoUnlockDilation.canBeApplied &&
          ttRequirement &&
          !isInCelestialReality() && !Pelle.isDoomed
      ) {
        return true;
      }
      const tsRequirement = [231, 232, 233, 234].some(id => TimeStudy(id).isBought);
      if (Perk.bypassECDilation.canBeApplied) return tsRequirement;
      const ecRequirement = EternityChallenge(11).isFullyCompleted && EternityChallenge(12).isFullyCompleted;
      return tsRequirement && ecRequirement && ttRequirement;
    }
  },
  {
    id: 2,
    description: () => i18n("studies", "ds2"),
    cost: DC.E6,
    requirement: () => PlayerProgress.dilationUnlocked()
  },
  {
    id: 3,
    description: () => i18n("studies", "ds3"),
    cost: DC.E7,
    requirement: () => TimeStudy.timeDimension(5).isBought
  },
  {
    id: 4,
    description: () => i18n("studies", "ds4"),
    cost: DC.E8,
    requirement: () => TimeStudy.timeDimension(6).isBought
  },
  {
    id: 5,
    description: () => i18n("studies", "ds5"),
    cost: DC.E9,
    requirement: () => TimeStudy.timeDimension(7).isBought
  },
  {
    id: 6,
    description: () => (Pelle.isDoomed
      ? i18n("studies", "ds6alt")
      : i18n("studies", "ds6")),
    cost: DC.D1,
    requirement: () => TimeStudy.timeDimension(8).isBought &&
      player.records.thisReality.maxEP.add(1).log10().gte(4000) &&
      (Perk.firstPerk.isBought || Achievements.preReality.every(a => a.isUnlocked)) &&
      !Pelle.isDoomed
  }
];
