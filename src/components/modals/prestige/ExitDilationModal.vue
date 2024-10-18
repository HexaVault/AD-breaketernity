<script>
import FullScreenAnimationHandler from "@/core/full-screen-animation-handler";

import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ExitDilationModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      tachyonGain: new Decimal(0),
      isDoomed: false
    };
  },
  computed: {
    gainText() {
      if (this.tachyonGain.lte(0)) return i18n("modal", "noGain");
      return i18n("modal", "dilGain", [quantify(i18n("modal", "tp"), this.tachyonGain, 2, 1)]);
    },
    isInEC() {
      return Player.anyChallenge instanceof EternityChallengeState;
    },
    confirmText() {
      return i18n("modal", this.isDoomed ? "okay" : "exit");
    }
  },
  methods: {
    update() {
      // We force-close the modal if dilation is inactive because there are a few edge cases which allow it to be
      // opened while switching between dilated/regular. The only thing this results in is an incorrect TP gain value
      if (!player.dilation.active) this.emitClose();
      this.tachyonGain.copyFrom(getTachyonGain(true));
      this.isDoomed = Pelle.isDoomed;
    },
    handleYesClick() {
      if (!player.dilation.active) return;
      const playAnimation = player.options.animations.dilation && !FullScreenAnimationHandler.isDisplaying;
      if (playAnimation) {
        animateAndUndilate();
      } else {
        eternity(false, false, { switchingDilation: true });
      }
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="dilation"
    @confirm="handleYesClick"
  >
    <template #header>
      <span v-if="isDoomed">
        {{ i18n("modal", "noDoomExit") }}
      </span>
      <span v-else>
        {{ i18n("modal", "aboutToExitDilation") }}
      </span>
    </template>
    <div class="c-modal-message__text">
      <span v-if="isDoomed">
        {{ i18n("modal", "doomedInfo", [gainText]) }}
      </span>
      <span v-else>
        {{ i18n("modal", "notDoomedInfo", [gainText]) }}
      </span>
      <div v-if="isInEC">
        {{ i18n("modal", "ECandDilation") }}
      </div>
      <br>
      {{ i18n("modal", "areYouSureProceed") }}
    </div>
    <template #confirm-text>
      {{ confirmText }}
    </template>
  </ModalWrapperChoice>
</template>
