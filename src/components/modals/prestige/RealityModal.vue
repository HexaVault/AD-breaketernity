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
    topLabel() {
      return i18n("modal", "realityModalTitle");
    },
    firstRealityText() {
      const time = timeDisplayNoDecimals(new Decimal(30 * 60000));
      return i18n("modal", "realityModalFirstReality", [formatInt(13), time]);
    },
    canSacrifice() {
      return RealityUpgrade(19).isEffectActive;
    },
    canRefine() {
      return Ra.unlocks.unlockGlyphAlchemy.canBeApplied;
    },
    warnText() {
      if (!this.hasChoice) {
        return i18n("modal", "realityModalNoSTART");
      }

      if (this.hasFilter && this.selectedGlyph === undefined) {
        return i18n("modal", "realityModalChoosePostFilter");
      }
      return this.selectedGlyph === undefined
        ? i18n("modal", "realityModalChoosePreFilter")
        : null;
    },
    gained() {
      return i18n("modal", "realityModalWillGainX", [[formatInt, this.simRealities], [x => format(x, 2), this.realityMachines],
        [this.simRealities, this.simRealities], [x => format(x, 2), this.shardsGained]], true)[Number(this.effarigUnlocked)];
    },
    levelStats() {
      // We have 3 version: equal, higher, lower
      // eslint-disable-next-line no-nested-ternary
      return i18n("modal", "realityModalLevelStat", [formatInt(this.level)], true)[this.level.eq(this.bestLevel) ? 0 : (this.level.gt(this.bestLevel) ? 1 : 2)];
    },
    confirmationToDisable() {
      return ConfirmationTypes.glyphSelection.isUnlocked() ? "glyphSelection" : undefined;
    },
    canConfirm() {
      return this.firstReality || this.selectedGlyph !== undefined || this.hasFilter;
    },
    simNoteA() {
      return i18n("modal", "realityModalSimulateNoteA");
    },
    simNoteB() {
      return i18n("modal", "realityModalSimulateNoteB", [[formatInt, simRealities.sub(1)]]);
    },
    autoPurgeA() {
      return i18n("modal", "realityModalAutoPurgeA");
    },
    autoPurgeB() {
      return i18n("modal", "realityModalAutoPurgeB");
    },
    simWarn() {
      return i18n("modal", "realityModalMoreSimThanInventory");
    },
    spaceWarn() {
      // eslint-disable-next-line no-nested-ternary
      return i18n("modal", "realityModalNoSpace", [], true)[this.canRefine ? 1 : (this.canSacrifice ? 0 : 2)];
    },
    forceShowModal() {
      return i18n("modal", "realityModalForceToShow");
    },
    sacrificeButtonLabel() {
      return i18n("modal", "realityModalSacrificeButton");
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
      const simRMGained = Currency.realityMachines.gain.times(this.simRealities);
      this.realityMachines.copyFrom(simRMGained.clampMax(Currency.realityMachines.hardcap
        .sub(Currency.realityMachines.gain)));
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
      {{ topLabel }}
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
      {{ simNoteA }}
      <br>
      {{ simNoteB }}
    </div>
    <div v-if="willAutoPurge">
      <br>
      {{ autoPurgeA }}
      <br>
      {{ autoPurgeB }}
    </div>
    <div
      v-if="!hasSpace"
      class="o-warning"
    >
      <span v-if="simRealities.gt(1)">
        {{ simWarn }}
      </span>
      <span v-else>
        {{ spaceWarn }}
      </span>
    </div>
    <div v-if="confirmationToDisable">
      <br>
      {{ forceShowModal }}
    </div>
    <template
      v-if="canSacrifice && canConfirm"
      #extra-buttons
    >
      <PrimaryButton
        class="o-primary-btn--width-medium c-modal-message__okay-btn"
        @click="confirmModal(true)"
      >
        {{ sacrificeButtonLabel }}
      </PrimaryButton>
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.o-warning {
  color: var(--color-infinity);
}
</style>
