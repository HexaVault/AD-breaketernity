<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "PurgeAllRejectedGlyphsModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      isRefining: false,
    };
  },
  computed: {
    topLabel() {
      return i18n("modal", "glyphPurgeRejectedModalTitle", [], true)[this.isRefining ? 1 : 0];
    },
    message() {
      const negativeWarning = AutoGlyphProcessor.hasNegativeEffectScore()
        ? i18n("modal", "glyphPurgeRejectedModalNegativeFilter")
        : "";
      return i18n("modal", "glyphPurgeRejectedModalMessage", [`${negativeWarning}`], true)[this.isRefining ? 1 : 0];
    },
    extraMessage() {
      if (this.glyphsDeleted === 0) return i18n("modal", "removesNoGlyphs", [], true)[this.isRefining ? 1 : 0];
      if (this.glyphsDeleted === this.glyphsTotal) return i18n("modal", "removesAllGlyphs", [], true)[this.isRefining ? 1 : 0];
      return i18n("modal", "removesSomeGlyphs", [() => this.glyphsDeleted], true)[this.isRefining ? 1 : 0];
    },

    // These two don't need to be reactive since the modal force-closes itself whenever glyphs change
    glyphsTotal() {
      return Glyphs.inventory.filter(slot => slot !== null).length;
    },
    glyphsDeleted() {
      return Glyphs.deleteAllRejected(false);
    },
  },
  methods: {
    update() {
      this.isRefining = GlyphSacrificeHandler.isRefining;
    },
    handleYesClick() {
      Glyphs.deleteAllRejected(true);
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
