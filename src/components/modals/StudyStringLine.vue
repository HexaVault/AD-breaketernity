<script>
export default {
  name: "StudyStringLine",
  props: {
    tree: {
      type: Object,
      required: true,
    },
    intoEmpty: {
      type: Boolean,
      required: true,
    }
  },
  computed: {
    notPurchaseString() {
      return i18n("modal", "studyStringModalLineNotPurchaseNew", [], true)[this.intoEmpty ? 0 : 1];
    },
    purchaseString() {
      return i18n("modal", "studyStringModalLineWillPurchaseX", [], true)[this.intoEmpty ? 0 : 1];
    },
    formatTheoremCost() {
      const strTT = i18n("plurals", "TTSHORT", [[formatWithCommas, this.tree.timeTheorems]]);
      const strST = i18n("plurals", "STSHORT", [[formatWithCommas, this.tree.spaceTheorems]]);
      return i18n("modal", "studyStringModalLineCostsX", [this.tree.spaceTheorems.eq(0) ? strTT : `${strTT} + ${strST}`]);
    }
  },
};
</script>

<template>
  <div class="l-modal-import-tree__tree-info-line">
    <div v-if="tree.timeTheorem.eq(0) && tree.spaceTheorems.eq(0)">
      <i>{{ notPurchaseString }}</i>
    </div>
    <div v-else>
      {{ purchaseString }}
      <br>
      {{ tree.newStudies }}
      {{ formatTheoremCost }}
    </div>
    <br>
  </div>
</template>
