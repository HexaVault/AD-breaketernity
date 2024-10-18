<script>
import HiddenTabGroup from "@/components/modals/options/hidden-tabs/HiddenTabGroup";
import ModalWrapperOptions from "@/components/modals/options/ModalWrapperOptions";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "HiddenTabsModal",
  components: {
    HiddenTabGroup,
    ModalWrapperOptions,
    PrimaryButton,
  },
  data() {
    return {
      isEnslaved: false,
      isAlmostEnd: false,
    };
  },
  computed: {
    tabs: () => Tabs.currentUIFormat,
    topLabel: () => i18n("modal", "modifyVisibleHeader"),
    message: () => i18n("modal", "modifyVisibleMessage").split("$"),
    cantHideNearEnd: () => i18n("modal", "modifyVisibleHeader"),
    namelessA: () => i18n("modal", "modifyVisibleHeader"),
    namelessB: () => i18n("modal", "modifyVisibleHeader"),
    showAll: () => i18n("modal", "modifyVisibleHeader"),
  },
  methods: {
    update() {
      this.isEnslaved = Enslaved.isRunning;
      this.isAlmostEnd = Pelle.hasGalaxyGenerator;
    },
    showAllTabs() {
      for (const tab of this.tabs) {
        tab.unhideTab();
        for (const subtab of tab.subtabs)
          subtab.unhideTab();
      }
    }
  },
};
</script>

<template>
  <ModalWrapperOptions class="l-wrapper">
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-modal--short">
      {{ message[0] }}
      <br>
      {{ message[1] }}
      <br>
      {{ message[2] }}
      <br>
      <div v-if="isAlmostEnd">
        {{ cantHideNearEnd }}
      </div>
      <div v-if="isEnslaved">
        <br>
        <i>{{ namelessA }}</i>
        <br>
        {{ namelessB }}
      </div>
      <PrimaryButton
        @click="showAllTabs"
      >
        {{ showAll }}
      </PrimaryButton>
      <HiddenTabGroup
        v-for="(tab, index) in tabs"
        :key="index"
        :tab="tab"
        :change-enabled="!isEnslaved && !isAlmostEnd"
        class="l-hide-modal-tab-container"
      />
    </div>
  </ModalWrapperOptions>
</template>

<style scoped>
.l-wrapper {
  width: 62rem;
}

.t-s12 .l-wrapper {
  width: 65rem;
}
</style>