<script>
import { GameProgress, ProgressChecker } from "@/core/storage/progress-checker";

import CatchupGroup from "@/components/modals/catchup/CatchupGroup";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "CatchupModal",
  components: {
    CatchupGroup,
    PrimaryButton,
  },
  props: {
    diff: {
      type: Number,
      required: true
    }
  },
  computed: {
    progressStage: () => ProgressChecker.getProgressStage(player).id,
    suggestedResource() {
      return GameProgress(this.progressStage).suggestedResource;
    },
    timeString() {
      // If diff is zero, that means we opened it up via the button and don't need the text for last opening
      if (!this.diff) return null;
      const string = TimeSpan.fromMilliseconds(new Decimal(this.diff)).toString();
      return `It has been ${string} since you last loaded up the game.`;
    },
    titleText() {
      return this.diff ? i18n("modal", "catchupModalTitleA") : i18n("modal", "catchupModalTitleB");
    },
    modalDescA() {
      return i18n("modal", "catchupModalDescA").split("$1ax");
    },
    modalDescB() {
      return i18n("modal", "catchupModalDescA", [""]);
    }
  },
  methods: {
    stageName(stage) {
      return GameProgress(stage).name;
    }
  }
};
</script>

<template>
  <div class="c-modal-away-progress">
    <div class="c-modal-away-progress__header">
      {{ titleText }}
    </div>
    <div>
      {{ timeString }}
      {{ modalDescA[0] }} <i class="fas fa-question-circle" /> {{ modalDescA[1] }}
    </div>
    <div
      class="l-catchup-group-container"
      :style="{ 'height' : `${Math.clamp(3 * progressStage + 5, 15, 35)}rem` }"
    >
      <CatchupGroup
        v-for="group of progressStage"
        :key="group"
        :group="group"
        :name="stageName(group)"
      />
    </div>
    <span class="c-suggestion-text">
      {{ modalDescB }} {{ suggestedResource }}.
    </span>
    <div class="l-confirm-padding">
      <PrimaryButton
        @click="emitClose"
      >
        Confirm
      </PrimaryButton>
    </div>
  </div>
</template>

<style scoped>
.l-catchup-group-container {
  overflow-y: scroll;
  width: 100%;
  text-align: left;
  border: 0.1rem solid var(--color-text);
  border-radius: var(--var-border-radius, 0.4rem);
  margin: 1rem 0;
  padding: 1.5rem;
}

.l-confirm-padding {
  margin: 1rem;
}

.c-suggestion-text {
  font-size: 1.6rem;
  font-weight: bold;
}
</style>
