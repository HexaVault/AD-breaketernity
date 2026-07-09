<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ExitChallengeModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    challengeName: {
      type: String,
      required: true,
    },
    normalName: {
      type: String,
      required: true,
    },
    hasHigherLayers: {
      type: Boolean,
      required: true,
    },
    exitFn: {
      type: Function,
      required: true,
    }
  },
  computed: {
    isCelestial() {
      return this.challengeName.match(i18n("modal", "real"));
    },
    isRestarting() {
      return this.isCelestial ? player.options.retryCelestial : player.options.retryChallenge;
    },
    topLabel() {
      return i18n("modal", "exitChallengeModalTitle", [this.challengeName], true)[Number(this.isRestarting)];
    },
    restartText() {
      return i18n("modal", "exitChallengeModalRestart", [challengeName]);
    },
    exitText() {
      return i18n("modal", "exitChallengeModalExit", [challengeName]);
    },
    higherLayerNote() {
      return i18n("modal", "exitChallengeModalHigherLayer");
    },
    confirmText() {
      return this.isRestarting ? i18n("consts", "restart") : i18n("consts", "exit");
    },
  },
  methods: {
    handleYesClick() {
      this.exitFn();
      EventHub.ui.offAll(this);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="exitChallenge"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>

    <div class="c-modal-message__text">
      <span v-if="isRestarting">
        {{ restartText }}
      </span>
      <span v-else>
        {{ exitText }}
      </span>
      <span v-if="hasHigherLayers">
        {{ higherLayerNote }}
      </span>
    </div>
    <template #confirm-text>
      {{ confirmText }}
    </template>
  </ModalWrapperChoice>
</template>
