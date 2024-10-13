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
      if (this.glyphsDeleted === 0) return i18n("modal", "noGlyphPurged");
      if (this.glyphsDeleted === this.glyphsTotal) return i18n("modal", "allGlyphPurged");
      return i18n("modal", "allGlyphPurged", [this.harsh ? `Harsh` : ``,
        `${formatInt(this.glyphsDeleted)}/${formatInt(this.glyphsTotal)}`]);
    },
    explanation() {
      return i18n("modal", this.harsh ? "harshPurgeExplanation" : "purgeExplanation");
    },
    topLabel() {
      return i18n("modal", "aboutToPurge", [this.harsh ? `Harsh` : ``]);
    },

    // These two don't need to be reactive since the modal force-closes itself whenever glyphs change
    glyphsTotal() {
      return Glyphs.inventory.filter(slot => slot !== null).length;
    },
    glyphsDeleted() {
      return Glyphs.autoClean(this.threshold, false);
    },

    message() {
      const msg = i18n("modal", "purgeMessage").split("$1aX");
      return this.harsh ? msg[0] + msg[1] : msg[1];
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
