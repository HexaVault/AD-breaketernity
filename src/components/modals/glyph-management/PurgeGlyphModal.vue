<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "PurgeGlyphModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    harsh: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    threshold() {
      return this.harsh ? 1 : 5;
    },
    extraMessage() {
      if (this.glyphsDeleted === 0) return i18n("modal", "purgesNoGlyphs", [], true)[Number(this.harsh)];
      if (this.glyphsDeleted === this.glyphsTotal) return i18n("modal", "purgesAllGlyphs", [], true)[Number(this.harsh)];
      return i18n("modal", "someGlyphPurged", [() => formatInt(this.glyphsDeleted)], true)[Number(this.harsh)];
    },
    explanation() {
      return i18n("modal", this.harsh ? "glyphPurgeModalHarshPurgeExplanation" : "glyphPurgeModalPurgeExplanation");
    },
    topLabel() {
      return i18n("modal", "glyphPurgeModalTitle", [], true)[Number(this.harsh)];
    },

    // These two don't need to be reactive since the modal force-closes itself whenever glyphs change
    glyphsTotal() {
      return Glyphs.inventory.filter(slot => slot !== null).length;
    },
    glyphsDeleted() {
      return Glyphs.autoClean(this.threshold, false);
    },

    message() {
      return i18n("modal", "glyphPurgeModalPurgeNote");
    }
  },
  methods: {
    handleYesClick() {
      Glyphs.autoClean(this.threshold, true);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="autoClean"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ message }}
      <br>
      <br>
      {{ explanation }}
    </div>
    <br>
    <div class="c-modal-hard-reset-danger">
      {{ extraMessage }}
    </div>
  </ModalWrapperChoice>
</template>
