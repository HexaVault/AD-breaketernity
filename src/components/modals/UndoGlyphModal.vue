<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "UndoGlyphModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      showStoredGameTime: false,
    };
  },
  computed: {
    topLabel() {
      return i18n("modal", "undoGlyphModalTitle");
    },
    infoText() {
      return i18n("modal", "undoGlyphModalLastRemoved");
    },
    undoList() {
      const list = i18n("modal", "undoGlyphModalUndoList", [], true);
      if (!this.showStoredGameTime) list.pop(5);
      return list;
    },
    specialConditions() {
      return i18n("modal", "undoGlyphModalSpecialInvalid");
    }
  },
  methods: {
    update() {
      this.showStoredGameTime = Enslaved.isUnlocked;
    },
    realityInvalidate() {
      this.emitClose();
      Modal.message.show(i18n("modal", "glyphUndoOnlyWithReality"),
        { closeEvent: GAME_EVENT.REALITY_RESET_AFTER });
    },
    handleYesClick() {
      this.emitClose();
      Glyphs.undo();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="glyphUndo"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div
      class="c-modal-message__text c-text-wrapper"
    >
      {{ infoText }}
      <br>
      <div class="c-text-wrapper">
        <span
          v-for="(undoneItem, idx) in undoList"
          :key="idx"
        >
          <br>{{ undoneItem }}
        </span>
      </div>
      <br>
      {{ specialConditions }}
    </div>
  </ModalWrapperChoice>
</template>

<style scoped>
.c-text-wrapper {
  text-align: left;
}
</style>