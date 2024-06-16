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
    ICTimes() {
      const v = [];
      const bullshitBypassVariable = new Decimal();
      for (let i = 0; i < 8; i++) {
        bullshitBypassVariable.copyFrom(player.challenge.infinity.bestTimes[i]);
        v.push(this.bullshitBypassVariable);
      }
      return v;
    },
    NCTimes() {
      const v = [];
      const bullshitBypassVariable = new Decimal();
      for (let i = 0; i < 8; i++) {
        bullshitBypassVariable.copyFrom(player.challenge.infinity.bestTimes[i]);
        v.push(this.bullshitBypassVariable);
      }
      return v;
    },
    update() {
      this.infinityChallengesUnlocked = PlayerProgress.infinityChallengeCompleted() ||
        PlayerProgress.eternityUnlocked();
      this.normalChallenges = this.ICTimes;
      this.infinityChallenges = this.ICTimes;
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
