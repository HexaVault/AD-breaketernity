<script>
export default {
  name: "GlyphContextMenu",
  components: {
  },
  props: {
    glyph: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    strength: {
      type: Decimal,
      required: true
    },
    level: {
      type: Decimal,
      required: true
    },
    effects: {
      type: Array,
      required: true
    },
    id: {
      type: Number,
      required: false,
      default: 0,
    },
    sacrificeReward: {
      type: Decimal,
      required: false,
      default: new Decimal(),
    },
    refineReward: {
      type: Decimal,
      required: false,
      default: new Decimal(),
    },
    uncappedRefineReward: {
      type: Decimal,
      required: false,
      default: new Decimal(),
    },
    currentAction: {
      type: String,
      required: true
    },
    scoreMode: {
      type: Number,
      required: true
    },
    showDeletionText: {
      type: Boolean,
      required: false,
      default: true,
    },
    displayLevel: {
      type: Decimal,
      required: false,
      default: new Decimal(),
    },
    changeWatcher: {
      type: Number,
      required: true
    },
    glyphSelection: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      canSacrifice: false,
      canRefine: false,
      canEquip: false,
      isEquipped: false,
    };
  },
  computed: {
    onTouchDevice() {
      return GameUI.touchDevice;
    },
    effectiveLevel() {
      return this.displayLevel.neq(0) ? this.displayLevel : this.level;
    },
    sortedEffects() {
      return getGlyphEffectValuesFromArray(this.effects, this.effectiveLevel, this.strength, this.type);
    },
    rarityInfo() {
      return getRarity(this.strength);
    },
    // Values for baseColor and textColor will only ever be black or white
    baseColor() {
      return CosmeticGlyphTypes[this.type].currentColor.bg;
    },
    textColor() {
      return this.baseColor === "black" ? "white" : "black";
    },
    mainBorderColor() {
      return GlyphAppearanceHandler.getBorderColor(this.type);
    },
    descriptionStyle() {
      const color = GlyphAppearanceHandler.getRarityColor(this.strength, this.type);
      const cursedColor = GlyphAppearanceHandler.isLightBG ? "white" : "black";
      return {
        color: this.type === "cursed" ? cursedColor : color,
        animation: this.type === "reality" ? "a-reality-glyph-name-cycle 10s infinite" : undefined
      };
    },
    isLevelCapped() {
      if (this.glyphSelection) return false;
      return this.displayLevel.neq(0) && this.displayLevel.lt(this.level);
    },
    isLevelBoosted() {
      if (this.glyphSelection) return false;
      return this.displayLevel.neq(0) && this.displayLevel.gt(this.level);
    },
    rarityText() {
      if (!GlyphInfo[this.type].hasRarity) return "";
      const strength = Pelle.isDoomed ? Pelle.glyphStrength : this.strength;
      return `Rarity:
        <span style="color: ${this.descriptionStyle.color}">${formatRarity(strengthToRarity(strength))}</span>`;
    },
    levelText() {
      if (this.type === "companion") return "No level";
      // eslint-disable-next-line no-nested-ternary
      const arrow = this.isLevelCapped
        ? "<i class='fas fa-sort-down'></i>"
        : (this.isLevelBoosted ? "<i class='fas fa-sort-up'></i>" : "");
      // eslint-disable-next-line no-nested-ternary
      const color = this.isLevelCapped
        ? "#ff4444"
        : (this.isLevelBoosted ? "#44FF44" : undefined);
      return `Level: <span style="color: ${color}">
              ${arrow}${formatInt(this.effectiveLevel)}${arrow}
              </span>`;
    },
    eventHandlers() {
      return GameUI.touchDevice ? {
        touchstart: this.touchStart,
        dragstart: this.dragStart,
        dragEnd: this.dragEnd,
      } : {};
    },
    glyphHeaderStyle() {
      const color = GlyphAppearanceHandler.getRarityColor(1.5, this.type);
      return {
        "border-color": color,
        "box-shadow": `0 0 0.5rem 0.1rem ${color}, 0 0 0.8rem ${color} inset`,
        color: this.textColor,
        background: this.baseColor
      };
    },
    equipStyle() {
      if (this.baseColor === "white") return this.canEquip ? "l-allowed-button-alt" : "l-disallowed-button-alt";
      return this.canEquip ? "l-allowed-button" : "l-disallowed-button";
    },
    equipText() {
      return this.canEquip ? "Equip" : "Can't Equip";
    },
    buttonStyle() {
      return this.baseColor === "white" ? "l-allowed-button-alt" : "l-allowed-button";
    },
  },
  watch: {
    changeWatcher() {
      this.$recompute("sortedEffects");
    }
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
  methods: {
    // eslint-disable-next-line no-empty-function
    update() {
      if (!this.glyph) return;
      this.isEquipped = Glyphs.active.find(n => n?.id === this.glyph.id) !== undefined;
      this.canRefine = (GlyphInfo[this.type].hasAlchemyResource && AlchemyResource[this.type].isUnlocked) ||
        (GlyphInfo[this.type].hasAdvancedAlchemyResource && AdvancedAlchemyResources[this.type === "amalgam" ? "amalgamated" : this.type].isUnlocked);
      this.canSacrifice = GlyphInfo[this.type].hasSacrifice && GlyphSacrificeHandler.canSacrifice;
      let canEquip = true;
      if (Glyphs.active.countWhere(n => !n) <= 0 || this.isEquipped) canEquip = false;
      const maxEquipped = GlyphInfo[this.glyph.type].maxEquipped ?? Infinity;
      if (Glyphs.active.filter(n => n?.type === this.glyph.type).length >= maxEquipped) canEquip = false;
      this.canEquip = canEquip;
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
    sacrificeText() {
      if (!this.canSacrifice) return "";
      const powerText = `${format(this.sacrificeReward, 2, 2)}`;
      return `Sacrifice for ${powerText}`;
    },
    refineText() {
      if (!this.canRefine) return "";
      let refinementText = `${format(this.uncappedRefineReward, 2, 2)} ${GlyphInfo[this.type].regularGlyphSymbol}`;
      if (this.uncappedRefineReward.neq(this.refineReward)) {
        // eslint-disable-next-line max-len
        refinementText += ` (Capped: ${format(this.refineReward, 2, 2)} ${GlyphInfo[this.type].regularGlyphSymbol})`;
      }
      return `Refine for ${refinementText}`;
    },
    glyphDelete() {
      GlyphSacrificeHandler.deleteGlyph(this.glyph);
    },
    glyphEquip() {
      if (!this.canEquip) return;
      for (let i = 0; i < Glyphs.activeSlotCount; i++) {
        if (Glyphs.activeGlyph(i) === null) {
          Glyphs.equip(Glyphs.findByInventoryIndex(this.glyph.idx), i);
          return;
        }
      }
    },
    glyphUnequip() {
      if (!this.isEquipped) return;
      const invSlot = Glyphs.findFreeIndex(player.options.respecIntoProtected);
      if (invSlot < 0) return;
      const findSlot = Glyphs.active.find(n => n.idx === this.glyph.idx);
      if (!findSlot) return;
      Glyphs.unequip(this.glyph.idx, invSlot);
      beginProcessReality(getRealityProps(true));
    },
    emitClose() {
      EventHub.dispatch(GAME_EVENT.CLOSE_CONTEXT);
    },
    glyphSacrifice() {
      if (this.isEquipped) return;
      const findSlot = Glyphs.findByInventoryIndex(this.glyph.idx);
      if (!findSlot) return;
      Glyphs.sacrificeGlyph(findSlot);
    },
    glyphRefine() {
      if (this.isEquipped) return;
      const findSlot = Glyphs.findByInventoryIndex(this.glyph.idx);
      if (!findSlot) return;
      GlyphSacrificeHandler.attemptRefineGlyph(findSlot, false, false);
    },
  }
};
</script>

<template>
  <div
    v-click-outside="emitClose"
    class="l-glyph-cm"
    v-on="eventHandlers"
  >
    <div
      class="c-glyph-tooltip__header"
      :style="glyphHeaderStyle"
    >
      <span
        class="c-glyph-tooltip__description"
      />
      <span class="l-glyph-tooltip__info">
        <br>
        <span v-html="levelText" /><br>
        <span v-html="rarityText" />
      </span>
      <span v-if="!isEquipped">
        <span class="l-gray">
          ————————
        </span><br>
        <button
          :class="equipStyle"
          @click="glyphEquip"
        >
          {{ equipText }}
        </button>
      </span>
      <span v-if="isEquipped">
        <span class="l-gray">
          ————————
        </span><br>
        <button
          :class="buttonStyle"
          @click="glyphUnequip"
        >
          Unequip
        </button>
      </span>
      <span v-if="canSacrifice && !isEquipped">
        <span class="l-gray">
          ————————
        </span>
        <button
          :class="buttonStyle"
          @click="glyphSacrifice"
        >
          {{ sacrificeText() }}
        </button>
      </span>
      <span v-if="canRefine && !isEquipped">
        <span class="l-gray">
          ————————
        </span>
        <button
          :class="buttonStyle"
          @click="glyphRefine"
        >
          {{ refineText() }}
        </button>
      </span>
      <span v-if="!canSacrifice && !canRefine && !isEquipped">
        <span class="l-gray">
          ————————
        </span><br>
        <button
          :class="buttonStyle"
          @click="glyphDelete"
        >
          Delete
        </button>
      </span>
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
