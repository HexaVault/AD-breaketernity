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
      const gain = i18n("modal", "gain").split(" $ ")[Number(isPlural)];
      const has = i18n("modal", "has").split(" $ ")[Number(isPlural)];
      return this.pet.level === 25
        ? i18n("modal", "regainedAllMemories", [has])
        : i18n("modal", "chunksBasedOn", [gain, this.chunkGain]);
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
