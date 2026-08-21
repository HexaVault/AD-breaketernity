<script>
export default {
  name: "StudyTreeInfo",
  props: {
    headerText: {
      type: String,
      required: true,
    },
    treeStatus: {
      type: Object,
      required: true,
    },
  },
  computed: {
    dimSplitText() {
      return i18n("modal", "studyStringModalInfoDimensionSplit", [treeStatus.firstPaths]);
    },
    paceSplitText() {
      return i18n("modal", "studyStringModalInfoPaceSplit", [treeStatus.secondPaths]);
    },
    ecText() {
      return i18n("modal", "studyStringModalInfoECText", [`${treeStatus.ec}`], true)[Number(treeStatus.startEC)];
    }
  }
};
</script>

<template>
  <div class="c-tree-info">
    <span
      class="l-tree-info-header"
      v-html="headerText"
    />
    <div
      v-if="treeStatus.firstPaths"
      class="l-modal-import-tree__tree-info-line"
    >
      {{ dimSplitText }}
    </div>
    <div
      v-if="treeStatus.secondPaths"
      class="l-modal-import-tree__tree-info-line"
    >
      {{ paceSplitText }}
    </div>
    <div
      v-if="treeStatus.ec > 0"
      class="l-modal-import-tree__tree-info-line"
    >
      {{ ecText }}
    </div>
  </div>
</template>

<style scoped>
.l-tree-info-header {
  font-size: 1.7rem;
}

.c-tree-info {
  padding: 0.7rem;
}
</style>
