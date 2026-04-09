const specialInfinityGlyphDisabledEffectText = () => (PelleRifts.chaos.milestones[1].canBeApplied
  ? i18n("chall", "ecPelleInfinityRemoved")
  : "");

export const eternityChallenges = [
  {
    id: 1,
    description: () => i18n("chall", "ec1"),
    goal: DC.E1800,
    goalIncrease: DC.E200,
    reward: {
      description: () => i18n("chall", "ec1rew"),
      effect: completions =>
        Decimal.pow(Decimal.max(player.records.thisEternity.time.div(10), 0.9), 0.3 + (completions * 0.05)),
      formatEffect: value => formatX(value, 2, 1)
    },
    // These will get notation-formatted and scrambled between for the final goal
    scrambleText: ["1e2600", "1e201600"],
  },
  {
    id: 2,
    description: () => i18n("chall", "ec2"),
    goal: DC.E975,
    pelleGoal: DC.E1750,
    goalIncrease: DC.E175,
    reward: {
      description: () => i18n("chall", "ec2rew"),
      effect: completions => Currency.infinityPower.value.pow(1.5 / (700 - completions * 100)).clampMin(1),
      cap: DC.E100,
      formatEffect: value => formatX(value, 2, 1)
    }
  },
  {
    id: 3,
    description: () => i18n("chall", "ec3"),
    goal: DC.E600,
    pelleGoal: DC.E925,
    goalIncrease: DC.E75,
    reward: {
      description: () => i18n("chall", "ec3rew", [formatInt(10)]),
      effect: completions => completions * 0.72,
      formatEffect: value => `+${format(value, 2, 2)}`
    }
  },
  {
    id: 4,
    description: () => i18n("chall", "ec4"),
    goal: DC.E2750,
    goalIncrease: DC.E550,
    restriction: completions => Math.max(16 - 4 * completions, 0),
    checkRestriction: restriction => Currency.infinities.lte(restriction),
    formatRestriction: restriction => (restriction === 0
      ? i18n("chall", "ec4restriction").split("$")[0]
      : i18n("chall", "ec4restriction", [formatInt(restriction)]).split("$")[0]),
    get failedRestriction() { return i18n("chall", "ec4fail"); },
    reward: {
      description: () => i18n("chall", "ec4rew"),
      effect: completions => Currency.infinityPoints.value.pow(0.003 + completions * 0.002),
      cap: DC.E200,
      formatEffect: value => formatX(value, 2, 1)
    }
  },
  {
    id: 5,
    description: () => i18n("chall", "ec5", [formatInt(100)]),
    goal: DC.E750,
    pelleGoal: DC.E1400,
    goalIncrease: DC.E400,
    reward: {
      description: () => i18n("chall", "ec5rew"),
      effect: completions => completions * 5,
      formatEffect: value => i18n("chall", "ec5rewFormat", [value]),
    }
  },
  {
    id: 6,
    // The asterisk, if present, will get replaced with strings generated from the scramble text
    description: () => {
      if (Enslaved.isRunning) return i18n("chall", "ec6enslaved");
      return i18n("chall", "ec6");
    },
    goal: DC.E850,
    pelleGoal: DC.E1500,
    goalIncrease: DC.E250,
    reward: {
      description: () => i18n("chall", "ec6rew"),
      effect: completions => completions * 0.2,
      formatEffect: value => {
        const total = Player.dimensionMultDecrease.add(Effects.sum(EternityChallenge(6).reward)).round().sub(value);
        return i18n("chall", "ec6rewFormat", [format(value, 2, 1), format(total, 2, 1)]);
      }
    },
    get scrambleText() { return i18n("chall", "ec6enslavedScramble").split(" $ "); },
  },
  {
    id: 7,
    description: () => i18n("chall", "ec7"),
    goal: DC.E2000,
    pelleGoal: DC.E2700,
    goalIncrease: DC.E530,
    effect: () => TimeDimension(1).productionPerSecond,
    reward: {
      description: () => i18n("chall", "ec7rew"),
      effect: completions => TimeDimension(1).productionPerSecond.pow(completions * 0.2).minus(1).clampMin(0),
      formatEffect: value => i18n("chall", "ec7rewFormat", [format(value, 2, 2)]),
    }
  },
  {
    id: 8,
    description: () => i18n("chall", "ec8", [formatInt(50), formatInt(40)]),
    goal: DC.E1300,
    pelleGoal: DC.E2800,
    goalIncrease: DC.E900,
    reward: {
      description: () => i18n("chall", "ec8rew"),
      effect: completions => {
        const infinityPower = Currency.infinityPower.value.add(1).max(1).log10().add(1).log10();
        return Decimal.pow(infinityPower, 0.03 * completions).sub(1).max(0);
      },
      formatEffect: value => formatPercents(value, 2)
    }
  },
  {
    id: 9,
    description: () => i18n("chall", "ec9", [specialInfinityGlyphDisabledEffectText()]),
    goal: DC.E1750,
    pelleGoal: DC.E2900,
    goalIncrease: DC.E250,
    reward: {
      description: () => i18n("chall", "ec9rew"),
      effect: completions => Currency.timeShards.value.pow(completions * 0.1).clampMin(1),
      cap: DC.E400,
      formatEffect: value => formatX(value, 2, 1)
    }
  },
  {
    id: 10,
    description: () => {
      let description = i18n("chall", "ec10", [formatInt(950), specialInfinityGlyphDisabledEffectText()]);
      EternityChallenge(10).applyEffect(v => description += i18n("chall", "ec10additional", [formatX(v, 2, 1)]));
      return description;
    },
    goal: DC.E3000,
    pelleGoal: DC.E3200,
    goalIncrease: DC.E300,
    effect: () => Currency.infinitiesTotal.value.pow(950).clampMin(1).pow(TimeStudy(31).effectOrDefault(1)),
    reward: {
      description: () => i18n("chall", "ec10rew"),
      effect: completions => {
        const mult = Currency.infinitiesTotal.value.times(2.783e-6).pow(0.4 + 0.1 * completions).clampMin(1);
        return mult.powEffectOf(TimeStudy(31));
      },
      formatEffect: value => {
        // Since TS31 is already accounted for in the effect prop, we need to "undo" it to display the base value here
        const mult = formatX(value, 2, 1);
        const ts31mult = formatX(value.pow(1 / TimeStudy(31).effectValue), 2, 1);
        return TimeStudy(31).canBeApplied
          ? i18n("chall", "ec10rewFormat", [ts31mult, mult])
          : mult;
      }
    }
  },
  {
    id: 11,
    description: () => i18n("chall", "ec11", [specialInfinityGlyphDisabledEffectText()]),
    goal: DC.E450,
    pelleGoal: DC.E11200,
    goalIncrease: DC.E200,
    pelleGoalIncrease: DC.E1400,
    reward: {
      description: () => i18n("chall", "ec11rew"),
      effect: completions => completions * 0.07,
      formatEffect: value => {
        const total = Player.tickSpeedMultDecrease.add(Effects.sum(EternityChallenge(11).reward)).round().sub(value);
        return i18n("chall", "ec11rewFormat", [format(value, 2, 2), format(total, 2, 2)]);
      }
    }
  },
  {
    id: 12,
    description: () => (PlayerProgress.realityUnlocked()
      ? i18n("chall", "ec12", [formatInt(1000), specialInfinityGlyphDisabledEffectText()])
      : i18n("chall", "ec12", [formatInt(1000)])),
    goal: DC.E110000,
    pelleGoal: DC.E208000,
    goalIncrease: DC.E12000,
    restriction: completions => Math.max(10 - 2 * completions, 1) / 10,
    checkRestriction: restriction => Time.thisEternity.totalSeconds.lt(restriction),
    formatRestriction: restriction => i18n("chall", "ec12restriction", [format(restriction, 0, 1)]).split("$")[Decimal.eq(restriction, 1) ? 0 : 1],
    get failedRestriction() { return i18n("chall", "ec12fail"); },
    reward: {
      description: () => i18n("chall", "ec12rew"),
      effect: completions => 1 - completions * 0.008,
      formatEffect: value => `x${formatPow(value, 3, 3)}`
    }
  }
];
