<script>
import GenericDimensionRowText from "@/components/GenericDimensionRowText";

export default {
  name: "ModernAntimatterDimensionRow",
  components: {
    GenericDimensionRowText
  },
  props: {
    tier: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
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
      buyUntil10: true,
      howManyCanBuy: new Decimal(0),
      isContinuumActive: false,
      continuumValue: new Decimal(0),
      isShown: false,
      isCostsAD: false,
      amountDisplay: "",
      hasTutorial: false,
      costJumps: new Decimal(),
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    name() {
      return i18n("other", "adRowModern_nthAD", [AntimatterDimension(this.tier).shortDisplayName]);
    },
    costDisplay() {
      return this.buyUntil10 ? format(this.until10Cost) : format(this.singleCost);
    },
    continuumString() {
      return formatFloat(this.continuumValue, 2);
    },
    showRow() {
      return this.isShown || this.isUnlocked || this.amount.gt(0);
    },
    boughtTooltip() {
      if (this.isCapped) return i18n("other", "adRowModern_nameless", [formatInt(1)]);
      if (this.isContinuumActive) return i18n("other", "adRowModern_continuum");
      return i18n("other", "adRowModern_purchased", [[formatInt, this.bought]]);
    },
    buttonPrefix() {
      if (!this.isUnlocked) return i18n("consts", "locked");
      if (this.isCapped) return i18n("other", "adRowModern_shattered");
      if (this.isContinuumActive) return i18n("other", "adRowModern_contValue");
      return i18n("other", "adRowModern_buyX", [formatInt(this.howManyCanBuy)]);
    },
    buttonValue() {
      if (this.isCapped) return "";
      if (this.isContinuumActive) return this.continuumString;
      return i18n("other", this.showCostTitle(this.singleCost) ? "adRowModern_ADcost" : "adRowModern_ADcostNoPrefix",
        [format(this.singleCost), i18n("consts", "nth", [], true)[Math.max(1, this.tier - 2)]], true)
        [this.isCostsAD ? 1 : 0];
    },
    hasLongText() {
      return this.buttonValue.length > 20;
    },
  },
  methods: {
    update() {
      const tier = this.tier;
      if (tier > DimBoost.maxDimensionsUnlockable && !this.isDoomed) return;
      const dimension = AntimatterDimension(tier);
      this.isUnlocked = dimension.isAvailableForPurchase;
      const buyUntil10 = player.buyUntil10;
      this.isCapped = tier === 8 && Enslaved.isRunning && dimension.bought.gte(1);
      this.multiplier.copyFrom(AntimatterDimension(tier).multiplier);
      this.amount.copyFrom(dimension.totalAmount);
      this.bought.copyFrom(dimension.bought);
      this.boughtBefore10.copyFrom(dimension.boughtBefore10);
      this.howManyCanBuy.copyFrom(buyUntil10 ? dimension.howManyCanBuy : Decimal.min(dimension.howManyCanBuy, 1));
      this.singleCost.copyFrom(dimension.cost);
      this.until10Cost.copyFrom(dimension.cost.times(Decimal.max(dimension.howManyCanBuy, 1)));
      if (tier < 8) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.isAffordable = dimension.isAffordable;
      this.buyUntil10 = buyUntil10;
      this.isContinuumActive = Laitela.continuumActive;
      if (this.isContinuumActive) this.continuumValue.copyFrom(dimension.continuumValue);
      this.isShown =
        (DimBoost.totalBoosts.gt(0) && DimBoost.totalBoosts.add(3).gte(tier)) || PlayerProgress.infinityUnlocked();
      this.isCostsAD = NormalChallenge(6).isRunning && tier > 2 && !this.isContinuumActive;
      this.amountDisplay = this.tier < 8 ? format(this.amount, 2) : formatInt(this.amount);
      this.hasTutorial = (tier === 1 && Tutorial.isActive(TUTORIAL_STATE.DIM1)) ||
        (tier === 2 && Tutorial.isActive(TUTORIAL_STATE.DIM2));
      this.costJumps.copyFrom(dimension.costBumps);
    },
    buy() {
      if (this.isContinuumActive) return;
      if (this.howManyCanBuy.eq(1)) {
        buyOneDimension(this.tier);
      } else {
        buyAsManyAsYouCanBuy(this.tier);
      }
    },
    showCostTitle(value) {
      return value.lt("1e1000000");
    },
    buttonClass() {
      return {
        "o-primary-btn o-primary-btn--new": true,
        "o-primary-btn--disabled": (!this.isAffordable && !this.isContinuumActive) || !this.isUnlocked || this.isCapped,
        "o-non-clickable o-continuum": this.isContinuumActive
      };
    },
    buttonTextClass() {
      return {
        "button-content l-modern-buy-ad-text": true,
        "tutorial--glow": this.isAffordable && this.hasTutorial
      };
    }
  }
};
</script>

<template>
  <div
    v-show="showRow"
    class="c-dimension-row l-dimension-row-antimatter-dim c-antimatter-dim-row l-dimension-single-row"
    :class="{ 'c-dim-row--not-reached': !isUnlocked }"
  >
    <GenericDimensionRowText
      :tier="tier"
      :name="name"
      :multiplier-text="formatX(multiplier, 2, 2)"
      :amount-text="amountDisplay"
      :rate="rateOfChange"
    />
    <div class="l-dim-row-multi-button-container c-modern-dim-tooltip-container">
      <div class="c-modern-dim-purchase-count-tooltip">
        {{ boughtTooltip }}
      </div>
      <button
        :class="buttonClass()"
        @click="buy"
      >
        <div :class="buttonTextClass()">
          <div>
            {{ buttonPrefix }}
          </div>
          <div :class="{ 'l-dim-row-small-text': hasLongText }">
            {{ buttonValue }}
          </div>
          <div
            v-if="hasTutorial"
            class="fas fa-circle-exclamation l-notification-icon"
          />
        </div>
        <div
          v-if="!isContinuumActive && isUnlocked && !isCapped"
          class="fill"
        >
          <div
            class="fill-purchased"
            :style="{ 'width': boughtBefore10.toNumber()*10 + '%' }"
          />
          <div
            class="fill-possible"
            :style="{ 'width': howManyCanBuy.toNumber()*10 + '%' }"
          />
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.l-modern-buy-ad-text {
  display: flex;
  flex-direction: column;
}

.o-non-clickable {
  cursor: auto;
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
