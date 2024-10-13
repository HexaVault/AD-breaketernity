<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "DeleteGlyphModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    idx: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      confirmedDelete: false
    };
  },
  computed: {
    glyph() {
      return Glyphs.findByInventoryIndex(this.idx);
    },
    msg1() {
      return i18n("modal", "deletionModalMsg1");
    },
    msg2() {
      return i18n("modal", "deletionModalMsg2");
    },
    msg3() {
      return i18n("modal", "deletionModalMsg3");
    }
  },
  methods: {
    update() {
      const newGlyph = Glyphs.findByInventoryIndex(this.idx);
      if (this.glyph !== newGlyph && !this.confirmedDelete) {

        // Why is confirmedDelete here: refer to SacrificeGlyphModal.vue

        this.emitClose();
        Modal.message.show(i18n("modal", "glyphMoveModal"));
      }
    },
    handleYesClick() {
      this.confirmedDelete = true;
      Glyphs.removeFromInventory(this.glyph);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="handleYesClick">
    <template #header>
      {{ msg1 }}
    </template>
    <div class="c-modal-message__text">
      {{ msg2 }}
      <div class="c-modal-hard-reset-danger">
        {{ msg3 }}
      </div>
    </div>
  </ModalWrapperChoice>
</template>
