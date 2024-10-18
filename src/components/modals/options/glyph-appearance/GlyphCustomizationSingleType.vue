<script>
import GlyphCustomizationSlidingWindow
  from "@/components/modals/options/glyph-appearance/GlyphCustomizationSlidingWindow";

export default {
  name: "GlyphCustomizationSingleType",
  components: {
    GlyphCustomizationSlidingWindow,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    glyphId: {
      type: Number,
      required: false,
      default: -1,
    }
  },
  computed: {
    name() {
      return this.type.capitalize();
    },
    symbols() {
      return GlyphAppearanceHandler.availableSymbols;
    },
    colors() {
      return GlyphAppearanceHandler.availableColors;
    },
    textA() {
      return i18n("modal", "perGlyphCos", this.name);
    },
    textB() {
      return i18n("modal", "noModCompanion");
    }
  },
};
</script>

<template>
  <div class="c-glyph-customization-entry">
    <span
      v-if="glyphId === -1"
      class="c-name"
    >
      {{ textA }}
    </span>
    <div v-if="type === 'companion'">
      {{ textB }}
    </div>
    <GlyphCustomizationSlidingWindow
      v-else
      :type="type"
      :is-symbol="true"
      :options="symbols"
      :glyph-id="glyphId"
    />
    <GlyphCustomizationSlidingWindow
      :type="type"
      :is-symbol="false"
      :options="colors"
      :glyph-id="glyphId"
    />
  </div>
</template>

<style scoped>
.c-glyph-customization-entry {
  display: flex;
  flex-direction: column;
}

.c-name {
  width: 100%;
  margin: 0.5rem 0 0;
}
</style>
