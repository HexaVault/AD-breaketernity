<script>
export default {
  name: "RealityButton",
  data() {
    return {
      canReality: false,
      showSpecialEffect: false,
      hasRealityStudy: false,
      machinesGained: new Decimal(),
      projectedRM: new Decimal(),
      newIMCap: new Decimal(),
      realityTime: new Decimal(),
      glyphLevel: new Decimal(),
      nextGlyphPercent: 0,
      nextMachineEP: new Decimal(),
      shardsGained: new Decimal(),
      currentShardsRate: new Decimal(),
      bestShardRate: new Decimal(),
      bestShardRateVal: new Decimal(),
      ppGained: new Decimal(),
      celestialRunText: ["", "", "", "", ""]
    };
  },
  computed: {
    formatMachinesGained() {
      if (this.machinesGained.gt(0)) return `Machines gained: ${format(this.machinesGained, 2)}`;
      return "No Machines gained";
    },
    formatMachineStats() {
      if (!PlayerProgress.realityUnlocked() && this.nextMachineEP.gt("1e8000")) {
        return `(Capped this Reality!)`;
      }
      if (this.machinesGained.gt(0) && this.machinesGained.lt(100)) {
        return `(Next at ${format(this.nextMachineEP, 2)} EP)`;
      }
      if (this.machinesGained.eq(0) && this.newIMCap.eq(0)) {
        return `(Projected: ${format(this.projectedRM, 2)} RM)`;
      }
      if (this.newIMCap.neq(0)) {
        return `(iM Cap: ${formatMachines(0, this.newIMCap)})`;
      }
      if (this.machinesGained.lt(Number.MAX_VALUE)) {
        return `(${format(this.machinesGained.divide(this.realityTime), 2, 2)} RM/min)`;
      }
      return "";
    },
    formatGlyphLevel() {
      if (this.glyphLevel.gte(1e4)) return `Glyph level: ${formatInt(this.glyphLevel)}`;
      return `Glyph level: ${formatInt(this.glyphLevel)} (${this.nextGlyphPercent} to next)`;
    },
    showShardsRate() {
      return this.currentShardsRate;
    },
    shardsGainedText() {
      return quantify("Relic Shard", this.shardsGained, 2);
    },
    classObject() {
      return {
        "c-reality-button--unlocked": this.canReality,
        "c-reality-button--locked": !this.canReality,
        "c-reality-button--special": this.showSpecialEffect,
      };
    }
  },
  methods: {
    percentToNextGlyphLevelText() {
      const glyphState = getGlyphLevelInputs();
      let level = glyphState.actualLevel;
      if (!level.isFinite()) level = new Decimal();
      const decimalPoints = this.glyphLevel.gt(1e3) ? 0 : 1;
      return `${formatPercents(level.sub(level.floor()).clampMax(0.999), decimalPoints)}`;
    },
    update() {
      this.hasRealityStudy = TimeStudy.reality.isBought;
      this.canReality = isRealityAvailable();
      this.showSpecialEffect = this.hasSpecialReward();
      if (!this.canReality) {
        this.shardsGained = new Decimal();
        return;
      }
      function EPforRM(rm) {
        const adjusted = Decimal.divide(rm, MachineHandler.realityMachineMultiplier);
        if (adjusted.lte(1)) return Decimal.pow10(4000);
        if (adjusted.lte(10)) return Decimal.pow10(adjusted.add(26).mul(4000).div(27));
        let result = Decimal.pow10(adjusted.log10().div(3).add(1).mul(4e3));
        if (!PlayerProgress.realityUnlocked() && result.gte("1e6000")) {
          result = result.div("1e6000").pow(4).times("1e6000");
        }
        return result;
      }

      const multiplier = simulatedRealityCount(false).add(1);
      this.projectedRM = MachineHandler.gainedRealityMachines.times(multiplier)
        .clampMax(MachineHandler.hardcapRM);
      this.newIMCap = MachineHandler.projectedIMCap;
      this.machinesGained = this.projectedRM.clampMax(MachineHandler.distanceToRMCap);
      this.realityTime.copyFrom(Time.thisRealityRealTime.totalMinutes);
      this.glyphLevel.copyFrom(gainedGlyphLevel().actualLevel);
      this.nextGlyphPercent = this.percentToNextGlyphLevelText();
      this.nextMachineEP.copyFrom(EPforRM(this.machinesGained.plus(1)));
      this.ppGained.copyFrom(multiplier);
      this.shardsGained.copyFrom(Effarig.shardsGained.mul(multiplier));
      this.currentShardsRate.copyFrom(this.shardsGained.div(Time.thisRealityRealTime.totalMinutes));
      this.bestShardRate.copyFrom(multiplier.mul(player.records.thisReality.bestRSmin));
      this.bestShardRateVal.copyFrom(multiplier.mul(player.records.thisReality.bestRSminVal));

      const teresaReward = this.formatScalingMultiplierText(
        "Glyph Sacrifice",
        Teresa.runRewardMultiplier,
        Decimal.max(Teresa.runRewardMultiplier, Teresa.rewardMultiplier(Currency.antimatter.value)));
      const teresaThreshold = this.formatThresholdText(
        Teresa.rewardMultiplier(Currency.antimatter.value).gt(Teresa.runRewardMultiplier),
        player.celestials.teresa.bestRunAM,
        "antimatter");
      this.celestialRunText = [
        [Teresa.isRunning, teresaReward, teresaThreshold]];
    },
    handleClick() {
      if (this.canReality) {
        requestManualReality();
      }
    },
    formatScalingMultiplierText(resource, before, after) {
      return `${resource} ${formatX(before, 2, 2)} ➜ ${formatX(after, 2, 2)}`;
    },
    formatThresholdText(condition, threshold, resourceName) {
      if (condition) return "";
      return `(${format(threshold, 2, 2)} ${resourceName} to improve)`;
    },
    // Make the button have a visual animation if Realitying will give a reward
    hasSpecialReward() {
      if (Teresa.isRunning && Teresa.rewardMultiplier(Currency.antimatter.value).gt(Teresa.runRewardMultiplier)) {
        return true;
      }
      return Currency.eternityPoints.value.max(1).log10().gte(4000) &&
        ((Effarig.isRunning && !EffarigUnlock.reality.isUnlocked) || (Enslaved.isRunning && !Enslaved.isCompleted));
    }
  }
};
</script>

