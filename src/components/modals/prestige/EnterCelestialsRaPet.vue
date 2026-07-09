<script>
export default {
  name: "EnterCelestialsRaPet",
  props: {
    petId: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      isUnlocked: false,
    };
  },
  computed: {
    pet() {
      return Ra.pets.all[this.petId];
    },
    name() {
      return this.pet.name;
    },
    color() {
      return `color: ${this.pet.color}`;
    },
    gainText() {
      // We need to special-case the grammar for Nameless
      const isPlural = this.pet.id === "enslaved";
      return this.pet.level === 25
        ? i18n("modal", "enterRaModalRegainedAllMemories", [], true)[Number(isPlural)]
        : i18n("modal", "enterRaModalChunksBasedOn", [this.chunkGain, true])[Number(isPlural)];
    },
    chunkGain() {
      return this.pet.chunkGain;
    },
  },
  methods: {
    update() {
      this.isUnlocked = this.pet.isUnlocked;
    }
  },
};
</script>

<template>
  <span
    v-if="isUnlocked"
    :style="color"
  >
    {{ name }} {{ gainText }}.
    <br>
  </span>
</template>
