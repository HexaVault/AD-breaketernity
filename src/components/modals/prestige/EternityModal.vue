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
        ? i18n("modal", "eterText")
        : i18n("modal", "firstEterText");
    },
    gainedEPOnEternity() {
      return i18n("modal", "gainedOnEter", [quantify(i18n("modal", "eter"), this.gainedEternities, 2),
        quantify(i18n("modal", "ep"), this.gainedEternityPoints, 2)
      ]);
    },
    startWithIP() {
      return this.startingIP.gt(0)
        ? i18n("modal", "startNextEter", [quantify(i18n("modal", "ip"), this.startingIP, 2)])
        : ``;
    },
    eternityChallenge() {
      const ec = EternityChallenge.current;
      if (ec.isFullyCompleted) {
        return i18n("modal", "ecXalreadyMaxed", [ec.id]);
      }
      if (!Perk.studyECBulk.isBought) {
        return i18n("modal", "noBulkECcompletion", [ec.id]);
      }
      const gainedCompletions = ec.gainedCompletionStatus.gainedCompletions;
      return i18n("modal", "bulkECcompletion", [quantifyInt(i18n("modal", "completion"), gainedCompletions), ec.id]);
    },
    topLabelRegular() {
      return i18n("modal", "eterHeader");
    },
    topLabelEC() {
      return i18n("modal", "completingECheader");
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
    :header="exitingEC ? topLabelRegular : topLabelEC"
    :message="message"
    :gained-resources="gainedEPOnEternity"
    :starting-resources="startWithIP"
    :confirm-fn="handleYesClick"
    :alternate-condition="exitingEC"
    :alternate-text="exitingEC ? eternityChallenge : undefined"
    confirm-option="eternity"
  />
</template>
