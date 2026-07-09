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
    topLabel() {
      return this.isDoomed ? i18n("modal", "exitDilModalTitle_Doomed") : i18n("modal", "exitDilModalTitle");
    },
    gainText() {
      let chosenStr;
      if (this.isDoomed) chosenStr = i18n("modal", "exitDilModalDoomed", [[x => format(x, 2, 1), this.tachyonGain]]);
      else chosenStr = i18n("modal", "exitDilModalNotDoomed", [[x => format(x, 2, 1), this.tachyonGain]]);
      return chosenStr[[Number(this.tachyonGain.lte(0))]];
    },
    isInEC() {
      return Player.anyChallenge instanceof EternityChallengeState;
    },
    confirmText() {
      return i18n("consts", this.isDoomed ? "okay" : "exit");
    },
    ECtext() {
      return i18n("modal", "exitDilModalECexit");
    },
    areYouSure() {
      return i18n("modal", "exitDilModalAreYouSure");
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
      {{ topLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ gainText }}
      <div v-if="isInEC">
        {{ ECtext }}
      </div>
      <br>
      {{ areYouSure }}
    </div>
    <template #confirm-text>
      {{ confirmText }}
    </template>
  </ModalWrapperChoice>
</template>
