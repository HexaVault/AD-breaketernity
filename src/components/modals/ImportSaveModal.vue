<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";
import PrimaryButton from "@/components/PrimaryButton";

const OFFLINE_PROGRESS_TYPE = {
  IMPORTED: 0,
  LOCAL: 1,
  IGNORED: 2,
};

export default {
  name: "ImportSaveModal",
  components: {
    ModalWrapperChoice,
    PrimaryButton
  },
  data() {
    return {
      input: "",
      offlineImport: OFFLINE_PROGRESS_TYPE.IMPORTED,
    };
  },
  computed: {
    saveCheckString() {
      const save = GameSaveSerializer.deserialize(this.input);
      const rawString = GameStorage.checkPlayerObject(save);
      // Keep the length bounded; we don't want the modal to be too big for the screen for particularly bad errors
      return rawString.length > 300 ? `${rawString.slice(0, 297)}...` : rawString;
    },
    player() {
      return this.saveCheckString === "" ? GameSaveSerializer.deserialize(this.input) : undefined;
    },
    progress() {
      return PlayerProgress.of(this.player);
    },
    fileName() {
      return this.player.options.saveFileName;
    },
    antimatter() {
      return this.player.antimatter;
    },
    infinities() {
      return this.player.infinities;
    },
    hasInput() {
      return this.input !== "";
    },
    inputIsValid() {
      return this.inputIsValidSave || this.inputIsSecret;
    },
    inputIsValidSave() {
      return this.player !== undefined;
    },
    inputIsSecret() {
      return isSecretImport(this.input) || Theme.isSecretTheme(this.input);
    },
    isFromFuture() {
      return this.player.lastUpdate > Date.now();
    },
    lastOpened() {
      const ms = Date.now() - this.player.lastUpdate;
      const formatms = TimeSpan.fromMilliseconds(Decimal.abs(ms)).toString();
      return this.isFromFuture
        ? i18n("modal", "importSaveModalFromFuture", [formatms])
        : i18n("modal", "importSaveModalFromPast", [formatms]);
    },
    offlineType() {
      // We update here in the computed method instead of elsewhere because otherwise it initializes the text
      // to a wrong or undefined setting
      this.updateOfflineSettings();

      switch (this.offlineImport) {
        case OFFLINE_PROGRESS_TYPE.IMPORTED:
          return i18n("modal", "importSaveModalImportedSaveSettings");
        case OFFLINE_PROGRESS_TYPE.LOCAL:
          return i18n("modal", "importSaveModalExistingSaveSettings");
        case OFFLINE_PROGRESS_TYPE.IGNORED:
          return i18n("modal", "importSaveModalNoOffline");
        default:
          throw new Error(i18n("modal", "importSaveModalOfflineSettingError"));
      }
    },
    offlineDetails() {
      if (this.offlineImport === OFFLINE_PROGRESS_TYPE.IGNORED) return i18n("modal", "importSaveModalImportNoOffline");
      if (!GameStorage.offlineEnabled) return i18n("modal", "importSaveModalImportWontOffline");
      if (this.isFromFuture) return i18n("modal", "importSaveModalNoOfflineCauseFuture");

      const durationInMs = Date.now() - this.player.lastUpdate;
      const ticks = GameStorage.maxOfflineTicks(durationInMs);
      const tickLengthFormat = TimeSpan.fromMilliseconds(new Decimal(durationInMs / ticks)).toStringShort();
      return i18n("modal", "importSaveModalSimulatesX", [ticks, tickLengthFormat]);
    },
    willLoseCosmetics() {
      const currSets = player.reality.glyphs.cosmetics.unlockedFromNG;
      const importedSets = this.player.reality?.glyphs.cosmetics?.unlockedFromNG ?? [];
      return currSets.filter(set => !importedSets.includes(set)).length > 0;
    },
    willLoseSpeedrun() {
      return player.speedrun.isUnlocked && !this.player.speedrun?.isUnlocked;
    },
    isDevEnv() {
      return DEV;
    },
    topLabel() {
      return i18n("modal", "importSaveModalTitle");
    },
    fileNameString() {
      return i18n("modal", "importSaveModalFileName", [this.fileName]);
    },
    antimatterString() {
      return i18n("modal", "importSaveModalAM", [formatPostBreak(this.antimatter, 2, 1)]);
    },
    infinitiesString() {
      return i18n("modal", "importSaveModalInfinities", [formatPostBreak(this.infinities, 2)]);
    },
    eternitiesString() {
      return i18n("modal", "importSaveModalEternities", [formatPostBreak(this.player.eternities, 2)]);
    },
    realitiesString() {
      return i18n("modal", "importSaveModalRealities", [formatPostBreak(this.player.realities, 2)]);
    },
    completionsString() {
      return i18n("modal", "importSaveModalCompletions", [formatInt(this.player.records.fullGameCompletions)]);
    },
    overrideString() {
      return i18n("modal", "importSaveModalOverride");
    },
    offlineString() {
      return i18n("modal", "importSaveModalOfflineProgressOption", [this.offlineType]);
    },
    invalidString() {
      return i18n("modal", "importSaveModalInvalidSave");
    },
    cosStringA() {
      return i18n("modal", "importSaveModalLoseCosmeticsNoteA");
    },
    cosStringB() {
      return i18n("modal", "importSaveModalLoseCosmeticsNoteB");
    },
    speedrunString() {
      return i18n("modal", "importSaveModalLoseSpeedrun");
    },
    devSaveString() {
      return i18n("modal", "importSaveModalDevelopment");
    },
    buttonLabel() {
      return i18n("consts", "import");
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
    changeOfflineSetting() {
      this.offlineImport = (this.offlineImport + 1) % 3;
    },
    updateOfflineSettings() {
      switch (this.offlineImport) {
        case OFFLINE_PROGRESS_TYPE.IMPORTED:
          // These are default values from a new save, used if importing from pre-reality where these props don't exist
          GameStorage.offlineEnabled = this.player.options.offlineProgress ?? true;
          GameStorage.offlineTicks = this.player.options.offlineTicks ?? 1e5;
          break;
        case OFFLINE_PROGRESS_TYPE.LOCAL:
          GameStorage.offlineEnabled = player.options.offlineProgress;
          GameStorage.offlineTicks = player.options.offlineTicks;
          break;
        case OFFLINE_PROGRESS_TYPE.IGNORED:
          GameStorage.offlineEnabled = false;
          break;
      }
    },
    importSave() {
      if (!this.inputIsValid) return;
      this.emitClose();
      GameStorage.import(this.input);
    },
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
      <div v-if="inputIsSecret">
        ???
      </div>
      <template v-else-if="inputIsValidSave">
        <div v-if="fileName">
          {{ fileNameString }}
        </div>
        <div>
          {{ antimatterString }}
        </div>
        <div v-if="progress.isInfinityUnlocked">
          {{ infinitiesString }}
        </div>
        <div v-if="progress.isEternityUnlocked">
          {{ eternitiesString }}
        </div>
        <div v-if="progress.isRealityUnlocked">
          {{ realitiesString }}
        </div>
        <div v-if="progress.hasFullCompletion">
          {{ completionsString }}
        </div>
        <div class="c-modal-import__warning">
          {{ overrideString }}
        </div>
        <br>
        <div>
          {{ lastOpened }}
          <div
            class="o-primary-btn"
            @click="changeOfflineSetting"
          >
            {{ offlineString }}
          </div>
          <span v-html="offlineDetails" />
        </div>
      </template>
      <div v-else-if="hasInput">
        {{ invalidString }}
        <br>
        {{ saveCheckString }}
      </div>
      <div
        v-if="player"
        class="c-modal-hard-reset-danger"
      >
        <div v-if="!isDevEnv && player.devVersion !== undefined">
          {{ devSaveString }}
        </div>
        <div v-if="willLoseCosmetics">
          <br>
          {{ cosStringA }}
          <br>
          {{ cosStringB }}
        </div>
        <div v-if="willLoseSpeedrun">
          <br>
          {{ speedrunString }}
        </div>
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