import { DC } from "../../constants";

import { GameMechanicState } from "../../game-mechanics";

import { deepmergeAll } from "@/utility/deepmerge";

class SingularityMilestoneState extends GameMechanicState {
  constructor(config) {
    const effect = config.effect;
    const configCopy = deepmergeAll([{}, config]);
    configCopy.effect = () => effect(this.completions);
    super(configCopy);
    this._rawEffect = effect;
  }

  get start() {
    return this.config.start;
  }

  get repeat() {
    return this.config.repeat;
  }

  get limit() {
    return this.config.limit;
  }

  get isUnique() {
    return this.repeat === 0;
  }

  get isUnlocked() {
    return Currency.singularities.gte(this.start);
  }

  get increaseThreshold() {
    return this.config.increaseThreshold;
  }

  nerfCompletions(completions) {
    const softcap = this.increaseThreshold;
    if (!softcap || (completions.lt(softcap))) return completions;
    return (completions.sub(softcap)).div(3).add(softcap);
  }

  unnerfCompletions(completions) {
    const softcap = this.increaseThreshold;
    if (!softcap || (completions.lt(softcap))) return completions;
    return (completions.sub(softcap)).times(3).add(softcap);
  }

  get previousGoal() {
    if (this.isUnique) return DC.D1;
    if (!this.isUnlocked) return DC.D0;
    return Decimal.pow(this.repeat, this.unnerfCompletions(this.completions).sub(1)).times(this.start);
  }

  get nextGoal() {
    if (this.isUnique) return new Decimal(this.start);
    return Decimal.pow(this.repeat, this.unnerfCompletions(this.completions.add(1)).sub(1)).times(this.start);
  }

  get rawCompletions() {
    if (this.isUnique) return this.isUnlocked ? DC.D1 : DC.D0;
    if (!this.isUnlocked) return DC.D0;
    return (Decimal.log10(Currency.singularities.value).sub(Decimal.log10(this.start)))
      .div(Decimal.log10(this.repeat)).add(1);
  }

  get completions() {
    return Decimal.min(Decimal.floor(this.nerfCompletions(this.rawCompletions)), this.limit);
  }

  get remainingSingularities() {
    return this.nextGoal.sub(Currency.singularities.value);
  }

  get progressToNext() {
    const prog = Currency.singularities.value.minus(this.previousGoal).div(this.nextGoal);
    return formatPercents(Decimal.clampMax(prog, 1));
  }

  get isMaxed() {
    return (this.isUnique && this.isUnlocked) || (this.completions.gte(this.limit));
  }

  get effectDisplay() {
    if (Decimal.isFinite(this.effectValue)) return this.config.effectFormat(this.effectValue);
    return "N/A";
  }

  get nextEffectDisplay() {
    return this.config.effectFormat(this._rawEffect(this.completions.add(1)));
  }

  get description() {
    return this.config.description;
  }

  get canBeApplied() {
    return this.isUnlocked && !Pelle.isDisabled("singularity");
  }
}

export const SingularityMilestone = mapGameDataToObject(
  GameDatabase.celestials.singularityMilestones,
  config => new SingularityMilestoneState(config)
);

