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
    topLabel() {
      return i18n("modal", "hardResetModalTitle");
    },
    willHardReset() {
      return this.input === i18n("modal", "hardResetModalResetString");
    },
    hasExtraNG() {
      return player.records.fullGameCompletions > 0;
    },
    hasSpeedrun() {
      return player.speedrun.isUnlocked;
    },
    willLoseNGText() {
      return i18n("modal", "hardResetModalRemovesCosmetics");
    },
    willLoseSpeedrunText() {
      return i18n("modal", "hardResetModalLoseSpeedrun");
    },
    confirmDesire() {
      return i18n("modal", "hardResetModalConfirm");
    },
    noSecrets() {
      return i18n("modal", "hardResetModalNoSecret");
    },
    typeIn() {
      return i18n("modal", "hardResetModalTypeInString", [i18n("modal", "hardResetModalResetString")]);
    },
    phraseNote() {
      return this.willHardReset ? i18n("modal", "hardResetModalConfirmedPhrase") : i18n("modal", "hardResetModalTypeIn");
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
      {{ topLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ confirmDesire }}
      <span class="c-modal-hard-reset-danger">{{ i18n("modal", "resetNoSecret") }}</span>
      {{ typeIn }}
      <div class="c-modal-hard-reset-danger">
        {{ noSecrets }}
        <span v-if="hasExtraNG">
          <br>
          {{ willLoseNGText }}
        </span>
        <span v-if="hasSpeedrun">
          <br>
          {{ willLoseSpeedrunText }}
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
      {{ phraseNote }}
    </div>
    <template #confirm-text>
      {{ topLabel }}
    </template>
  </ModalWrapperChoice>
</template>
