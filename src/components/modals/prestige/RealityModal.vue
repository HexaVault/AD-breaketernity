<script>
import GlyphComponent from "@/components/GlyphComponent";
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "RealityModal",
  components: {
    PrimaryButton,
    ModalWrapperChoice,
    GlyphComponent,
  },
  data() {
    return {
      firstReality: false,
      hasSpace: true,
      hasChoice: false,
      hasFilter: false,
      glyphs: [],
      bestLevel: new Decimal(),
      levelDifference: 0,
      selectedGlyph: undefined,
      canRefresh: false,
      level: new Decimal(),
      simRealities: new Decimal(),
      realityMachines: new Decimal(),
      shardsGained: 0,
      effarigUnlocked: false,
      willAutoPurge: false,
    };
  },
  computed: {
    firstRealityText() {
      const time = timeDisplayNoDecimals(new Decimal(30 * 60000));
      return i18n("modal", "firstRealityText", [formatInt(13), time]);
    },
    canSacrifice() {
      return RealityUpgrade(19).isEffectActive;
    },
    warnText() {
      if (!this.hasChoice) {
        return i18n("modal", "noSTARTwarning");
      }

      if (this.hasFilter && this.selectedGlyph === undefined) {
        return i18n("modal", "noChosenPostFilter");
      }
      return this.selectedGlyph === undefined
        ? i18n("modal", "noChosenPreFilter")
        : null;
    },
    gained() {
      const gainedResources = [];
      gainedResources.push(`${quantify(i18n("modal", "real"), this.simRealities)}`);
      gainedResources.push(`${quantify(i18n("modal", "pp"), this.simRealities)}`);
      gainedResources.push(`${quantify(i18n("modal", "rm"), this.realityMachines, 2)}`);
      if (this.effarigUnlocked) {
        gainedResources.push(`${quantify(i18n("modal", "rs"), this.shardsGained, 2)}`);
      }
      return i18n("modal", "willGainX", [makeEnumeration(gainedResources)]);
    },
    levelStats() {
      // Bit annoying to read due to needing >, <, and =, with = needing a different format.
      let str = "";
      str = i18n("modal", this.level.gt(this.bestLevel) ? "higherThanBest" : "lowerThanBest");
      if (this.level.eq(this.bestLevel)) {
        str = i18n("modal", "equalToBest");
      }
      return i18n("modal", "levelStat", [formatInt(this.level), str]);
    },
    confirmationToDisable() {
      return ConfirmationTypes.glyphSelection.isUnlocked() ? "glyphSelection" : undefined;
    },
    canConfirm() {
      return this.firstReality || this.selectedGlyph !== undefined || this.hasFilter;
    }
  },
  created() {
    this.getGlyphs();
    GlyphSelection.realityProps = getRealityProps(false, false);
  },
  methods: {
    update() {
      this.firstReality = player.realities.eq(0);
      this.hasChoice = Perk.firstPerk.isEffectActive;
      this.effarigUnlocked = TeresaUnlocks.effarig.canBeApplied;
      this.hasFilter = EffarigUnlock.glyphFilter.isUnlocked;
      this.level.copyFrom(gainedGlyphLevel().actualLevel);
      this.simRealities = simulatedRealityCount(false).add(1);
      this.hasSpace = Decimal.fromNumber(GameCache.glyphInventorySpace.value).gte(this.simRealities);
      const simRMGained = Currency.realityMachines.cappedGain.times(this.simRealities);
      this.realityMachines.copyFrom(simRMGained.clampMax(Currency.realityMachines.hardcap
        .sub(Currency.realityMachines.cappedGain)));
      this.shardsGained = simulatedRealityCount(false).add(1).mul(Currency.relicShards.gain);
      this.willAutoPurge = player.reality.autoAutoClean;
      if (this.firstReality) return;
      for (let i = 0; i < this.glyphs.length; ++i) {
        const currentGlyph = this.glyphs[i];
        const newGlyph = GlyphSelection.glyphList(
          GlyphSelection.choiceCount, gainedGlyphLevel(), { isChoosingGlyph: false }
        )[i];
        if (currentGlyph.level === newGlyph.level) continue;
        currentGlyph.level = newGlyph.level;
        currentGlyph.effects = newGlyph.effects;
      }
      this.bestLevel.copyFrom(player.records.bestReality.glyphLevel);
      this.levelDifference = Decimal.abs(this.bestLevel.sub(this.level));
    },
    glyphClass(index) {
      return {
        "l-modal-glyph-selection__glyph": true,
        "l-modal-glyph-selection__glyph--selected": this.selectedGlyph === index,
      };
    },
    getGlyphs() {
      this.canRefresh = true;
      this.glyphs = GlyphSelection.upcomingGlyphs;
    },
    select(index) {
      this.selectedGlyph = index;
    },
    confirmModal(sacrifice) {
      if (!this.canConfirm) return;
      if (sacrifice) {
        // Sac isn't passed through confirm so we have to close it manually
        this.emitClose();
      }
      startManualReality(sacrifice, this.selectedGlyph);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    :option="confirmationToDisable"
    :show-confirm="canConfirm"
    @confirm="confirmModal(false)"
  >
    <template #header>
      {{ i18n("modal", "realityModalHeader") }}
    </template>
    <div
      v-if="firstReality"
      class="c-modal-message__text"
    >
      {{ firstRealityText }}
    </div>

    <div class="c-modal-message__text">
      {{ gained }}
    </div>
    <div
      v-if="!firstReality"
      class="l-glyph-selection__row"
    >
      <GlyphComponent
        v-for="(glyph, index) in glyphs"
        :key="index"
        :class="glyphClass(index)"
        :glyph="glyph"
        :is-in-modal="true"
        :ignore-modified-level="true"
        :show-sacrifice="canSacrifice"
        @click.native="select(index)"
      />
    </div>
    <div v-if="!firstReality">
      {{ levelStats }}
      <br>
      <b class="o-warning">
        {{ warnText }}
      </b>
    </div>
    <div v-if="simRealities.gt(1)">
      <br>
      {{ i18n("modal", "simRealityTextA") }}
      <br>
      {{ i18n("modal", "simRealityTextB", [quantify(i18n("modal", "glyph"), simRealities.sub(1))]) }}
    </div>
    <div v-if="willAutoPurge">
      <br>
      {{ i18n("modal", "autoPurgeTextA") }}
      <br>
      {{ i18n("modal", "autoPurgeTextB") }}
    </div>
    <div
      v-if="!hasSpace"
      class="o-warning"
    >
      <span v-if="simRealities.gt(1)">
        {{ i18n("modal", "simRealityWarning") }}
      </span>
      <span v-else>
        {{ i18n("modal", "noInvSpace", [i18n("modal", sacrificeDelete).split(" $ ")[canSacrifice ? 1 : 0]]) }}
      </span>
    </div>
    <div v-if="confirmationToDisable">
      <br>
      {{ i18n("modal", "disablingRealityModal") }}
    </div>
    <template
      v-if="canSacrifice && canConfirm"
      #extra-buttons
    >
      <PrimaryButton
        class="o-primary-btn--width-medium c-modal-message__okay-btn"
        @click="confirmModal(true)"
      >
        {{ i18n("modal", "sacrifice") }}
      </PrimaryButton>
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.o-warning {
  color: var(--color-infinity);
}
</style>
