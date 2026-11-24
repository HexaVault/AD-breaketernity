<script>
export default {
  name: "ModernAntimatterGalaxyRow",
  data() {
    return {
      type: GALAXY_TYPE.NORMAL,
      galaxies: {
        normal: new Decimal(),
        replicanti: new Decimal(),
        dilation: new Decimal()
      },
      requirement: {
        tier: 1,
        amount: 0
      },
      canBeBought: false,
      distantStart: new Decimal(),
      remoteStart: new Decimal(),
      lockText: null,
      canBulkBuy: false,
      creditsClosed: false,
      scalingText: {
        distant: null,
        remote: null,
      },
      hasTutorial: false,
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    dimName() {
      return AntimatterDimension(this.requirement.tier).shortDisplayName;
    },
    buttonText() {
      if (this.lockText !== null) return this.lockText;
      let strToUse = 0;
      if (!Achievement(111).canBeApplied) strToUse += 1;
      if (!Achievement(143).canBeApplied) strToUse += 2;
      return i18n("other", "adGalaxyModern_incPower", [], true)[strToUse];
    },
    sumText() {
      const parts = [Decimal.max(this.galaxies.normal, 0)];
      if (this.galaxies.replicanti.gt(0)) parts.push(this.galaxies.replicanti);
      if (this.galaxies.dilation.gt(0)) parts.push(this.galaxies.dilation);
      const sum = parts.map(this.formatGalaxies).join(" + ");
      if (parts.length >= 2) {
        return `${sum} = ${this.formatGalaxies(parts.sum())}`;
      }
      return sum;
    },
    typeName() {
      const strings = i18n("other", "adGalaxyModern_typeName", [], true);
      if (this.type > strings.length) return "???";
      return strings[this.type];
    },
    hasIncreasedScaling() {
      return this.type !== GALAXY_TYPE.NORMAL;
    },
    costScalingText() {
      switch (this.type) {
        case GALAXY_TYPE.DISTANT:
          return i18n("other", "adGalaxyModern_moreExpensive", [this.distantStart]);
        case GALAXY_TYPE.REMOTE: {
          const str = i18n("other", "adGalaxyModern_moreExpensiveTypes", [this.distantStart, this.remoteStart], true);
          const scalings = [
            { text: str[1], amount: this.distantStart },
            { text: str[2], amount: this.remoteStart }
          ];
          return `${str[0]} ${scalings.sort((a, b) => a.amount.compare(b.amount))
            .map(scaling => `${scaling.text}`)
            .join(", ").capitalize()}`;
        }
      }
      return undefined;
    },
    classObject() {
      return {
        "o-primary-btn o-primary-btn--new o-primary-btn--dimension-reset": true,
        "tutorial--glow": this.canBeBought && this.hasTutorial,
        "o-primary-btn--disabled": !this.canBeBought,
        "o-pelle-disabled-pointer": this.creditsClosed
      };
    },
    reqText() {
      return i18n("other", "adGalaxyModern_requiresNDim", [formatInt(this.requirement.amount), this.dimName()]);
    }
  },
  methods: {
    update() {
      this.type = Galaxy.type;
      this.galaxies.normal.copyFrom(player.galaxies.add(GalaxyGenerator.galaxies));
      this.galaxies.replicanti.copyFrom(Replicanti.galaxies.total);
      this.galaxies.dilation.copyFrom(player.dilation.totalTachyonGalaxies);
      const requirement = Galaxy.requirement;
      this.requirement.amount = requirement.amount;
      this.requirement.tier = requirement.tier;
      this.canBeBought = requirement.isSatisfied && Galaxy.canBeBought;
      this.distantStart.copyFrom(EternityChallenge(5).isRunning ? new Decimal() : Galaxy.costScalingStart);
      this.remoteStart.copyFrom(Galaxy.remoteStart);
      this.lockText = Galaxy.lockText;
      this.canBulkBuy = EternityMilestone.autobuyMaxGalaxies.isReached;
      this.creditsClosed = GameEnd.creditsEverClosed;
      if (this.isDoomed) {
        this.scalingText = {
          distant: this.formatGalaxies(this.distantStart),
          remote: this.formatGalaxies(Galaxy.remoteStart),
        };
      }
      this.hasTutorial = Tutorial.isActive(TUTORIAL_STATE.GALAXY);
    },
    buyGalaxy(bulk) {
      if (!this.canBeBought) return;
      manualRequestGalaxyReset(this.canBulkBuy && bulk);
    },
    formatGalaxies(num) {
      return num.gt(1e8) ? format(num, 2) : formatInt(num.toNumber());
    },
  }
};
</script>

<template>
  <div class="reset-container galaxy">
    <h4>{{ typeName }} ({{ sumText }})</h4>
    <span>{{ reqText }}</span>
    <span v-if="hasIncreasedScaling">{{ costScalingText }}</span>
    <button
      :class="classObject"
      @click.exact="buyGalaxy(true)"
      @click.shift.exact="buyGalaxy(false)"
    >
      {{ buttonText }}
      <div
        v-if="hasTutorial"
        class="fas fa-circle-exclamation l-notification-icon"
      />
    </button>
  </div>
</template>
