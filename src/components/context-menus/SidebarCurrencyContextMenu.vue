<script>
export default {
  name: "SidebarCurrencyContextMenu",
  components: {
  },
  props: {},
  data() {
    return {
      sidebarID: 0
    };
  },
  computed: {
    // Values for baseColor and textColor will only ever be black or white
    baseColor() {
      return Theme.current().isDark ? "black" : "white";
    },
    textColor() {
      return Theme.current().isDark ? "white" : "black";
    },
    eventHandlers() {
      return GameUI.touchDevice ? {
        touchstart: this.touchStart,
        dragstart: this.dragStart,
        dragEnd: this.dragEnd,
      } : {};
    },
    numDBEntries() {
      return this.resourceDB.length;
    },
    resourceDB: () => GameDatabase.sidebarResources,
    resource() {
      return this.sidebarID === 0
        ? this.resourceDB.filter(e => e.isAvailable()).sort((a, b) => b.id - a.id)[0]
        : this.resourceDB.find(e => e.id === this.sidebarID);
    },
    glyphHeaderStyle() {
      const color = GlyphAppearanceHandler.getRarityColor(1.5, "power");
      return {
        "border-color": "#43a047",
        "box-shadow": `0 0 0.5rem 0.1rem ${color}, 0 0 0.8rem ${color} inset`,
        color: "white",
        background: "black"
      };
    },
    buttonStyle() {
      return this.baseColor === "white" ? "l-allowed-button-alt" : "l-allowed-button";
    },
  },
  mounted() {
    // By attaching the tooltip to the body element, we make sure it ends up on top of anything
    // else, with no z order shenanigans
    document.body.appendChild(this.$el);
  },
  destroyed() {
    try {
      document.body.removeChild(this.$el);
    } catch (e) {
      // If the tooltip isn't visible, then it can't be removed on account of not being there in the first place.
      // Trying to remove it anyway causes an exception to be thrown but otherwise nothing seems to actually affect
      // the game. Nevertheless, including this try/catch no-op suppresses console error spam.
    }
  },
  // Player.options.sidebarResourceID
  methods: {
    // eslint-disable-next-line no-empty-function
    update() {
      this.sidebarID = player.options.sidebarResourceID;
    },
    touchStart() {
      // We _don't_ preventDefault here because we want the event to turn into a local
      // dragstart that we can intercept
      this.$parent.$emit("tooltip-touched");
    },
    dragStart(ev) {
      // Prevent dragging by tooltip on mobile
      ev.preventDefault();
      ev.stopPropagation();
    },
    dragEnd(ev) {
      ev.preventDefault();
      ev.stopPropagation();
    },
    getFontColor() {
      return Theme.current().isDark() ? "#cccccc" : "black";
    },
    emitClose() {
      EventHub.dispatch(GAME_EVENT.CLOSE_CONTEXT);
    },
    setToZero() {
      player.options.sidebarResourceID = 0;
    },
    changeResource(dir) {
      const oldID = this.sidebarID;
      this.sidebarID = (this.sidebarID + this.numDBEntries + dir) % this.numDBEntries;
      while (this.sidebarID !== oldID) {
        if (this.resource.isAvailable()) break;
        this.sidebarID = (this.sidebarID + this.numDBEntries + dir) % this.numDBEntries;
      }
      player.options.sidebarResourceID = this.sidebarID;
    },
  }
};
</script>

<template>
  <div
    v-click-outside="emitClose"
    class="l-sidebar-cm"
    v-on="eventHandlers"
  >
    <div
      class="c-glyph-tooltip__header"
      :style="glyphHeaderStyle"
    >
      <br>
      <button
        :class="buttonStyle"
        @click.exact="changeResource(1)"
      >
        Next Currency
      </button>
      <span class="l-gray">
        ————————
      </span>
      <button
        :class="buttonStyle"
        @click.exact="changeResource(-1)"
      >
        Previous Currency
      </button>
      <span class="l-gray">
        ————————
      </span>
      <button
        :class="buttonStyle"
        @click="setToZero"
      >
        Set to Current Currency
      </button>
      <br>
    </div>
  </div>
</template>

<style scoped>
.c-glyph-tooltip__sacrifice {
  font-size: 1rem;
  font-weight: normal;
}

/* We have to redefine all these because its the easiest way */
.l-allowed-button {
  background-color: transparent;
  border: none;
  color: white;
  font-family: Typewriter, serif;
  font-size: 1.1rem;
  font-weight: bold;
  -webkit-font-smoothing: antialiased;
}

.l-disallowed-button {
  background-color: transparent;
  border: none;
  color: #606060;
  font-family: Typewriter, serif;
  font-size: 1.1rem;
  font-weight: bold;
  -webkit-font-smoothing: antialiased;
}

.l-allowed-button-alt {
  background-color: transparent;
  border: none;
  color: black;
  font-family: Typewriter, serif;
  font-size: 1.1rem;
  font-weight: bold;
  -webkit-font-smoothing: antialiased;
}

.l-disallowed-button-alt {
  background-color: transparent;
  border: none;
  color: #909090;
  font-family: Typewriter, serif;
  font-size: 1.1rem;
  font-weight: bold;
  -webkit-font-smoothing: antialiased;
}

.l-gray {
  color: #101010;
}
</style>
