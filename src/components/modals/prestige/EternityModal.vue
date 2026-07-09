<script>
import ResetModal from "@/components/modals/prestige/ResetModal";

export default {
  name: "EternityModal",
  components: {
    ResetModal
  },
  data() {
    return {
      exitingEC: false,
      startingIP: new Decimal(),
      gainedEternityPoints: new Decimal(),
      gainedEternities: new Decimal()
    };
  },
  computed: {
    message() {
      return PlayerProgress.eternityUnlocked()
        ? i18n("modal", "eternityModalInfo")
        : i18n("modal", "eternityModalFirstEter");
    },
    gainedEPOnEternity() {
      return i18n("modal", "eternityModalEternityGain", [[x => format(x, 2), this.gainedEternities], [x => format(x, 2), this.gainedEternityPoints]]);
    },
    startWithIP() {
      return this.startingIP.gt(0)
        ? i18n("modal", "eternityModalStartNextEter", [[x => format(x, 2), this.startingIP]])
        : ``;
    },
    eternityChallenge() {
      const ec = EternityChallenge.current;
      if (ec.isFullyCompleted) {
        return i18n("modal", "eternityModalECxMaxed", [ec.id]);
      }
      if (!Perk.studyECBulk.isBought) {
        return i18n("modal", "eternityModalNoBulk", [ec.id]);
      }
      const gainedCompletions = ec.gainedCompletionStatus.gainedCompletions;
      return i18n("modal", "eternityModalBulkEcs", [[formatInt, gainedCompletions], ec.id]);
    },
    topLabelRegular() {
      return i18n("modal", "eternityModalTitle");
    },
    topLabelEC() {
      return i18n("modal", "eternityModalTitle_EC");
    }
  },
  methods: {
    update() {
      this.exitingEC = EternityChallenge.isRunning;
      this.startingIP = Currency.infinityPoints.startingValue;
      this.gainedEternityPoints = Currency.eternityPoints.gain;
      this.gainedEternities = gainedEternities();
    },
    handleYesClick() {
      animateAndEternity();
      EventHub.ui.offAll(this);
    }
  },
};
</script>

<template>
  <ResetModal
    :header="exitingEC ? topLabelEC : topLabelRegular"
    :message="message"
    :gained-resources="gainedEPOnEternity"
    :starting-resources="startWithIP"
    :confirm-fn="handleYesClick"
    :alternate-condition="exitingEC"
    :alternate-text="exitingEC ? eternityChallenge : undefined"
    confirm-option="eternity"
  />
</template>
