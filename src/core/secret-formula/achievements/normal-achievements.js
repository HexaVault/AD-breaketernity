/* eslint-disable max-len */
export const normalAchievements = [
  {
    id: 11,
    get name() { return i18n("ach", "ach11title"); },
    get description() { return i18n("ach", "ach11desc"); },
  },
  {
    id: 12,
    get name() { return i18n("ach", "ach12title"); },
    get description() { return i18n("ach", "ach12desc"); },
  },
  {
    id: 13,
    get name() { return i18n("ach", "ach13title"); },
    get description() { return i18n("ach", "ach13desc"); },
  },
  {
    id: 14,
    get name() { return i18n("ach", "ach14title"); },
    get description() { return i18n("ach", "ach14desc"); },
  },
  {
    id: 15,
    get name() { return i18n("ach", "ach15title"); },
    get description() { return i18n("ach", "ach15desc"); },
  },
  {
    id: 16,
    get name() { return i18n("ach", "ach16title"); },
    get description() { return i18n("ach", "ach16desc").split("$")[Enslaved.isRunning ? 1 : 0]; },
  },
  {
    id: 17,
    get name() { return i18n("ach", "ach17title"); },
    get description() { return i18n("ach", "ach17desc"); },
  },
  {
    id: 18,
    get name() { return i18n("ach", "ach18title"); },
    get description() { return i18n("ach", "ach18desc").split("$")[Enslaved.isRunning ? 1 : 0]; },
  },
  {
    id: 21,
    get name() { return i18n("ach", "ach21title"); },
    get description() { return i18n("ach", "ach21desc"); },
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return i18n("ach", "ach21reward", [formatInt(100)]); },
    effect: 100
  },
  {
    id: 22,
    get name() { return i18n("ach", "ach22title"); },
    get description() { return i18n("ach", "ach22desc", [formatInt(50)]); },
    checkRequirement: () => NewsHandler.uniqueTickersSeen >= 50,
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER
  },
  {
    id: 23,
    get name() { return i18n("ach", "ach23title"); },
    get description() { return i18n("ach", "ach23desc", [formatInt(99)]); },
    checkRequirement: () => AntimatterDimension(8).amount.eq(99),
    get reward() { return i18n("ach", "ach23reward", [formatPercents(0.1)]); },
    effect: 1.1
  },
  {
    id: 24,
    get name() { return i18n("ach", "ach24title"); },
    get description() { return i18n("ach", "ach24desc", [format(DC.E80)]); },
    checkRequirement: () => Currency.antimatter.gte(DC.E80),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 25,
    get name() { return i18n("ach", "ach25title"); },
    get description() { return i18n("ach", "ach25desc", [formatInt(10)]); },
    checkRequirement: () => DimBoost.purchasedBoosts.gte(10),
    checkEvent: GAME_EVENT.DIMBOOST_AFTER
  },
  {
    id: 26,
    get name() { return i18n("ach", "ach26title"); },
    get description() { return i18n("ach", "ach26desc"); },
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.GALAXY_RESET_BEFORE
  },
  {
    id: 27,
    get name() { return i18n("ach", "ach27title"); },
    get description() { return i18n("ach", "ach27desc", [formatInt(2)]); },
    checkRequirement: () => player.galaxies.gte(2),
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER
  },
  {
    id: 28,
    get name() { return i18n("ach", "ach28title"); },
    get description() { return i18n("ach", "ach28desc", [format(DC.E150)]); },
    checkRequirement: () => AntimatterDimension(1).amount.gte(DC.E150),
    get reward() { return i18n("ach", "ach28reward", [formatPercents(0.1)]); },
    effect: 1.1
  },
  {
    id: 31,
    get name() { return i18n("ach", "ach31title"); },
    get description() { return i18n("ach", "ach31desc", [formatX(DC.E31)]); },
    checkRequirement: () => AntimatterDimensions.all.some(x => x.multiplier.gte(DC.E31)),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return i18n("ach", "ach31reward", [formatPercents(0.05)]); },
    effect: 1.05
  },
  {
    id: 32,
    get name() { return i18n("ach", "ach32title"); },
    get description() { return i18n("ach", "ach32desc", [formatX(600)]); },
    checkRequirement: () => !NormalChallenge(8).isOnlyActiveChallenge && Sacrifice.totalBoost.gte(600),
    checkEvent: GAME_EVENT.SACRIFICE_RESET_AFTER,
    get reward() {
      return i18n("ach", "ach32reward", [
        Sacrifice.getSacrificeDescription({ "Achievement32": false, "Achievement57": false, "Achievement88": false }),
        Sacrifice.getSacrificeDescription({ "Achievement32": true, "Achievement57": false, "Achievement88": false })
      ]);
    },
    effect: 0.1,
  },
  {
    id: 33,
    get name() { return i18n("ach", "ach33title"); },
    get description() { return i18n("ach", "ach33desc", [formatInt(10)]); },
    checkRequirement: () => Currency.infinities.gte(10),
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER
  },
  {
    id: 34,
    get name() { return i18n("ach", "ach34title"); },
    get description() { return i18n("ach", "ach34desc"); },
    checkRequirement: () => AntimatterDimension(8).totalAmount.eq(0),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return i18n("ach", "ach34reward", [formatPercents(0.02)]); },
    effect: 1.02
  },
  {
    id: 35,
    get name() { return i18n("ach", "ach35title"); },
    get description() { return i18n("ach", "ach35desc", [formatInt(6)]).split("$")[PlayerProgress.realityUnlocked() ? 1 : 0]; },
    checkRequirement: () => Date.now() - player.lastUpdate >= 21600000,
    checkEvent: GAME_EVENT.GAME_TICK_BEFORE
  },
  {
    id: 36,
    get name() { return i18n("ach", "ach36title"); },
    get description() { return i18n("ach", "ach36desc", [formatInt(1)]); },
    checkRequirement: () => player.galaxies.eq(1),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return i18n("ach", "ach36reward", [format(1.02, 2, 2)]); },
    effect: 1 / 1.02
  },
  {
    id: 37,
    get name() { return i18n("ach", "ach37title"); },
    get description() { return i18n("ach", "ach37desc", [formatInt(2)]); },
    checkRequirement: () => Time.thisInfinityRealTime.totalHours.lte(2),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return i18n("ach", "ach37reward", [formatInt(5000)]); },
    effect: 5000
  },
  {
    id: 38,
    get name() { return i18n("ach", "ach38title"); },
    get description() { return i18n("ach", "ach38desc"); },
    checkRequirement: () => player.requirementChecks.infinity.noSacrifice,
    checkEvent: GAME_EVENT.GALAXY_RESET_BEFORE
  },
  {
    id: 41,
    get name() { return i18n("ach", "ach41title"); },
    get description() { return i18n("ach", "ach41desc", [formatInt(16)]); },
    checkRequirement: () => player.infinityUpgrades.size >= 16,
    checkEvent: [
      GAME_EVENT.INFINITY_UPGRADE_BOUGHT,
      GAME_EVENT.REALITY_RESET_AFTER,
      GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT
    ],
    get reward() { return i18n("ach", "ach41reward", [formatX(2)]); },
  },
  {
    id: 42,
    get name() { return i18n("ach", "ach42title"); },
    get description() { return i18n("ach", "ach42desc", [format(DC.E63)]); },
    checkRequirement: () =>
      Currency.antimatter.gte(DC.E63) &&
      Currency.antimatter.productionPerSecond.gt(Currency.antimatter.value),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 43,
    get name() { return i18n("ach", "ach43title"); },
    get description() { return i18n("ach", "ach43desc"); },
    checkRequirement: () => {
      const multipliers = Array.range(1, 8).map(tier => AntimatterDimension(tier).multiplier);
      for (let i = 0; i < multipliers.length - 1; i++) {
        if (multipliers[i].gte(multipliers[i + 1])) return false;
      }
      return true;
    },
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return i18n("ach", "ach43reward", [formatPercents(0.08), formatPercents(0.07)]); },
  },
  {
    id: 44,
    get name() { return i18n("ach", "ach44title"); },
    get description() { return i18n("ach", "ach44desc", [formatInt(30)]); },
    checkRequirement: () => AchievementTimers.marathon1
      .check(Currency.antimatter.productionPerSecond.gt(Currency.antimatter.value), 30),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
  },
  {
    id: 45,
    get name() { return i18n("ach", "ach45title"); },
    get description() { return i18n("ach", "ach45desc", [format(DC.E29)]); },
    checkRequirement: () => Tickspeed.current.lte(1e-26),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return i18n("ach", "ach45reward", [formatX(1.02, 0, 2)]); },
    effect: 1 / 1.02
  },
  {
    id: 46,
    get name() { return i18n("ach", "ach46title"); },
    get description() { return i18n("ach", "ach46desc", [format(DC.E12)]); },
    checkRequirement: () => AntimatterDimension(7).amount.gte(1e12),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 47,
    get name() { return i18n("ach", "ach47title"); },
    get description() { return i18n("ach", "ach47desc", [formatInt(3)]); },
    checkRequirement: () => NormalChallenges.all.countWhere(c => c.isCompleted) >= 3,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT],
  },
  {
    id: 48,
    get name() { return i18n("ach", "ach48title"); },
    get description() { return i18n("ach", "ach48desc", [formatInt(12)]); },
    checkRequirement: () => NormalChallenges.all.countWhere(c => !c.isCompleted) === 0,
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT],
    get reward() { return i18n("ach", "ach48reward", [formatPercents(0.1)]); },
    effect: 1.1
  },
  {
    id: 51,
    get name() { return i18n("ach", "ach51title"); },
    get description() { return i18n("ach", "ach51desc"); },
    checkRequirement: () => player.break,
    checkEvent: [GAME_EVENT.BREAK_INFINITY, GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT],
  },
  {
    id: 52,
    get name() { return i18n("ach", "ach52title"); },
    get description() { return i18n("ach", "ach52desc"); },
    checkRequirement: () => Autobuyer.antimatterDimension.zeroIndexed.concat(Autobuyer.tickspeed)
      .every(a => a.isUnlocked && a.hasMaxedInterval),
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT]
  },
  {
    id: 53,
    get name() { return i18n("ach", "ach53title"); },
    get description() { return i18n("ach", "ach53desc"); },
    // The upgradeable autobuyers are dimensions, tickspeed, dimension boost,
    // galaxy, and big crunch (the ones you get from normal challenges).
    // We don't count autobuyers which can be upgraded via e.g. perks as upgradeable.
    checkRequirement: () => Autobuyers.upgradeable
      .every(a => a.isUnlocked && a.hasMaxedInterval),
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT]
  },
  {
    id: 54,
    get name() { return i18n("ach", "ach54title"); },
    get description() { return i18n("ach", "ach54desc", [formatInt(10)]); },
    checkRequirement: () => Time.thisInfinityRealTime.totalMinutes.lte(10),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return i18n("ach", "ach54reward", [format(5e5)]); },
    effect: 5e5
  },
  {
    id: 55,
    get name() { return i18n("ach", "ach55title"); },
    get description() { return i18n("ach", "ach55desc", [formatInt(1)]); },
    checkRequirement: () => Time.thisInfinityRealTime.totalMinutes.lte(1),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return i18n("ach", "ach55reward", [format(5e10)]); },
    effect: 5e10
  },
  {
    id: 56,
    get name() { return i18n("ach", "ach56title"); },
    get description() { return i18n("ach", "ach56desc", [formatInt(3)]); },
    checkRequirement: () => NormalChallenge(2).isOnlyActiveChallenge && Time.thisInfinityRealTime.totalMinutes.lte(3),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return i18n("ach", "ach56reward", [formatInt(3)]); },
    effect: () => DC.D6.div(Time.thisInfinity.totalMinutes.add(3)).clampMin(1),
    effectCondition: () => Time.thisInfinity.totalMinutes.lt(3),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 57,
    get name() { return i18n("ach", "ach57title"); },
    get description() { return i18n("ach", "ach57desc", [formatInt(3)]); },
    checkRequirement: () => NormalChallenge(8).isOnlyActiveChallenge && Time.thisInfinityRealTime.totalMinutes.lte(3),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() {
      return i18n("ach", "ach57reward", [
        Sacrifice.getSacrificeDescription({ "Achievement32": true, "Achievement57": false, "Achievement88": false }),
        Sacrifice.getSacrificeDescription({ "Achievement32": true, "Achievement57": true, "Achievement88": false })
      ]);
    },
    effect: 0.1
  },
  {
    id: 58,
    get name() { return i18n("ach", "ach58title"); },
    get description() { return i18n("ach", "ach58desc", [formatInt(3)]); },
    checkRequirement: () => NormalChallenge(9).isOnlyActiveChallenge && Time.thisInfinityRealTime.totalMinutes.lte(3),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return i18n("ach", "ach58reward", [formatInt(10), formatPercents(0.01)]); },
    effect: 1.01
  },
  {
    id: 61,
    get name() { return i18n("ach", "ach61title"); },
    get description() { return i18n("ach", "ach61desc", [formatInt(Autobuyer.antimatterDimension.bulkCap)]); },
    checkRequirement: () => Autobuyer.antimatterDimension.zeroIndexed.every(x => x.hasMaxedBulk),
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_TEN_BOUGHT,
      GAME_EVENT.SAVE_CONVERTED_FROM_PREVIOUS_VERSION],
    get reward() { return i18n("ach", "ach61reward"); },
  },
  {
    id: 62,
    get name() { return i18n("ach", "ach62title"); },
    get description() { return i18n("ach", "ach62desc", [format(DC.E8)]); },
    checkRequirement: () => Player.bestRunIPPM.gte(1e8),
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER
  },
  {
    id: 63,
    get name() { return i18n("ach", "ach63title"); },
    get description() { return i18n("ach", "ach63desc"); },
    checkRequirement: () => Currency.infinityPower.gt(1),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 64,
    get name() { return i18n("ach", "ach64title"); },
    get description() { return i18n("ach", "ach64desc"); },
    checkRequirement: () => player.galaxies.eq(0) && DimBoost.purchasedBoosts.eq(0) && NormalChallenge.isRunning,
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return i18n("ach", "ach64reward", [formatPercents(0.25)]); },
    effect: 1.25
  },
  {
    id: 65,
    get name() { return i18n("ach", "ach65title"); },
    get description() { return i18n("ach", "ach65desc", [formatInt(3)]); },
    checkRequirement: () => Time.challengeSum.totalMinutes.lt(3),
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER],
    get reward() { return i18n("ach", "ach65reward", [formatInt(3)]); },
    effect: () => (Player.isInAnyChallenge ? DC.D4.div(Time.thisInfinity.totalMinutes.add(1)).clampMin(1) : 1),
    effectCondition: () => Player.isInAnyChallenge && Time.thisInfinity.totalMinutes.lt(3),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 66,
    get name() { return i18n("ach", "ach66title"); },
    get description() { return i18n("ach", "ach66desc", [format(DC.E58)]); },
    checkRequirement: () => Tickspeed.current.lte(1e-55),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return i18n("ach", "ach66reward", [formatX(1.02, 0, 2)]); },
    effect: 0.98
  },
  {
    id: 67,
    get name() { return i18n("ach", "ach67title"); },
    get description() { return i18n("ach", "ach67desc"); },
    checkRequirement: () => InfinityChallenges.completed.length > 0,
    checkEvent: [GAME_EVENT.INFINITY_CHALLENGE_COMPLETED, GAME_EVENT.REALITY_RESET_AFTER]
  },
  {
    id: 68,
    get name() { return i18n("ach", "ach68title"); },
    get description() { return i18n("ach", "ach68desc", [formatInt(10)]); },
    checkRequirement: () => NormalChallenge(3).isOnlyActiveChallenge && Time.thisInfinityRealTime.totalSeconds.lte(10),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return i18n("ach", "ach68reward", [formatPercents(0.5)]); },
    effect: 1.5
  },
  {
    id: 71,
    get name() { return i18n("ach", "ach71title"); },
    get description() { return i18n("ach", "ach71desc"); },
    checkRequirement: () =>
      NormalChallenge(2).isOnlyActiveChallenge &&
      AntimatterDimension(1).amount.eq(1) &&
      DimBoost.purchasedBoosts.eq(0) &&
      player.galaxies.eq(0),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return i18n("ach", "ach71reward", [formatInt(3)]); },
    effect: 3
  },
  {
    id: 72,
    get name() { return i18n("ach", "ach72title"); },
    get description() { return i18n("ach", "ach72desc", [formatX(DC.NUMMAX, 1)]); },
    checkRequirement: () => AntimatterDimensions.all.every(x => x.multiplier.gte(DC.NUMMAX)),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return i18n("ach", "ach72reward", [formatPercents(0.1)]); },
    effect: 1.1
  },
  {
    id: 73,
    // Check i18n note
    name: "THIS ACHIEVEMENT DOESN'T EXIST",
    get description() { return i18n("ach", "ach73desc", [formatPostBreak(DC.D9_9999E9999, 5)]); },
    checkRequirement: () => Currency.antimatter.gte(DC.D9_9999E9999),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return i18n("ach", "ach73reward"); },
    effect: () => Currency.antimatter.value.pow(0.00002).plus(1),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 74,
    get name() { return i18n("ach", "ach74title"); },
    get description() { return i18n("ach", "ach74desc", [formatInt(5)]); },
    checkRequirement: () => Time.challengeSum.totalSeconds.lt(5),
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER],
    get reward() { return i18n("ach", "ach74reward", [formatPercents(0.4)]); },
    effect: 1.4,
    effectCondition: () => Player.isInAnyChallenge
  },
  {
    id: 75,
    get name() { return i18n("ach", "ach75title"); },
    get description() { return i18n("ach", "ach75desc"); },
    checkRequirement: () => InfinityDimension(4).isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return i18n("ach", "ach75reward"); },
    effect: () => Achievements.power
  },
  {
    id: 76,
    get name() { return i18n("ach", "ach76title"); },
    get description() { return i18n("ach", "ach76desc", [formatInt(8)]); },
    checkRequirement: () => Time.totalTimePlayed.totalDays.gte(8),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return i18n("ach", "ach76reward"); },
    effect: () => Time.totalTimePlayed.totalDays.div(2).pow(0.05).clampMin(1),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 77,
    get name() { return i18n("ach", "ach77title"); },
    get description() { return i18n("ach", "ach77desc", [format(1e6)]); },
    checkRequirement: () => Currency.infinityPower.gte(1e6),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 78,
    get name() { return i18n("ach", "ach78title"); },
    get description() { return i18n("ach", "ach78desc", [formatInt(250)]); },
    checkRequirement: () => Time.thisInfinityRealTime.totalMilliseconds.lte(250),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return i18n("ach", "ach78reward", [format(5e25)]); },
    effect: 5e25
  },
  {
    id: 81,
    get name() { return i18n("ach", "ach81title"); },
    get description() { return i18n("ach", "ach81desc", [formatInt(15)]); },
    checkRequirement: () => InfinityChallenge(5).isRunning && Time.thisInfinityRealTime.totalSeconds.lte(15),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE
  },
  {
    id: 82,
    get name() { return i18n("ach", "ach82title"); },
    get description() { return i18n("ach", "ach82desc", [formatInt(8)]); },
    checkRequirement: () => InfinityChallenges.completed.length === 8,
    checkEvent: [GAME_EVENT.INFINITY_CHALLENGE_COMPLETED, GAME_EVENT.REALITY_RESET_AFTER],
  },
  {
    id: 83,
    get name() { return i18n("ach", "ach83title"); },
    get description() { return i18n("ach", "ach83desc", [formatInt(50)]); },
    checkRequirement: () => player.galaxies.gte(50),
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    get reward() { return i18n("ach", "ach83reward", [formatPercents(0.05)]); },
    effect: () => DC.D0_95.pow(player.galaxies),
    formatEffect: value => `${formatX(value.recip(), 2, 2)}`
  },
  {
    id: 84,
    get name() { return i18n("ach", "ach84title"); },
    get description() { return i18n("ach", "ach84desc", [formatPostBreak("1e35000")]); },
    checkRequirement: () => Currency.antimatter.gte("1e35000"),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return i18n("ach", "ach84reward"); },
    effect: () => Currency.antimatter.value.pow(0.00002).plus(1),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 85,
    get name() { return i18n("ach", "ach85title"); },
    get description() { return i18n("ach", "ach85desc", [format(DC.E150)]); },
    checkRequirement: () => Currency.infinityPoints.gain.gte(DC.E150),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return i18n("ach", "ach85reward", [formatX(4)]); },
    effect: 4
  },
  {
    id: 86,
    get name() { return i18n("ach", "ach86title"); },
    get description() { return i18n("ach", "ach86desc", [formatX(1e3)]); },
    checkRequirement: () => Tickspeed.multiplier.recip().gte(1e3),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return i18n("ach", "ach86reward", [formatPercents(0.01)]); },
    effect: 1.01
  },
  {
    id: 87,
    get name() { return i18n("ach", "ach87title"); },
    get description() { return i18n("ach", "ach87desc", [format(DC.D2E6)]); },
    checkRequirement: () => Currency.infinities.gt(DC.D2E6),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return i18n("ach", "ach87reward", [formatInt(5), formatX(250)]); },
    effect: 250,
    effectCondition: () => Time.thisInfinity.totalSeconds.gt(5)
  },
  {
    id: 88,
    get name() { return i18n("ach", "ach88title"); },
    get description() { return i18n("ach", "ach88desc", [format(DC.NUMMAX, 1, 0)]); },
    checkRequirement: () => Sacrifice.nextBoost.gte(DC.NUMMAX),
    checkEvent: GAME_EVENT.SACRIFICE_RESET_BEFORE,
    get reward() {
      return i18n("ach", "ach88reward", [
        Sacrifice.getSacrificeDescription({ "Achievement32": true, "Achievement57": true, "Achievement88": false }),
        Sacrifice.getSacrificeDescription({ "Achievement32": true, "Achievement57": true, "Achievement88": true })]);
    },
    effect: 0.1
  },
  {
    id: 91,
    get name() { return i18n("ach", "ach91title"); },
    get description() { return i18n("ach", "ach91desc", [format(DC.E200), formatInt(2)]); },
    checkRequirement: () => Currency.infinityPoints.gain.gte(DC.E200) && Time.thisInfinityRealTime.totalSeconds.lte(2),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return i18n("ach", "ach91reward", [formatInt(5)]); },
    effect: () => DC.D5.sub(Time.thisInfinity.totalSeconds).times(60).clampMin(1),
    effectCondition: () => Time.thisInfinity.totalSeconds.lt(5),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 92,
    get name() { return i18n("ach", "ach92title"); },
    get description() { return i18n("ach", "ach92desc", [format(DC.E250), formatInt(20)]); },
    checkRequirement: () => Currency.infinityPoints.gain.gte(DC.E250) && Time.thisInfinityRealTime.totalSeconds.lte(20),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return i18n("ach", "ach92reward", [formatInt(60)]); },
    effect: () => DC.D1.sub(Time.thisInfinity.totalMinutes).times(100).clampMin(1),
    effectCondition: () => Time.thisInfinity.totalMinutes.lt(1),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 93,
    get name() { return i18n("ach", "ach93title"); },
    get description() { return i18n("ach", "ach93desc", [format(DC.E300)]); },
    checkRequirement: () => Currency.infinityPoints.gain.gte(DC.E300),
    checkEvent: GAME_EVENT.BIG_CRUNCH_BEFORE,
    get reward() { return i18n("ach", "ach93reward", [formatX(4)]); },
    effect: 4
  },
  {
    id: 94,
    get name() { return i18n("ach", "ach94title"); },
    get description() { return i18n("ach", "ach94desc", [format(DC.E260)]); },
    checkRequirement: () => Currency.infinityPower.gte(DC.E260),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return i18n("ach", "ach94reward"); },
    effect: 2
  },
  {
    id: 95,
    get name() { return i18n("ach", "ach95title"); },
    get description() { return i18n("ach", "ach95desc", [format(DC.NUMMAX, 1, 0), formatInt(1)]); },
    get reward() { return i18n("ach", "ach95reward", [formatInt(1)]); },
    checkRequirement: () =>
      (Replicanti.amount.eq(DC.NUMMAX) || player.replicanti.galaxies.gt()) &&
      Time.thisInfinityRealTime.totalHours.lte(1),
    checkEvent: GAME_EVENT.REPLICANTI_TICK_AFTER
  },
  {
    id: 96,
    get name() { return i18n("ach", "ach96title"); },
    get description() { return i18n("ach", "ach96desc"); },
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 97,
    get name() { return i18n("ach", "ach97title"); },
    get description() { return i18n("ach", "ach97desc", [format(6.66, 2, 2)]); },
    checkRequirement: () => Time.infinityChallengeSum.totalSeconds.lt(6.66),
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER],
  },
  {
    id: 98,
    get name() { return i18n("ach", "ach98title"); },
    get description() { return i18n("ach", "ach98desc"); },
    checkRequirement: () => InfinityDimension(8).isUnlocked,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 101,
    get name() { return i18n("ach", "ach101title"); },
    get description() { return i18n("ach", "ach101desc"); },
    checkRequirement: () => player.requirementChecks.eternity.onlyAD8,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 102,
    get name() { return i18n("ach", "ach102title"); },
    get description() { return i18n("ach", "ach102desc"); },
    checkRequirement: () => EternityMilestone.all.every(m => m.isReached),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 103,
    // Check i18n note
    name: "Tätä saavutusta ei ole olemassa II",
    get description() { return i18n("ach", "ach103desc", [formatPostBreak(DC.D9_99999E999, 5, 0)]); },
    checkRequirement: () => Currency.infinityPoints.gte("1e1000"),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return i18n("ach", "ach103reward", [formatInt(308), formatFloat(307.8, 1)]); },
    effect: 307.8
  },
  {
    id: 104,
    get name() { return i18n("ach", "ach104title"); },
    get description() { return i18n("ach", "ach104desc", [formatInt(30)]); },
    checkRequirement: () => Time.thisEternity.totalSeconds.lte(30),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    get reward() { return i18n("ach", "ach104reward", [format(5e25)]); },
    effect: 5e25
  },
  {
    id: 105,
    get name() { return i18n("ach", "ach105title"); },
    get description() { return i18n("ach", "ach105desc", [formatInt(308)]); },
    checkRequirement: () => player.tickspeed.gained.gte(308),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return i18n("ach", "ach105reward"); },
    effect: () => Tickspeed.perSecond.pow(0.000005),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 106,
    get name() { return i18n("ach", "ach106title"); },
    get description() { return i18n("ach", "ach106desc", [formatInt(10), formatInt(15)]); },
    checkRequirement: () => Replicanti.galaxies.total.gte(10) && Time.thisInfinity.totalSeconds.lte(15),
    checkEvent: GAME_EVENT.REPLICANTI_TICK_AFTER
  },
  {
    id: 107,
    get name() { return i18n("ach", "ach107title"); },
    get description() { return i18n("ach", "ach107desc", [formatInt(10)]); },
    checkRequirement: () => Currency.infinities.lt(10),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 108,
    get name() { return i18n("ach", "ach108title"); },
    get description() { return i18n("ach", "ach108desc", [formatInt(9)]); },
    checkRequirement: () => Replicanti.amount.round().eq(9),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 111,
    get name() { return i18n("ach", "ach111title"); },
    get description() { return i18n("ach", "ach111desc", [formatInt(10), format(DC.NUMMAX, 1, 0)]); },
    checkRequirement: () => {
      if (player.records.recentInfinities.some(i => i[0] === Number.MAX_VALUE)) return false;
      const infinities = player.records.recentInfinities.map(run => run[3]);
      for (let i = 0; i < infinities.length - 1; i++) {
        if (infinities[i].lt(infinities[i + 1].times(DC.NUMMAX))) return false;
      }
      return true;
    },
    checkEvent: GAME_EVENT.BIG_CRUNCH_AFTER,
    get reward() { return i18n("ach", "ach111reward"); },
  },
  {
    id: 112,
    get name() { return i18n("ach", "ach112title"); },
    get description() { return i18n("ach", "ach112desc", [formatInt(750)]); },
    checkRequirement: () => Time.infinityChallengeSum.totalMilliseconds.lt(750),
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.REALITY_RESET_AFTER]
  },
  {
    id: 113,
    get name() { return i18n("ach", "ach113title"); },
    get description() { return i18n("ach", "ach113desc", [formatInt(250)]); },
    checkRequirement: () => Time.thisEternity.totalMilliseconds.lte(250),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    get reward() { return i18n("ach", "ach113reward", [formatX(2)]); },
    effect: 2,
  },
  {
    id: 114,
    get name() { return i18n("ach", "ach114title"); },
    get description() { return i18n("ach", "ach114desc"); },
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.CHALLENGE_FAILED,
    get reward() { return i18n("ach", "ach114reward"); },
    get effect() { return i18n("ach", "ach114effect"); }
  },
  {
    id: 115,
    get name() { return i18n("ach", "ach115title"); },
    get description() { return i18n("ach", "ach115desc"); },
  },
  {
    id: 116,
    get name() { return i18n("ach", "ach116title"); },
    get description() { return i18n("ach", "ach116desc", [formatInt(1)]); },
    checkRequirement: () => Currency.infinities.lte(1),
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE,
    get reward() { return i18n("ach", "ach116reward"); },
    effect: () => Currency.infinitiesTotal.value.clampMin(1).pow(LOG10_2 / 4).powEffectOf(TimeStudy(31)),
    cap: () => Effarig.eternityCap,
    formatEffect: value => {
      // Since TS31 is already accounted for in the effect prop, we need to "undo" it to display the base value here
      const mult = formatX(value, 2, 2);
      const ts31mult = formatX(value.pow(1 / TimeStudy(31).effectValue), 2, 2);
      return TimeStudy(31).canBeApplied
        ? i18n("ach", "ach116effect", [ts31mult, mult])
        : mult;
    }
  },
  {
    id: 117,
    get name() { return i18n("ach", "ach117title"); },
    get description() { return i18n("ach", "ach117desc", [formatInt(750)]); },
    checkRequirement: ([bulk]) => bulk.gte(750),
    checkEvent: GAME_EVENT.DIMBOOST_AFTER,
    get reward() { return i18n("ach", "ach117reward", [formatPercents(0.01)]); },
    effect: 1.01
  },
  {
    id: 118,
    get name() { return i18n("ach", "ach118title"); },
    get description() { return i18n("ach", "ach118desc", [formatPostBreak(DC.E9000)]); },
    checkRequirement: () => Sacrifice.totalBoost.gte(DC.E9000),
    checkEvent: GAME_EVENT.SACRIFICE_RESET_AFTER,
    get reward() { return i18n("ach", "ach118reward"); },
  },
  {
    id: 121,
    get name() { return i18n("ach", "ach121title"); },
    get description() { return i18n("ach", "ach121desc", [formatPostBreak("e30008")]); },
    checkRequirement: () => Currency.infinityPoints.gte("e30008"),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 122,
    get name() { return i18n("ach", "ach122title"); },
    get description() { return i18n("ach", "ach122desc"); },
    checkRequirement: () => player.requirementChecks.eternity.onlyAD1,
    checkEvent: GAME_EVENT.ETERNITY_RESET_BEFORE
  },
  {
    id: 123,
    get name() { return i18n("ach", "ach123title"); },
    get description() { return i18n("ach", "ach123desc", [formatInt(50)]); },
    checkRequirement: () => EternityChallenges.completions >= 50,
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER
  },
  {
    id: 124,
    get name() { return i18n("ach", "ach124title"); },
    get description() { return i18n("ach", "ach124desc", [formatInt(60)]); },
    checkRequirement: () => AchievementTimers.marathon2
      .check(
        !EternityChallenge(7).isRunning &&
        InfinityDimension(1).productionPerSecond.gt(Currency.infinityPower.value),
        60
      ),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 125,
    get name() { return i18n("ach", "ach125title"); },
    get description() { return i18n("ach", "ach125desc", [format(DC.E90)]); },
    checkRequirement: () => Currency.infinityPoints.value.max(1).log10().gte(90) &&
      player.requirementChecks.eternity.noAD1 && Currency.infinities.eq(0),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return i18n("ach", "ach125reward"); },
    effect() {
      const thisInfinity = Time.thisInfinity.totalSeconds.times(10).add(1).max(1);
      return DC.D2.pow(Decimal.log(thisInfinity, Math.E).times(Decimal.min(Decimal.pow(thisInfinity, 0.11), 500)));
    },
    cap: () => Effarig.eternityCap,
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 126,
    get name() { return i18n("ach", "ach126title"); },
    get description() { return i18n("ach", "ach126desc", [formatInt(180)]); },
    checkRequirement: () => Replicanti.galaxies.total.gte(player.galaxies.times(180)) && player.galaxies.gt(0),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return i18n("ach", "ach126reward", [formatPostBreak(DC.NUMMAX, 1, 0), formatInt(1)]); },
  },
  {
    id: 127,
    get name() { return i18n("ach", "ach127title"); },
    get description() { return i18n("ach", "ach127desc", [formatPostBreak(DC.NUMMAX, 1, 0)]); },
    checkRequirement: () => Currency.eternityPoints.gte(DC.NUMMAX),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 128,
    get name() { return i18n("ach", "ach128title"); },
    get description() { return i18n("ach", "ach128desc", [formatPostBreak("1e22000")]); },
    checkRequirement: () => Currency.infinityPoints.gte("1e22000") && player.timestudy.studies.length === 0,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return i18n("ach", "ach128reward"); },
    effect: () => Math.max(player.timestudy.studies.length, 1),
    formatEffect: value => `${formatX(value)}`
  },
  {
    id: 131,
    get name() { return i18n("ach", "ach131title"); },
    get description() { return i18n("ach", "ach131desc", [format(DC.D2E9)]); },
    checkRequirement: () => Currency.infinitiesBanked.gt(DC.D2E9),
    checkEvent: [GAME_EVENT.ETERNITY_RESET_AFTER, GAME_EVENT.SAVE_CONVERTED_FROM_PREVIOUS_VERSION],
    get reward() { return i18n("ach", "ach131reward", [formatX(2), formatPercents(0.05)]); },
    effects: {
      infinitiesGain: 2,
      bankedInfinitiesGain: () => Currency.infinities.value.times(0.05).floor()
    }
  },
  {
    id: 132,
    get name() { return i18n("ach", "ach132title"); },
    get description() { return i18n("ach", "ach132desc", [formatInt(569)]); },
    checkRequirement: () => player.galaxies.gte(569) && player.requirementChecks.eternity.noRG,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    get reward() { return i18n("ach", "ach132reward"); },
    effect: () => player.galaxies.pow(0.04).clampMin(1).times(1.22),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 133,
    get name() { return i18n("ach", "ach133title"); },
    get description() { return i18n("ach", "ach133desc", [formatPostBreak(DC.E200000), formatX(2)]); },
    checkRequirement: () =>
      Array.dimensionTiers.map(InfinityDimension).every(dim => dim.baseAmount.eq(0)) &&
      player.IPMultPurchases === DC.D0 &&
      Currency.infinityPoints.gte(DC.E200000),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return i18n("ach", "ach133reward"); },
  },
  {
    id: 134,
    get name() { return i18n("ach", "ach134title"); },
    get description() { return i18n("ach", "ach134desc", [formatPostBreak(DC.E18000)]); },
    checkRequirement: () => Replicanti.amount.gte(DC.E18000),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return i18n("ach", "ach134reward", [formatInt(2), format(replicantiCap(), 1)]); },
  },
  {
    id: 135,
    get name() { return i18n("ach", "ach135title"); },
    get description() { return i18n("ach", "ach135desc", [formatPostBreak("1e8296262")]); },
    checkRequirement: () => Tickspeed.current.lte("1e-8296262"),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 136,
    get name() { return i18n("ach", "ach136title"); },
    get description() { return i18n("ach", "ach136desc"); },
  },
  {
    id: 137,
    get name() { return i18n("ach", "ach137title"); },
    get description() { return i18n("ach", "ach137desc", [formatPostBreak("1e260000"), formatInt(1)]); },
    checkRequirement: () =>
      Currency.antimatter.gte("1e26000") &&
      Time.thisEternity.totalMinutes.lte(1) &&
      player.dilation.active,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return i18n("ach", "ach137reward", [formatX(2)]); },
    effect: () => (player.dilation.active ? 2 : 1),
  },
  {
    id: 138,
    get name() { return i18n("ach", "ach138title"); },
    get description() { return i18n("ach", "ach138desc", [formatPostBreak("1e26000")]); },
    checkRequirement: () =>
      player.timestudy.studies.length === 0 &&
      player.dilation.active &&
      Currency.infinityPoints.gte("1e26000"),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return i18n("ach", "ach138reward"); },
  },
  {
    id: 141,
    get name() { return i18n("ach", "ach141title"); },
    get description() { return i18n("ach", "ach141desc"); },
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    get reward() { return i18n("ach", "ach141reward", [formatX(4), formatInt(10), format(0.1, 0, 1)]); },
    effects: {
      ipGain: 4,
      buyTenMult: 0.1
    }
  },
  {
    id: 142,
    get name() { return i18n("ach", "ach142title"); },
    get description() { return i18n("ach", "ach142desc"); },
    checkRequirement: () => Player.automatorUnlocked,
    checkEvent: [GAME_EVENT.REALITY_RESET_AFTER, GAME_EVENT.REALITY_UPGRADE_BOUGHT, GAME_EVENT.PERK_BOUGHT,
      GAME_EVENT.BLACK_HOLE_UNLOCKED],
    get reward() { return i18n("ach", "ach142reward", [formatPercents(0.5)]); },
    effect: 1.5,
  },
  {
    id: 143,
    get name() { return i18n("ach", "ach143title"); },
    get description() { return i18n("ach", "ach143desc", [formatInt(10), format(DC.NUMMAX, 1, 0)]); },
    checkRequirement: () => {
      if (player.records.recentEternities.some(i => i[0] === Number.MAX_VALUE)) return false;
      const eternities = player.records.recentEternities.map(run => run[3]);
      for (let i = 0; i < eternities.length - 1; i++) {
        if (eternities[i].lt(eternities[i + 1].times(DC.NUMMAX))) return false;
      }
      return true;
    },
    checkEvent: GAME_EVENT.ETERNITY_RESET_AFTER,
    get reward() { return i18n("ach", "ach143reward"); },
  },
  {
    id: 144,
    get name() { return i18n("ach", "ach144title"); },
    get description() { return i18n("ach", "ach144desc"); },
    checkRequirement: () => BlackHole(1).isUnlocked,
    checkEvent: GAME_EVENT.BLACK_HOLE_UNLOCKED,
  },
  {
    id: 145,
    get name() { return i18n("ach", "ach145title"); },
    get description() { return i18n("ach", "ach145desc"); },
    checkRequirement: () => BlackHoles.list.some(bh => bh.interval.lt(bh.duration)),
    checkEvent: GAME_EVENT.BLACK_HOLE_UPGRADE_BOUGHT,
    get reward() { return i18n("ach", "ach145reward", [formatPercents(0.1)]); },
    effect: 0.9
  },
  {
    id: 146,
    get name() { return i18n("ach", "ach146title"); },
    get description() { return i18n("ach", "ach146desc"); },
    checkRequirement: () => player.reality.perks.size === Perks.all.length,
    checkEvent: GAME_EVENT.PERK_BOUGHT,
    get reward() { return i18n("ach", "ach146reward", [formatPercents(0.01)]); },
    effect: 1
  },
  {
    id: 147,
    get name() { return i18n("ach", "ach147title"); },
    get description() { return i18n("ach", "ach147desc"); },
    checkRequirement: () => RealityUpgrades.allBought,
    checkEvent: GAME_EVENT.REALITY_UPGRADE_BOUGHT,
    get reward() { return i18n("ach", "ach147reward"); },
  },
  {
    id: 148,
    get name() { return i18n("ach", "ach148title"); },
    get description() { return i18n("ach", "ach148desc"); },
    checkRequirement: () => GlyphInfo.basicGlyphTypes
      .every(type => Glyphs.activeList.some(g => g.type === type)),
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    get reward() { return i18n("ach", "ach148reward"); },
    effect: () => (new Set(Glyphs.activeWithoutCompanion.map(g => g.type))).size,
    formatEffect: value => `+${formatInt(value)}`
  },
  {
    id: 151,
    get name() { return i18n("ach", "ach151title"); },
    get description() { return i18n("ach", "ach151desc", [formatInt(800)]); },
    checkRequirement: () => player.galaxies.gte(800) && player.requirementChecks.infinity.noAD8,
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    get reward() { return i18n("ach", "ach151reward"); },
  },
  {
    id: 152,
    get name() { return i18n("ach", "ach152title"); },
    get description() { return i18n("ach", "ach152desc", [formatInt(100)]); },
    checkRequirement: () => Glyphs.inventoryList.length >= 100,
    checkEvent: GAME_EVENT.GLYPHS_CHANGED
  },
  {
    id: 153,
    get name() { return i18n("ach", "ach153title"); },
    get description() { return i18n("ach", "ach153desc"); },
    checkRequirement: () => player.requirementChecks.reality.noAM,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
  },
  {
    id: 154,
    get name() { return i18n("ach", "ach154title"); },
    get description() { return i18n("ach", "ach154desc", [formatInt(5)]); },
    checkRequirement: () => Time.thisReality.totalSeconds.lte(5),
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    get reward() { return i18n("ach", "ach154reward", [formatPercents(0.1), formatX(2)]); },
    effect: 0.1
  },
  {
    id: 155,
    get name() { return i18n("ach", "ach155title"); },
    get description() { return i18n("ach", "ach155desc", [formatFloat(13.7, 1)]); },
    checkRequirement: () => Time.totalTimePlayed.totalYears.gt(13.7e9),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return i18n("ach", "ach155reward", [formatPercents(0.1)]); },
    effect: 1.1
  },
  {
    id: 156,
    get name() { return i18n("ach", "ach156title"); },
    get description() { return i18n("ach", "ach156desc"); },
    checkRequirement: () => player.requirementChecks.reality.noPurchasedTT,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    get reward() { return i18n("ach", "ach156reward", [formatX(2.5, 0, 1)]); },
    effect: 2.5
  },
  {
    id: 157,
    get name() { return i18n("ach", "ach157title"); },
    get description() { return i18n("ach", "ach157desc", [formatInt(4)]); },
    checkRequirement: () => Glyphs.activeList.concat(Glyphs.inventoryList).map(
      glyph => glyph.effects.length).max().gte(4),
    checkEvent: GAME_EVENT.GLYPHS_CHANGED
  },
  {
    id: 158,
    get name() { return i18n("ach", "ach158title"); },
    get description() { return i18n("ach", "ach158desc"); },
    checkRequirement: () => BlackHole(1).isPermanent && BlackHole(2).isPermanent,
    checkEvent: GAME_EVENT.BLACK_HOLE_UPGRADE_BOUGHT,
    get reward() { return i18n("ach", "ach158reward", [formatPercents(0.1)]); },
    effect: 1.1
  },
  {
    id: 161,
    get name() { return i18n("ach", "ach161title"); },
    get description() { return i18n("ach", "ach161desc", [formatPostBreak(DC.E1E8)]); },
    checkRequirement: () => Currency.antimatter.gte(DC.E1E8) && player.dilation.active,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 162,
    get name() { return i18n("ach", "ach162title"); },
    get description() { return i18n("ach", "ach162desc"); },
    checkRequirement: () => player.timestudy.studies.length >= 58,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 163,
    get name() { return i18n("ach", "ach163title"); },
    get description() { return i18n("ach", "ach163desc", [formatInt(5), formatInt(1)]); },
    checkRequirement: () => EternityChallenges.all.map(ec => ec.completions).min().gte(5) &&
      Time.thisReality.totalSeconds.lte(1),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 164,
    get name() { return i18n("ach", "ach164title"); },
    get description() { return i18n("ach", "ach164desc", [format(DC.NUMMAX, 1)]); },
    checkRequirement: () => Currency.infinitiesTotal.gte(DC.NUMMAX),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return i18n("ach", "ach164reward", [formatInt(1024)]); },
    effect: 1024
  },
  {
    id: 165,
    get name() { return i18n("ach", "ach165title"); },
    get description() { return i18n("ach", "ach165desc", [formatInt(5000)]); },
    checkRequirement: () => gainedGlyphLevel().actualLevel.gte(5000) &&
      ["repl", "dt", "eternities"].every(
        i => player.celestials.effarig.glyphWeights[i] === player.celestials.effarig.glyphWeights.ep),
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    get reward() { return i18n("ach", "ach165reward"); },
  },
  {
    id: 166,
    get name() { return i18n("ach", "ach166title"); },
    get description() { return i18n("ach", "ach166desc", [formatInt(6969)]); },
    checkRequirement: () => gainedGlyphLevel().actualLevel.eq(6969),
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
    get reward() { return i18n("ach", "ach166reward", [formatInt(69)]); },
    effect: 69
  },
  {
    id: 167,
    get name() { return i18n("ach", "ach167title"); },
    get description() { return i18n("ach", "ach167desc", [format(DC.NUMMAX, 1, 0)]); },
    checkRequirement: () => Currency.realityMachines.gte(DC.NUMMAX),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return i18n("ach", "ach167reward"); },
    effect: () => Currency.realityMachines.value.clampMin(1).log2().clampMin(1),
    formatEffect: value => `${formatX(value, 2, 2)}`
  },
  {
    id: 168,
    get name() { return i18n("ach", "ach168title"); },
    get description() { return i18n("ach", "ach168desc", [formatInt(50)]); },
    checkRequirement: () => Ra.totalPetLevel >= 50,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    get reward() { return i18n("ach", "ach168reward", [formatPercents(0.1)]); },
    effect: 1.1
  },
  {
    id: 171,
    get name() { return i18n("ach", "ach171title"); },
    get description() { return i18n("ach", "ach171desc"); },
    checkRequirement: () => Object.values(player.reality.glyphs.sac).every(s => s.gt(0)),
    checkEvent: GAME_EVENT.GLYPHS_CHANGED,
    get reward() { return i18n("ach", "ach171reward", [formatX(2)]); },
    effect: 2,
  },
  {
    id: 172,
    get name() { return i18n("ach", "ach172title"); },
    get description() { return i18n("ach", "ach172desc", [format(DC.NUMMAX, 1)]); },
    checkRequirement: () => Currency.realityMachines.cappedGain.gte(DC.NUMMAX) &&
      player.celestials.ra.charged.size === 0 && Glyphs.activeWithoutCompanion.length === 0 &&
      player.requirementChecks.reality.noTriads,
    checkEvent: GAME_EVENT.REALITY_RESET_BEFORE,
  },
  {
    id: 173,
    // See i18n note
    name: "Cet accomplissement n'existe pas III",
    get description() { return i18n("ach", "ach173desc", [formatPostBreak(DC.D9_99999E999, 5, 0)]); },
    checkRequirement: () => player.reality.realityMachines.gte(DC.D9_99999E999),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 174,
    get name() { return i18n("ach", "ach174title"); },
    get description() { return i18n("ach", "ach174desc"); },
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.SINGULARITY_RESET_BEFORE
  },
  {
    id: 175,
    get name() { return i18n("ach", "ach175title"); },
    get description() { return i18n("ach", "ach175desc", [formatInt(Ra.alchemyResourceCap)]); },
    checkRequirement: () => AlchemyResources.all.every(x => x.amount.gte(Ra.alchemyResourceCap)),
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER,
    get reward() { return i18n("ach", "ach175reward", [formatPercents(1), formatX(10)]); },
    effect: 10,
  },
  {
    id: 176,
    get name() { return i18n("ach", "ach176title"); },
    get description() { return i18n("ach", "ach176desc"); },
  },
  {
    id: 177,
    get name() { return i18n("ach", "ach177title"); },
    get description() { return i18n("ach", "ach177desc"); },
    checkRequirement: () => SingularityMilestones.all.every(x => x.completions.gt(0)),
    checkEvent: GAME_EVENT.SINGULARITY_RESET_AFTER,
  },
  {
    id: 178,
    get name() { return i18n("ach", "ach178title"); },
    get description() { return i18n("ach", "ach178desc", [formatInt(1e5)]); },
    checkRequirement: () => player.galaxies.gte(1e5),
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER,
    get reward() { return i18n("ach", "ach178reward", [formatPercents(0.01)]); },
    effect: 1.01
  },
  {
    id: 181,
    displayId: 666,
    get name() { return i18n("ach", "ach181title"); },
    get description() { return i18n("ach", "ach181desc"); },
    checkRequirement: () => Pelle.isDoomed,
    checkEvent: GAME_EVENT.REALITY_RESET_AFTER,
  },
  {
    id: 182,
    get name() { return i18n("ach", "ach182title"); },
    get description() { return i18n("ach", "ach182desc"); },
    checkRequirement: () => PelleUpgrade.antimatterDimAutobuyers1.canBeApplied &&
      PelleUpgrade.antimatterDimAutobuyers2.canBeApplied,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 183,
    get name() { return i18n("ach", "ach183title"); },
    get description() { return i18n("ach", "ach183desc"); },
    checkRequirement: () => Pelle.isDoomed && InfinityChallenge(5).isCompleted,
    checkEvent: GAME_EVENT.INFINITY_CHALLENGE_COMPLETED,
    // Weirdly specific reward? Yes, its V's ST bonus because we forgot to disable it
    // when balancing Pelle and only realised too late.
    get reward() { return i18n("ach", "ach183reward", [formatPow(1.0812403840463596, 0, 3)]); },
    effect: 1.0812403840463596
  },
  {
    id: 184,
    get name() { return i18n("ach", "ach184title"); },
    get description() { return i18n("ach", "ach184desc"); },
    checkRequirement: () => PelleStrikes.eternity.hasStrike,
    checkEvent: GAME_EVENT.PELLE_STRIKE_UNLOCKED
  },
  {
    id: 185,
    get name() { return i18n("ach", "ach185title"); },
    get description() { return i18n("ach", "ach185desc"); },
    checkRequirement: () => PelleStrikes.ECs.hasStrike,
    checkEvent: GAME_EVENT.PELLE_STRIKE_UNLOCKED
  },
  {
    id: 186,
    displayId: 181,
    get name() { return i18n("ach", "ach186title"); },
    get description() { return i18n("ach", "ach186desc"); },
  },
  {
    id: 187,
    get name() { return i18n("ach", "ach187title"); },
    get description() { return i18n("ach", "ach187desc"); },
    checkRequirement: () => PelleStrikes.dilation.hasStrike,
    checkEvent: GAME_EVENT.PELLE_STRIKE_UNLOCKED,
    // We forgot to disable a singularity milestone while balancing Pelle; now it's disabled
    // and this upgrade has the same effect as it used to.
    get reward() { return i18n("ach", "ach187reward", [formatX(1.35, 0, 2)]); },
    effect: 1.35
  },
  {
    id: 188,
    get name() { return i18n("ach", "ach188title"); },
    get description() { return i18n("ach", "ach188desc"); },
    checkRequirement: () => GameEnd.endState > END_STATE_MARKERS.GAME_END && !GameEnd.removeAdditionalEnd,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
];
