<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "LoadGameEntry",
  components: {
    PrimaryButton
  },
  props: {
    saveId: {
      type: Number,
      required: true
    }
  },
  data() {
    const save = GameStorage.saves[this.saveId];
    return {
      antimatter: new Decimal(save ? save.antimatter || save.money : 10),
      fileName: save ? save.options.saveFileName : ""
    };
  },
  computed: {
    isSelected() {
      return GameStorage.currentSlot === this.saveId;
    },
    saveString() {
      return i18n("modal", "loadGameEntrySave", [this.saveId + 1], true)[Number(this.isSelected)];
    },
    fileNameString() {
      return i18n("modal", "importSaveModalFileName", [this.fileName]);
    },
    antimatterString() {
      return i18n("modal", "importSaveModalAM", [formatAntimatter(this.antimatter)]);
    },
    buttonLabel() {
      return i18n("consts", "load");
    }
  },
  methods: {
    load() {
      GameStorage.loadSlot(this.saveId);
    },
    formatAntimatter(antimatter) {
      return formatPostBreak(antimatter, 2, 1);
    },
    update() {
      if (this.isSelected) {
        this.antimatter.copyFrom(Currency.antimatter);
      }
    },
  },
};
</script>

<template>
  <div class="l-modal-options__save-record">
    <h3>{{ saveString }}</h3>
    <span v-if="fileName">{{ fileNameString }}</span>
    <span>{{ antimatterString }}</span>
    <PrimaryButton
      class="o-primary-btn--width-medium"
      @click="load"
    >
      {{ buttonLabel }}
    </PrimaryButton>
  </div>
</template>
