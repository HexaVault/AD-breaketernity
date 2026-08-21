<script>
import GlyphSetPreview from "@/components/GlyphSetPreview";
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "GlyphSetSaveDeleteModal",
  components: {
    ModalWrapperChoice,
    GlyphSetPreview
  },
  props: {
    glyphSetId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      glyphSet: []
    };
  },
  computed: {
    topLabel() {
      return i18n("modal", "delGlyphSetModalTitle");
    },
    stringText() {
      return i18n("modal", "delGlyphSetModalConfirm");
    },
    notDeletingGlyphs() {
      return i18n("modal", "delGlyphSetModalNotGlyphs");
    },
    buttonLabel() {
      return i18n("consts", "delete");
    }
  },
  methods: {
    update() {
      this.glyphSet = cloneDeep(Glyphs.copyForRecords(player.reality.glyphs.sets[this.glyphSetId].glyphs));
    },
    handleYesClick() {
      player.reality.glyphs.sets[this.glyphSetId].glyphs = [];
      EventHub.dispatch(GAME_EVENT.GLYPH_SET_SAVE_CHANGE);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="deleteGlyphSetSave"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ stringText }}
      <GlyphSetPreview
        :is-in-modal="true"
        :glyphs="glyphSet"
      />
      {{ notDeletingGlyphs }}
    </div>
    <template #confirm-text>
      {{ buttonLabel }}
    </template>
  </ModalWrapperChoice>
</template>
