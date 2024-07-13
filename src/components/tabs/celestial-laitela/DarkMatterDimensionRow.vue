<script>
export default {
  name: "DarkMatterDimensionRow",
  props: {
    tier: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      ascension: new Decimal(0),
      hasAscended: false,
      powerDMPerAscension: new Decimal(0),
      interval: new Decimal(0),
      powerDM: new Decimal(0),
      powerDE: new Decimal(0),
      intervalCost: new Decimal(0),
      powerDMCost: new Decimal(0),
      powerDECost: new Decimal(0),
      amount: new Decimal(0),
      canBuyInterval: false,
      canBuyPowerDM: false,
      canBuyPowerDE: false,
      isIntervalCapped: false,
      timer: new Decimal(0),
      timerPercent: new Decimal(0),
      intervalAscensionBump: new Decimal(10000),
      intervalAfterAscension: new Decimal(0),
      darkEnergyPerSecond: new Decimal(0),
      portionDE: new Decimal(0),
      productionPerSecond: new Decimal(0),
      percentPerSecond: 0,
      hoverOverAscension: false,
    };
  },
  computed: {
    name() {
      return `${DarkMatterDimension(this.tier).shortDisplayName} Dark Matter Dimension`;
    },
    ascensionText() {
      return `(⯅${formatInt(this.ascension)})`;
    },
    intervalClassObject() {
      return {
        "o-dark-matter-dimension-button": true,
        "o-dark-matter-dimension-button--available": this.canBuyInterval,
        "o-dark-matter-dimension-button--ascend": this.isIntervalCapped
      };
    },
    darkMatterClassObject() {
      return {
        "o-dark-matter-dimension-button": true,
        "o-dark-matter-dimension-button--available": this.hoverOverAscension || this.canBuyPowerDM,
        "o-dark-matter-dimension-button--accent": this.hoverOverAscension
      };
    },
    darkEnergyClassObject() {
      return {
        "o-dark-matter-dimension-button": true,
        "o-dark-matter-dimension-button--available": this.hoverOverAscension || this.canBuyPowerDE,
        "o-dark-matter-dimension-button--accent": this.hoverOverAscension
      };
    },
    intervalText() {
      const interval = this.hoverOverAscension ? this.intervalAfterAscension : this.interval;
      const str = `${TimeSpan.fromMilliseconds(interval, 2, 2).toStringShort()}`;
      const line1 = this.hoverOverAscension ? `<b>${str}</b>` : str;

      let line2;
      if (this.isIntervalCapped) line2 = this.hoverOverAscension ? "On ascend ➜" : "Ascend!";
      else line2 = `Cost: ${this.formatDMCost(this.intervalCost)} DM`;
      return ` ${line1}<br>${line2}`;
    },
    darkMatterText() {
      const dm = this.powerDM.times(this.hoverOverAscension ? this.powerDMPerAscension : 1);
      const str = `DM ${formatX(dm, 2, 2)}`;
      const line1 = this.hoverOverAscension ? `<b>${str}</b>` : str;

      const ascMult = this.powerDMPerAscension.mul(this.interval).div(this.intervalAfterAscension);
      const line2 = this.hoverOverAscension
        ? `${formatX(ascMult, 2, 2)} / sec`
        : `Cost: ${this.formatDMCost(this.powerDMCost)} DM`;
      return `${line1}<br>${line2}`;
    },
    darkEnergyText() {
      const de = this.powerDE.mul(this.hoverOverAscension ? POWER_DE_PER_ASCENSION : 1);
      const str = `DE +${format(de, 2, 4)}`;
      const line1 = this.hoverOverAscension ? `<b>${str}</b>` : str;
      const ascMult = POWER_DE_PER_ASCENSION.mul(this.interval).div(this.intervalAfterAscension);
      const line2 = this.hoverOverAscension
        ? `${formatX(ascMult, 2, 2)} / sec`
        : `Cost: ${this.formatDMCost(this.powerDECost)} DM`;
      return `${line1}<br>${line2}`;
    },
    ascensionTooltip() {
      return `Interval is capped at ${formatInt(DarkMatterDimension(this.tier).intervalPurchaseCap)}ms.
        Ascension multiplies interval by ${formatInt(this.intervalAscensionBump)},
        DM by ${formatInt(this.powerDMPerAscension)}, and DE by ${formatInt(POWER_DE_PER_ASCENSION)}.`;
    }
  },
  methods: {
    update() {
      const dim = DarkMatterDimension(this.tier);
      this.isUnlocked = dim.isUnlocked;
      this.ascension.copyFrom(dim.ascensions);
      this.hasAscended = this.ascension.gt(0);
      this.powerDMPerAscension.copyFrom(dim.powerDMPerAscension);
      this.interval.copyFrom(dim.interval);
      this.powerDM.copyFrom(dim.powerDM);
      this.powerDE.copyFrom(dim.powerDE);
      this.intervalCost.copyFrom(dim.intervalCost);
      this.powerDMCost.copyFrom(dim.powerDMCost);
      this.powerDECost.copyFrom(dim.powerDECost);
      this.amount.copyFrom(dim.amount);
      this.canBuyInterval = dim.canBuyInterval;
      this.canBuyPowerDM = dim.canBuyPowerDM;
      this.canBuyPowerDE = dim.canBuyPowerDE;
      this.isIntervalCapped = dim.interval.lte(dim.intervalPurchaseCap);
      this.timer.copyFrom(dim.realDiff);
      this.timerPercent.copyFrom(this.timer.div(this.interval));
      this.intervalAscensionBump.copyFrom(SingularityMilestone.ascensionIntervalScaling.effectOrDefault(new Decimal(1200)));
      this.intervalAfterAscension.copyFrom(dim.intervalAfterAscension);
      this.darkEnergyPerSecond.copyFrom(dim.productionPerSecond);
      this.portionDE.copyFrom(this.darkEnergyPerSecond.div(Currency.darkEnergy.productionPerSecond));
      this.productionPerSecond = this.dimensionProduction(this.tier);
      this.percentPerSecond = Decimal.divide(this.productionPerSecond, this.amount).clampMax(1).toNumber();
      if (!this.isIntervalCapped) this.hoverOverAscension = false;
    },
    handleIntervalClick() {
      if (this.isIntervalCapped) DarkMatterDimension(this.tier).ascend();
      else DarkMatterDimension(this.tier).buyInterval();
    },
    buyPowerDM() {
      DarkMatterDimension(this.tier).buyPowerDM();
    },
    buyPowerDE() {
      DarkMatterDimension(this.tier).buyPowerDE();
    },
    // All the values are internally Decimals and technically allowed to go above Infinity. This is a special case
    // however; it looks better in-game if we just format it as Infinity instead, as the resource used for these costs
    // is itself hardcapped at e308 and we specifically want to format here (and nowhere else) as Infinity.
    formatDMCost(cost) {
      return cost.gt(Number.MAX_VALUE) ? Notations.current.infinite : format(cost, 2);
    },
    dimensionProduction(tier) {
      if (tier === 4) return SingularityMilestone.dim4Generation.effectOrDefault(new Decimal(0));
      const prodDim = DarkMatterDimension(tier + 1);
      return prodDim.amount.times(prodDim.powerDM).divide(prodDim.interval).times(1000);
    },
    hoverState(state) {
      if (!this.isIntervalCapped) return;
      this.hoverOverAscension = state;
    }
  }
};
</script>