export const SingularityMilestones = {
  all: SingularityMilestone.all,
  lastNotified: player.celestials.laitela.lastCheckedMilestones,

  get sorted() {
    return this.all.sort((a, b) => Decimal.compare(a.remainingSingularities, b.remainingSingularities));
  },

  sortedForCompletions(moveNewToTop) {
    const options = player.celestials.laitela.singularitySorting;

    // Sorting functions for singularity milestones, values are generally around 0 to 2ish. Should generally attempt
    // to return unique values for all milestones for the sake of stable sorting
    let sortFn;
    switch (options.sortResource) {
      case SINGULARITY_MILESTONE_SORT.SINGULARITIES_TO_NEXT:
        sortFn = m => {
          // If it's maxed, we order based on the final goal value - higher goals are sorted later
          if (m.isMaxed) return Decimal.log10(m.isUnique ? m.nextGoal : m.previousGoal).add(1);
          return Decimal.log10(m.remainingSingularities).div(100);
        };
        break;
      case SINGULARITY_MILESTONE_SORT.CURRENT_COMPLETIONS:
        // Also counts partial completion on the current step
        sortFn = m => {
          // For never-completed repeatable milestones, this is zero and will cause NaN bugs if we don't set it to 1
          const prev = Decimal.clampMin(m.previousGoal, 1);
          // eslint-disable-next-line max-len
          const part = Decimal.clamp(Currency.singularities.value.div(prev).max(1).log10().div(m.nextGoal.div(prev).max(1).log10()), 0, 1);
          return (m.completions.add(part)).div(20);
        };
        break;
      case SINGULARITY_MILESTONE_SORT.PERCENT_COMPLETIONS:
        // Orders infinite milestones based on completion count, putting them after all limited ones even if
        // they're completed
        sortFn = m => {
          const limit = Number.isFinite(m.limit) ? m.limit : 100;
          const currComp = Currency.singularities.value.div(m.previousGoal).max(1).log10().div(
            Decimal.log10(m.nextGoal.div(m.previousGoal)));
          return Decimal.clampMax(currComp.add(m.completions).div(limit), 1).add(Number.isFinite(m.limit) ? 0 : 1);
        };
        break;
      case SINGULARITY_MILESTONE_SORT.FINAL_COMPLETION:
        // Sorts infinite milestones as if they end at 50 steps; for any given number of completions, this
        // treats infinite milestones with larger steps as if they complete at a higher value
        sortFn = m => {
          const limit = Number.isFinite(m.limit) ? m.limit : 50;
          return Decimal.mul(m.config.start, Decimal.pow(m.config.repeat, limit - 1)).max(1).log10().div(100);
        };
        break;
      case SINGULARITY_MILESTONE_SORT.MOST_RECENT:
        sortFn = m => {
          if (!m.isUnlocked) return Decimal.log10(m.start).div(1000).add(1);
          // For unique milestones, previousGoal is actually 1 and nextGoal contains the completion amount
          return Decimal.log10(m.isUnique ? m.nextGoal : m.previousGoal).div(100);
        };
        break;
      default:
        throw new Error("Unrecognized Singularity Milestone sorting option (order)");
    }

    // Shift the fully completed milestones to the front or back with a constant offset which should be larger
    // than the value that the sort function should ever evaluate to
    let completedVal;
    switch (options.showCompleted) {
      case COMPLETED_MILESTONES.FIRST:
        completedVal = 10;
        break;
      case COMPLETED_MILESTONES.LAST:
        completedVal = -10;
        break;
      case COMPLETED_MILESTONES.IGNORED:
        completedVal = 0;
        break;
      default:
        throw new Error("Unrecognized Singularity Milestone sorting option (completed milestones)");
    }

    // Compose the functions together; possibly reverse the final order and bring new milestones to the top
    const isNew = m => ((m.previousGoal.gt(player.celestials.laitela.lastCheckedMilestones) && moveNewToTop) ? 20 : 0);
    // eslint-disable-next-line max-len
    const compFn = m => Decimal.add(options.sortOrder ? sortFn(m) : sortFn(m).neg(), isNew(m) + (m.isMaxed ? completedVal : 0));
    return this.sorted.sort((a, b) => Decimal.compare(compFn(a), compFn(b)));
  },

  get nextMilestoneGroup() {
    return this.sortedForCompletions(false).filter(m => !m.isMaxed).slice(0, 6);
  },

  get unseenMilestones() {
    const laitela = player.celestials.laitela;
    return SingularityMilestoneThresholds
      .filter(s => laitela.lastCheckedMilestones.lt(s) && Currency.singularities.gte(s));
  },

  // This code is stupid and forces us to do this bs
  dumbgt(x, y) {
    return new Decimal(x).gt(new Decimal(y));
  },


  get unnotifiedMilestones() {
    // eslint-disable-next-line max-len
    return SingularityMilestoneThresholds.filter(s => this.dumbgt(s, this.lastNotified) && Currency.singularities.gte(s));
  }
};

