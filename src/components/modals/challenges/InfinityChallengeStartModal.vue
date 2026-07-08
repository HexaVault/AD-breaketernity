<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "InfinityChallengeStartModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  computed: {
    challenge() {
      return InfinityChallenge(this.id);
    },
    challengeIsCompleted() {
      return this.challenge.isCompleted;
    },
    message() {
      return i18n("modal", "infinityChallengeModalMessage", [this.challengeIsCompleted ? "" : () =>
        i18n("modal", "challengeModalInfix"), [format, InfinityChallenge(this.id).goal]]);
    },
    entranceLabel() {
      return i18n("modal", "eternityChallengeModalAboinfinityChallengeModalAboutToEnterutToEnter");
    },
    reward() {
      let rewardDescription = this.challenge.config.reward.description;
      if (typeof rewardDescription === "function") {
        rewardDescription = rewardDescription();
      }
      return i18n("modal", "infinityChallengeModalRewardForCompletion", [this.rewardDescription]);
    },
    condition() {
      let conditionOfChallenge = this.challenge.config.description;
      if (typeof conditionOfChallenge === "function") {
        conditionOfChallenge = conditionOfChallenge();
      }
      return i18n("modal", "infinityChallengeModalInsideIC", [this.conditionOfChallenge]);
    },
    begin() {
      return i18n("consts", "begin");
    }
  },
  created() {
    this.on$(GAME_EVENT.ETERNITY_RESET_AFTER, this.emitClose);
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, this.emitClose);
  },
  methods: {
    handleYesClick() {
      this.challenge.start();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="challenges"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ entranceLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ message }}
      <br><br>
      {{ condition }}
    </div>
    <div
      v-if="!challengeIsCompleted"
      class="c-modal-message__text"
    >
      <br>
      {{ reward }}
    </div>
    <template #confirm-text>
      {{ begin }}
    </template>
  </ModalWrapperChoice>
</template>
