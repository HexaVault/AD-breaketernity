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
      if (this.bulk) return i18n("modal", "aboutToPurchase", [quantifyInt(i18n("modal", "ags"), this.newGalaxies)]);
      return i18n("modal", "atpOneAG");
    },
    message() {
      const resetResouces = [];
      const rrTrans = i18n("modal", "resetResourcesAG");
      if (Pelle.isDoomed) resetResouces.push(rrTrans[0], rrTrans[1], rrTrans[2]);
      if (!this.perkANRBought) resetResouces.push(rrTrans[1], rrTrans[2]);
      if (!this.keepDimBoost) resetResouces.push(rrTrans[3]);
      if (!this.keepAntimatter && !this.perkANRBought) resetResouces.push(rrTrans[0]);
      const resetList = makeEnumeration(resetResouces);
      let tickspeedFixed = "";
      if (InfinityChallenge(3).isRunning) {
        tickspeedFixed = i18n("modal", "icN", [InfinityChallenge(3).id]);
      } else if (Ra.isRunning) {
        tickspeedFixed = i18n("modal", "cel5Reality", [Ra.displayName]);
      }
      const tickspeedInfo = (tickspeedFixed === "")
        ? i18n("modal", "agTSboost")
        : i18n("modal", "agNoTSboost", [tickspeedFixed]);
      const message = (resetList === "")
        ? i18n("modal", "resetNothing", [tickspeedInfo])
        : i18n("modal", "resetSome", [resetList, tickspeedInfo]);

      if (this.bulk) {
        return i18n("modal", "surePurchase", [quantifyInt("Antimatter Galaxy", this.newGalaxies), message]);
      }
      return i18n("modal", "surePurAG", [message]);
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
      this.keepAntimatter = Achievement(111).isUnlocked;
      this.perkANRBought = Perk.antimatterNoReset.canBeApplied;
      this.keepDimBoost = (Achievement(143).isUnlocked && !Pelle.isDoomed) ||
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
