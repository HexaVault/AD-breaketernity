const thisInfinityMult = thisInfinity => {
  // All "this inf time" or "best inf time" mults are * 10
  const scaledInfinity = thisInfinity.times(10).add(1);
  const cappedInfinity = Decimal.min(Decimal.pow(scaledInfinity, 0.125), 500);
  return DC.D15.pow(Decimal.log10(scaledInfinity).times(cappedInfinity));
};
const passiveIPMult = () => {
  const isEffarigLimited = Effarig.isRunning && Effarig.currentStage === EFFARIG_STAGES.ETERNITY;
  const normalValue = Perk.studyPassive.isBought ? DC.E50 : DC.E25;
  return isEffarigLimited
    ? Decimal.min(normalValue, Effarig.eternityCap)
    : normalValue;
};


/**
 * List of time study specifications and attributes
 * {
 *  @property {Number} id                   Numerical ID shown for each time study in code and in-game
 *  @property {Number} cost                 Amount of available time theorems required to purchase
 *  @property {Number} STcost               Amount of available space theorems required to purchase if needed
 *  @property {Object[]} requirement   Array of Numbers or functions which are checked to determine purchasability
 *  @property {Number} reqType              Number specified by enum in TS_REQUIREMENT_TYPE for requirement behavior
 *  @property {Number[]} requiresST    Array of Numbers indicating which other studies will cause this particular
 *    study to also cost space theorems - in all cases this applies if ANY in the array are bought
 *  @property {function: @return String} description  Text to be shown in-game for the time study's effects
 *  @property {function: @return Number} effect       Numerical value for the effects of a study
 *  @property {String[]} cap     Hard-coded cap for studies which don't scale forever
 *  @property {String} formatEffect   Formatting function for effects, if the default formatting isn't appropriate
 * }
 */
