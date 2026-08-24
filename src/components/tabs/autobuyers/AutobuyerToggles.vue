<script>
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "AutobuyerToggles",
  components: {
    PrimaryButton,
    PrimaryToggleButton
  },
  data() {
    return {
      isDoomed: false,
      autobuyersOn: false,
      showContinuum: false,
      disableContinuum: false,
      allAutobuyersDisabled: false,
      allAutobuyersSingle: false,
    };
  },
  watch: {
    autobuyersOn(newValue) {
      player.auto.autobuyersOn = newValue;
    },
    disableContinuum(newValue) {
      if (ImaginaryUpgrade(21).isLockingMechanics && !newValue) {
        ImaginaryUpgrade(21).tryShowWarningModal();
        return;
      }
      Laitela.setContinuum(!newValue);
    }
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.autobuyersOn = player.auto.autobuyersOn;
      this.showContinuum = Laitela.isUnlocked;
      this.disableContinuum = player.auto.disableContinuum;
      this.allAutobuyersDisabled = Autobuyers.unlocked.every(autobuyer => !autobuyer.isActive);
      this.allAutobuyersSingle = Autobuyers.unlocked.filter(n => n.fullName?.splice(0, 4, "") === i18n("auto", "adXauto")
        .splice(0, 4, "")).every(autobuyer => autobuyer.mode === 1);
    },
    toggleAllAutobuyers() {
      for (const autobuyer of Autobuyers.unlocked) {
        autobuyer.isActive = this.allAutobuyersDisabled;
      }
    },
    toggleSingleADauto() {
      for (const autobuyer of Autobuyers.unlocked) {
        if (autobuyer.fullName.splice(0, 4, "") === i18n("auto", "adXauto").splice(0, 4, "")) {
          autobuyer.mode = this.allAutobuyersSingle ? 10 : 1;
        }
      }
    }
  }
};
</script>

<template>
  <div class="c-subtab-option-container">
    <PrimaryToggleButton
      v-model="autobuyersOn"
      on="Pause autobuyers"
      off="Resume autobuyers"
      class="o-primary-btn--subtab-option"
    />
    <PrimaryButton
      class="o-primary-btn--subtab-option"
      @click="toggleAllAutobuyers()"
    >
      {{ allAutobuyersDisabled ? i18n("consts", "disable") : i18n("consts", "enable") }}
    </PrimaryButton>
    <PrimaryButton
      class="o-primary-btn--subtab-option"
      @click="toggleSingleADauto()"
    >
      {{ i18n("auto", "buy10buy1").split("$")[allAutobuyersSingle ? 0 : 1] }}
    </PrimaryButton>
    <span v-if="isDoomed">
      <PrimaryButton
        v-if="showContinuum"
        class="o-primary-btn--subtab-option"
      >
        {{ i18n("auto", "continuum") }}
      </PrimaryButton>
    </span>
    <span v-else>
      <PrimaryToggleButton
        v-if="showContinuum"
        v-model="disableContinuum"
        on="Enable Continuum"
        off="Disable Continuum"
        class="o-primary-btn--subtab-option"
      />
    </span>
  </div>
</template>

<style scoped>

</style>