<template>
  <div
    v-if="isUnlocked"
    class="c-dark-matter-dimension-container"
  >
    <div class="o-dark-matter-dimension-amount">
      {{ name }}<span v-if="hasAscended"> {{ ascensionText }}</span>: {{ format(amount, 2) }}
    </div>
    <div>
      Average gain: {{ format(productionPerSecond, 2, 2) }}/s
      (+{{ formatPercents(percentPerSecond, 2, 2) }}/s)
    </div>
    <div class="c-dark-matter-dimension-buttons">
      <button
        :class="intervalClassObject"
        @click="handleIntervalClick"
        @mouseover="hoverState(true)"
        @mouseleave="hoverState(false)"
      >
        <span
          v-if="isIntervalCapped"
          :ach-tooltip="ascensionTooltip"
        >
          <i class="fas fa-question-circle" />
        </span>
        <span v-html="intervalText" />
      </button>
      <button
        :class="darkMatterClassObject"
        @click="buyPowerDM"
      >
        <span v-html="darkMatterText" />
      </button>
      <button
        :class="darkEnergyClassObject"
        @click="buyPowerDE"
      >
        <span v-html="darkEnergyText" />
      </button>
    </div>
    <div v-if="interval.gt(200)">
      Tick: {{ formatInt(timer) }} ms ({{ formatPercents(timerPercent, 1) }})
    </div>
    <div v-else>
      {{ format(interval.div(1000).recip(), 2, 2) }} ticks / sec
    </div>
    <div>
      Dark Energy: {{ format(darkEnergyPerSecond, 2, 4) }}/s ({{ formatPercents(portionDE, 1) }} of total)
    </div>
  </div>
</template>