<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "HardResetModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      input: ""
    };
  },
  computed: {
    willHardReset() {
      return this.input === i18n("modal", "shrek");
    },
    hasExtraNG() {
      return player.records.fullGameCompletions > 0;
    },
    hasSpeedrun() {
      return player.speedrun.isUnlocked;
    }
  },
  destroyed() {
    if (this.willHardReset) SecretAchievement(38).unlock();
  },
  methods: {
    hardReset() {
      if (this.willHardReset) GameStorage.hardReset();
      this.input = "";
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    :show-cancel="!willHardReset"
    :show-confirm="willHardReset"
    confirm-class="o-primary-btn--width-medium c-modal__confirm-btn c-modal-hard-reset-btn"
    @confirm="hardReset"
  >
    <template #header>
      {{ i18n("modal", "hardResetHeader") }}
    </template>
    <div class="c-modal-message__text">
      {{ i18n("modal", "resetConfirmText") }}
      <span class="c-modal-hard-reset-danger">{{ i18n("modal", "resetNoSecret") }}</span>
      {{ i18n("modal", "resetTypeIn", [i18n("modal", "shrek")]) }}
      <div class="c-modal-hard-reset-danger">
        {{ i18n("modal", "resetWipe") }}
        <span v-if="hasExtraNG">
          <br>
          {{ i18n("modal", "resetRemoveNG") }}
        </span>
        <span v-if="hasSpeedrun">
          <br>
          {{ i18n("modal", "resetLoseSpeedrun") }}
        </span>
      </div>
    </div>
    <input
      ref="input"
      v-model="input"
      type="text"
      onpaste="return false;"
      class="c-modal-input c-modal-hard-reset__input"
      @keyup.esc="emitClose"
    >
    <div class="c-modal-hard-reset-info">
      <div
        v-if="willHardReset"
        class="c-modal-hard-reset-danger"
      >
        {{ i18n("modal", "resetPhraseConfirmed") }}
      </div>
      <div v-else>
        {{ i18n("modal", "resetTypeIn") }}
      </div>
    </div>
    <template #confirm-text>
      {{ i18n("modal", "hardResetHeader") }}
    </template>
  </ModalWrapperChoice>
</template>
