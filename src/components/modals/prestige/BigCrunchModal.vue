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
      return i18n("modal", "uponInfinity", [info]);
    },
    firstInfinityInfo() {
      return i18n("modal", "firstInfinityInfo");
    },
    ipGainInfo() {
      return i18n("modal", "infGainInfo", [quantify(i18n("modal", "inf"), this.gainedInfinities, 2, 0),
        quantify(i18n("modal", "ip"), this.gainedInfinityPoints, 2, 0)
      ]);
    },
    startingResources() {
      const gainedResources = [];
      if (this.startingAM.gte(10)) gainedResources.push(`${quantify(i18n("modal", "am"), this.startingAM, 2, 1)}`);
      if (this.startingBoosts.gte(0)) gainedResources.push(`${quantify(i18n("modal", "db"), this.startingBoosts)}`);
      if (this.willStartWithGalaxy) gainedResources.push(`${quantify(i18n("modal", "gal"), 1)}`);

      return i18n("modal", "willStartNextInf", [makeEnumeration(gainedResources)]);
    },
    aboutToInf() {
      return i18n("modal", "aboutToInf");
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
    header="You are about to Infinity"
    :message="message"
    :gained-resources="ipGainInfo"
    :starting-resources="startingResources"
    :confirm-fn="handleYesClick"
    :alternate-condition="isFirstInfinity"
    :alternate-text="message"
    :confirm-option="isFirstInfinity ? undefined : 'bigCrunch'"
  />
</template>
