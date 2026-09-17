<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ClassicAntimatterDimensionsTabHeader",
  components: {
    PrimaryButton
  },
  data() {
    return {
      isSacrificeUnlocked: false,
      isSacrificeAffordable: false,
      currentSacrifice: new Decimal(0),
      sacrificeBoost: new Decimal(0),
      disabledCondition: "",
      isFullyAutomated: false,
    };
  },
  computed: {
    sacrificeTooltip() {
      return i18n("other", "adTabHeadClassic_BoostTooltip", [formatX(this.sacrificeBoost, 2, 2)], true)[Number(this.isFullyAutomated)];
    },
    fullAutoSac() {
      return i18n("other", "adTabHeadClassic_BoostAuto");
    },
    sacText() {
      return i18n("other", "adTabHeadClassic_BoostNormal", [formatX(this.sacrificeBoost, 2, 2)]);
    },
    disabledSac() {
      return i18n("other", "adTabHeadClassic_BoostDisabled", [this.disabledCondition]);
    },
    maxAllLabel() {
      return i18n("other", "adTabHeadClassic_Max");
    }
  },
  methods: {
    update() {
      const isSacrificeUnlocked = Sacrifice.isVisible;
      this.isSacrificeUnlocked = isSacrificeUnlocked;
      if (!isSacrificeUnlocked) return;
      this.isSacrificeAffordable = Sacrifice.canSacrifice;
      this.isFullyAutomated = Autobuyer.sacrifice.isActive && Achievement(118).isEffectActive &&
      (this.isSacrificeAffordable || Sacrifice.isDisabledDueToMultiplier);
      this.currentSacrifice.copyFrom(Sacrifice.totalBoost);
      this.sacrificeBoost.copyFrom(Sacrifice.nextBoost);
      this.disabledCondition = Sacrifice.disabledCondition;
    },
    sacrifice() {
      sacrificeBtnClick();
    },
    maxAll() {
      maxAll();
    }
  }
};
</script>

<template>
  <div class="l-antimatter-dim-tab__header">
    <PrimaryButton
      v-show="isSacrificeUnlocked"
      v-tooltip="sacrificeTooltip"
      :enabled="isSacrificeAffordable && !isFullyAutomated"
      class="o-primary-btn--sacrifice"
      @click="sacrifice"
    >
      <span v-if="isFullyAutomated">
        {{ fullAutoSac }}
      </span>
      <span v-else-if="isSacrificeAffordable">{{ sacText }}</span>
      <span v-else>{{ disabledSac }}</span>
    </PrimaryButton>
    <PrimaryButton
      class="o-primary-btn--buy-max"
      @click="maxAll"
    >
      {{ maxAllLabel }}
    </PrimaryButton>
  </div>
</template>
