<script>
export default {
  name: "SelectNotationDropdown",
  data() {
    return {
      options: ["Off", "Compact", "Normal"],
    };
  },
  methods: {
    setAsCurrent(option) {
      player.options.amGainDisplayType = option;
    }
  }
};
</script>

<template>
  <div class="l-dropdown">
    <div class="l-dropdown__inner">
      <div
        v-for="option in options"
        :key="option"
        class="o-primary-btn l-dropdown__item c-dropdown__item"
        @click="setAsCurrent(option)"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>
