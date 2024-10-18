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
    }
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
      {{ i18n("modal", "aboutTo") }} {{ isRestarting ? i18n("modal", "restartLowercase") :
        i18n("modal", "restartLowercase") }} {{ challengeName }}
    </template>

    <div class="c-modal-message__text">
      <span v-if="isRestarting">
        {{ i18n("modal", "restartingChall", [challengeName]) }}
      </span>
      <span v-else>
        {{ i18n("modal", "exitingChall", [challengeName]) }}
      </span>
      <span v-if="hasHigherLayers">
        {{ i18n("modal", "hasHigherLayers") }}
      </span>
    </div>
    <template #confirm-text>
      {{ isRestarting ? i18n("modal", "restart") : i18n("modal", "exit") }}
    </template>
  </ModalWrapperChoice>
</template>
