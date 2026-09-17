<script>
export default {
  name: "PopupModal",
  props: {
    modal: {
      type: Object,
      required: true,
    },
    modalid: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data() {
    return {
      showModal: false,
      positionStyle: {},
      x: 50,
      y: 50,
      initalDragX: 0,
      initalDragY: 0
    };
  },
  created() {
    this.on$(GAME_EVENT.CLOSE_MODAL, this.hide);
  },
  mounted() {
    this.updatePositionStyles();
  },
  destroyed() {
    document.activeElement.blur();
  },
  methods: {
    update() {
      const oldShowModal = this.showModal;
      // 2.5 is the cutoff point where the screen starts fading (interactivity disabled). However, we specifically
      // want to allow glyph customization to appear at the very end (and nothing else)
      this.showModal = GameEnd.endState <= END_STATE_MARKERS.INTERACTIVITY_DISABLED ||
        this.modal.component.name === "CosmeticSetChoiceModal";
      if (this.showModal !== oldShowModal) this.$nextTick(() => this.updatePositionStyles());
      this.updatePositionStyles();
    },
    updatePositionStyles() {
      if (!this.$refs.modal) return;
      if (!this.showModal || this.$viewModel.theme !== "S12") {
        this.positionStyle = {};
        return;
      }
      const w = this.$refs.modal.offsetWidth, h = this.$refs.modal.offsetHeight;
      // We need to set position style specifically for S12 because using a transform messes things up and
      // makes everything really blurry
      this.positionStyle = {
        left: `${Math.round(innerWidth / 2 - w / 2)}px`,
        top: `${Math.round(innerHeight / 2 - h / 2)}px`,
        transform: "none",
      };
    },
    hide() {
      if (!this.modal.isOpen) return;
      if (this.modal.hide) this.modal.hide();
      else Modal.hide();
    },
    style() {
      return { "left": `${this.x}vw`, "top": `${this.y}vh` };
    },
    changeOnDrag(dragData) {
      // This occurs on the last call when dragging ends. Best to disallow this edge-case then edge-case the bug.
      if (dragData.screenX === 0) return;
      this.x += ((dragData.pageX - this.initalDragX) / window.innerWidth) * 100;
      this.y += ((dragData.pageY - this.initalDragY) / window.innerHeight) * 100;
      this.initalDragX = dragData.pageX;
      this.initalDragY = dragData.pageY;
    },
    removeDragImage(event) {
      event.dataTransfer.setDragImage(event.target, -99999, -99999);
      this.initalDragX = event.pageX;
      this.initalDragY = event.pageY;
    }
  },
};
</script>

<template>
  <div
    v-if="showModal"
    ref="modal"
    class="l-modal c-modal"
    :style="style()"
    draggable="true"
    @drag="changeOnDrag($event)"
    @dragstart="removeDragImage($event)"
  >
    <component
      :is="modal.component"
      v-bind="modal.props"
      @close="hide"
    />
  </div>
</template>
