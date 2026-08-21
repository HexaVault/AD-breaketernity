<script>
import ModalWrapper from "@/components/modals/ModalWrapper";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "PelleEffectsModal",
  components: {
    PrimaryButton,
    ModalWrapper,
  },
  computed: {
    topLabel() {
      return i18n("modal", "pelleEffectsModalTitle");
    },
    nerfs() {
      return i18n("modal", "pelleEffectsModalListOfDisabled", [
        format(Number.MAX_VALUE, 2),
        formatPercents(0.5),
        formatInt(10),
        formatX(2),
        formatPercents(0),
        formatInt(1)
      ], true);
    },
    buttonLabel() {
      return i18n("consts", "okay");
    }
  }
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      {{ topLabel }}
    </template>
    <div class="pelle-effects-container">
      <p
        v-for="(nerf, idx) in nerfs"
        :key="idx"
      >
        {{ nerf }}
      </p>
    </div>
    <PrimaryButton
      class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
      @click="emitClose"
    >
      {{ buttonLabel }}
    </PrimaryButton>
  </ModalWrapper>
</template>

<style scoped>
.pelle-effects-container {
  overflow-y: scroll;
  height: 40rem;
}

p {
  margin-bottom: 1rem;
}
</style>
