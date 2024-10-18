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
      return i18n("modal", "dilationInfo", [formatPow(0.75, 2, 2)]);
    },
    entranceLabel() {
      return i18n("modal", "dilEnterHeader");
    },
    EPSinceLabel() {
      if (player.dilation.lastEP.eq(-1)) {
        return i18n("modal", "thisFirstDilation");
      }
      if (!isInCelestialReality() && Ra.unlocks.unlockDilationStartingTP.canBeApplied) {
        return i18n("modal", "maxFeasible", [formatInt(25)]);
      }
      return i18n("modal", "lastDiltionAt", [format(player.dilation.lastEP, 2, 2)]);
    },
    enter() {
      return i18n("modal", "enter");
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
      Enter
    </template>
  </ModalWrapperChoice>
</template>
