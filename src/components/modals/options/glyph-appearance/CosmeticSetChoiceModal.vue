<script>
import CosmeticSetDropdown from "@/components/modals/options/glyph-appearance/CosmeticSetDropdown";
import ExpandingControlBox from "@/components/ExpandingControlBox";
import GlyphComponent from "@/components/GlyphComponent";
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "CosmeticSetChoiceModal",
  components: {
    ModalWrapperChoice,
    ExpandingControlBox,
    CosmeticSetDropdown,
    GlyphComponent
  },
  data() {
    return {
      initialSet: "",
      currentSet: "",
    };
  },
  computed: {
    lockedSets() {
      return GlyphAppearanceHandler.lockedSets;
    },
    cosmeticTypes() {
      return CosmeticGlyphTypes.list.filter(t => t.isCosmetic && t.isUnlocked).map(t => t.id);
    },
    setName() {
      return this.currentSet?.name ?? i18n("modal", "cosmeticSetChoiceModalNone");
    },
    setContents() {
      const contents = [];
      if (this.symbols) contents.push(i18n("modal", "cosmeticSetChoiceModalSymbol", [[x => x, this.symbols.length]]));
      if (this.colors) contents.push(i18n("modal", "cosmeticSetChoiceModalColorScheme", [[x => x, this.colors.length]]));
      // Wwe use + here so we dont have to do weird shenanigans with and
      return contents.join(" + ");
    },
    symbols() {
      return this.currentSet.symbol;
    },
    colors() {
      return this.currentSet.color;
    },
    glyphIconProps() {
      return {
        size: "3rem",
        "glow-blur": "0.3rem",
        "glow-spread": "0.1rem",
        "text-proportion": 0.66,
      };
    },
    topLabel() {
      return i18n("modal", "cosmeticSetChoiceModalChooseCosmeticSet");
    },
    dropdown() {
      return i18n("modal", "cosmeticSetChoiceModalDropdown");
    },
    contains() {
      return i18n("modal", "cosmeticSetChoiceModalSetContains", [this.currentSet.name, this.setContents]);
    },
  },
  created() {
    this.initialSet = GlyphAppearanceHandler.chosenFromModal;
    GlyphAppearanceHandler.setInModal = this.initialSet;
  },
  methods: {
    update() {
      this.currentSet = GlyphAppearanceHandler.setInModal;
    },
    chooseSet() {
      GlyphAppearanceHandler.chosenFromModal = this.currentSet;
    },
    cancelSet() {
      GlyphAppearanceHandler.chosenFromModal = this.initialSet;
      this.emitClose();
    },
    fakeGlyph(color) {
      return {
        type: "power",
        strength: 1,
        color,
      };
    },
  }
};
</script>

<template>
  <ModalWrapperChoice
    :cancel-fn="cancelSet"
    @confirm="chooseSet"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-center">
      <ExpandingControlBox
        class="o-primary-btn c-dropdown-btn"
      >
        <template #header>
          <div class="c-dropdown-header">
            {{ dropdown }}
            <br>
            {{ setName }}
          </div>
        </template>
        <template #dropdown>
          <CosmeticSetDropdown />
        </template>
      </ExpandingControlBox>
      <div v-if="currentSet">
        {{ contains }}
        <br>
        <span
          v-for="symbol of symbols"
          :key="symbol"
          class="o-single-symbol"
        >
          {{ symbol }}
        </span>
        <br>
        <span
          v-for="color of colors"
          :key="color"
          class="o-single-glyph"
        >
          <GlyphComponent
            v-bind="glyphIconProps"
            :glyph="fakeGlyph(color)"
          />
        </span>
      </div>
    </div>
  </ModalWrapperChoice>
</template>

<style scoped>
.c-center {
  display: flex;
  flex-direction: column;
  width: 38rem;
  align-items: center;
}

.t-s12 .c-center {
  width: 50rem;
  text-align: center;
}

.c-dropdown-btn {
  width: 24rem;
  margin: 0.3rem;
  padding: 0;
}

.c-dropdown-header {
  height: 5rem;
  padding: 0.5rem;
  user-select: none;
}

.o-single-symbol {
  font-size: 3rem;
}

.o-single-glyph {
  padding: 0.5rem;
}
</style>
