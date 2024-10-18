<script>
export default {
  name: "AutomatorDocsTemplateList",
  data() {
    return {
      selectedTemplateID: -1,
    };
  },
  computed: {
    templates: () => GameDatabase.reality.automator.templates.scripts,
    pasteText() {
      return `copy the template as text onto your clipboard. You can directly paste the template text into your
        Automator wherever you would like it`;
    }
  },
  methods: {
    showModal(template) {
      Modal.automatorScriptTemplate.show(template);
    },
    setIndex(index) {
      this.selectedTemplateID = index;
    }
  }
};
</script>

<template>
  <div>
    These templates will let you do some more common things within the Automator. They may be slightly slower than
    manually-written scripts, but don't require you to have any previous programming experience to use. Clicking any
    of these buttons will open up a prompt with some input fields, which will generate a template you can place into
    your Automator.
    <button
      v-for="template in templates"
      :key="template.name"
      class="o-primary-btn c-automator-docs-template--button l-automator__button"
      @click="showModal(template)"
    >
      Template: {{ template.name }}
    </button>
    This panel will {{ pasteText }}.
  </div>
</template>

<style scoped>
.c-automator-docs-template--button {
  margin: 0.4rem;
  border-radius: var(--var-border-radius, 0.4rem);
  border-width: var(--var-border-width, 0.2rem);
  cursor: pointer;
}

.template-container {
  display: flex;
  flex-direction: column;
}
</style>
