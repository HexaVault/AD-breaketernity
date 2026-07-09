<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "AntimatterGalaxyModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    bulk: {
      type: Boolean,
      required: true,
    }
  },
  data() {
    return {
      newGalaxies: 0,
      keepAntimatter: false,
      perkANRBought: false,
      keepDimBoost: false
    };
  },
  computed: {
    topLabel() {
      return i18n("modal", "agModalTitle", [[formatInt, this.newGalaxies]]);
    },
    message() {
      const resetResouces = [];
      const rrTrans = i18n("modal", "agModalResettableResources");
      if (Pelle.isDoomed) resetResouces.push(rrTrans[0], rrTrans[1], rrTrans[2]);
      if (!this.perkANRBought) resetResouces.push(rrTrans[1], rrTrans[2]);
      if (!this.keepDimBoost) resetResouces.push(rrTrans[3]);
      if (!this.keepAntimatter && !this.perkANRBought) resetResouces.push(rrTrans[0]);
      const resetList = makeEnumeration(resetResouces);
      let tickspeedFixed = "";
      if (InfinityChallenge(3).isRunning) {
        tickspeedFixed = i18n("modal", "agModalICx", [InfinityChallenge(3).id]);
      } else if (Ra.isRunning) {
        tickspeedFixed = i18n("modal", "agModalRaReality", [Ra.displayName]);
      }
      const tickspeedInfo = (tickspeedFixed === "")
        ? i18n("modal", "agModalWillBoostTickspeed")
        : i18n("modal", "agModalWillNotBoostTickspeed", [tickspeedFixed]);
      const message = (resetList === "")
        ? i18n("modal", "agModalWillResetNothing", [tickspeedInfo])
        : i18n("modal", "agModalWillResetX", [resetList, tickspeedInfo]);

      return i18n("modal", "agModalPurchaseConfirmation", [[formatInt, this.newGalaxies], message]);
    }
  },
  created() {
    this.on$(GAME_EVENT.DIMBOOST_AFTER, () =>
      (BreakInfinityUpgrade.autobuyMaxDimboosts.isBought ? undefined : this.emitClose()));
  },
  methods: {
    update() {
      if (this.bulk) {
        const req = Galaxy.requirement;
        const dim = AntimatterDimension(req.tier);
        const bulk = Galaxy.buyableGalaxies(Decimal.floor(dim.totalAmount.toNumber())).gt(player.galaxies);
        if (bulk) {
          this.newGalaxies = Galaxy.buyableGalaxies(Decimal.floor(dim.totalAmount.toNumber())).sub(player.galaxies);
        }
      }
      this.keepAntimatter = Achievement(111).canBeApplied;
      this.perkANRBought = Perk.antimatterNoReset.canBeApplied;
      this.keepDimBoost = (Achievement(143).canBeApplied && !Pelle.isDoomed) ||
        PelleUpgrade.galaxyNoResetDimboost.canBeApplied;
    },
    handleYesClick() {
      requestGalaxyReset(this.bulk);
      EventHub.ui.offAll(this);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="antimatterGalaxy"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>

    <div class="c-modal-message__text">
      {{ message }}
    </div>
  </ModalWrapperChoice>
</template>
