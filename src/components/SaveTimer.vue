<script>
export default {
  name: "SaveTimer",
  data() {
    return {
      currentTime: 0,
      lastLocalSave: 0,
      showTimeSinceSave: false,
      saveDisabled: false,
    };
  },
  computed: {
    timeString() {
      return timeDisplayShort(new Decimal(this.currentTime - this.lastLocalSave));
    },
  },
  methods: {
    update() {
      this.currentTime = Date.now();
      this.lastLocalSave = GameStorage.lastSaveTime;
      this.showTimeSinceSave = player.options.showTimeSinceSave;
      this.saveDisabled = GameEnd.endState >= END_STATE_MARKERS.INTERACTIVITY_DISABLED;
    },
    save() {
      GameStorage.save(false, true);
    }
  }
};
</script>

<template>
  <div
    v-if="showTimeSinceSave"
    class="o-save-timer"
    @click="save"
  >
    <b v-if="saveDisabled">There is nothing left to save.</b>
    <span v-else>Time since last save: {{ timeString }}</span>
  </div>
</template>

<style scoped>
.o-save-timer {
  white-space: nowrap;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 5;
  text-align: left;
  color: var(--color-text);
  background-color: var(--color-base);
  border-top: 0.1rem solid var(--color-accent);
  border-right: 0.1rem solid var(--color-accent);
  padding: 0 0.5rem;
  pointer-events: auto;
  -webkit-user-select: none;
  user-select: none;
  cursor: pointer;
}

.t-s2 .o-save-timer {
  filter: sepia(100%) hue-rotate(180deg) saturate(250%);
}

.t-s3 .o-save-timer {
  animation: a-glasses 7s infinite;
}
</style>
