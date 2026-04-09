<script>
export default {
  name: "SelectLargeNotationDropdown",
  computed: {
    notations: () => LNotations.all,
  }
};
</script>

<template>
  <div class="l-dropdown">
    <div class="l-dropdown__inner">
      <div
        v-for="notation in notations"
        :key="notation.name"
        class="o-primary-btn l-dropdown__item c-dropdown__item"
        @click="notation.setAsCurrent()"
      >
        {{ notation.name }}
      </div>
    </div>
  </div>
</template>
