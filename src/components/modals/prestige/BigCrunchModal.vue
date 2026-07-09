<script>
import ResetModal from "@/components/modals/prestige/ResetModal";

export default {
  name: "BigCrunchModal",
  components: {
    ResetModal
  },
  data() {
    return {
      gainedInfinities: new Decimal(),
      gainedInfinityPoints: new Decimal(),
      startingBoosts: 0,
      startingAM: new Decimal(10),
      willStartWithGalaxy: false
    };
  },
  computed: {
    isFirstInfinity() {
      return !PlayerProgress.infinityUnlocked();
    },
    message() {
      const info = this.isFirstInfinity ? this.firstInfinityInfo : ``;
      return i18n("modal", "infinityModalWillReset", [info]);
    },
    firstInfinityInfo() {
      return i18n("modal", "firstInfinityInfo");
    },
    ipGainInfo() {
      return i18n("modal", "infinityModalInfinityGain", [[x => format(x, 2, 0), this.gainedInfinities], [x => format(x, 2, 0), this.gainedInfinityPoints]]);
    },
    startingResources() {
      const strings = i18n("modal", "infinityModalStartNextInf", [[format, this.startingAM], [formatInt, this.startingBoosts], [formatInt, 1]], true);
      const finalString = [strings[0]];
      if (this.startingBoosts.gte(0)) finalString.push(strings[1]);
      if (this.willStartWithGalaxy) finalString.push(strings[2]);

      return "".concat(finalString);
    },
    aboutToInf() {
      return i18n("modal", "infinityModalTitle");
    }
  },
  methods: {
    update() {
      this.gainedInfinities = gainedInfinities().round();
      this.gainedInfinityPoints = Currency.infinityPoints.gain.round();
      this.startingBoosts = DimBoost.startingDimensionBoosts;
      this.startingAM = Currency.antimatter.startingValue;
      this.willStartWithGalaxy = InfinityUpgrade.skipResetGalaxy.isBought;
    },
    handleYesClick() {
      bigCrunchResetRequest();
      EventHub.ui.offAll(this);
      if (this.isFirstInfinity) {
        setTimeout(() => Modal.message.show(i18n("modal", "infAnimationModal"), {}, 3), 2000);
      }
    }
  },
};
</script>

<template>
  <ResetModal
    :header="aboutToInf"
    :message="message"
    :gained-resources="ipGainInfo"
    :starting-resources="startingResources"
    :confirm-fn="handleYesClick"
    :alternate-condition="isFirstInfinity"
    :alternate-text="message"
    :confirm-option="isFirstInfinity ? undefined : 'bigCrunch'"
  />
</template>
