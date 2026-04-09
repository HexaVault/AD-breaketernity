<script>
export default {
  name: "CosmeticSetDropdown",
  computed: {
    lockedSets() {
      return GlyphAppearanceHandler.lockedSets.map(key => GameDatabase.reality.glyphCosmeticSets[key]);
    }
  },
  methods: {
    select(set) {
      GlyphAppearanceHandler.setInModal = set;
      this.$parent.openRequest = false;
    }
  }
};
</script>

<template>
  <div class="l-dropdown">
    <div class="l-dropdown__inner">
      <div
        v-for="set in lockedSets"
        :key="set.id"
        class="o-primary-btn l-dropdown__item c-dropdown__item"
        @click="select(set)"
      >
        {{ set.name }}
      </div>
    </div>
  </div>
</template>
