<script>
import { LAITELA_UPGRADE_DIRECTION } from "@/core/secret-formula";

export default {
  name: "SingularityMilestoneComponent",
  props: {
    milestone: {
      type: Object,
      required: true
    },
    suppressGlow: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    isMaxed: false,
    progressToNext: "",
    remainingSingularities: new Decimal(),
    description: "",
    effectDisplay: "",
    isUnique: false,
    nextEffectDisplay: "",
    start: new Decimal(),
    completions: new Decimal(),
    limit: 0,
    milestoneMode: false,
    singularitiesPerCondense: new Decimal(),
    baseCondenseTime: new Decimal(),
    currentCondenseTime: new Decimal(),
    autoCondenseDelay: new Decimal(),
    lastCheckedMilestones: new Decimal(),
    autoSingActive: false,
  }),
  computed: {
    // The bar is a mask that inverts colors for any element with a lower z-index (including text).
    // When maxed, the visual appearance is instead determined by a class with its own explicit width
    barStyle() {
      return {
        width: this.isMaxed ? undefined : this.progressToNext,
      };
    },
    barClass() {
      return {
        "c-laitela-milestone__progress": true,
        "c-laitela-milestone-mask": true,
        "c-laitela-milestone--completed": this.isMaxed
      };
    },
    containerClass() {
      return {
        "c-laitela-milestone": true,
        "o-laitela-milestone--glow": !this.suppressGlow &&
          this.milestone.previousGoal.gt(this.lastCheckedMilestones)
      };
    },
    upgradeDirectionIcon() {
      switch (this.milestone.config.upgradeDirection) {
        case LAITELA_UPGRADE_DIRECTION.SELF_BOOST: return `<b>ᛝ</b>`;
        case LAITELA_UPGRADE_DIRECTION.BOOSTS_MAIN: return `<i class="fas fa-arrows-alt"></i>`;
        case LAITELA_UPGRADE_DIRECTION.BOOSTS_LAITELA: return `<i class="fas fa-compress-arrows-alt"></i>`;
        default: throw new Error("Unspecified Lai'tela upgrade direction in singularity milestone");
      }
    },
    maxCompletions() {
      return this.isUnique ? 1 : this.limit;
    },
    completionsDisplay() {
      const maxStr = Number.isFinite(this.limit) ? formatInt(this.maxCompletions) : "∞";
      return `${formatInt(this.completions)}/${maxStr} ${pluralize("completion", this.completions)}`;
    },
    progressDisplay() {
      const condenseCount = this.remainingSingularities.div(this.singularitiesPerCondense);
      let thisSingularityTime, extraTime, timeText;
      switch (this.milestoneMode) {
        case SINGULARITY_MILESTONE_RESOURCE.SINGULARITIES:
          return `In ${quantify("Singularity", this.remainingSingularities, 2)}`;
        case SINGULARITY_MILESTONE_RESOURCE.CONDENSE_COUNT:
          return `Condense ${quantify("time", condenseCount, 2, 2)}`;
        case SINGULARITY_MILESTONE_RESOURCE.MANUAL_TIME:
          thisSingularityTime = Decimal.clampMin(0, this.currentCondenseTime);
          extraTime = Decimal.ceil(condenseCount.sub(1)).mul(this.baseCondenseTime);
          return `In ${TimeSpan.fromSeconds(new Decimal(thisSingularityTime.add(extraTime))).toStringShort()} (manual)`;
        case SINGULARITY_MILESTONE_RESOURCE.AUTO_TIME:
          thisSingularityTime = Decimal.clampMin(0, this.currentCondenseTime.add(this.autoCondenseDelay));
          extraTime = Decimal.ceil(condenseCount.sub(1)).mul(this.baseCondenseTime.add(this.autoCondenseDelay));
          timeText = `In ${TimeSpan.fromSeconds(new Decimal(thisSingularityTime.add(extraTime))).toStringShort()}`;
          return this.autoSingActive ? timeText : `Auto-Singularity is OFF`;
        default:
          throw new Error("Unrecognized Singularity Milestone mode");
      }
    },
    isDoomed: () => Pelle.isDoomed,
  },
  methods: {
    update() {
      this.autoSingActive = player.auto.singularity.isActive;
      this.isMaxed = this.milestone.isMaxed;
      this.progressToNext = this.milestone.progressToNext;
      this.remainingSingularities.copyFrom(this.milestone.remainingSingularities);
      this.description = this.milestone.description;
      this.effectDisplay = this.milestone.effectDisplay;
      this.isUnique = this.milestone.isUnique;
      if (!this.isUnique && !this.isMaxed) this.nextEffectDisplay = this.milestone.nextEffectDisplay;
      this.completions.copyFrom(this.milestone.completions);
      this.limit = this.milestone.limit;
      this.milestoneMode = player.celestials.laitela.singularitySorting.displayResource;
      this.singularitiesPerCondense.copyFrom(Singularity.singularitiesGained);
      this.baseCondenseTime.copyFrom(Singularity.timePerCondense);
      this.currentCondenseTime.copyFrom(Singularity.timeUntilCap);
      this.autoCondenseDelay.copyFrom(Singularity.timeDelayFromAuto);
      this.lastCheckedMilestones.copyFrom(player.celestials.laitela.lastCheckedMilestones);
      this.isMetro = Theme.current().isMetro;
    },
  }
};
</script>

<template>
  <div :class="containerClass">
    <div
      v-if="!isMetro && !isMaxed"
      class="c-laitela-milestone--bar-border-fix"
    />
    <div
      :class="barClass"
      :style="barStyle"
    />
    <span :class="{ 'o-pelle-disabled': isDoomed }">
      <b v-if="!isMaxed">
        {{ progressDisplay }}
      </b>
      <p>
        <span v-html="upgradeDirectionIcon" /> {{ description }}
      </p>
      <b>
        {{ effectDisplay }}
        <span v-if="!isUnique && !isMaxed">➜ {{ nextEffectDisplay }}</span>
      </b>
      <div class="c-laitela-milestone__completions">
        {{ completionsDisplay }}
      </div>
    </span>
  </div>
</template>

<style scoped>
.o-laitela-milestone--glow {
  font-weight: bold;
  color: var(--color-laitela--base);
  background: var(--color-laitela--accent);
  border-color: var(--color-laitela--accent);
  box-shadow: 0 0 0.5rem 0.1rem inset, 0 0 0.3rem 0;
  animation: 3s a-laitela-flash infinite;
}
</style>
