<script>
import ModalWrapper from "@/components/modals/ModalWrapper";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "EnslavedHintsModal",
  components: {
    ModalWrapper,
    PrimaryButton
  },
  data() {
    return {
      currentStored: new Decimal(0),
      nextHintCost: new Decimal(0),
      canGetHint: false,
      shownEntries: [],
      realityHintsLeft: 0,
      glyphHintsLeft: 0,
      hints: 0,
    };
  },
  computed: {
    hintCost() {
      return i18n("plurals", "year", [x => format(x, 2), TimeSpan.fromMilliseconds(this.nextHintCost).totalYears]);
    },
    formattedStored() {
      return i18n("plurals", "year", [x => format(x, 2), TimeSpan.fromMilliseconds(this.currentStored).totalYears]);
    },
    hasProgress(id) {
      return this.progressEntries.some(entry => entry.id === id);
    },
    // Note: This calculation seems to behave extremely poorly if the goal has been raised more than 12 hints worth
    // of cost bumps and I'm not entirely sure why. There's probably a numerical issue I can't quite figure out, but
    // considering that much cost raising can't happen in practice I think I'm just going to leave it be.
    timeEstimate() {
      if (this.currentStore.gte(this.nextHintCost)) return "";

      // Relevant values are stored as milliseconds, so multiply the rate by 1000 to get to seconds
      const storeRate = (Enslaved.isStoringGameTime
        ? Enslaved.currentBlackHoleStoreAmountPerMs
        : getGameSpeedupFactor()).mul(1e3);
      const alreadyWaited = this.currentStored.div(storeRate);
      const decaylessTime = this.nextHintCost.div(storeRate);

      // Check if decay is irrelevant and don't do the hard calculations if so
      const minCostEstimate = (TimeSpan.fromYears(new Decimal(1e40)).totalMilliseconds.sub(this.currentStored))
        .div(storeRate);
      if (TimeSpan.fromSeconds(minCostEstimate).totalDays.gt(this.hints)) {
        return `${TimeSpan.fromSeconds(minCostEstimate).toStringShort(true)}`;
      }

      // Decay is 3x per day, but the math needs decay per second
      const K = Decimal.pow(3, 1 / 86400);
      const x = Decimal.ln(K).mul(Decimal.pow(K, alreadyWaited)).mul(decaylessTime);
      const timeToGoal = decimalProductLog(x).div(Decimal.ln(K).sub(alreadyWaited));
      return `${TimeSpan.fromSeconds(timeToGoal).toStringShort(true)}`;
    },
    topLabel() {
      return i18n("modal", "enslavedHintModalTitle");
    },
    topString() {
      return i18n("modal", "enslavedHintModalResisting");
    },
    notFiguredString() {
      return i18n("modal", "enslavedHintModalNotFiguredOut");
    },
    exposedCrackString() {
      return i18n("modal", "enslavedHintModalExposedCrack");
    },
    spendTimeString() {
      return i18n("modal", "enslavedHintModalSpendTime", [formatInt(3), [formatInt, 24], formatInt(2), [format, 40]]);
    },
    nextHintString() {
      return i18n("modal", "enslavedHintModalNextHint", [[format, this.hintCost], this.formattedStored]);
    },
    ttrString() {
      return i18n("modal", "enslavedHintModalWillReachIf", [this.timeEstimate]);
    },
    realityHintString() {
      return i18n("modal", "enslavedHintModalRealityHint", [this.realityHintsLeft]);
    },
    glyphHintString() {
      return i18n("modal", "enslavedHintModalGlyphHint", [this.glyphHintsLeft]);
    },
    noHintsString() {
      return i18n("modal", "enslavedHintModalNoHints");
    },
  },
  methods: {
    update() {
      this.currentStored.copyFrom(player.celestials.enslaved.stored);
      this.nextHintCost = Enslaved.nextHintCost;
      this.canGetHint = this.currentStored.gte(this.nextHintCost);
      this.shownEntries = [];

      this.realityHintsLeft = EnslavedProgress.all.length;
      for (const prog of EnslavedProgress.all) {
        if (prog.hasHint) {
          this.shownEntries.push([false, prog]);
          this.realityHintsLeft--;
        }
      }

      const glyphHintCount = player.celestials.enslaved.glyphHintsGiven;
      for (let hintNum = 0; hintNum < glyphHintCount; hintNum++) {
        this.shownEntries.push([true, GameDatabase.celestials.enslaved.glyphHints[hintNum]]);
      }
      this.glyphHintsLeft = GameDatabase.celestials.enslaved.glyphHints.length - glyphHintCount;

      this.hints = Enslaved.hintCostIncreases;
    },
    giveRealityHint(available) {
      if (available <= 0 || !Enslaved.spendTimeForHint()) return;
      EnslavedProgress.all.filter(prog => !prog.hasHint).randomElement().unlock();
    },
    giveGlyphHint(available) {
      if (available <= 0 || !Enslaved.spendTimeForHint()) return;
      player.celestials.enslaved.glyphHintsGiven++;
    }
  },

};
</script>

<template>
  <ModalWrapper>
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-enslaved-hint-modal c-modal--short">
      <div>
        {{ topString }}
      </div>
      <br>
      <div
        v-for="(entry, index) in shownEntries"
        :key="index"
      >
        <div v-if="!entry[0]">
          <span v-if="entry[1].hasHint && !entry[1].hasProgress">
            <i class="c-icon-wrapper fas fa-question-circle" />
            <b>{{ notFiguredString }}</b>
          </span>
          <span v-else>
            <i class="c-icon-wrapper fa-solid fa-house-crack" />
            <b>{{ exposedCrackString }}</b>
          </span>
          <br>
          - {{ entry[1].hintInfo }}
          <br>
          - {{ entry[1].hasProgress ? entry[1].completedInfo : "?????" }}
        </div>
        <div v-else>
          <i class="fa-solid fa-shapes" /> <b>Glyph hint:</b>
          <br>
          {{ entry[1] }}
        </div>
        <br>
      </div>
      <div v-if="realityHintsLeft + glyphHintsLeft > 0">
        {{ spendTimeString }}
        <br><br>
        {{ nextHintString }}
        <span v-if="currentStored.lt(nextHintCost)">
          {{ ttrString }}
        </span>
        <br><br>
        <PrimaryButton
          :enabled="realityHintsLeft > 0 && canGetHint"
          class="l-enslaved-hint-button"
          @click="giveRealityHint(realityHintsLeft)"
        >
          {{ realityHintString }}
        </PrimaryButton>
        <br>
        <PrimaryButton
          :enabled="glyphHintsLeft > 0 && canGetHint"
          class="l-enslaved-hint-button"
          @click="giveGlyphHint(glyphHintsLeft)"
        >
          {{ glyphHintString }}
        </PrimaryButton>
      </div>
      <div v-else>
        <b>{{ noHintsString }}</b>
      </div>
    </div>
  </ModalWrapper>
</template>

<style scoped>
.c-icon-wrapper {
  margin-right: 1rem;
}

.l-enslaved-hint-button {
  margin: 0.4rem 0;
}
</style>
