<script>
export default {
  name: "ImportFilterSingleType",
  props: {
    type: {
      type: String,
      required: true,
    },
    currSettings: {
      type: Object,
      required: true,
    },
    newSettings: {
      type: Object,
      required: true,
    }
  },
  computed: {
    settingsChanged() {
      return JSON.stringify(this.currSettings) !== JSON.stringify(this.newSettings);
    },
    symbol() {
      return GlyphInfo[this.type].regularGlyphSymbol;
    },
    capitalized() {
      return `${this.type.charAt(0).toUpperCase()}${this.type.substring(1)}`;
    },
    rarityStr() {
      return this.changedValue(this.currSettings.rarity, this.newSettings.rarity, x => formatPercents(x / 100));
    },
    effectStr() {
      return i18n("modal", "importSingleGlyphFilterModalMinimumEffects", [this.changedValue(this.currSettings.effectCount, this.newSettings.effectCount, formatInt)]);
    },
    scoreStr() {
      return i18n("modal", "importSingleGlyphFilterModalScore", [this.changedValue(this.currSettings.score, this.newSettings.score, formatInt)]);
    },
    effectData() {
      const changes = [];
      for (let index = 0; index < this.currSettings.effectScores.length; index++) {
        const intID = AutoGlyphProcessor.bitmaskIndexOffset(this.type) + index;
        changes.push({
          intID,
          oldReq: (this.currSettings.specifiedMask & (1 << intID)) !== 0,
          newReq: (this.newSettings.specifiedMask & (1 << intID)) !== 0,
          oldScore: this.currSettings.effectScores[index],
          newScore: this.newSettings.effectScores[index],
        });
      }
      return changes;
    },
    noChange() {
      return i18n("modal", "importGlyphFilterModalNoChange");
    }
  },
  methods: {
    changedValue(oldVal, newVal, applyFn) {
      if (oldVal === newVal) return applyFn(oldVal);
      return `${applyFn(oldVal)}➜${applyFn(newVal)}`;
    },
    effectScoreStr(effectEntry) {
      const fullStr = (isSelected, value) => {
        const check = isSelected ? "✔" : "✘";
        return `${check}${formatInt(value)}`;
      };
      const oldStr = fullStr(effectEntry.oldReq, effectEntry.oldScore);
      const newStr = fullStr(effectEntry.newReq, effectEntry.newScore);

      if (effectEntry.oldScore === effectEntry.newScore) return oldStr;
      return `${oldStr}➜${newStr}`;
    },
    topLevelClassObject(key) {
      return {
        "o-cell": true,
        "o-cell--changed": this.currSettings[key] !== this.newSettings[key],
      };
    },
    effectClassObject(effectEntry) {
      return {
        "o-cell": true,
        "o-cell--changed": effectEntry.oldReq !== effectEntry.newReq || effectEntry.oldScore !== effectEntry.newScore,
      };
    },
    getEffectDesc(effectEntry) {
      return GlyphEffects.all.find(e => e.intID === effectEntry.intID && e.isGenerated).genericDesc;
    },
    getTooltip(effectEntry) {
      return i18n("modal", `importSingleGlyphFilterModalTYPE_${effectEntry}`);
    }
  },
};
</script>

<template>
  <div>
    {{ symbol }}:
    <span v-if="settingsChanged">
      <span class="c-single-row">
        <span
          class="c-rarity"
          :class="topLevelClassObject('rarity')"
          :ach-tooltip="getTooltip('rarity')"
        >
          {{ rarityStr }}
        </span>
        <span
          class="c-effects-count"
          :class="topLevelClassObject('effectCount')"
          :ach-tooltip="getTooltip('effectCount')"
        >
          {{ effectStr }}
        </span>
        <span
          class="c-target-score"
          :class="topLevelClassObject('score')"
          :ach-tooltip="getTooltip('score')"
        >
          {{ scoreStr }}
        </span>
      </span>
      <br>
      <span class="c-single-row">
        <span
          v-for="effect in effectData.slice(0, 4)"
          :key="effect.bitmaskIndex"
          class="c-single-score"
          :class="effectClassObject(effect)"
          :ach-tooltip="getEffectDesc(effect)"
        >
          {{ effectScoreStr(effect) }}
        </span>
      </span>
      <span
        v-if="effectData.length > 4"
        class="c-single-row c-second-row"
      >
        <br>
        <span
          v-for="effect in effectData.slice(4)"
          :key="effect.bitmaskIndex"
          class="c-single-score o-cell"
          :class="effectClassObject(effect)"
          :ach-tooltip="getEffectDesc(effect)"
        >
          {{ effectScoreStr(effect) }}
        </span>
      </span>
    </span>
    <span v-else>
      {{ noChange }}
    </span>
  </div>
</template>

<style scoped>
.c-single-row {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: -2.15rem 0 0 3rem;
}

.c-second-row {
  margin: 0 0 0 -9rem;
}

.o-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  border: var(--var-border-width, 0.2rem) solid;
  padding: 0.1rem;
}

.o-cell--changed {
  background-color: var(--color-accent);
}

.c-rarity {
  width: 10rem;
}

.c-effects-count {
  width: 20rem;
}

.c-target-score {
  width: 18rem;
}

.c-single-score {
  width: 12rem;
}
</style>
