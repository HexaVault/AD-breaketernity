<script>
import ModalWrapper from "@/components/modals/ModalWrapper";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ModifySeedModal",
  components: {
    ModalWrapper,
    PrimaryButton,
  },
  data() {
    return {
      mode: 0,
      inputSeed: "",
      seedText: "",
      convertedInput: false,
      seedValue: 0,
    };
  },
  computed: {
    choiceEnum: () => SPEEDRUN_SEED_STATE,
    officialSeed: () => Speedrun.officialFixedSeed,
    topLabel: () => i18n("modal", "modifySeedModalTitle"),
    topMessage: () => i18n("modal", "modifySeedModalMessageA"),
    canSwitchMessage: () => i18n("modal", "modifySeedModalCanSwitch"),
    OPS() {
      return i18n("modal", "modifySeedModalOffical", [this.officialSeed]);
    },
    OPSInfo: () => i18n("modal", "modifySeedModalOfficalInfo"),
    RCS: () => i18n("modal", "modifySeedModalRandom"),
    RCSInfo: () => i18n("modal", "modifySeedModalRandomInfo"),
    PCS: () => i18n("modal", "modifySeedModalChosen"),
    PCSInfo: () => i18n("modal", "modifySeedModalChosenInfo"),
    // For some reason, this gets flagged as having an invalid "this" parameter as a single-line function
    chosenBecomes() {
      return i18n("modal", "modifySeedModalInputBecomesX", [this.seedValue], true)[Number(this.convertedInput)];
    },
    chosenBecomesZero() {
      return i18n("modal", "modifySeedModalInputBecomesZero", [], true)[Number(this.convertedInput)];
    },
    technicalReasons: () => i18n("modal", "modifySeedModalTechnicalReasons")
  },
  created() {
    this.seedValue = player.speedrun.initialSeed;
    this.inputSeed = `${player.speedrun.initialSeed}`;
    this.convertedInput = false;
  },
  methods: {
    update() {
      this.mode = player.speedrun.seedSelection;
      this.seedText = Speedrun.seedModeText();
    },
    handleSeedInput() {
      if (this.inputSeed.match(/^-?\d+$/gu)) {
        const num = Number(this.inputSeed);
        this.seedValue = Math.abs(num) > 9e15
          ? this.hashStringToSeed(this.inputSeed)
          : Number(this.inputSeed);
      } else {
        this.seedValue = this.hashStringToSeed(this.inputSeed);
      }
      this.convertedInput = this.seedValue !== Number(this.inputSeed);

      if (this.seedValue === 0) this.setMode(this.choiceEnum.FIXED);
      else this.setMode(this.choiceEnum.PLAYER, this.seedValue);
    },
    setMode(mode, seed) {
      if (mode === this.choiceEnum.PLAYER && this.seedValue === 0) return;
      Speedrun.modifySeed(mode, parseInt(seed, 10));
    },
    buttonClass(mode) {
      return {
        "o-primary-btn--subtab-option": true,
        "o-selected": mode === this.mode,
      };
    },
    // String-to-number hashing function, using a fixed numerical seed inspired by Number.MAX_VALUE
    // See https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
    hashStringToSeed(str) {
      const seed = 17977308;
      let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
      for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
      }
      h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
      h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
      return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    }
  },
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      {{ topLabel }}
    </template>
    <div>
      {{ topMessage }}
      <br>
      <br>
      {{ canSwitchMessage }}
      <br>
      {{ seedText }}
      <br>
      <br>
      <PrimaryButton
        :class="buttonClass(choiceEnum.FIXED)"
        @click="setMode(choiceEnum.FIXED)"
      >
        {{ OPS }}
      </PrimaryButton>
      <br>
      {{ OPSInfo }}
      <br>
      <br>
      <PrimaryButton
        :class="buttonClass(choiceEnum.RANDOM)"
        @click="setMode(choiceEnum.RANDOM)"
      >
        {{ RCS }}
      </PrimaryButton>
      <br>
      {{ RCSInfo }}
      <br>
      <br>
      <PrimaryButton
        v-tooltip="seedValue === 0 ? i18nA() : ''"
        :class="buttonClass(choiceEnum.PLAYER)"
        @click="setMode(choiceEnum.PLAYER, seedValue)"
      >
        {{ PCS }}
      </PrimaryButton>
      <input
        ref="inputSeed"
        v-model="inputSeed"
        type="text"
        class="c-modal-input"
        @input="handleSeedInput()"
      >
      <br>
      {{ PCSInfo }}
      <br>
      <span v-if="seedValue !== 0">
        {{ chosenBecomes }}
      </span>
      <span v-else>
        {{ chosenBecomesZero }}
      </span>
      <br>
      {{ technicalReasons }}
    </div>
  </ModalWrapper>
</template>

<style scoped>
.o-selected {
  color: var(--color-text-inverted);
  background-color: var(--color-good);
}
</style>
