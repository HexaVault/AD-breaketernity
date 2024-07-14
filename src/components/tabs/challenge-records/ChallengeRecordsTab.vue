<script>
import ChallengeRecordsList from "./ChallengeRecordsList";

export default {
  name: "ChallengeRecordsTab",
  components: {
    ChallengeRecordsList
  },
  data() {
    return {
      infinityChallengesUnlocked: false,
      normalChallenges: [],
      infinityChallenges: []
    };
  },
  methods: {
    getNormalChallengeTimes() {
      const times = [];
      let BBV = new Decimal();
      for (let i = 0; i < 11; i++) {
        BBV = new Decimal();
        BBV.copyFrom(player.challenge.normal.bestTimes[i]);
        times.push(BBV);
      }
      return times;
    },
    getInfinityChallengeTimes() {
      const timesi = [];
      let BBVi = new Decimal();
      for (let i = 0; i < 8; i++) {
        BBVi = new Decimal();
        BBVi.copyFrom(player.challenge.infinity.bestTimes[i]);
        timesi.push(BBVi);
      }
      return timesi;
    },
    update() {
      this.infinityChallengesUnlocked = PlayerProgress.infinityChallengeCompleted() ||
        PlayerProgress.eternityUnlocked();
      this.normalChallenges = this.getNormalChallengeTimes();
      this.infinityChallenges = this.getInfinityChallengeTimes();
    }
  }
};
</script>

<template>
  <div class="l-challenge-records-tab c-stats-tab">
    <ChallengeRecordsList
      :start="2"
      :times="normalChallenges"
      name="Normal Challenge"
    />
    <ChallengeRecordsList
      v-if="infinityChallengesUnlocked"
      :start="1"
      :times="infinityChallenges"
      name="Infinity Challenge"
      class="l-challenge-records-tab__infinity_challenges"
    />
  </div>
</template>