<template>
  <div class="l-reality-button">
    <button
      class="c-reality-button infotooltip"
      :class="classObject"
      @click="handleClick"
    >
      <div class="l-reality-button__contents">
        <template v-if="canReality">
          <div class="c-reality-button__header">
            Make a new Reality
          </div>
          <div>{{ formatMachinesGained }} {{ formatMachineStats }}</div>
          <div>{{ formatGlyphLevel }}</div>
        </template>
        <template v-else-if="hasRealityStudy">
          <div>Get {{ format("1e4000") }} Eternity Points to unlock a new Reality</div>
        </template>
        <template v-else>
          <div>Purchase the study in the Eternity tab to unlock a new Reality</div>
        </template>
        <div
          v-if="canReality"
          class="infotooltiptext"
        >
          <div>Other resources gained:</div>
          <div>{{ quantifyInt("Perk Point", ppGained) }}</div>
          <div v-if="shardsGained.neq(0)">
            {{ shardsGainedText }} ({{ format(currentShardsRate, 2) }}/min)
            <br>
            Peak: {{ format(bestShardRate, 2) }}/min at {{ format(bestShardRateVal, 2) }} RS
          </div>
          <div
            v-for="(celestialInfo, i) in celestialRunText"
            :key="i"
          >
            <span v-if="celestialInfo[0]">
              {{ celestialInfo[1] }}
              <br>
              {{ celestialInfo[2] }}
            </span>
          </div>
        </div>
      </div>
    </button>
  </div>
</template>

<style scoped>

</style>
