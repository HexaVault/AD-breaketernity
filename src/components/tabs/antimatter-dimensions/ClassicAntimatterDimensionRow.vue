<script>
import GenericDimensionRowText from "@/components/GenericDimensionRowText";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ClassicAntimatterDimensionRow",
  components: {
    GenericDimensionRowText,
    PrimaryButton
  },
  props: {
    tier: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      end: false,
      isUnlocked: false,
      isCapped: false,
      multiplier: new Decimal(0),
      amount: new Decimal(0),
      bought: new Decimal(0),
      boughtBefore10: new Decimal(0),
      rateOfChange: new Decimal(0),
      singleCost: new Decimal(0),
      until10Cost: new Decimal(0),
      isAffordable: false,
      isAffordableUntil10: false,
      isContinuumActive: false,
      continuumValue: 0,
      isShown: false,
      isCostsAD: false,
      formattedAmount: null,
      hasTutorial: false,
      costJumps: new Decimal(),
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    name() {
      return i18n("other", "adRow_nthAD", [AntimatterDimension(this.tier).shortDisplayName]);
    },
    amountText() {
      if (this.formattedAmount) return this.formattedAmount;
      const amount = this.tier < 8 ? format(this.amount, 2) : formatInt(this.amount);
      return `${amount} (${formatInt(this.boughtBefore10)})`;
    },
    singleText() {
      if (this.isCapped) return i18n("consts", "capped");
      return i18n("other", this.showCostTitle(this.singleCost) ? "adRow_ADcost" : "adRow_ADcostNoPrefix",
        [format(this.singleCost), i18n("consts", "nth", [], true)[Math.max(1, this.tier - 2)]], true)
        [this.isCostsAD ? 1 : 0];
    },
    until10Text() {
      if (this.isCapped) return i18n("other", "adRow_shattered");
      if (this.isContinuumActive) return i18n("other", "adRow_contValue", [this.continuumString]);

      const string = i18n("other", this.showCostTitle(this.until10Cost) ? "adRow_ADcost10" : "adRow_ADcost10NoPrefix",
        [formatInt(10), format(this.until10Cost), i18n("consts", "nth", [], true)[Math.max(1, this.tier - 2)]], true)
        [this.isCostsAD ? 1 : 0];

      return this.costJumps.gt(0) ? `${string} (+${formatInt(this.costJumps)})` : string;
    },
    continuumString() {
      return formatFloat(this.continuumValue, 2);
    },
    showRow() {
      return this.isShown || this.isUnlocked || this.amount.gt(0);
    },
    boughtTooltip() {
      if (this.isCapped) return i18n("other", "adRow_nameless", [formatInt(1)]);
      if (this.isContinuumActive) return i18n("other", "adRow_continuum");
      return i18n("other", "adRow_purchased", [[formatInt, this.bought]]);
    },
    costUnit() {
      return `${AntimatterDimension(this.tier - 2).shortDisplayName} AD`;
    },
    buySingleClass() {
      return {
        "o-primary-btn--buy-ad o-primary-btn--buy-single-ad c-dim-tooltip-container": true,
        "l-dim-row-small-text": this.isLongText(this.singleText) || !this.showCostTitle(this.singleCost),
      };
    },
    buyTenClass() {
      return {
        "o-primary-btn--buy-ad o-primary-btn--buy-dim c-dim-tooltip-container": true,
        "o-primary-btn--buy-10-ad": !this.isContinuumActive,
        "o-primary-btn--continuum-ad o-continuum": this.isContinuumActive,
        "l-dim-row-small-text": this.isLongText(this.until10Text) && !this.isContinuumActive
      };
    }
  },
  methods: {
    update() {
      const tier = this.tier;
      if (tier === 8 && this.isDoomed) this.formattedAmount = formatInt(this.amount);
      if (tier > DimBoost.maxDimensionsUnlockable) return;
      const dimension = AntimatterDimension(tier);
      this.isUnlocked = dimension.isAvailableForPurchase;
      this.isCapped = tier === 8 && Enslaved.isRunning && dimension.bought.gte(1);
      this.multiplier.copyFrom(dimension.multiplier);
      this.amount.copyFrom(dimension.totalAmount);
      this.bought.copyFrom(dimension.bought);
      this.boughtBefore10.copyFrom(dimension.boughtBefore10);
      this.singleCost.copyFrom(dimension.cost);
      this.until10Cost.copyFrom(dimension.costUntil10);
      if (tier < 8) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.isAffordable = dimension.isAffordable;
      this.isAffordableUntil10 = dimension.isAffordableUntil10;
      this.isContinuumActive = Laitela.continuumActive;
      if (this.isContinuumActive) this.continuumValue = dimension.continuumValue;
      this.isShown =
        (DimBoost.totalBoosts.gt(0) && DimBoost.totalBoosts.add(3).gte(tier)) || PlayerProgress.infinityUnlocked();
      this.isCostsAD = NormalChallenge(6).isRunning && tier > 2 && !this.isContinuumActive;
      this.hasTutorial = (tier === 1 && Tutorial.isActive(TUTORIAL_STATE.DIM1)) ||
        (tier === 2 && Tutorial.isActive(TUTORIAL_STATE.DIM2));
      this.costJumps.copyFrom(dimension.costBumps);
    },
    buySingle() {
      if (this.isContinuumActive) return;
      buyOneDimension(this.tier);
    },
    buyUntil10() {
      if (this.isContinuumActive) return;
      buyManyDimension(this.tier);
    },
    showCostTitle(value) {
      return value.max(1).log10().lte(1e6);
    },
    isLongText(str) {
      return str.length > 20;
    },
    tutorialClass() {
      return {
        "l-glow-container": true,
        "tutorial--glow": this.isAffordable && this.hasTutorial
      };
    },
  }
};
</script>

<template>
  <div
    v-show="showRow"
    class="c-dimension-row c-antimatter-dim-row l-dimension-single-row"
    :class="{ 'c-dim-row--not-reached': !isUnlocked }"
  >
    <GenericDimensionRowText
      :tier="tier"
      :name="name"
      :multiplier-text="formatX(multiplier, 2, 2)"
      :amount-text="amountText"
      :rate="rateOfChange"
    />
    <div class="l-dim-row-multi-button-container">
      <PrimaryButton
        v-if="!isContinuumActive"
        :enabled="isAffordable && !isCapped && isUnlocked"
        :class="buySingleClass"
        @click="buySingle"
      >
        <div :class="tutorialClass()">
          {{ singleText }}
        </div>
        <div class="c-dim-purchase-count-tooltip">
          {{ boughtTooltip }}
        </div>
        <div
          v-if="hasTutorial"
          class="fas fa-circle-exclamation l-notification-icon"
        />
      </PrimaryButton>
      <PrimaryButton
        :enabled="(isAffordableUntil10 || isContinuumActive) && !isCapped && isUnlocked"
        :class="buyTenClass"
        @click="buyUntil10"
      >
        {{ until10Text }}
        <div class="c-dim-purchase-count-tooltip">
          {{ boughtTooltip }}
        </div>
      </PrimaryButton>
    </div>
  </div>
</template>

<style scoped>
.l-glow-container {
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  border-radius: var(--var-border-radius, inherit);
}

.o-continuum {
  border-color: var(--color-laitela--accent);
  color: var(--color-laitela--accent);
  background: var(--color-laitela--base);
}

.o-continuum:hover {
  border-color: var(--color-laitela--accent);
  color: var(--color-laitela--base);
  background: var(--color-laitela--accent);
}
</style>
