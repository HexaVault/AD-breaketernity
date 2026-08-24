<script>
export default {
  name: "AntimatterDimensionProgressBar",
  data() {
    return {
      fill: new Decimal(0),
      tooltip: "",
      displayPercents: "",
    };
  },
  computed: {
    progressBarStyle() {
      return {
        width: `${(this.fill.times(100).toNumber()).toFixed(2)}%`
      };
    }
  },
  methods: {
    // eslint-disable-next-line complexity
    update() {
      this.displayPercents = formatPercents(this.fill, 2);
      const setProgress = (current, goal, tooltip) => {
        this.fill = Decimal.min(current.clampMin(1).pLog10().div(Decimal.log10(goal)), 1);
        this.tooltip = tooltip();
      };
      const setLinearProgress = (current, goal, tooltip) => {
        this.fill = Decimal.min(current.div(goal), 1);
        this.tooltip = tooltip();
      };

      // Goals for challenges and challenge-like runs should come first because numbers will always be much smaller
      // than normal and therefore default filling won't be meaningful. Since challenges get completed or abandoned from
      // the inside outwards, we show the goals in that priority as well. It only makes sense to check cel6 and not the
      // others because pre-cel3 completion it'll default to e4000 and cel4/5 don't have meaningful single goals
      const inSpecialRun = Player.isInAntimatterChallenge || EternityChallenge.isRunning || player.dilation.active ||
        Laitela.isRunning;
      if (inSpecialRun) {
        if (Player.isInAntimatterChallenge) {
          setProgress(Currency.antimatter.value, Player.antimatterChallenge.goal, () => i18n("other", "adProgressBar_challengeGoal"));
        } else if (EternityChallenge.isRunning) {
          if (Perk.studyECBulk.isBought) {
            // Note: If the EC is fully complete, this prop doesn't exist
            const goal = new Decimal(EternityChallenge.current.gainedCompletionStatus.nextGoalAt);
            if (goal) {
              setProgress(Currency.infinityPoints.value, goal, () => i18n("other", "adProgressBar_nextChallengeCompletion"));
            } else {
              // In a fully completed EC, there's nothing useful we can show so we just pin it at 100% and say so
              setProgress(Currency.infinityPoints.value, new Decimal(10), () => i18n("other", "adProgressBar_fullyCompletedAlready"));
            }
          } else {
            setProgress(Currency.infinityPoints.value, Player.eternityGoal, () => i18n("other", "adProgressBar_eternityChallengeGoal"));
          }
        } else if (player.dilation.active) {
          if (player.dilation.lastEP.gt(0)) {
            setProgress(Currency.antimatter.value, getTachyonReq(), () => i18n("other", "adProgressBar_moreTPDilation"));
          } else {
            setProgress(Currency.infinityPoints.value, Player.eternityGoal, () => i18n("other", "adProgressBar_toEternityDilation"));
          }
        } else {
          // Lai'tela destabilization; since the progress bar is logarithmically-scaled, we need to pow10 the arguments
          setProgress(Decimal.pow10(player.celestials.laitela.entropy), new Decimal(10), () => i18n("other", "adProgressBar_toDestabilization"));
        }
      } else if (Pelle.isDoomed) {
        if (PelleRifts.recursion.milestones[2].canBeApplied || GalaxyGenerator.spentGalaxies.gt(0)) {
          setProgress(Currency.infinityPoints.value, Tesseracts.nextCost, () => i18n("other", "adProgressBar_toNextTesseract"));
        } else if (PelleStrikes.dilation.hasStrike) {
          setProgress(Currency.eternityPoints.value, DC.E4000, () => i18n("other", "adProgressBar_toGalaxyGenerator"));
        } else if (PelleStrikes.ECs.hasStrike) {
          setLinearProgress(
            (Decimal.min(Currency.timeTheorems.max.div(12900), 1)
              .add(Decimal.min(EternityChallenges.completions / 60, 1))).div(2),
            1, "Percentage to fifth Strike");
        } else if (PelleStrikes.eternity.hasStrike) {
          setLinearProgress(Currency.timeTheorems.max, new Decimal(115), () => i18n("other", "adProgressBar_toStrikeFour"));
        } else if (PelleStrikes.powerGalaxies.hasStrike) {
          setProgress(Currency.infinityPoints.value, Player.eternityGoal, () => i18n("other", "adProgressBar_toStrikeThree"));
        } else if (PelleStrikes.infinity.hasStrike) {
          if (player.break) {
            setProgress(Currency.infinityPoints.value, new Decimal(5e11), () => i18n("other", "adProgressBar_toStrikeTwo"));
          } else {
            setProgress(Currency.antimatter.value, new Decimal(Number.MAX_VALUE), () => i18n("other", "adProgressBar_toInfinity"));
          }
        } else {
          setProgress(Currency.antimatter.value, new Decimal(Number.MAX_VALUE), () => i18n("other", "adProgressBar_toStrikeOne"));
        }
      } else if (Enslaved.isCompleted) {
        // Show all other goals from the top down, starting at features in the highest prestige layer
        setProgress(Currency.infinityPoints.value, Tesseracts.nextCost, () => i18n("other", "adProgressBar_toNextTesseract"));
      } else if (PlayerProgress.dilationUnlocked()) {
        setProgress(Currency.eternityPoints.value, DC.E4000, () => i18n("other", "adProgressBar_toReality"));
      } else if (InfinityDimension(8).isUnlocked) {
        setProgress(Currency.infinityPoints.value, Player.eternityGoal, () => i18n("other", "adProgressBar_toEternity"));
      } else if (player.break) {
        const text = InfinityDimensions.next().hasIPUnlock
          ? () => i18n("other", "adProgressBar_toNewDimensionType")
          : () => i18n("other", "adProgressBar_toNewInfinityDimension");
        const nextID = InfinityDimensions.next();
        if (nextID.ipRequirementReached) {
          setProgress(player.records.thisEternity.maxAM, nextID.amRequirement, text);
        } else {
          setProgress(player.infinityPoints, nextID.ipRequirement, text);
        }
      } else {
        setProgress(Currency.antimatter.value, new Decimal(Number.MAX_VALUE), () => i18n("other", "adProgressBar_toInfinity"));
      }
    }
  }
};
</script>

<template>
  <div class="c-progress-bar">
    <div
      :style="progressBarStyle"
      class="c-progress-bar__fill"
    >
      <span
        v-tooltip="tooltip"
        class="c-progress-bar__percents"
      >
        {{ displayPercents }}
      </span>
    </div>
  </div>
</template>
