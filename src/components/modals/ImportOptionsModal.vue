<!-- eslint-disable no-useless-return -->
<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ImportOptionsModal",
  components: {
    ModalWrapperChoice,
    PrimaryButton
  },
  data() {
    return {
      input: "",
    };
  },
  computed: {
    saveCheckString() {
      const save = GameSaveSerializer.deserialize(this.input, "settings");
      // eslint-disable-next-line no-console
      console.log(save);
      function checkOptionsObject(data) {
        const failStrings = i18n("modal", "importOptionsModalFailStrings", [], true);
        if (data === undefined) return failStrings[7];
        // Check for save file name, UI, theme, notation, large notation and language.
        if (!(data.saveFileName) && data.saveFileName !== "") return failStrings[1];
        if (!data.notation) return failStrings[2];
        if (!data.lnotation) return failStrings[3];
        if (!data.themeModern || !data.themeClassic) return failStrings[4];
        if (!data.newUI) return failStrings[5];
        if (!data.language) return failStrings[6];
        return "";
      }
      const rawString = checkOptionsObject(save);
      // Keep the length bounded; we don't want the modal to be too big for the screen for particularly bad errors
      return rawString.length > 300 ? `${rawString.slice(0, 297)}...` : rawString;
    },
    settingData() {
      return this.saveCheckString === "" ? GameSaveSerializer.deserialize(this.input, "settings") : undefined;
    },
    fileName() {
      return this.setting.saveFileName;
    },
    notation() {
      return this.setting.notation;
    },
    largeNotation() {
      return this.setting.lnotation;
    },
    theme() {
      return this.setting.newUI ? this.setting.themeModern : this.setting.themeClassic;
    },
    ui() {
      return this.setting.newUI ? "Modern" : "Classic";
    },
    language() {
      return Lang[this.setting.language].nameInEN;
    },
    languageTranslated() {
      return Lang[this.setting.language].nameInLang;
    },
    hasInput() {
      return this.input !== "";
    },
    inputIsValid() {
      return this.settingData !== undefined;
    },
    isDevEnv() {
      return DEV;
    },
    fileText() {
      return i18n("modal", "importOptionsModalFilename", [this.fileName]);
    },
    themeText() {
      return i18n("modal", "importOptionsModalTheme", [this.theme]);
    },
    uiText() {
      return i18n("modal", "importOptionsModalUI", [this.ui]);
    },
    notationText() {
      return i18n("modal", "importOptionsModalNotation", [this.notation]);
    },
    lnotationText() {
      return i18n("modal", "importOptionsModalLNotation", [this.lnotation]);
    },
    languageText() {
      return i18n("modal", "importOptionsModalLanguage", [this.language, this.languageTranslated]);
    },
    overrideWarning() {
      return i18n("modal", "importOptionsModalOverride");
    },
    invalidString() {
      return i18n("modal", "importOptionsModalInvalidSettings");
    },
    topLabel() {
      return i18n("modal", "importOptionsModalTitle");
    },
    buttonLabel() {
      return i18n("modal", "import");
    }
  },
  mounted() {
    this.$refs.input.select();
  },
  destroyed() {
    // Explicitly setting this to undefined after closing forces the game to fall-back to the stored settings within
    // the player object if this modal is closed - ie. it makes sure actions in the modal don't persist
    GameStorage.offlineEnabled = undefined;
    GameStorage.offlineTicks = undefined;
  },
  methods: {
    importSave() {
      if (!this.inputIsValid) return;
      this.emitClose();
      player.settings = GameSaveSerializer.deserialize(this.input, "settings");
    },
    update() {
      // eslint-disable-next-line no-console
      console.log(this.inputIsValid);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    :show-cancel="!inputIsValid"
    :show-confirm="false"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <input
      ref="input"
      v-model="input"
      type="text"
      class="c-modal-input c-modal-import__input"
      @keyup.enter="importSave"
      @keyup.esc="emitClose"
    >
    <div class="c-modal-import__save-info">
      <div v-if="inputIsValid">
        hi
        <div v-if="fileName">
          {{ fileText }}
        </div>
        <div>
          {{ uiText }}
        </div>
        <div>
          {{ themeText }}
        </div>
        <div>
          {{ notationText }}
        </div>
        <div>
          {{ lnotationText }}
        </div>
        <div>
          {{ languageText }}
        </div>
        <div class="c-modal-import__warning">
          {{ overrideWarning }}
        </div>
        <br>
      </div>
      <div v-else-if="hasInput">
        {{ invalidString }}
        <br>
        {{ saveCheckString }}
      </div>
    </div>

    <PrimaryButton
      v-if="inputIsValid"
      class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
      @click="importSave"
    >
      {{ buttonLabel }}
    </PrimaryButton>
  </ModalWrapperChoice>
</template>