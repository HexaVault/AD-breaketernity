<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "UiChoiceModal",
  components: {
    ModalWrapperChoice
  },
  computed: {
    listEntries() {
      return i18n("modal", "UIChoiceModalEntries", [], true);
    },
    topLabel() {
      return i18n("modal", "UIChoiceModalTitle");
    },
    oldSaveLoaded() {
      return i18n("modal", "UIChoiceModalOldSaveLoad");
    },
    changeAnytime() {
      return i18n("modal", "UIChoiceModalChangeAnytime");
    },
    buttonLabelA() {
      return i18n("consts", "remain");
    },
    buttonLabelB() {
      return i18n("consts", "swap");
    }
  },
  methods: {
    handleYesClick() {
      GameOptions.toggleUI();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="handleYesClick">
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ oldSaveLoaded }}
      <br>
      <br>
      <div class="c-visual-change-list">
        <div
          v-for="(entry, i) in listEntries"
          :key="i"
          class="c-visual-change-list-entry"
        >
          <b>&bull;</b>
          {{ entry }}
        </div>
      </div>
      <br>
      <br>
      {{ changeAnytime }}
    </div>
    <template #cancel-text>
      {{ buttonLabelA }}
    </template>
    <template #confirm-text>
      {{ buttonLabelB }}
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.c-visual-change-list {
  display: inline-block;
  max-width: 45rem;
  text-align: left;
}

.c-visual-change-list-entry {
  display: flex;
  margin-bottom: 0.5rem;
  gap: 1rem;
}
</style>
