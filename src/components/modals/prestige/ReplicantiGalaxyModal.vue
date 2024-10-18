<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ReplicantiGalaxyModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      replicanti: new Decimal(),
      divideReplicanti: false,
      canBeBought: 0,
    };
  },
  computed: {
    topLabel() {
      return i18n("modal", "rgHeader", [quantifyInt(i18n("modal", "rg"), this.canBeBought)]);
    },
    message() {
      const reductionString = this.divideReplicanti
        ? i18n("modal", "rgDevideRep", [format(Number.MAX_VALUE, 2, 2), format(this.replicanti, 2, 2),
          format(this.replicanti.divide(Decimal.pow(Number.MAX_VALUE, this.canBeBought)), 2, 2)
        ])
        : i18n("modal", "rgResetRep", [formatInt(1)]);
      return i18n("modal", "rgMessage", [reductionString]);
    }
  },
  methods: {
    update() {
      this.replicanti.copyFrom(player.replicanti.amount);
      this.divideReplicanti = Achievement(126).isUnlocked;
      this.canBeBought = Replicanti.galaxies.gain;
      if (this.replicanti.lt(Number.MAX_VALUE)) this.emitClose();
    },
    handleYesClick() {
      replicantiGalaxy(false);
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="replicantiGalaxy"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
  </ModalWrapperChoice>
</template>
