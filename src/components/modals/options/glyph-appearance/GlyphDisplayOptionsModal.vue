<script>
import SelectGlyphInfoDropdown, { GlyphInfoVue } from ".././SelectGlyphInfoDropdown";

import ExpandingControlBox from "@/components/ExpandingControlBox";
import GlyphCustomization from "@/components/modals/options/glyph-appearance/GlyphCustomization";
import ModalOptionsToggleButton from "@/components/ModalOptionsToggleButton";
import ModalWrapperOptions from "@/components/modals/options/ModalWrapperOptions";

export default {
  name: "GlyphDisplayOptionsModal",
  components: {
    ExpandingControlBox,
    ModalOptionsToggleButton,
    ModalWrapperOptions,
    SelectGlyphInfoDropdown,
    GlyphCustomization,
  },
  data() {
    return {
      newGlyphs: false,
      showUnequippedGlyphIcon: false,
      glyphEffectDots: false,
      glyphBG: 0,
      glyphInfoType: 0,
      showGlyphInfoByDefault: false,
      glyphBorders: false,
      highContrastRarity: false,
      swapGlyphColors: false,
    };
  },
  computed: {
    infoLabel() {
      return GlyphInfoVue.labels[this.glyphInfoType];
    },
    glyphBGStr() {
      switch (this.glyphBG) {
        case GLYPH_BG_SETTING.AUTO:
          return i18n("modal", "auto");
        case GLYPH_BG_SETTING.LIGHT:
          return i18n("modal", "light");
        case GLYPH_BG_SETTING.DARK:
          return i18n("modal", "dark");
        default:
          throw new Error("Unrecognized Glyph BG setting");
      }
    },
    topLabel() {
      return i18n("modal", "GDOtopLabel");
    },
    dropdownLabel() {
      return i18n("modal", "glyphBGcol", [this.glyphBGStr]);
    },
    dropdownLabelB() {
      return i18n("modal", "additionalGlyphInfo");
    }
  },
  watch: {
    newGlyphs(newValue) {
      player.options.showNewGlyphIcon = newValue;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
    showUnequippedGlyphIcon(newValue) {
      player.options.showUnequippedGlyphIcon = newValue;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
    glyphEffectDots(newValue) {
      player.options.showHintText.glyphEffectDots = newValue;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
    showGlyphInfoByDefault(newValue) {
      player.options.showHintText.showGlyphInfoByDefault = newValue;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
    glyphBorders(newValue) {
      player.options.glyphBorders = newValue;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
    highContrastRarity(newValue) {
      player.options.highContrastRarity = newValue;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
    swapGlyphColors(newValue) {
      player.options.swapGlyphColors = newValue;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
  },
  methods: {
    update() {
      const options = player.options;
      this.newGlyphs = options.showNewGlyphIcon;
      this.showUnequippedGlyphIcon = options.showUnequippedGlyphIcon;
      this.glyphEffectDots = options.showHintText.glyphEffectDots;
      this.glyphBG = player.options.glyphBG;
      this.glyphInfoType = options.showHintText.glyphInfoType;
      this.showGlyphInfoByDefault = options.showHintText.showGlyphInfoByDefault;
      this.glyphBorders = options.glyphBorders;
      this.highContrastRarity = options.highContrastRarity;
      this.swapGlyphColors = options.swapGlyphColors;
    },
    noEffectStyle() {
      if (this.glyphInfoType !== 0) return null;
      return {
        "background-color": "var(--color-disabled)",
      };
    },
    cycleBG() {
      player.options.glyphBG = (player.options.glyphBG + 1) % Object.keys(GLYPH_BG_SETTING).length;
      EventHub.dispatch(GAME_EVENT.GLYPH_VISUAL_CHANGE);
    },
    getStr(val) {
      return i18n("modal", "glyphDisplayOptionsList").split(" $ ")[val];
    },
  },
};
</script>

<template>
  <ModalWrapperOptions class="c-modal-options__glyph">
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-glyph-visual-options c-modal--short">
      <div class="c-modal-options__button-container">
        <ModalOptionsToggleButton
          v-model="newGlyphs"
          @text="getStr(0)"
        />
        <ModalOptionsToggleButton
          v-model="showUnequippedGlyphIcon"
          @text="getStr(1)"
        />
        <ModalOptionsToggleButton
          v-model="glyphEffectDots"
          @text="getStr(2)"
        />
        <ModalOptionsToggleButton
          v-model="glyphBorders"
          @text="getStr(3)"
        />
        <button
          class="o-primary-btn o-primary-btn--modal-option"
          @click="cycleBG()"
        >
          {{ dropdownLabel }}
        </button>
        <ModalOptionsToggleButton
          v-model="showGlyphInfoByDefault"
          :style="noEffectStyle()"
          @text="getStr(4)"
        />
        <ModalOptionsToggleButton
          v-model="highContrastRarity"
          @text="getStr(5)"
        />
        <ModalOptionsToggleButton
          v-model="swapGlyphColors"
          @text="getStr(6)"
        />
        <ExpandingControlBox
          class="o-primary-btn c-dropdown-btn"
        >
          <template #header>
            <div class="c-dropdown-header">
              {{ dropdownLabelB }}
              <br>
              {{ infoLabel }}
            </div>
          </template>
          <template #dropdown>
            <SelectGlyphInfoDropdown />
          </template>
        </ExpandingControlBox>
      </div>
      <GlyphCustomization />
    </div>
  </ModalWrapperOptions>
</template>

<style scoped>
.c-modal-options__glyph {
  width: 55rem;
}

.c-glyph-visual-options {
  width: 55rem;
  overflow-x: hidden;
  padding-right: 1rem;
}

.c-dropdown-btn {
  width: 24rem;
  margin: 0.3rem;
  padding: 0;
}

.c-dropdown-header {
  padding: 0.9rem;
  height: 6.5rem;
  user-select: none;
}
</style>
