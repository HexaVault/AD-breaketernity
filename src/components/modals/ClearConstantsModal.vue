<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ClearConstantsModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      constantCount: 0,
    };
  },
  computed: {
    topLabel() {
      return i18n("modal", "delConstsModalTitle");
    },
    noteA() {
      return i18n("modal", "delConstsModalWishToDelete");
    },
    noteB() {
      return i18n("modal", "delConstsModalWillDeleteXConsts", [[formatInt, this.constantCount]]);
    },
    buttonLabel() {
      return i18n("modal", "delConstsModalButtonLabel");
    }
  },
  methods: {
    update() {
      this.constantCount = Object.keys(player.reality.automator.constants).length;
      if (this.constantCount === 0) this.emitClose();
    },
    deleteConstants() {
      player.reality.automator.constants = {};
      player.reality.automator.constantSortOrder = [];
    }
  }
};
</script>

<template>
  <ModalWrapperChoice
    @confirm="deleteConstants"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ noteA }}
      <br>
      <span class="l-lost-text">
        {{ noteB }}
      </span>
    </div>
    <template #confirm-text>
      {{ buttonLabel }}
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.l-lost-text {
  font-weight: bold;
  color: var(--color-bad);
}
</style>
