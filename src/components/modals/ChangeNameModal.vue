<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "ChangeNameModal",
  components: {
    ModalWrapperChoice,
  },
  data() {
    return {
      input: "",
      actualName: ""
    };
  },
  computed: {
    topLabel() {
      return i18n("modal", "changeNameModalTitle");
    },
    noteA() {
      return i18n("modal", "changeNameModalCannotChange", [formatInt(40)]);
    },
    noteB() {
      return i18n("modal", "changeNameModalNewName", [this.actualName]);
    },
    buttonLabel() {
      return i18n("modal", "changeNameModalButtonLabel");
    }
  },
  created() {
    this.input = player.speedrun.name;
    this.actualName = Speedrun.generateName(this.input);
  },
  mounted() {
    this.$refs.input.select();
  },
  methods: {
    updateName() {
      this.actualName = Speedrun.generateName(this.input);
    },
    confirmChange() {
      player.speedrun.name = this.actualName;
      this.emitClose();
    },
  },
};
</script>

<template>
  <ModalWrapperChoice @confirm="confirmChange">
    <template #header>
      {{ topLabel }}
    </template>
    <input
      ref="input"
      v-model="input"
      type="text"
      class="c-modal-input c-modal-import__input"
      @keyup="updateName"
      @keyup.enter="confirmChange"
      @keyup.esc="emitClose"
    >
    <i>
      {{ noteA }}
    </i>
    <div>
      {{ noteB }}
    </div>
    <template #confirm-text>
      {{ buttonLabel }}
    </template>
  </ModalWrapperChoice>
</template>
