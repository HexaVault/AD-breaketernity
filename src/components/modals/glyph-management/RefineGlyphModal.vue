<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "RefineGlyphModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    idx: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      resourceAmount: new Decimal(),
      resourceUnlocked: false,
      gain: new Decimal(),
      after: new Decimal(),
      cap: new Decimal(),
      confirmedRefine: false
    };
  },
  computed: {
    glyph() {
      return Glyphs.findByInventoryIndex(this.idx);
    },
    resource() {
      return GlyphSacrificeHandler.glyphAlchemyResource(this.glyph);
    },
    resourceName() {
      return this.resource.name;
    },
  },
  methods: {
    update() {
      const resource = this.resource;
      this.resourceAmount.copyFrom(resource.amount);
      this.resourceUnlocked = resource.isUnlocked;
      this.gain.copyFrom(GlyphSacrificeHandler.glyphRefinementGain(this.glyph));
      this.cap.copyFrom(GlyphSacrificeHandler.glyphEffectiveCap(this.glyph));

      this.after = this.resourceAmount.add(this.gain);

      const newGlyph = Glyphs.findByInventoryIndex(this.idx);
      if (this.glyph !== newGlyph && !this.confirmedRefine) {

        // Why is confirmedRefine here: refer to SacrificeGlyphModal.vue

        this.emitClose();
        Modal.message.show("The selected Glyph changed position or was otherwise changed!");
      }
    },
    handleYesClick() {
      this.confirmedRefine = true;
      GlyphSacrificeHandler.refineGlyph(this.glyph);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="glyphRefine"
    @confirm="handleYesClick"
  >
    <template #header>
      You are about to refine a Glyph
    </template>
    <div
      v-if="resourceUnlocked"
      class="c-modal-message__text"
    >
      Refining a Glyph will remove the Glyph from your inventory, and in return,
      you will increase your {{ resourceName }} Alchemy resource from
      {{ format(resourceAmount, 2, 2) }} to {{ format(after, 2, 2) }}.
      This Glyph can raise your {{ resourceName }} resource to at most {{ format(cap, 2, 2) }}.
    </div>
    <div
      v-else
      class="c-modal-message__text"
    >
      You cannot gain any {{ resourceName }} alchemy resource because you have not
      unlocked this Glyph's resource yet. You can still refine it anyway, but nothing
      will happen. Consider sacrificing the Glyph instead.
    </div>
  </ModalWrapperChoice>
</template>
