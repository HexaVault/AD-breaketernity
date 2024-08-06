import { DC } from "../../constants";

function rebuyable(config) {
  const effectFunction = config.effect || (x => x);
  const { id, maxUpgrades, description, isDisabled, noLabel, onPurchased } = config;
  return {
    rebuyable: true,
    id,
    cost: () => config.initialCost.mul(Decimal.pow(config.costIncrease, player.infinityRebuyables[config.id])),
    maxUpgrades,
    description,
    effect: () => effectFunction(player.infinityRebuyables[config.id]),
    isDisabled,
    // There isn't enough room in the button to fit the EC reduction and "Next:" at the same time while still
    // presenting all the information in an understandable way, so we only show it if the upgrade is maxed
    formatEffect: config.formatEffect ||
      (value => {
        const afterECText = config.afterEC ? config.afterEC() : "";
        return value.gte(config.maxUpgrades)
          ? `Currently: ${formatX(DC.E1.sub(value))} ${afterECText}`
          : `Currently: ${formatX(DC.E1.sub(value))} | Next: ${formatX(DC.E1.sub(value).sub(1))}`;
      }),
    formatCost: value => format(value, 2, 0),
    noLabel,
    onPurchased
  };
}

export const breakInfinityUpgrades = {
  totalAMMult: {
    id: "totalMult",
    cost: DC.E4,
    description: "Antimatter Dimensions gain a multiplier based on total antimatter produced",
    effect: () => Decimal.pow(player.records.totalAntimatter.max(1).log10().add(1), 0.5),
    formatEffect: value => formatX(value, 2, 2)
  },
  currentAMMult: {
    id: "currentMult",
    cost: DC.E4.mul(5),
    description: "Antimatter Dimensions gain a multiplier based on current antimatter",
    effect: () => Decimal.pow(Currency.antimatter.value.max(1).log10().add(1), 0.5),
    formatEffect: value => formatX(value, 2, 2)
  },
  galaxyBoost: {
    id: "postGalaxy",
    cost: new Decimal(5e11),
    description: () => `All Galaxies are ${formatPercents(0.5)} stronger`,
    effect: 1.5
  },
  infinitiedMult: {
    id: "infinitiedMult",
    cost: DC.E5,
    description: "Antimatter Dimensions gain a multiplier based on Infinities",
    effect: () => Currency.infinitiesTotal.value.max(1).absLog10().times(10).add(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  achievementMult: {
    id: "achievementMult",
    cost: DC.E6,
    description: "Antimatter Dimensions gain a multiplier based on Achievements completed",
    effect: () => Math.max(Math.pow((Achievements.effectiveCount - 30), 3) / 40, 1),
    formatEffect: value => formatX(value, 2, 2)
  },
  slowestChallengeMult: {
    id: "challengeMult",
    cost: new Decimal(1e7),
    description: "Antimatter Dimensions gain a multiplier based on how fast your slowest challenge run is",
    effect: () => Decimal.clampMin(new Decimal(50).div(Time.worstChallenge.totalMinutes), 1),
    formatEffect: value => formatX(value, 2, 2),
    hasCap: true,
    cap: DC.D3E4
  },
  infinitiedGen: {
    id: "infinitiedGeneration",
    cost: new Decimal(2e7),
    description: "Passively generate Infinities based on your fastest Infinity",
    effect: () => player.records.bestInfinity.time,
    formatEffect: value => {
      if (value === Number.MAX_VALUE && !Pelle.isDoomed) return "No Infinity generation";
      let infinities = DC.D1;
      infinities = infinities.timesEffectsOf(
        RealityUpgrade(5),
        RealityUpgrade(7),
        Ra.unlocks.continuousTTBoost.effects.infinity
      );
      infinities = infinities.times(getAdjustedGlyphEffect("infinityinfmult"));
      const timeStr = Time.bestInfinity.totalMilliseconds.lte(50)
        ? `${TimeSpan.fromMilliseconds(new Decimal(100)).toStringShort()} (capped)`
        : `${Time.bestInfinity.times(new Decimal(2)).toStringShort()}`;
      return `${quantify("Infinity", infinities)} every ${timeStr}`;
    }
  },
  autobuyMaxDimboosts: {
    id: "autobuyMaxDimboosts",
    cost: new Decimal(5e9),
    description: "Unlock the buy max Dimension Boost Autobuyer mode"
  },
  autobuyerSpeed: {
    id: "autoBuyerUpgrade",
    cost: DC.E15,
    description: "Autobuyers unlocked or improved by Normal Challenges work twice as fast"
  },
  tickspeedCostMult: rebuyable({
    id: 0,
    initialCost: DC.E6,
    costIncrease: DC.D5,
    maxUpgrades: DC.D8,
    description: "Reduce post-infinity Tickspeed Upgrade cost multiplier scaling",
    afterEC: () => (EternityChallenge(11).completions > 0
      ? `After EC11: ${formatX(Player.tickSpeedMultDecrease, 2, 2)}`
      : ""
    ),
    noLabel: true,
    onPurchased: () => GameCache.tickSpeedMultDecrease.invalidate()
  }),
  dimCostMult: rebuyable({
    id: 1,
    initialCost: new Decimal(1e7),
    costIncrease: new Decimal(5e3),
    maxUpgrades: new Decimal(7),
    description: "Reduce post-infinity Antimatter Dimension cost multiplier scaling",
    afterEC: () => (EternityChallenge(6).completions > 0
      ? `After EC6: ${formatX(Player.dimensionMultDecrease, 2, 2)}`
      : ""
    ),
    noLabel: true,
    onPurchased: () => GameCache.dimensionMultDecrease.invalidate()
  }),
  ipGen: rebuyable({
    id: 2,
    initialCost: new Decimal(1e7),
    costIncrease: DC.E1,
    maxUpgrades: DC.E1,
    effect: value => Player.bestRunIPPM.times(value.div(20)),
    description: () => {
      let generation = `Generate ${format(player.infinityRebuyables[2].mul(5))}%`;
      if (!BreakInfinityUpgrade.ipGen.isCapped) {
        generation += ` ➜ ${format(player.infinityRebuyables[2].add(1).mul(5))}%`;
      }
      return `${generation} of your best IP/min from your last 10 Infinities`;
    },
    isDisabled: effect => effect.eq(0),
    formatEffect: value => `${format(value, 2, 1)} IP/min`,
    noLabel: false
  })
};
