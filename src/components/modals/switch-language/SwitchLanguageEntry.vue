<script>
import PrimaryButton from "../../PrimaryButton";

export default {
  name: "SwitchLanguageEntry",
  components: {
    PrimaryButton,
  },
  props: {
    lang: {
      type: String,
      required: true
    }
  },
  computed: {
    langName() { return Lang[this.lang].name; },
  },
  methods: {
    setLanguage(lang) {
      Lang[lang].setAsCurrent(false);
    },
  },
};
</script>

<template>
  <PrimaryButton
    :key="lang"
    class="c-language-list-entry"
    @click="setLanguage(lang)"
  >
    <img
      :src="`flags/flag_${lang}.svg`"
      class="c-language-flag"
    >
    <span>{{ langName }}</span>
  </PrimaryButton>
</template>

<style scoped>
.c-language-list-entry {
  display: flex;
  margin-bottom: 1.5rem;
  height: fit-content;
  flex-direction: column;
}

.c-language-list-entry > span {
  width: 100%;
}

.c-language-flag {
  width: 11rem;
  height: 11rem;
}
</style>
