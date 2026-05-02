export const secretAchievements = [
  {
    id: 11,
    get name() { return i18n("secret", "ach11title"); },
    get description() { return i18n("secret", "ach11desc"); },
  },
  {
    id: 12,
    get name() { return i18n("secret", "ach12title"); },
    get description() { return i18n("secret", "ach12desc", [formatInt(100)]); },
  },
  {
    id: 13,
    get name() { return i18n("secret", "ach13title"); },
    get description() { return i18n("secret", "ach13desc"); },
  },
  {
    id: 14,
    get name() { return i18n("secret", "ach14title"); },
    get description() { return i18n("secret", "ach14desc"); },
  },
  {
    id: 15,
    get name() { return i18n("secret", "ach15title"); },
    get description() { return i18n("secret", "ach15desc"); },
  },
  {
    id: 16,
    get name() { return i18n("secret", "ach16title"); },
    get description() { return i18n("secret", "ach16desc", [formatInt(10)]); },
    checkRequirement: () => AchievementTimers.pain
      .check(PlayerProgress.eternityUnlocked() && Notations.current.isPainful, 600),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 17,
    get name() { return i18n("secret", "ach17title"); },
    get description() { return i18n("secret", "ach17desc"); },
  },
  {
    id: 18,
    get name() { return i18n("secret", "ach18title"); },
    get description() { return i18n("secret", "ach18desc", [formatInt(1), formatInt(1e5)]); },
  },
  {
    id: 21,
    get name() { return i18n("secret", "ach21title"); },
    get description() { return i18n("secret", "ach21desc"); },
  },
  {
    id: 22,
    get name() { return i18n("secret", "ach22title"); },
    get description() { return i18n("secret", "ach22desc", [formatInt(1e5)]); },
    checkRequirement: () => player.requirementChecks.permanent.emojiGalaxies.gte(1e5),
    checkEvent: GAME_EVENT.GALAXY_RESET_AFTER
  },
  {
    id: 23,
    get name() { return i18n("secret", "ach23title"); },
    get description() { return i18n("secret", "ach23desc"); },
  },
  {
    id: 24,
    get name() { return i18n("secret", "ach24title"); },
    get description() { return i18n("secret", "ach24desc"); },
  },
  {
    id: 25,
    get name() { return i18n("secret", "ach25title"); },
    get description() { return i18n("secret", "ach25desc"); },
  },
  {
    id: 26,
    get name() { return i18n("secret", "ach26title"); },
    get description() { return i18n("secret", "ach26desc", [formatInt(10)]); },
    checkRequirement: (function() {
      let count = 0;
      return () => ++count >= 10;
    }()),
    checkEvent: GAME_EVENT.CHALLENGE_FAILED
  },
  {
    id: 27,
    get name() { return i18n("secret", "ach27title"); },
    get description() { return i18n("secret", "ach27desc"); },
    checkRequirement: () => Currency.matter.gte(DC.NUMMAX),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 28,
    get name() { return i18n("secret", "ach28title"); },
    get description() { return i18n("secret", "ach28desc"); },
  },
  {
    id: 31,
    get name() { return i18n("secret", "ach31title"); },
    get description() { return i18n("secret", "ach31desc", [formatInt(200)]); },
  },
  {
    id: 32,
    get name() { return i18n("secret", "ach32title"); },
    get description() { return i18n("secret", "ach32desc", [format(0.001, 3, 3)]); },
    checkRequirement: () =>
      Time.bestInfinity.totalMilliseconds.lte(1) ||
      Time.bestEternity.totalMilliseconds.lte(1),
    checkEvent: [GAME_EVENT.BIG_CRUNCH_AFTER, GAME_EVENT.ETERNITY_RESET_AFTER]
  },
  {
    id: 33,
    get name() { return i18n("secret", "ach33title"); },
    get description() { return i18n("secret", "ach33desc"); },
  },
  {
    id: 34,
    get name() { return i18n("secret", "ach34title"); },
    get description() { return i18n("secret", "ach34desc"); },
  },
  {
    id: 35,
    get name() { return i18n("secret", "ach35title"); },
    get description() { return i18n("secret", "ach35desc", [formatInt(1e5)]); },
    checkRequirement: () => player.requirementChecks.permanent.singleTickspeed >= 1e5,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 36,
    get name() { return i18n("secret", "ach36title"); },
    get description() { return i18n("secret", "ach36desc"); },
  },
  {
    id: 37,
    get name() { return i18n("secret", "ach37title"); },
    get description() { return i18n("secret", "ach37desc"); },
  },
  {
    id: 38,
    get name() { return i18n("secret", "ach38title"); },
    get description() { return i18n("secret", "ach38desc"); },
  },
  {
    id: 41,
    get name() { return i18n("secret", "ach41title"); },
    get description() { return i18n("secret", "ach41desc"); },
  },
  {
    id: 42,
    get name() { return i18n("secret", "ach42title"); },
    get description() { return i18n("secret", "ach42desc"); },
  },
  {
    id: 43,
    get name() { return i18n("secret", "ach43title"); },
    get description() { return i18n("secret", "ach43desc"); },
    checkRequirement: () => Glyphs.active.length && Glyphs.active.every(x => Glyphs.isMusicGlyph(x)),
    checkEvent: GAME_EVENT.GLYPHS_EQUIPPED_CHANGED
  },
  {
    id: 44,
    get name() { return i18n("secret", "ach44title"); },
    get description() { return i18n("secret", "ach44desc", [formatInt(15)]); },
    checkRequirement: () => AchievementTimers.stats.check(Tab.statistics.isOpen, 900),
    checkEvent: GAME_EVENT.GAME_TICK_AFTER
  },
  {
    id: 45,
    get name() { return i18n("secret", "ach45title"); },
    get description() { return i18n("secret", "ach45desc"); },
    checkRequirement: () => player.requirementChecks.permanent.perkTreeDragging++ / 100 >= 60
  },
  {
    id: 46,
    get name() { return i18n("secret", "ach46title"); },
    get description() { return i18n("secret", "ach46desc"); },
  },
  {
    id: 47,
    get name() { return i18n("secret", "ach47title"); },
    get description() { return i18n("secret", "ach47desc"); },
  },
  {
    id: 48,
    get name() { return i18n("secret", "ach48title"); },
    get description() { return i18n("secret", "ach48desc"); },
  },
];
