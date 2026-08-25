<script>
import ModalWrapper from "@/components/modals/ModalWrapper";

export default {
  name: "HotkeysModal",
  components: {
    ModalWrapper
  },
  data() {
    return {
      updateIndicies: [],
      visible: [],
      timeStudyUnlocked: false,
      glyphSacUnlocked: false,
      isElectron: false
    };
  },
  computed: {
    moreShiftKeyInfo() {
      const shiftKeyFunctions = [];
      const text = i18n("modal", "hotkeyModalAboutShift", [], true);
      if (this.timeStudyUnlocked) {
        shiftKeyFunctions.push(text[1]);
        shiftKeyFunctions.push(text[2]);
      }
      if (this.glyphSacUnlocked) {
        shiftKeyFunctions.push(text[3]);
      }
      const shiftKeyInfo = makeEnumeration(shiftKeyFunctions);
      return (shiftKeyInfo === "")
        ? ""
        : i18n("modal", "hotkeyModalAboutShift", [shiftKeyInfo], true)[0];
    },
    hotkeyCount() {
      return shortcuts.length;
    },
    shortcutNames() {
      return shortcuts.map(x => x.name);
    },
    shortcutKeys() {
      return shortcuts.map(x => x.keys.map(key => this.format(key)));
    },
    topLabel() {
      return i18n("modal", "hotkeyModalTitle");
    },
    buyNdims() {
      return i18n("modal", "hotkeyModalXDimensions", [], true);
    },
    shiftInfo() {
      return i18n("modal", "hotkeyModalInfoForShift");
    },
    altInfoA() {
      return i18n("modal", "hotkeyModalInfoAboutAlt");
    },
    altInfoB() {
      return i18n("modal", "hotkeyModalInfoAboutAltShift");
    },
    arrowKeyInfo() {
      return i18n("modal", "hotkeyModalInfoAboutArrows");
    },
    numpadLimit() {
      return i18n("modal", "hotkeyModalInfoAboutNumpad", [], true);
    },
    zoomAdj() {
      return i18n("modal", "hotkeyModalToAdjustZoom", [], true);
    },
    fullscreen() {
      return i18n("modal", "hotkeyModalFullscreen");
    },
    fullscreenInfo() {
      return i18n("modal", "hotkeyModalToEnterFullscreen", [], true);
    },
    windowZoom() {
      return i18n("modal", "windowZhotkeyModalWindowZoomoom");
    },
    otherHeaders() {
      return i18n("modal", "hotkeyModalInternalHeaders").split("$");
    }
  },
  created() {
    for (let i = 0; i < this.hotkeyCount; i++) {
      const visible = shortcuts[i].visible;
      if (typeof visible === "function") {
        this.updateIndicies.push(i);
      } else {
        this.visible[i] = visible;
      }
    }
  },
  methods: {
    update() {
      for (const index of this.updateIndicies) {
        this.$set(this.visible, index, shortcuts[index].visible());
      }
      const progress = PlayerProgress.current;
      this.timeStudyUnlocked = progress.isEternityUnlocked;
      this.glyphSacUnlocked = RealityUpgrade(19).isBought;

      // ElectronRuntime is a global which only exists on Steam (throws a ReferenceError on web)
      try {
        this.isElectron = ElectronRuntime.isActive;
      } catch {
        this.isElectron = false;
      }
    },
    format(x) {
      switch (x) {
        case "mod":
          return "CTRL/⌘";
        default:
          return x.toUpperCase();
      }
    }
  },
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      {{ topLabel }}
    </template>
    <span class="c-modal-hotkeys l-modal-hotkeys">
      <div class="l-modal-hotkeys__column">
        <div class="l-modal-hotkeys-row">
          <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">{{ buyNdims[0] }}</span>
          <kbd>SHIFT</kbd><kbd>1</kbd>-<kbd>SHIFT</kbd><kbd>8</kbd>
        </div>
        <div class="l-modal-hotkeys-row">
          <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">{{ buyNdims[1] }}</span>
          <kbd>1</kbd>-<kbd>8</kbd>
        </div>
        <div
          v-for="index in hotkeyCount"
          :key="index"
        >
          <span
            v-if="visible[index - 1]"
            class="l-modal-hotkeys-row"
          >
            <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">{{ shortcutNames[index - 1] }}</span>
            <kbd
              v-for="(key, i) in shortcutKeys[index - 1]"
              :key="i"
            >
              {{ key }}
            </kbd>
          </span>
        </div>
      </div>
      <div class="l-modal-hotkeys__column l-modal-hotkeys__column--right">
        <div class="l-modal-hotkeys-row">
          <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">{{ otherHeaders[0] }}</span>
          <kbd>SHIFT</kbd>
        </div>
        <span class="c-modal-hotkeys__shift-description">
          {{ shiftInfo }}
          <br>
          {{ moreShiftKeyInfo }}
        </span>
        <br>
        <div class="l-modal-hotkeys-row">
          <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">{{ otherHeaders[1] }}</span>
          <kbd>ALT</kbd>
        </div>
        <span class="c-modal-hotkeys__shift-description">
          {{ altInfoA }}
          <br>
          {{ altInfoB }}
        </span>
        <br>
        <div class="l-modal-hotkeys-row">
          <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">{{ otherHeaders[2] }}</span>
          <div>
            <kbd>←</kbd><kbd>↓</kbd><kbd>↑</kbd><kbd>→</kbd>
          </div>
        </div>
        <span class="c-modal-hotkeys__shift-description">
          {{ arrowKeyInfo }}
        </span>
        <br>
        <div class="l-modal-hotkeys-row">
          <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">{{ otherHeaders[3] }}</span>
        </div>
        <span class="c-modal-hotkeys__shift-description">
          {{ numpadLimit[0] }}<kbd>SHIFT</kbd>{{ numpadLimit[1] }}<kbd>ALT</kbd>{{ numpadLimit[2] }}
        </span>
        <template v-if="isElectron">
          <br>
          <div class="l-modal-hotkeys-row">
            <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">{{ windowZoom }}</span>
            <kbd>-</kbd><kbd>0</kbd><kbd>+</kbd>
          </div>
          <span class="c-modal-hotkeys__shift-description">
            {{ zoomAdj[0] }}<kbd>ctrl</kbd>{{ zoomAdj[1] }}<kbd>-</kbd>{{ zoomAdj[2] }}<kbd>+</kbd>
            {{ zoomAdj[3] }}<kbd>ctrl</kbd><kbd>0</kbd>{{ zoomAdj[4] }}
          </span>
          <br>
          <div class="l-modal-hotkeys-row">
            <span class="c-modal-hotkeys-row__name l-modal-hotkeys-row__name">{{ fullscreen }}</span>
            <kbd>F10</kbd>
          </div>
          <span class="c-modal-hotkeys__shift-description">
            {{ fullscreenInfo[0] }}<kbd>F10</kbd>{{ fullscreenInfo[1] }}
          </span>
        </template>
      </div>
    </span>
  </ModalWrapper>
</template>

<style scoped>
.l-modal-hotkeys__column {
  display: flex;
  flex-direction: column;
  width: 28rem;
}

.l-modal-hotkeys__column--right {
  margin-left: 1rem;
}

.c-modal-hotkeys {
  font-size: 1.25rem;
}

.l-modal-hotkeys {
  display: flex;
  flex-direction: row;
}

.l-modal-hotkeys-row {
  display: flex;
  flex-direction: row;
  line-height: 1.6rem;
  padding-bottom: 0.3rem;
}

.c-modal-hotkeys-row__name {
  text-align: left;
}

.l-modal-hotkeys-row__name {
  flex: 1 1 auto;
}

.c-modal-hotkeys__shift-description {
  text-align: left;
  font-size: 1rem;
}
</style>
