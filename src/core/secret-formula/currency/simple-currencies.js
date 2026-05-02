/* eslint-disable capitalized-comments */
// loc is the location of the currency in the player data. For example, player.eternities -> ["eternities"], and
// player.dilation.dilatedTime = ["dilation", "dilatedTime"].
// By default the code only checks for up to 3 indicies, if you need more modify the code in currency.js (and maybe make it less shit)
// startingValue is how much you start with. This is a function, and should return a decimal value

export const simpleCur = {
  matter: {
    loc: ["challengeData", "matter"]
  },
  infinities: {
    loc: ["infinities"]
  },
  infinitiesBanked: {
    loc: ["infinitiesBanked"]
  },
  infinityPower: {
    loc: ["infinityPower"]
  },
  eternities: {
    loc: ["eternities"],
    startingValue: () => {
      if (Pelle.isDoomed) return new Decimal(0);
      return Effects.max(
        DC.D0,
        RealityUpgrade(10)
      );
    }
  },
  timeShards: {
    loc: ["timeShards"],
  },
  tachyonParticles: {
    loc: ["dilation", "tachyonParticles"],
  },
  dilatedTime: {
    loc: ["dilation", "dilatedTime"],
  },
  realities: {
    loc: ["realities"],
  },
  perkPoints: {
    loc: ["perkPoints"],
  },
  relicShards: {
    loc: ["celestials", "effarig", "relicShards"]
  },
  darkEnergy: {
    loc: ["celestials", "laitela", "darkEnergy"]
  },
  singularities: {
    loc: ["celestials", "laitela", "singularities"],
  },
  remnants: {
    loc: ["celestials", "pelle", "remnants"],
  },
  realityShards: {
    loc: ["celestials", "pelle", "realityShards"],
  },
  replicanti: {
    loc: ["replicanti, amount"],
  },
};