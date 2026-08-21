<script>
import ModalWrapper from "@/components/modals/ModalWrapper";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "RealityGlyphCreationModal",
  components: {
    ModalWrapper,
    PrimaryButton
  },
  data() {
    return {
      isDoomed: false,
      realityGlyphLevel: new Decimal(),
      // This contains an array where each entry is an array looking like [4000, "realitygalaxies"]
      possibleEffects: [],
    };
  },
  computed: {
    topLabel() {
      return i18n("modal", "realityGlyphCreationModalTitle");
    },
    creationMessage() {
      return i18n("modal", "realityGlyphCreationModalInfo", [formatInt(realityGlyphLevel), formatPercents(1)]);
    },
    buttonLabel() {
      if (this.isDoomed) return i18n("modal", "realityGlyphCreationModalCantMakeDoomed");
      if (this.realityGlyphLevel.eq(0)) return i18n("modal", "realityGlyphCreationModalCantMakeLevelZero");
      return i18n("modal", "realityGlyphCreationModalMakeGlyph");
    },
    availableEffects() {
      return i18n("modal", "realityGlyphCreationModalListOfEffects");
    }
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.realityGlyphLevel.copyFrom(AlchemyResource.reality.effectValue);
      const realityEffectConfigs = GlyphEffects.all
        .filter(eff => eff.glyphTypes.includes("reality"))
        .sort((a, b) => a.intID - b.intID);
      const minRealityEffectIndex = realityEffectConfigs.map(cfg => cfg.intID).nMin();
      this.possibleEffects = realityEffectConfigs
        .map(cfg => [realityGlyphEffectLevelThresholds[cfg.intID - minRealityEffectIndex], cfg.id]);
    },
    createRealityGlyph() {
      if (GameCache.glyphInventorySpace.value === 0) {
        Modal.message.show(i18n("modal", "noSpaceForGlyphs"),
          { closeEvent: GAME_EVENT.GLYPHS_CHANGED });
        return;
      }
      Glyphs.addToInventory(GlyphGenerator.realityGlyph());
      AlchemyResource.reality.amount = new Decimal();
      player.reality.glyphs.createdRealityGlyph = true;
      this.emitClose();
    },
    formatGlyphEffect(effect) {
      if (this.realityGlyphLevel.lt(effect[0])) return i18n("modal", "realityGlyphCreationModalRequiresLevelX", [formatInt(effect[0])]);
      const config = GlyphEffects[effect[1]];
      const value = config.primary.effectValueForInput(this.realityGlyphLevel);
      return config.singleDesc.replace("{value}", config.primary.formatEffect(value));
    },
  },
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-reality-glyph-creation">
      <div>
        {{ creationMessage }}
      </div>
      <div class="o-available-effects-container">
        <div class="o-available-effects">
          {{ availableEffects }}
        </div>
        <div
          v-for="(effect, index) in possibleEffects"
          :key="index"
        >
          {{ formatGlyphEffect(effect) }}
        </div>
      </div>
      <PrimaryButton
        :enabled="!isDoomed && realityGlyphLevel.neq(0)"
      >
        {{ buttonLabel }}
      </PrimaryButton>
    </div>
  </ModalWrapper>
</template>

<style scoped>
.o-available-effects-container {
  margin: 1.5rem 0 2rem;
}

.o-available-effects {
  font-weight: bold;
}
</style>
