<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ArmageddonModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      isDoomed: false,
      remnantsGain: new Decimal(0),
      realityShardGain: new Decimal(0),
      nextRealityShardGain: new Decimal(0),
      canArmageddon: false,
    };
  },
  computed: {
    topLabel() {
      if (!this.isDoomed) return i18n("modal", "armageddonModalAboutToDoom");
      return i18n("modal", "armageddonModalTitle");
    },
    message() {
      const isFirstReset = (Currency.remnants.eq(0))
        ? i18n("modal", "armageddonModalFirstReset", [[x => format(x, 2, 2), this.nextRealityShardGain]])
        : i18n("modal", "armageddonModalNotFirstReset", [format(this.realityShardGain, 2, 2),
          format(this.nextRealityShardGain, 2, 2)]);

      return i18n("modal", "ArmaReset", [[x => format(x, 2, 0), this.remnantsGain], isFirstReset]);
    },
    doomingText() {
      return i18n("modal", "armageddonModalDoomInfo");
    },
    isSure() {
      return i18n("modal", "armageddonModalConfirmation");
    }
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.remnantsGain.copyFrom(Pelle.remnantsGain);
      this.realityShardGain.copyFrom(Pelle.realityShardGainPerSecond);
      this.nextRealityShardGain.copyFrom(Pelle.nextRealityShardGain);
      this.canArmageddon = Pelle.canArmageddon;
    },
    handleYesClick() {
      Pelle.initializeRun();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    :option="isDoomed ? 'armageddon' : undefined"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div
      v-if="!isDoomed"
      class="c-modal-message__text"
    >
      {{ doomingText }}
      <br>
      <br>
      {{ isSure }}
    </div>
    <div
      v-else
      class="c-modal-message__text"
    >
      {{ message }}
    </div>
  </ModalWrapperChoice>
</template>
