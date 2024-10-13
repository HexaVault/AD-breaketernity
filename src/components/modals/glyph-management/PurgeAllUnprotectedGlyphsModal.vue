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
      if (this.isRefining) return `Refine`;
      if (this.isSacrificing) return `Sacrifice`;
      return `delete`;
    },
    topLabel() {
      return i18n("modal", "unprotGlyphPurgeLabel", [this.refiningSacrificingOrDeleting]);
    },
    message() {
      return i18n("modal", "unprotGlyphPergeMsg", [this.refiningSacrificingOrDeleting]);
    },
    extraMessage() {
      if (this.glyphsDeleted === 0) return i18n("modal", "noGlyphRemovesRSD", [this.refiningSacrificingOrDeleting]);
      if (this.glyphsDeleted === this.glyphsTotal) {
        return i18n("modal", "allGlyphRemovesRSD", [this.refiningSacrificingOrDeleting]);
      }
      return i18n("modal", "someGlyphRemovesRSD", [this.refiningSacrificingOrDeleting,
        `${formatInt(this.glyphsDeleted)}/${formatInt(this.glyphsTotal)}`]);
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
