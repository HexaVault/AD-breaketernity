<script>
import AwayProgressOptionsEntry from "@/components/modals/options/AwayProgressOptionsEntry";
import ModalWrapperOptions from "@/components/modals/options/ModalWrapperOptions";

export default {
  name: "AwayProgressOptionsModal",
  components: {
    AwayProgressOptionsEntry,
    ModalWrapperOptions,
  },
  computed: {
    all() {
      return AwayProgressTypes.showOption;
    },
    topLabel: () => i18n("modal", "AwayHeader"),
    note: () => i18n("modal", "AwayNote")
  },
};
</script>

<template>
  <ModalWrapperOptions class="l-wrapper">
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-modal-options__button-container">
      <AwayProgressOptionsEntry
        v-for="name of all"
        :key="name"
        :name="name"
      />
    </div>
    {{ note }}
  </ModalWrapperOptions>
</template>

<style scoped>
.l-wrapper {
  width: 75rem;
}
</style>