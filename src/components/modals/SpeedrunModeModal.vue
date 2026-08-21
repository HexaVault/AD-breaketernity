<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "SpeedrunModeModal",
  components: {
    PrimaryButton,
    ModalWrapperChoice,
  },
  data() {
    return {
      onInfoPage: true,
      name: "",
      confirmPhrase: "",
    };
  },
  computed: {
    willStartRun() {
      return this.confirmPhrase === i18n("modal", "speedunModalConfirmationPhrase");
    },
    topLabel() {
      return i18n("modal", "speedrunModalTitle");
    },
    textA() {
      return i18n("modal", "speedrunModalTextA");
    },
    textB() {
      return i18n("modal", "speedrunModalTextB");
    },
    textC() {
      return i18n("modal", "speedrunModalTextC");
    },
    textD() {
      return i18n("modal", "speedrunModalTextD");
    },
    textE() {
      return i18n("modal", "speedrunModalTextE");
    },
    textF() {
      return i18n("modal", "speedrunModalTextF");
    },
    textG() {
      return i18n("modal", "speedrunModalTextG", [i18n("modal", "speedrunModalConfirmationPhrase")]);
    },
    buttonALabel() {
      return i18n("consts", "continue");
    },
    buttonBLabel() {
      return i18n("modal", "speedrunModalStartRun");
    },
    buttonCLabel() {
      return i18n("consts", "cancel");
    }
  },
  methods: {
    nextPage() {
      this.onInfoPage = false;
    },
    startRun() {
      if (!this.willStartRun) return;
      this.emitClose();
      Speedrun.prepareSave(Speedrun.generateName(this.name));
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    :show-cancel="!onInfoPage && !willStartRun"
    :show-confirm="!onInfoPage && willStartRun"
    confirm-class="o-primary-btn--width-medium c-modal-hard-reset-btn c-modal__confirm-btn"
    @confirm="startRun"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div
      v-if="onInfoPage"
      class="c-modal-message__text"
    >
      {{ TextA }}
      <br>
      <br>
      {{ TextB }}
      <br>
      <br>
      <i>
        {{ TextC }}
      </i>
      <br>
      <br>
      <PrimaryButton
        class="o-primary-btn--width-medium c-modal-hard-reset-btn c-modal__confirm-btn"
        @click="nextPage"
      >
        {{ buttonALabel }}
      </PrimaryButton>
    </div>
    <div
      v-else
      class="c-modal-message__text"
    >
      {{ TextD }}
      <input
        ref="name"
        v-model="name"
        type="text"
        class="c-modal-input c-modal-hard-reset__input"
        @keyup.esc="emitClose"
      >
      <br>
      <br>
      {{ TextE }}
      <br>
      <br>
      {{ TextF }}
      <br>
      <br>
      <div class="c-modal-hard-reset-danger">
        {{ TextG }}
      </div>
      <input
        ref="confirmPhrase"
        v-model="confirmPhrase"
        type="text"
        class="c-modal-input c-modal-hard-reset__input"
        @keyup.esc="emitClose"
      >
    </div>
    <template #confirm>
      {{ buttonBLabel }}
    </template>
    <template #cancel>
      {{ buttonCLabel }}
    </template>
  </ModalWrapperChoice>
</template>
