<script>
export default {
  name: "CurrentGlyphEffect",
  props: {
    isColored: {
      type: Boolean,
      default: true
    },
    effect: {
      type: String,
      required: true
    }
  },
  computed: {
    effectConfig() {
      return GlyphEffects[this.effect];
    },
    formatValue() {
      if (this.effectConfig.isDisabledByDoomed) return "";
      const value2 = this.effectConfig.secondary === undefined
        ? ""
        : this.effectConfig.secondary.formattedEffect;
      return this.effectConfig.totalDesc
        .replace("{value}", this.effectConfig.primary.formattedEffect)
        .replace("{value2}", value2);
    },
    textColor() {
      if (!this.isColored) return { };
      const typeObject = this.effectConfig.effectCol;

      let glyphColor = typeObject.currentColor.border;
      if (typeObject.id === "cursed") glyphColor = "var(--color-celestials)";

      return {
        color: glyphColor,
        "text-shadow": `-1px 1px 1px var(--color-text-base), 1px 1px 1px var(--color-text-base),
                            -1px -1px 1px var(--color-text-base), 1px -1px 1px var(--color-text-base),
                            0 0 3px ${typeObject.currentColor.border}`,
        animation: typeObject.id === "reality" ? "a-reality-glyph-description-cycle 10s infinite" : undefined,
      };
    },
    valueClass() {
      return this.effectConfig.isEffectCapped ? "c-current-glyph-effects__effect--capped" : "";
    }
  },
  created() {
    this.on$(GAME_EVENT.GLYPH_VISUAL_CHANGE, () => {
      this.$recompute("effectConfig");
    });
  }
};
</script>

<template>
  <div>
    <span
      :style="textColor"
      :class="valueClass"
    >
      {{ formatValue }}
    </span>
  </div>
</template>

<style scoped>

</style>