export const normalTimeStudies = [
  {
    id: 11,
    cost: DC.D1,
    // All requirements of an empty array will always evaluate to true, so this study is always purchasable
    requirement: [],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: () => i18n("studies", "ts11"),
    effect: () => {
      const tickspeed = Tickspeed.current.dividedBy(1000);
      const firstPart = tickspeed.pow(0.005).times(0.95);
      const secondPart = tickspeed.pow(0.0003).times(0.05);
      return firstPart.plus(secondPart).reciprocate();
    },
    cap: DC.E2500,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 21,
    cost: DC.D3,
    requirement: [11],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts21", [formatPow(2), formatPow(0.032, 3, 3)]),
    effect: () => Replicanti.amount.pow(0.032),
    // This is a special case because the study itself is *added* to the existing formula, but it makes more sense
    // to display a multiplicative increase just like every other study. We need to do the calculation in here in order
    // to properly show only the effect of this study and nothing else
    formatEffect: value => {
      const oldVal = Decimal.pow(Decimal.log2(Replicanti.amount.clampMin(1)), 2).clampMin(1);
      const newVal = oldVal.plus(value);
      return formatX(newVal.div(oldVal).clampMin(1), 2, 2);
    }
  },
  {
    id: 22,
    cost: DC.D2,
    requirement: [11],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts22", formatInt(50), formatInt(1)),
    effect: 1
  },
  {
    id: 31,
    cost: DC.D3,
    requirement: [21],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts31", formatPow(4)),
    effect: 4
  },
  {
    id: 32,
    cost: DC.D2,
    requirement: [22],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts32"),
    effect: () => DimBoost.totalBoosts.clampMin(1),
    formatEffect: value => formatX(value, 2)
  },
  {
    id: 33,
    cost: DC.D2,
    requirement: [22],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts33")
  },
  {
    id: 41,
    cost: DC.D4,
    requirement: [31],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts41", [formatX(DC.D1_2, 1, 1)]),
    effect: () => DC.D1_2.pow(player.dilation.totalTachyonGalaxies.add(Replicanti.galaxies.total).add(player.galaxies)),
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 42,
    cost: DC.D6,
    requirement: [32],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts42", [formatInt(52), formatInt(60)]),
    effect: 52
  },
  {
    id: 51,
    cost: DC.D3,
    requirement: [41, 42],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts51", (formatX(1e15))),
    effect: 1e15
  },
  {
    id: 61,
    cost: DC.D3,
    requirement: [51],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts63", [formatX(15)]),
    effect: 15
  },
  {
    id: 62,
    cost: DC.D3,
    requirement: [42, () => Perk.bypassEC5Lock.isBought || EternityChallenge(5).completions > 0],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: () => i18n("studies", "ts62", formatInt(3)),
    effect: 3
  },
  {
    id: 71,
    cost: DC.D4,
    requirement: [61, () => Perk.studyECRequirement.isBought || !EternityChallenge(12).isUnlocked],
    reqType: TS_REQUIREMENT_TYPE.DIMENSION_PATH,
    description: () => i18n("studies", "ts71"),
    effect: () => Sacrifice.totalBoost.pow(0.25).clampMin(1),
    cap: DC.E210000,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 72,
    cost: DC.D6,
    requirement: [61,
      () => Perk.studyECRequirement.isBought ||
        (!EternityChallenge(11).isUnlocked && !EternityChallenge(12).isUnlocked)],
    reqType: TS_REQUIREMENT_TYPE.DIMENSION_PATH,
    description: () => i18n("studies", "ts72"),
    effect: () => Sacrifice.totalBoost.pow(0.04).clampMin(1),
    cap: DC.E30000,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 73,
    cost: DC.D5,
    requirement: [61, () => Perk.studyECRequirement.isBought || !EternityChallenge(11).isUnlocked],
    reqType: TS_REQUIREMENT_TYPE.DIMENSION_PATH,
    description: () => i18n("studies", "ts73"),
    effect: () => Sacrifice.totalBoost.pow(0.005).clampMin(1),
    cap: DC.E1300,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 81,
    cost: DC.D4,
    requirement: [71],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts81", [formatX(10)]),
    effect: 10
  },
  {
    id: 82,
    cost: DC.D6,
    requirement: [72],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts82"),
    effect: () => DC.D1_0000109.pow(DimBoost.totalBoosts.pow(2)),
    cap: DC.E1E7,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 83,
    cost: DC.D5,
    requirement: [73],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts83"),
    effect: () => DC.D1_0004.pow(player.tickspeed.gained),
    cap: DC.E30,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 91,
    cost: DC.D4,
    requirement: [81],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts91"),
    effect: () => Time.thisEternity.totalMinutes.clampMax(20).times(15).pow10(),
    cap: DC.E300,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 92,
    cost: DC.D5,
    requirement: [82],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts92"),
    effect: () => DC.D2.pow(Decimal.div(60, Time.bestEternity.totalSeconds.clampMin(2))),
    cap: DC.C2P30,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 93,
    cost: DC.D7,
    requirement: [83],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts93"),
    effect: () => Decimal.pow(player.tickspeed.gained, 0.25).clampMin(1),
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 101,
    cost: DC.D4,
    requirement: [91],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts101"),
    effect: () => Decimal.max(Replicanti.amount, 1),
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 102,
    cost: DC.D6,
    requirement: [92],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts102"),
    effect: () => DC.D5.pow(player.replicanti.galaxies),
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 103,
    cost: DC.D6,
    requirement: [93],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts103"),
    effect: () => Decimal.max(player.replicanti.galaxies, 1),
    formatEffect: value => formatX(value, 2, 0)
  },
  {
    id: 111,
    cost: DC.D12,
    requirement: [101, 102, 103],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts111", [Achievement(103).canBeApplied ? formatFloat(307.8, 1) : formatInt(308), formatInt(285)]),
    effect: 285
  },
  {
    id: 121,
    cost: DC.D9,
    STCost: 2,
    requirement: [111],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [122, 123],
    description: () => (Perk.studyActiveEP.isBought
      ? i18n("studies", "ts121alt", [formatX(50)])
      : i18n("studies", PlayerProgress.realityUnlocked() ? "ts121r" : "ts121")),
    effect: () => (Perk.studyActiveEP.isBought
      ? new Decimal(50)
      : Decimal.div(250, Player.averageRealTimePerEternity).min(50).max(1)),
    formatEffect: value => (Perk.studyActiveEP.isBought ? undefined : formatX(value, 1, 1)),
    cap: 50
  },
  {
    id: 122,
    cost: DC.D9,
    STCost: 2,
    requirement: [111],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [121, 123],
    description: () => (i18n("studies", "ts122", [formatX(Perk.studyPassive.isBought ? 50 : 35)])),
    effect: () => (Perk.studyPassive.isBought ? 50 : 35)
  },
  {
    id: 123,
    cost: DC.D9,
    STCost: 2,
    requirement: [111],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [121, 122],
    description: () => i18n("studies", "ts123"),
    effect: () => {
      const perkEffect = TimeSpan.fromMinutes(Perk.studyIdleEP.effectOrDefault(0));
      const totalSeconds = Time.thisEternity.plus(perkEffect).totalSeconds;
      return Decimal.pow(totalSeconds.times(1.39), 0.5);
    },
    formatEffect: value => formatX(value, 1, 1)
  },
  {
    id: 131,
    cost: DC.D5,
    STCost: 8,
    requirement: [121],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [132, 133],
    description: () => (Achievement(138).isUnlocked
      ? i18n("studies", "ts131", [formatPercents(0.5)])
      : i18n("studies", "ts131alt", [formatPercents(0.5)])),
    effect: () => Decimal.floor(player.replicanti.boughtGalaxyCap.div(2))
  },
  {
    id: 132,
    cost: DC.D5,
    STCost: 8,
    requirement: [122],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [131, 133],
    description: () => (Pelle.isDoomed
      ? i18n("studies", "ts132alt", [formatPercents(0.4)])
      : i18n("studies", "ts132", [formatPercents(0.4), formatX(Perk.studyPassive.isBought ? 3 : 1.5, 1, 1)])),
    effect: 0.4
  },
  {
    id: 133,
    cost: DC.D5,
    STCost: 8,
    requirement: [123],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [131, 132],
    description: () => (Achievement(138).isUnlocked
      ? i18n("studies", "ts133", [formatPercents(0.5)])
      : i18n("studies", "ts133alt", [formatX(10), format(DC.NUMMAX, 2), formatPercents(0.5)])),
    effect: 0.5
  },
  {
    id: 141,
    cost: DC.D4,
    STCost: 2,
    requirement: [131],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [142, 143],
    description: () => (Perk.studyActiveEP.isBought
      ? i18n("studies", "ts141", [formatX(DC.E45)])
      : i18n("studies", "ts141alt")),
    effect: () => (Perk.studyActiveEP.isBought
      ? DC.E45
      : DC.E45.divide(thisInfinityMult(Time.thisInfinity.totalSeconds)).clampMin(1)),
    formatEffect: value => (Perk.studyActiveEP.isBought ? undefined : formatX(value, 2, 1))
  },
  {
    id: 142,
    cost: DC.D4,
    STCost: 2,
    requirement: [132],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [141, 143],
    description: () => i18n("studies", "ts142", [formatX(passiveIPMult())]),
    effect: passiveIPMult,
    cap: () => (Effarig.eternityCap === undefined ? undefined : Effarig.eternityCap.toNumber())
  },
  {
    id: 143,
    cost: DC.D4,
    STCost: 2,
    requirement: [133],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [141, 142],
    description: i18n("studies", "ts143"),
    effect: () => {
      const perkEffect = TimeSpan.fromMinutes(Perk.studyIdleEP.effectOrDefault(0));
      const totalSeconds = Time.thisInfinity.plus(perkEffect).totalSeconds;
      return thisInfinityMult(totalSeconds);
    },
    formatEffect: value => formatX(value, 2, 1),
    cap: () => Effarig.eternityCap
  },
  {
    id: 151,
    cost: DC.D8,
    requirement: [141, 142, 143],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts151", [formatX(1e4)]),
    effect: 1e4
  },
  {
    id: 161,
    cost: DC.D7,
    requirement: [151],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts161", [formatX(DC.E616)]),
    effect: () => DC.E616
  },
  {
    id: 162,
    cost: DC.D7,
    requirement: [151],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts162", [formatX(1e11)]),
    effect: 1e11
  },
  {
    id: 171,
    cost: DC.D15,
    requirement: [161, 162],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts171", [formatX(1.33, 0, 2), formatX(1.25, 0, 2)]),
    effect: () => 1.25
  },
  {
    id: 181,
    cost: new Decimal(200),
    requirement: [171,
      () => EternityChallenge(1).completions > 0 || Perk.bypassEC1Lock.isBought,
      () => EternityChallenge(2).completions > 0 || Perk.bypassEC2Lock.isBought,
      () => EternityChallenge(3).completions > 0 || Perk.bypassEC3Lock.isBought],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: () => i18n("studies", "ts181", [formatPercents(0.01)]),
    effect: () => Currency.infinityPoints.gain.times(Time.deltaTime.div(100))
      .timesEffectOf(Ra.unlocks.continuousTTBoost.effects.autoPrestige)
  },
  {
    id: 191,
    cost: new Decimal(400),
    requirement: [181, () => EternityChallenge(10).completions > 0],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: () => i18n("studies", "ts191", [formatPercents(0.05)]),
    effect: () => Currency.infinities.value.times(0.05).floor()
  },
  {
    id: 192,
    cost: new Decimal(730),
    requirement: [181, () => EternityChallenge(10).completions > 0, () => !Enslaved.isRunning],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: () => (Enslaved.isRunning
      ? i18n("studies", "ts192alt")
      : i18n("studies", "ts192", [format(replicantiCap(), 2, 1)]))
  },
  {
    id: 193,
    cost: new Decimal(300),
    requirement: [181, () => EternityChallenge(10).completions > 0],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    description: i18n("studies", "ts193"),
    effect: () => (DC.E13000.pow(Currency.eternities.value.div(1e6).clampMax(1))),
    cap: DC.E13000,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 201,
    cost: new Decimal(900),
    requirement: [192],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts201")
  },
  {
    id: 211,
    cost: new Decimal(120),
    requirement: [191],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts211", [formatInt(5)]),
    effect: 5
  },
  {
    id: 212,
    cost: new Decimal(150),
    requirement: [191],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: i18n("studies", "ts212"),
    effect: () => Currency.timeShards.value.clampMin(2).log2().pow(0.005),
    cap: new Decimal(1.1),
    formatEffect: value => `+${formatPercents(value.sub(1), 3)}`
  },
  {
    id: 213,
    cost: new Decimal(200),
    requirement: [193],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts213", [formatInt(20)]),
    effect: 20
  },
  {
    id: 214,
    cost: new Decimal(120),
    requirement: [193],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    description: () => i18n("studies", "ts214"),
    effect: () => {
      const totalBoost = Sacrifice.totalBoost;
      const firstPart = totalBoost.pow(7.6).clampMaxExponent(44000);
      const secondPart = totalBoost.pow(1.05).clampMaxExponent(120000);
      return firstPart.times(secondPart);
    },
    cap: DC.E164000,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 221,
    cost: new Decimal(900),
    STCost: 4,
    requirement: [211],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [222],
    description: () => i18n("studies", "ts221"),
    effect: () => DC.D1_0025.pow(DimBoost.totalBoosts),
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 222,
    cost: new Decimal(900),
    STCost: 4,
    requirement: [211],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [221],
    description: () => i18n("studies", "ts222", [formatInt(2)]),
    effect: 2
  },
  {
    id: 223,
    cost: new Decimal(900),
    STCost: 4,
    requirement: [212],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [224],
    description: () => i18n("studies", "ts223", formatInt(7)),
    effect: 7
  },
  {
    id: 224,
    cost: new Decimal(900),
    STCost: 4,
    requirement: [212],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [223],
    description() {
      const effect = TimeStudy(224).effectValue;
      return i18n("studies", "ts224", [quantifyInt(i18n("studies", "ts224gal"), effect), formatInt(1), formatInt(2000)]);
    },
    effect: () => DimBoost.totalBoosts.div(2000).floor()
  },
  {
    id: 225,
    cost: new Decimal(900),
    STCost: 4,
    requirement: [213],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [226],
    description: () => i18n("studies", "ts225"),
    effect: () => Decimal.floor(Replicanti.amount.clampMin(1).log10().div(1000)),
    formatEffect: value => `+${formatInt(value)} RG`
  },
  {
    id: 226,
    cost: new Decimal(900),
    STCost: 4,
    requirement: [213],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [225],
    description: () => i18n("studies", "ts226"),
    effect: () => Decimal.floor(player.replicanti.boughtGalaxyCap.div(15)),
    formatEffect: value => `+${formatInt(value)} RG`
  },
  {
    id: 227,
    cost: new Decimal(900),
    STCost: 4,
    requirement: [214],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [228],
    description: () => i18n("studies", "ts227"),
    effect: () => Decimal.max(Decimal.pow(Sacrifice.totalBoost.absLog10(), 10), 1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    id: 228,
    cost: new Decimal(900),
    STCost: 4,
    requirement: [214],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [227],
    description: () => i18n("studies", "ts228", [
      Sacrifice.getSacrificeDescription({ "TimeStudy228": false }),
      Sacrifice.getSacrificeDescription({ "TimeStudy228": true })
    ]),
    effect: 0.2
  },
  {
    id: 231,
    cost: new Decimal(500),
    STCost: 5,
    requirement: [221, 222],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [232],
    description: () => i18n("studies", "ts231"),
    effect: () => Decimal.pow(DimBoost.totalBoosts, 0.3).clampMin(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    id: 232,
    cost: new Decimal(500),
    STCost: 5,
    requirement: [223, 224],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [231],
    description: () => i18n("studies", "ts232"),
    effect: () => Decimal.pow(player.galaxies.div(1000).add(1), 0.2),
    formatEffect: value => `+${formatPercents(value.sub(1), 3)}`
  },
  {
    id: 233,
    cost: new Decimal(500),
    STCost: 5,
    requirement: [225, 226],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [234],
    description: () => i18n("studies", "ts233"),
    effect: () => Replicanti.amount.pow(0.3),
    formatEffect: value => `/ ${format(value, 1, 2)}`
  },
  {
    id: 234,
    cost: new Decimal(500),
    STCost: 5,
    requirement: [227, 228],
    reqType: TS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    requiresST: [233],
    description: () => i18n("studies", "ts234"),
    effect: () => Sacrifice.totalBoost,
  },
  // Note: These last 4 entries are the triad studies
  {
    id: 301,
    cost: DC.D0,
    STCost: 12,
    requirement: [() => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 1, 221, 222, 231],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    requiresST: [221, 222, 231],
    description: () => i18n("studies", "ts301"),
    effect: () => TimeStudy(221).effectValue.pow(TimeStudy(231).effectValue.minus(1)).clampMin(1),
    formatEffect: value => formatX(value, 2, 1),
    unlocked: () => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 1
  },
  {
    id: 302,
    cost: DC.D0,
    STCost: 12,
    requirement: [() => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 2, 223, 224, 232],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    requiresST: [223, 224, 232],
    description: () => () => i18n("studies", "ts302", [formatInt(3000)]),
    effect: 3000,
    unlocked: () => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 2
  },
  {
    id: 303,
    cost: DC.D0,
    STCost: 12,
    requirement: [() => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 3, 225, 226, 233],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    requiresST: [225, 226, 233],
    description: () => () => i18n("studies", "ts303", [formatPercents(0.5)]),
    effect: 1.5,
    unlocked: () => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 3
  },
  {
    id: 304,
    cost: DC.D0,
    STCost: 12,
    requirement: [() => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 4, 227, 228, 234],
    reqType: TS_REQUIREMENT_TYPE.ALL,
    requiresST: [227, 228, 234],
    description: () => i18n("studies", "ts304"),
    effect: 2,
    unlocked: () => Ra.unlocks.unlockHardV.effectOrDefault(0) >= 4
  }
];
