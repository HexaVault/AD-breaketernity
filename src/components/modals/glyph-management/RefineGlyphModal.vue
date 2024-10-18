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
    topLabel() {
      return i18n("modal", "aboutToRefine");
    },
    isUnlockedMessage() {
      return i18n("modal", "refineMsgA", [
        resourceName, format(this.resourceAmount, 2, 2), format(this.after, 2, 2),
        resourceName, format(this.cap, 2, 2)
      ]);
    },
    isntUnlockedMessage() {
      return i18n("modal", "refineMsgA", [this.resourceName]);
    }
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
        Modal.message.show(i18n("modal", "glyphMoveModal"));
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
      {{ topLabel }}
    </template>
    <div
      v-if="resourceUnlocked"
      class="c-modal-message__text"
    >
      {{ isntUnlockedMessage }}
    </div>
    <div
      v-else
      class="c-modal-message__text"
    >
      {{ isntUnlockedMessage }}
    </div>
  </ModalWrapperChoice>
</template>
