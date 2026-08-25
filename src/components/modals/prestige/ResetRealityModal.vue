<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ResetRealityModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      isDoomed: false,
      canReality: false,
    };
  },
  computed: {
    topLabel() {
      return i18n("modal", "resetRealityModalTitles", [], true)[Number(this.isDoomed)];
    },
    informationNote() {
      return i18n("modal", "resetRealityModalWillReset", [], true)[Number(this.isDoomed)];
    },
    areYouSure() {
      return i18n("modal", "resetRealityModalAreYouSure");
    },
    canRealityNote() {
      return i18n("modal", "resetRealityModalCanReality");
    },
    resetButtonLabel() {
      return i18n("consts", "reset");
    },
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.canReality = isRealityAvailable();
    },
    handleYesClick() {
      beginProcessReality(getRealityProps(true));
      EventHub.ui.offAll(this);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="resetReality"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ informationNote }}
      <br>
      <br>
      {{ areYouSure }}
      <div
        v-if="canReality"
        class="c-has-rewards"
      >
        <br>
        {{ canRealityNote }}
      </div>
      <br>
    </div>
    <template #confirm-text>
      {{ resetButtonLabel }}
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.c-has-rewards {
  font-weight: bold;
  font-size: 1.5rem;
  color: var(--color-bad);
}
</style>
