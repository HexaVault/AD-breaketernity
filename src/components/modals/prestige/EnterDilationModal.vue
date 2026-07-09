<script>
import FullScreenAnimationHandler from "@/core/full-screen-animation-handler";

import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "EnterDilationModal",
  components: {
    ModalWrapperChoice
  },
  computed: {
    message() {
      return i18n("modal", "dilationModalInfo", [formatPow(0.75, 2, 2)]);
    },
    entranceLabel() {
      return i18n("modal", "dilationModalTitle");
    },
    EPSinceLabel() {
      if (player.dilation.lastEP.eq(-1)) {
        return i18n("modal", "dilationModalFirst");
      }
      if (!isInCelestialReality() && Ra.unlocks.unlockDilationStartingTP.canBeApplied) {
        return i18n("modal", "dilationModalTeresaReward", [formatInt(25)]);
      }
      return i18n("modal", "dilationModalLastDilation", [[x => format(x, 2, 2), player.dilation.lastEP]]);
    },
    enter() {
      return i18n("consts", "enter");
    }
  },
  methods: {
    handleYesClick() {
      if (player.dilation.active) return;
      if (player.options.animations.dilation && !FullScreenAnimationHandler.isDisplaying) {
        // Strike trigger happens within the delayed dilation callback in this function
        animateAndDilate();
      } else {
        startDilatedEternity();
        if (Pelle.isDoomed) PelleStrikes.dilation.trigger();
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
      {{ entranceLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ EPSinceLabel }}
      <br>
      <br>
      {{ message }}
    </div>
    <template #confirm-text>
      {{ enter }}
    </template>
  </ModalWrapperChoice>
</template>