// Sorted list of all the values where a singularity milestone exists, used for "new milestone" styling
const SingularityMilestoneThresholds = (function() {
  return SingularityMilestones.all
    .map(m => Array.range(0, Math.min(50, m.limit))
      .filter(r => !m.increaseThreshold || r <= m.increaseThreshold ||
        (r > m.increaseThreshold && ((r - m.increaseThreshold) % 3) === 2))
      .map(r => m.start * Math.pow(m.repeat, r)))
    .flat(Infinity)
    .filter(n => n < 1e100)
    .sort((a, b) => a - b);
}());

export const Singularity = {
  get cap() {
    return Decimal.pow10(player.celestials.laitela.singularityCapIncreases).mul(200);
  },

  get gainPerCapIncrease() {
    return SingularityMilestone.improvedSingularityCap.effectOrDefault(new Decimal(11));
  },

  get singularitiesGained() {
    return Decimal.floor(Decimal.pow(this.gainPerCapIncrease, player.celestials.laitela.singularityCapIncreases)
      .mul(SingularityMilestone.singularityMult.effectOrDefault(DC.D1))
      .mul(ImaginaryUpgrade(10).effectOrDefault(DC.D0).add(1)));
  },

  // Time (in seconds) to go from 0 DE to the condensing requirement
  get timePerCondense() {
    return this.cap.div(Currency.darkEnergy.productionPerSecond);
  },

  // Time (in seconds) to reach the condensing requirement from *current* DE
  get timeUntilCap() {
    return this.cap.minus(Currency.darkEnergy.value).div(Currency.darkEnergy.productionPerSecond);
  },

  // Total additional time auto-condense will wait after reaching the condensing requirement
  get timeDelayFromAuto() {
    return this.timePerCondense.times(SingularityMilestone.autoCondense.effectOrDefault(Infinity) - 1);
  },

  get capIsReached() {
    return Currency.darkEnergy.gte(this.cap);
  },

  increaseCap() {
    if (player.celestials.laitela.singularityCapIncreases.gt(5e11)) {
      player.celestial.laitela.singularityCapIncreases
        .add(Decimal.pow10(player.celestial.laitela.singularityCapIncreases.log(10).sub(10).floor()));
    }
    player.celestials.laitela.singularityCapIncreases = player.celestials.laitela.singularityCapIncreases.add(1);
  },

  decreaseCap() {
    if (player.celestials.laitela.singularityCapIncreases.eq(0)) return;
    if (player.celestials.laitela.singularityCapIncreases.gt(5e11)) {
      player.celestial.laitela.singularityCapIncreases
        .sub(Decimal.pow10(player.celestial.laitela.singularityCapIncreases.log(10).sub(10).floor()));
    }
    player.celestials.laitela.singularityCapIncreases = player.celestials.laitela.singularityCapIncreases.sub(1);
  },

  perform() {
    if (!this.capIsReached || Pelle.isDoomed) return;

    EventHub.dispatch(GAME_EVENT.SINGULARITY_RESET_BEFORE);

    Currency.darkEnergy.reset();
    Currency.singularities.add(this.singularitiesGained);

    for (const quote of Laitela.quotes.all) {
      if (quote.requirement) {
        quote.show();
      }
    }

    EventHub.dispatch(GAME_EVENT.SINGULARITY_RESET_AFTER);
  }
};

EventHub.logic.on(GAME_EVENT.GAME_LOAD, () => SingularityMilestones.lastNotified = Currency.singularities.value);

EventHub.logic.on(GAME_EVENT.SINGULARITY_RESET_AFTER, () => {
  const newMilestones = SingularityMilestones.unnotifiedMilestones.length;
  if (newMilestones === 0) return;
  if (newMilestones === 1) GameUI.notify.blackHole(`You reached a Singularity milestone!`);
  else if (newMilestones > 100) GameUI.notify.blackHole(`You reached over 100 Singularity milestones!`);
  else GameUI.notify.blackHole(`You reached ${formatInt(newMilestones)} Singularity milestones!`);
  SingularityMilestones.lastNotified = Currency.singularities.value;
});
