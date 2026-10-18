<script>
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "EPMultiplierButton",
  components: {
    PrimaryButton,
    PrimaryToggleButton
  },
  data() {
    return {
      isAutobuyerActive: false,
      isAutoUnlocked: false,
      isAffordable: false,
      multiplier: new Decimal(),
      cost: new Decimal()
    };
  },
  computed: {
    upgrade() {
      return EternityUpgrade.epMult;
    },
    autobuyer() {
      return Autobuyer.epMult;
    },
    classObject() {
      if (this.isDoomed) {
        return {
          "o-eternity-upgrade": true,
          "o-eternity-upgrade--useless": !this.isAffordable,
          "o-pelle-disabled-pointer": true,
          "o-pelle-disabled": true,
        };
      }
      return {
        "o-eternity-upgrade": true,
        "o-eternity-upgrade--available": this.isAffordable,
        "o-eternity-upgrade--unavailable": !this.isAffordable
      };
    },
    isDoomed: () => Pelle.isDoomed,
    autoep: () => i18n("eter", "autoep")
  },
  watch: {
    isAutobuyerActive(newValue) {
      Autobuyer.epMult.isActive = newValue;
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isAutoUnlocked = this.autobuyer.isUnlocked;
      this.isAutobuyerActive = this.autobuyer.isActive;
      this.multiplier.copyFrom(upgrade.effectValue);
      this.cost.copyFrom(upgrade.cost);
      this.isAffordable = upgrade.isAffordable;
    },
    purchaseUpgrade() {
      if (RealityUpgrade(15).isLockingMechanics) RealityUpgrade(15).tryShowWarningModal();
      else this.upgrade.purchase();
    }
  }
};
</script>

<template>
  <div class="l-spoon-btn-group l-margin-top">
    <button
      :class="classObject"
      @click="purchaseUpgrade"
    >
      <div :class="{ 'o-pelle-disabled': isDoomed }">
        {{ i18n("eter", "epxsource", [formatX(5)]) }}
        <br>
        {{ i18n("eter", "current", [formatX(multiplier, 2, 0)]) }}
      </div>
      <br>
      {{ i18n("eter", "cost", [[format, cost]]) }}
    </button>
    <PrimaryButton
      class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
      @click="upgrade.buyMax(false)"
    >
      {{ i18n("eter", "maxepx") }}
    </PrimaryButton>
    <PrimaryToggleButton
      v-if="isAutoUnlocked"
      v-model="isAutobuyerActive"
      :label="autoep"
      class="l--spoon-btn-group__little-spoon o-primary-btn--small-spoon"
    />
  </div>
</template>

<style scoped>
.l-margin-top {
  margin-top: 0.55rem;
}
</style>
