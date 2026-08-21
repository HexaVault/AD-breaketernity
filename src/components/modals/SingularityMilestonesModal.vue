<script>
import ModalWrapper from "@/components/modals/ModalWrapper";
import SingularityMilestoneComponent from "@/components/tabs/celestial-laitela/SingularityMilestoneComponent";

export default {
  name: "SingularityMilestonesModal",
  components: {
    SingularityMilestoneComponent,
    ModalWrapper,
  },
  data() {
    return {
      milestones: [],
      resourceVal: 0,
      sortVal: 0,
      completedVal: 0,
      orderVal: 0,
      milestoneGlow: false,
    };
  },
  computed: {
    topLabel() {
      return i18n("modal", "singMilestoneModalTitle");
    },
    resourceStr() {
      const states = i18n("modal", "singMilestoneModalGroupResource", [], true);
      return states[this.resourceVal];
    },
    sortStr() {
      const states = i18n("modal", "singMilestoneModalGroupSort", [], true);
      return states[this.sortVal];
    },
    completedStr() {
      const states = i18n("modal", "singMilestoneModalGroupCompleted", [], true);
      return states[this.completedVal];
    },
    orderStr() {
      const states = i18n("modal", "singMilestoneModalSortOrder", [], true);
      return states[this.orderVal];
    },
    glowSettingText() {
      return i18n("modal", "singMilestoneModalGlow");
    },
    resourceSettingText() {
      return i18n("modal", "singMilestoneModalToMilestoneInfo");
    },
    sortSettingText() {
      return i18n("modal", "singMilestoneModalSortBy");
    },
    completedSettingText() {
      return i18n("modal", "singMilestoneModalCompletedPlacement");
    },
    orderSettingText() {
      return i18n("modal", "singMilestoneModalSortingOrder");
    }
  },
  watch: {
    resourceVal(newValue) {
      player.celestials.laitela.singularitySorting.displayResource = newValue;
    },
    sortVal(newValue) {
      player.celestials.laitela.singularitySorting.sortResource = newValue;
    },
    completedVal(newValue) {
      player.celestials.laitela.singularitySorting.showCompleted = newValue;
    },
    orderVal(newValue) {
      player.celestials.laitela.singularitySorting.sortOrder = newValue;
    },
    milestoneGlow(newValue) {
      player.celestials.laitela.milestoneGlow = newValue;
    },
  },
  beforeDestroy() {
    player.celestials.laitela.lastCheckedMilestones = Currency.singularities.value;
  },
  methods: {
    update() {
      this.milestones = SingularityMilestones.sortedForCompletions(true);
      const settings = player.celestials.laitela.singularitySorting;
      this.resourceVal = settings.displayResource;
      this.sortVal = settings.sortResource;
      this.completedVal = settings.showCompleted;
      this.orderVal = settings.sortOrder;
      this.milestoneGlow = player.celestials.laitela.milestoneGlow;
    },
    cycleButton(id) {
      const settings = player.celestials.laitela.singularitySorting;
      let stateCount;
      switch (id) {
        case 0:
          stateCount = Object.keys(SINGULARITY_MILESTONE_RESOURCE).length;
          settings.displayResource = (settings.displayResource + 1) % stateCount;
          break;
        case 1:
          stateCount = Object.keys(SINGULARITY_MILESTONE_SORT).length;
          settings.sortResource = (settings.sortResource + 1) % stateCount;
          break;
        case 2:
          stateCount = Object.keys(COMPLETED_MILESTONES).length;
          settings.showCompleted = (settings.showCompleted + 1) % stateCount;
          break;
        case 3:
          stateCount = Object.keys(SORT_ORDER).length;
          settings.sortOrder = (settings.sortOrder + 1) % stateCount;
          break;
        default:
          throw new Error("Unrecognized Singularity milestone sorting button");
      }
    },
    glowOptionClass() {
      return {
        "c-modal__confirmation-toggle__checkbox": true,
        "c-modal__confirmation-toggle__checkbox--active": this.milestoneGlow
      };
    },
    toggleGlow() {
      this.milestoneGlow = !this.milestoneGlow;
    }
  },
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      {{ topLabel }}
    </template>
    <div
      class="c-modal__confirmation-toggle"
      @click="toggleGlow"
    >
      <div :class="glowOptionClass()">
        <span
          v-if="milestoneGlow"
          class="fas fa-check"
        />
      </div>
      <span class="c-modal__confirmation-toggle__text">
        {{ glowSettingText }}
      </span>
    </div>
    <div class="l-singularity-milestone-modal-container-outer">
      <div class="l-singularity-milestone-modal-container-inner">
        <SingularityMilestoneComponent
          v-for="milestone in milestones"
          :key="milestone.id"
          :milestone="milestone"
        />
      </div>
    </div>
    <div class="l-singularity-milestone-sort-container">
      <button
        class="c-singularity-milestone-modal-sort-button"
        @click="cycleButton(0)"
      >
        {{ resourceSettingText }}
        <br>
        {{ resourceStr }}
      </button>
      <button
        class="c-singularity-milestone-modal-sort-button"
        @click="cycleButton(1)"
      >
        {{ sortSettingText }}
        <br>
        {{ sortStr }}
      </button>
      <button
        class="c-singularity-milestone-modal-sort-button"
        @click="cycleButton(2)"
      >
        {{ completedSettingText }}
        <br>
        {{ completedStr }}
      </button>
      <button
        class="c-singularity-milestone-modal-sort-button"
        @click="cycleButton(3)"
      >
        {{ orderSettingText }}
        <br>
        {{ orderStr }}
      </button>
    </div>
  </ModalWrapper>
</template>
