function dimInfinityMult() {
  return Currency.infinitiesTotal.value.times(0.2).plus(1);
}
function chargedDimInfinityMult() {
  return Currency.infinitiesTotal.value.max(1).log10().max(1).log10()
    .times(Math.sqrt(Ra.pets.teresa.level)).div(150).add(1);
}

export const infinityUpgrades = {
  totalTimeMult: {
    id: "timeMult",
    cost: 1,
    get description() { return i18n("inf", "iU11"); },
    effect: () => Time.totalTimePlayed.totalMinutes.div(2).pow(0.15),
    formatEffect: value => formatX(value, 2, 2),
    charged: {
      description: () => i18n("inf", "iU11c"),
      effect: () => Time.totalTimePlayed.totalMilliseconds.max(1).log10().max(1).log10()
        .times(Math.sqrt(Ra.pets.teresa.level)).div(150).add(1),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  dim18mult: {
    id: "18Mult",
    cost: 1,
    checkRequirement: () => InfinityUpgrade.totalTimeMult.isBought,
    get description() { return i18n("inf", "iU12"); },
    effect: () => dimInfinityMult(),
    formatEffect: value => formatX(value, 1, 1),
    charged: {
      description: () => i18n("inf", "iU12c"),
      effect: () => chargedDimInfinityMult(),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  dim27mult: {
    id: "27Mult",
    cost: 1,
    checkRequirement: () => InfinityUpgrade.buy10Mult.isBought,
    get description() { return i18n("inf", "iU22"); },
    effect: () => dimInfinityMult(),
    formatEffect: value => formatX(value, 1, 1),
    charged: {
      description: () => i18n("inf", "iU22c"),
      effect: () => chargedDimInfinityMult(),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  dim36mult: {
    id: "36Mult",
    cost: 1,
    checkRequirement: () => InfinityUpgrade.dim18mult.isBought,
    get description() { return i18n("inf", "iU13"); },
    effect: () => dimInfinityMult(),
    formatEffect: value => formatX(value, 1, 1),
    charged: {
      description: () => i18n("inf", "iU13c"),
      effect: () => chargedDimInfinityMult(),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  dim45mult: {
    id: "45Mult",
    cost: 1,
    checkRequirement: () => InfinityUpgrade.dim27mult.isBought,
    get description() { return i18n("inf", "iU23"); },
    effect: () => dimInfinityMult(),
    formatEffect: value => formatX(value, 1, 1),
    charged: {
      description: () => i18n("inf", "iU23c"),
      effect: () => chargedDimInfinityMult(),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  resetBoost: {
    id: "resetBoost",
    cost: 1,
    checkRequirement: () => InfinityUpgrade.dim36mult.isBought,
    get description() { return i18n("inf", "iU14", [formatInt(9)]); },
    effect: 9,
    charged: {
      description: () => i18n("inf", "iU14c"),
      effect: () => 1 / (1 + Math.sqrt(Ra.pets.teresa.level) / 10),
      formatEffect: value => `${formatX(value, 4, 4)}`
    }
  },
  buy10Mult: {
    id: "dimMult",
    cost: 1,
    get description() { return i18n("inf", "iU21", [formatInt(10)]); },
    effect: () => 1.1,
    formatEffect: () => `${formatX(2, 0, 1)} ➜ ${formatX(2.2, 0, 1)}`,
    charged: {
      description: () => i18n("inf", "iU21c", [formatInt(10)]),
      effect: () => 1 + Ra.pets.teresa.level / 200,
      formatEffect: value => formatPow(value, 3, 3)
    }
  },
  galaxyBoost: {
    id: "galaxyBoost",
    cost: 2,
    checkRequirement: () => InfinityUpgrade.dim45mult.isBought,
    get description() { return i18n("inf", "iU24"); },
    effect: 2,
    charged: {
      description: () => i18n("inf", "iU24c"),
      effect: () => 2 + Math.sqrt(Ra.pets.teresa.level) / 100,
      formatEffect: value => `+${formatPercents(value - 1)}`
    }
  },
  thisInfinityTimeMult: {
    id: "timeMult2",
    cost: 3,
    get description() { return i18n("inf", "iU31"); },
    effect: () => Time.thisInfinity.totalMinutes.div(4).pow(0.25).clampMin(1),
    formatEffect: value => formatX(value, 2, 2),
    charged: {
      description: () => i18n("inf", "iU31c"),
      effect: () =>
        Decimal.log10(Decimal.log10(Time.thisInfinity.totalMilliseconds.add(100)))
          .times(Math.sqrt(Ra.pets.teresa.level)).div(150).add(1),
      formatEffect: value => formatPow(value, 4, 4)
    }
  },
  unspentIPMult: {
    id: "unspentBonus",
    cost: 5,
    checkRequirement: () => InfinityUpgrade.thisInfinityTimeMult.isBought,
    get description() { return i18n("inf", "iU32"); },
    effect: () => Currency.infinityPoints.value.dividedBy(2).pow(1.5).plus(1),
    formatEffect: value => formatX(value, 2, 2),
    charged: {
      description: () => i18n("inf", "iU32c"),
      effect: () => Currency.infinityPoints.value.div(2).pow(Math.sqrt(Ra.pets.teresa.level) * 1.5).plus(1),
      formatEffect: value => formatX(value, 2, 2)
    }
  },
  dimboostMult: {
    id: "resetMult",
    cost: 7,
    checkRequirement: () => InfinityUpgrade.unspentIPMult.isBought,
    get description() { return i18n("inf", "iU33"); },
    effect: () => 2.5,
    formatEffect: () => `${formatX(2, 0, 1)} ➜ ${formatX(2.5, 0, 1)}`,
    charged: {
      description: () => i18n("inf", "iU33c"),
      effect: () => 1 + Ra.pets.teresa.level / 200,
      formatEffect: value => formatPow(value, 3, 3)
    }
  },
  ipGen: {
    id: "passiveGen",
    cost: 10,
    checkRequirement: () => InfinityUpgrade.dimboostMult.isBought,
    get description() { return i18n("inf", "iU34", [formatInt(10)]); },
    // Cutting corners: this is not actual effect, but it is totalIPMult that is displyed on upgrade
    effect: () => (Teresa.isRunning || V.isRunning || Pelle.isDoomed ? DC.D0 : GameCache.totalIPMult.value),
    formatEffect: value => {
      if (Teresa.isRunning || V.isRunning) return "Disabled in this reality";
      if (Pelle.isDoomed) return "Disabled";
      if (player.records.bestInfinity.time.gte(DC.BEMAX.log10())) return "Too slow to generate";
      return `${format(value, 2)} every ${Time.bestInfinity.times(DC.E1).toStringShort()}`;
    },
    charged: {
      description: () => i18n("inf", "iU34c"),
      effect: () => Decimal.mul(Math.pow(Ra.pets.teresa.level, 2),
        Ra.unlocks.continuousTTBoost.effects.autoPrestige.effectOrDefault(1)),
      formatEffect: value => formatX(value, 2, 1)
    }
  },
  skipReset1: {
    id: "skipReset1",
    cost: 20,
    get description() { return i18n("inf", "iU41", [formatInt(1)]); },
  },
  skipReset2: {
    id: "skipReset2",
    cost: 40,
    checkRequirement: () => InfinityUpgrade.skipReset1.isBought,
    get description() { return i18n("inf", "iU42", [formatInt(2)]); },
  },
  skipReset3: {
    id: "skipReset3",
    cost: 80,
    checkRequirement: () => InfinityUpgrade.skipReset2.isBought,
    get description() { return i18n("inf", "iU43", [formatInt(3)]); },
  },
  skipResetGalaxy: {
    id: "skipResetGalaxy",
    cost: 300,
    checkRequirement: () => InfinityUpgrade.skipReset3.isBought,
    get description() { return i18n("inf", "iU44", [formatInt(4)]); },
  },
  ipOffline: {
    id: "ipOffline",
    cost: 1000,
    checkRequirement: () => Achievement(41).isUnlocked,
    description: () => (player.options.offlineProgress
      ? i18n("inf", "iU35", [formatPercents(0.5)])
      : i18n("inf", "iU35alt")),
    effect: () => (player.options.offlineProgress
      ? player.records.thisEternity.bestIPMsWithoutMaxAll.times(TimeSpan.fromMinutes(1).totalMilliseconds.div(2))
      : DC.D0),
    isDisabled: () => !player.options.offlineProgress,
    formatEffect: value => i18n("inf", "iU35eff", [format(value, 2, 2)]),
  },
  ipMult: {
    id: "ipMult",
    cost: () => InfinityUpgrade.ipMult.cost,
    checkRequirement: () => Achievement(41).isUnlocked,
    costCap: DC.E6E6,
    costIncreaseThreshold: DC.E3E6,
    get description() { return i18n("inf", "iU25", [formatX(2)]); },
    // Normally the multiplier caps at e993k or so with 3300000 purchases, but if the cost is capped then we just give
    // an extra e7k to make the multiplier look nice
    effect: () => (player.IPMultPurchases.gte(3299999) ? DC.E1E6 : DC.D2.pow(player.IPMultPurchases)),
    cap: () => Effarig.eternityCap ?? DC.E1E6,
    formatEffect: value => formatX(value, 2, 2),
  }
};
