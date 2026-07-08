<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "PurgeAllUnprotectedGlyphsModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      isRefining: false,
      isSacrificing: false,
    };
  },
  computed: {
    refiningSacrificingOrDeleting() {
      if (this.isRefining) return 1;
      return this.isSacrificing ? 0 : 2;
    },
    topLabel() {
      return i18n("modal", "glyphPurgeRejectedModalTitle", [], true)[this.refiningSacrificingOrDeleting];
    },
    message() {
      return i18n("modal", "glyphPurgeRejectedModalMessage", [], true)[this.refiningSacrificingOrDeleting];
    },
    extraMessage() {
      if (this.glyphsDeleted === 0) return i18n("modal", "removesNoGlyphs", [], true)[this.refiningSacrificingOrDeleting];
      if (this.glyphsDeleted === this.glyphsTotal) return i18n("modal", "removedAllGlyphs", [], true)[this.refiningSacrificingOrDeleting];
      return i18n("modal", "removesSomeGlyphs", [() => formatInt(this.glyphsDeleted)], true)[this.refiningSacrificingOrDeleting];
    },

    // These two don't need to be reactive since the modal force-closes itself whenever glyphs change
    glyphsTotal() {
      return Glyphs.inventory.filter(slot => slot !== null).length;
    },
    glyphsDeleted() {
      return Glyphs.autoClean(0, false);
    },
  },
  methods: {
    update() {
      this.isRefining = GlyphSacrificeHandler.isRefining;
      this.isSacrificing = GlyphSacrificeHandler.canSacrifice;
    },
    handleYesClick() {
      Glyphs.deleteAllUnprotected();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="sacrificeAll"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
    <br>
    <div class="c-modal-hard-reset-danger">
      {{ extraMessage }}
    </div>
  </ModalWrapperChoice>
</template>
