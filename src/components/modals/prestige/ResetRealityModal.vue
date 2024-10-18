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
    resetTerm() { return i18n("modal", this.isDoomed ? "arma" : "real"); },
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
      {{ i18n("modal", "aboutToReset", [resetTerm]) }}
    </template>
    <div class="c-modal-message__text">
      {{ i18n("modal", "aboutToResetMessage", [resetTerm]) }}
      <br>
      <br>
      {{ i18n("modal", "areYouSure") }}
      <div
        v-if="canReality"
        class="c-has-rewards"
      >
        <br>
        {{ i18n("modal", "canNormalReal") }}
      </div>
      <br>
    </div>
    <template #confirm-text>
      Reset
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
