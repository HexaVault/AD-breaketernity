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
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.realityGlyphLevel = AlchemyResource.reality.effectValue;
      const realityEffectConfigs = GlyphEffects.all.filter(eff => eff.id.includes("reality"));
      this.possibleEffects = realityEffectConfigs.map(cfg => cfg.id);
    },
    createRealityGlyph() {
      if (GameCache.glyphInventorySpace.value === 0) {
        Modal.message.show("No available inventory space; Sacrifice some Glyphs to free up space.",
          { closeEvent: GAME_EVENT.GLYPHS_CHANGED });
        return;
      }
      Glyphs.addToInventoryReality(this.realityGlyphLevel);
      AlchemyResource.reality.amount = new Decimal();
      player.reality.glyphs.createdRealityGlyph = true;
      this.emitClose();
    },
    formatGlyphEffect(effect) {

      const eff = GlyphEffects.all.filter(eff => eff.id.includes(effect));
      const efflevel = realityGlyphEffectLevelThresholds[eff[0].intID - 32];
      
      if (this.realityGlyphLevel.lt(efflevel)) return `(Requires Glyph level ${formatInt(efflevel)})`;
      const config = GlyphEffects[effect];
      const value = config.effect(this.realityGlyphLevel, rarityToStrength(100));
      const effectTemplate = config.singleDesc;
      return effectTemplate.replace("{value}", config.formatEffect(value));
    }
  },
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      Reality Glyph Creation
    </template>
    <div class="c-reality-glyph-creation">
      <div>
        Create a level {{ formatInt(realityGlyphLevel) }} Reality Glyph.
        Rarity will always be {{ formatPercents(1) }} and
        level scales on your current Reality Resource amount (which is all consumed). All other Alchemy Resources will
        be unaffected. Reality Glyphs have unique effects, some of which are only available with higher level Glyphs.
        Reality Glyphs can also be sacrificed to increase all Memory Chunk gain. Like Effarig Glyphs,
        you cannot equip more than one at the same time.
      </div>
      <div class="o-available-effects-container">
        <div class="o-available-effects">
          Available Effects:
        </div>
        <div
          v-for="(effect, index) in possibleEffects"
          :key="index"
        >
          {{ formatGlyphEffect(effect) }}
        </div>
      </div>
      <PrimaryButton
        v-if="isDoomed"
        :enabled="false"
      >
        You cannot create Reality Glyphs while Doomed
      </PrimaryButton>
      <PrimaryButton
        v-else-if="realityGlyphLevel.neq(0)"
        @click="createRealityGlyph"
      >
        Create a Reality Glyph!
      </PrimaryButton>
      <PrimaryButton
        v-else
        :enabled="false"
      >
        Reality Glyph level must be higher than {{ formatInt(0) }}
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
