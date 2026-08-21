<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "BreakInfinityModal",
  components: {
    ModalWrapperChoice
  },
  computed: {
    message() {
      const infinity = formatPostBreak(Number.MAX_VALUE, 2);
      return i18n("modal", PlayerProgress.eternityUnlocked() ? "breakModalTextHasEternitied" : "breakModalText",
        [infinity, [x => formatPostBreak(x, 2), Number.MAX_VALUE]], true);
    },
    topLabel() {
      return i18n("modal", "breakModalTitle");
    },
    buttonLabel() {
      return i18n("modal", "breakModalButton");
    }
  },
  methods: {
    handleYesClick() {
      breakInfinity();
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    :show-cancel="false"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-modal-message__text">
      <span
        v-for="(line, index) in message"
        :key="index"
      >
        {{ line }} <br>
      </span>
    </div>
    <template #confirm-text>
      {{ buttonLabel }}
    </template>
  </ModalWrapperChoice>
</template>
