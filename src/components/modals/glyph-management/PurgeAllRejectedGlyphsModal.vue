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
    refiningOrSacrificing() {
      if (this.isRefining) return `Refine`;
      return `Sacrifice`;
    },
    topLabel() {
      return i18n("modal", "allGlyphPurgeLabel", [`${this.refiningOrSacrificing}`]);
    },
    message() {
      const negativeWarning = AutoGlyphProcessor.hasNegativeEffectScore()
        ? i18n("modal", "allGlyphPurgeNegWarning")
        : "";
      return i18n("modal", "allGlyphPergeMsg", [`${this.refiningOrSacrificing}`, `${negativeWarning}`]);
    },
    extraMessage() {
      if (this.glyphsDeleted === 0) return i18n("modal", "noGlyphRemoves");
      if (this.glyphsDeleted === this.glyphsTotal) return i18n("modal", "allGlyphRemoves");
      return i18n("modal", "someGlyphRemoves", [`${this.glyphsDeleted}/${this.glyphsTotal}`]);
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
