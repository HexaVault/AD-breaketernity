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
        ? i18n("modal", "saveFromFuture", [formatms])
        : i18n("modal", "saveFromPast", [formatms]);
    },
    offlineType() {
      // We update here in the computed method instead of elsewhere because otherwise it initializes the text
      // to a wrong or undefined setting
      this.updateOfflineSettings();

      switch (this.offlineImport) {
        case OFFLINE_PROGRESS_TYPE.IMPORTED:
          return i18n("modal", "opImported");
        case OFFLINE_PROGRESS_TYPE.LOCAL:
          return i18n("modal", "opLocal");
        case OFFLINE_PROGRESS_TYPE.IGNORED:
          return i18n("modal", "opIgnored");
        default:
          throw new Error(i18n("modal", "opErr"));
      }
    },
    offlineDetails() {
      if (this.offlineImport === OFFLINE_PROGRESS_TYPE.IGNORED) return i18n("modal", "willImpWOoffline");
      if (!GameStorage.offlineEnabled) return i18n("modal", "wontApplyOffline");
      if (this.isFromFuture) return i18n("modal", "noOfflineFuture");

      const durationInMs = Date.now() - this.player.lastUpdate;
      const ticks = GameStorage.maxOfflineTicks(durationInMs);
      const tickLengthFormat = TimeSpan.fromMilliseconds(new Decimal(durationInMs / ticks)).toStringShort();
      return i18n("modal", "tickCalc", [ticks, tickLengthFormat]);
    },
    willLoseCosmetics() {
      const currSets = player.reality.glyphs.cosmetics.unlockedFromNG;
      const importedSets = this.player.reality?.glyphs.cosmetics?.unlockedFromNG ?? [];
      return currSets.filter(set => !importedSets.includes(set)).length > 0;
    },
    willLoseSpeedrun() {
      return player.speedrun.isUnlocked && !this.player.speedrun?.isUnlocked;
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
      {{ i18n("modal", "inputSave") }}
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
          {{ i18n("modal", "fileName", [fileName]) }}
        </div>
        <div>
          {{ i18n("modal", "saveAM", [formatPostBreak(antimatter, 2, 1)]) }}
        </div>
        <div v-if="progress.isInfinityUnlocked">
          {{ i18n("modal", "saveInf", [formatPostBreak(infinities, 2)]) }}
        </div>
        <div v-if="progress.isEternityUnlocked">
          {{ i18n("modal", "saveEter", [formatPostBreak(player.eternities, 2)]) }}
        </div>
        <div v-if="progress.isRealityUnlocked">
          {{ i18n("modal", "saveReal", [formatPostBreak(player.realities, 2)]) }}
        </div>
        <div v-if="progress.hasFullCompletion">
          {{ i18n("modal", "saveComps", [formatInt(player.records.fullGameCompletions)]) }}
        </div>
        <div class="c-modal-import__warning">
          {{ i18n("modal", "willOverride") }}
        </div>
        <br>
        <div>
          {{ lastOpened }}
          <div
            class="o-primary-btn"
            @click="changeOfflineSetting"
          >
            {{ i18n("modal", "saveOP", [offlineType]) }}
          </div>
          <span v-html="offlineDetails" />
        </div>
      </template>
      <div v-else-if="hasInput">
        {{ i18n("modal", "invalidSave") }}
        <br>
        {{ saveCheckString }}
      </div>
      <div
        v-if="player"
        class="c-modal-hard-reset-danger"
      >
        <div v-if="!isDevEnv && player.devVersion">
          WARNING: This save comes from a development version. It might fail to import!
        </div>
        <div v-if="willLoseCosmetics">
          <br>
          {{ i18n("modal", "willLoseCosmeticsA") }}
          <br>
          {{ i18n("modal", "willLoseCosmeticsB") }}
        </div>
        <div v-if="willLoseSpeedrun">
          <br>
          {{ i18n("modal", "willLoseSpeedrun") }}
        </div>
      </div>
    </div>

    <PrimaryButton
      v-if="inputIsValid"
      class="o-primary-btn--width-medium c-modal-message__okay-btn c-modal__confirm-btn"
      @click="importSave"
    >
      {{ i18n("modal", "import") }}
    </PrimaryButton>
  </ModalWrapperChoice>
</template>