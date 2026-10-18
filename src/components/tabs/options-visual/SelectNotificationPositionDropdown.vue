<script>
export default {
  name: "SelectNotificationPositionDropdown",
  data() {
    return {
      // TODO: i18n
      options: ["Top Right", "Top Left", "Bottom Left", "Bottom Right"],
    };
  },
  methods: {
    setAsCurrent(option) {
      player.options.notificationDisplay = this.options.indexOf(option);
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
