<script>
import ModalWrapper from "../ModalWrapper";
import PrimaryButton from "../../PrimaryButton";

import SwitchLanguageEntry from "./SwitchLanguageEntry";

export default {
  name: "SwitchLanguageModal",
  components: {
    ModalWrapper,
    SwitchLanguageEntry,
    PrimaryButton,
  },
  data() {
    return {};
  },
  computed: {
    languages: () => {
      const languages = Lang.all;
      delete languages.form;
      return languages;
    },
    langChange: () => i18n("options", "langChange"),
    showLangIn() {
      return i18n("options", "showLang", [], true)[player.options.englishLangNames ? 0 : 1]
    }
  },
  methods: {
    setLanguage(language) {
      player.options.language = language;
    },
    id(row, column) {
      return this.languages[(row - 1) * 3 + column - 1];
    },
    toggleLangIn() {
      player.options.englishLangNames = !player.options.englishLangNames;
      this.$recompute("showLangIn");
    },
  },
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      {{ langChange }}
      <div>
        <PrimaryButton
          @click="toggleLangIn"
        >
          {{ showLangIn }}
        </PrimaryButton>
      </div>
    </template>
    <div class="c-modal-message__text">
      <div class="c-language-list">
        <div
          v-for="row in Math.ceil(languages.length / 3)"
          :key="row"
          class="c-language-list-row"
        >
          <SwitchLanguageEntry
            v-for="column in Math.min(languages.length - (row - 1) * 3, 3)"
            :key="id(row, column).shortName"
            :lang="id(row, column).shortName"
          />
        </div>
      </div>
    </div>
  </ModalWrapper>
</template>

<style scoped>
.c-modal-message__text {
  max-height: 50rem;
  overflow-y: scroll;
}

.c-language-list {
  display: flex;
  max-width: 45rem;
  flex-direction: column;
}

.c-language-list-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 45rem;
}
</style>
