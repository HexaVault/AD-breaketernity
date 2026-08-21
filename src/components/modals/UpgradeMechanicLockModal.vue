<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "UpgradeMechanicLockModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    },
    isImaginary: {
      type: Boolean,
      required: true,
    },
    specialLockText: {
      type: String,
      required: false,
      default: null,
    }
  },
  computed: {
    upgradeType() {
      return i18n("modal", "upgradeLockModaliUrU").split("$")[this.isImaginary ? 0 : 1];
    },
    topLabel() {
      return i18n("modal", "upgradeLockModalTitle", [this.upgradeType]);
    },
    textA() {
      return i18n("modal", "upgradeLockModalAreYouSure", [lockEvent, upgradeStr, upgrade.name], true)[0];
    },
    textB() {
      return i18n("modal", "upgradeLockModalAreYouSure", [lockEvent, upgradeStr, upgrade.name], true)[1];
    },
    selectCancel() {
      return i18n("modal", "upgradeLockModalCancelNoEffect");
    },
    noAction() {
      return i18n("modal", "upgradeLockModalNeitherDoesAction");
    },
    buttonLabel() {
      return i18n("modal", "upgradeLockModalDisableLock");
    },
    lockEvent() {
      return this.specialLockText ?? this.upgrade.lockEvent;
    }
  },
  methods: {
    disableLock() {
      this.upgrade.setMechanicLock(false);
    }
  }
};
</script>

<template>
  <ModalWrapperChoice
    @confirm="disableLock"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ textA }}
      <span class="l-emphasis">
        {{ textB }}
      </span>
      <span :ach-tooltip="upgrade.requirement">
        <i class="fas fa-question-circle" />
      </span>
      <br>
      <br>
      {{ selectCancel }}
      <br>
      <br>
      {{ noAction }}
    </div>
    <template #confirm-text>
      {{ buttonLabel }}
    </template>
  </ModalWrapperChoice>
</template>

<style scoped>
.l-emphasis {
  font-weight: bold;
  color: var(--color-bad);
}
</style>
