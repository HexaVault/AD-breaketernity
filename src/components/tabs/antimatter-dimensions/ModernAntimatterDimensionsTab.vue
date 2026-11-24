<script>
import AntimatterDimensionProgressBar from "./AntimatterDimensionProgressBar";
import AntimatterDimensionRow from "@/components/tabs/antimatter-dimensions/ModernAntimatterDimensionRow";
import AntimatterGalaxyRow from "@/components/tabs/antimatter-dimensions/ModernAntimatterGalaxyRow";
import DimensionBoostRow from "@/components/tabs/antimatter-dimensions/ModernDimensionBoostRow";
import PrimaryButton from "@/components/PrimaryButton";
import TickspeedRow from "@/components/tabs/antimatter-dimensions/TickspeedRow";

export default {
  name: "ModernAntimatterDimensionsTab",
  components: {
    PrimaryButton,
    AntimatterDimensionProgressBar,
    AntimatterDimensionRow,
    AntimatterGalaxyRow,
    DimensionBoostRow,
    TickspeedRow
  },
  data() {
    return {
      hasDimensionBoosts: false,
      buyUntil10: true,
      isSacrificeUnlocked: false,
      isSacrificeAffordable: false,
      buy10Mult: new Decimal(0),
      currentSacrifice: new Decimal(0),
      sacrificeBoost: new Decimal(0),
      disabledCondition: "",
      isQuickResetAvailable: false,
      hasContinuum: false,
      isContinuumActive: false,
      multiplierText: "",
      isFullyAutomated: false,
    };
  },
  computed: {
    sacrificeTooltip() {
      return i18n("other", "adTabModern_BoostTooltip", [formatX(this.sacrificeBoost, 2, 2)], true)[Number(this.isFullyAutomated)];
    },
    sacrificeButtonLabel() {
      return i18n("other", "adTabModern_sacButtonText", [formatX(this.sacrificeBoost, 2, 2), this.disabledCondition],
        // eslint-disable-next-line no-nested-ternary
        true)[this.isFullyAutomated ? 0 : (this.isSacrificeAffordable ? 1 : 2)];
    },
    noGainResetLabel() {
      return i18n("other", "hasDimensionBoosts", [], true)[Number(this.hasDimensionBoosts)];
    },
    maxLabel() {
      return i18n("other", "adTabModern_max");
    }
  },
  methods: {
    maxAll() {
      maxAll();
    },
    sacrifice() {
      sacrificeBtnClick();
    },
    // Toggle single/10 without Continuum, otherwise cycle through all 3 if it's unlocked
    changeBuyMode() {
      if (!this.hasContinuum) {
        player.buyUntil10 = !player.buyUntil10;
        return;
      }
      // "Continuum" => "Until 10" => "Buy 1" => "Continuum"
      if (this.isContinuumActive) {
        Laitela.setContinuum(false);
        player.buyUntil10 = true;
      } else if (player.buyUntil10) {
        player.buyUntil10 = false;
      } else {
        if (ImaginaryUpgrade(21).isLockingMechanics && player.auto.disableContinuum) {
          ImaginaryUpgrade(21).tryShowWarningModal();
          return;
        }
        Laitela.setContinuum(true);
      }
    },
    getUntil10Display() {
      if (this.isContinuumActive) return i18n("other", "adTabModern_buyMode", [formatInt(10), formatInt(1)], true)[0];
      return i18n("other", "adTabModern_buyMode", [formatInt(10), formatInt(1)], true)[this.buyUntil10 ? 1 : 2];
    },
    update() {
      this.hasDimensionBoosts = player.dimensionBoosts.gt(0);
      this.buyUntil10 = player.buyUntil10;
      this.hasContinuum = Laitela.continuumUnlocked;
      this.isContinuumActive = Laitela.continuumActive;
      this.isQuickResetAvailable = Player.isInAntimatterChallenge && Player.antimatterChallenge.isQuickResettable;

      const isSacrificeUnlocked = Sacrifice.isVisible;
      this.isSacrificeUnlocked = isSacrificeUnlocked;

      this.buy10Mult.copyFrom(AntimatterDimensions.buyTenMultiplier);

      this.multiplierText = i18n("other", "adTabModern_multiplierText",
        [formatInt(10), formatX(this.buy10Mult, 2, 2), formatX(this.currentSacrifice, 2, 2)], true)[Number(this.isSacrificeUnlocked)];
      if (!isSacrificeUnlocked) return;
      this.isSacrificeAffordable = Sacrifice.canSacrifice;
      this.isFullyAutomated = Autobuyer.sacrifice.isActive && Achievement(118).isEffectActive &&
        (this.isSacrificeAffordable || Sacrifice.nextBoost.lte(1));
      this.currentSacrifice.copyFrom(Sacrifice.totalBoost);
      this.sacrificeBoost.copyFrom(Sacrifice.nextBoost);
      this.disabledCondition = Sacrifice.disabledCondition;
      this.multiplierText += sacText;
    }
  }
};
</script>

<template>
  <div class="l-antimatter-dim-tab">
    <div class="modes-container">
      <button
        class="o-primary-btn l-button-container"
        @click="changeBuyMode"
      >
        {{ getUntil10Display() }}
      </button>
      <PrimaryButton
        v-show="isSacrificeUnlocked"
        v-tooltip="sacrificeTooltip"
        :enabled="isSacrificeAffordable && !isFullyAutomated"
        class="o-primary-btn--sacrifice"
        @click="sacrifice"
      >
        <span>{{ sacrificeButtonLabel }}</span>
      </PrimaryButton>
      <button
        class="o-primary-btn l-button-container"
        @click="maxAll"
      >
        {{ maxLabel }}
      </button>
    </div>
    <span>{{ multiplierText }}</span>
    <TickspeedRow />
    <div class="l-dimensions-container">
      <AntimatterDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
      />
    </div>
    <div class="resets-container">
      <DimensionBoostRow />
      <PrimaryButton
        v-if="isQuickResetAvailable"
        class="o-primary-btn--quick-reset"
        onclick="softReset(-1, true, true, false)"
      >
        {{ noGainResetLabel }}
      </PrimaryButton>
      <AntimatterGalaxyRow />
    </div>
    <AntimatterDimensionProgressBar />
  </div>
</template>

<style scoped>
.l-button-container {
  width: 100px;
  height: 30px;
  padding: 0;
}
</style>
