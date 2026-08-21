<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "SacrificeModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      currentMultiplier: new Decimal(),
      nextMultiplier: new Decimal(),
    };
  },
  computed: {
    topLabel() {
      return i18n("modal", "sacrificeModalTitle");
    },
    message() {
      if (Achievement(118).isUnlocked && !Pelle.isDoomed) {
        return i18n("modal", "sacrificeModalAch118");
      }
      return i18n("modal", "sacrificeModalNo118");
    },
    multiplierText() {
      return i18n("modal", "sacrificeModalCurrentMultiplier", [formatX(this.currentMultiplier, 2, 2), formatX(this.nextMultiplier, 2, 2)]);
    },
  },
  methods: {
    update() {
      this.currentMultiplier.copyFrom(Sacrifice.totalBoost);
      this.nextMultiplier.copyFrom(Sacrifice.nextBoost.times(Sacrifice.totalBoost));
    },
    handleYesClick() {
      sacrificeReset();
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="sacrifice"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
    <br>
    <div class="c-modal-message__text">
      {{ multiplierText }}
      <br>
    </div>
  </ModalWrapperChoice>
</template>
