import { Player } from "./player";

import FullScreenAnimationHandler from "./full-screen-animation-handler";

/* eslint-disable no-console */
// Disabling no-console here seems reasonable, since these are the devtools after all

export const dev = {};

dev.speedUp = 1;

dev.hardReset = function() {
  GameStorage.hardReset();
};

dev.giveAch = {};

dev.giveAch.normal = function() {
  Achievements.all.filter(ach => ach.id !== 188).forEach(ach => ach.unlock());
};

dev.giveAch.secret = function() {
  SecretAchievements.all.forEach(ach => ach.unlock());
};

dev.barrelRoll = function() {
  FullScreenAnimationHandler.display("a-barrel-roll", 5);
};

dev.spin3d = function(len = 3) {
  document.body.style.animation = document.body.style.animation === ""
    ? `a-spin3d ${len}s infinite`
    : "";
};

dev.spin4d = function(len = 3) {
  document.body.style.animation = document.body.style.animation === ""
    ? `a-spin4d ${len}s infinite`
    : "";
};

dev.cancerize = function() {
  Theme.tryUnlock("Design");
  Notation.emoji.setAsCurrent();
};

// eslint-disable-next-line max-params
dev.giveGlyph = function(type, effects, strength, level) {
  if (GameCache.glyphInventorySpace.value === 0) return;
  Glyphs.addToInventory({
    id: undefined,
    idx: null,
    type,
    strength,
    level,
    effects
  });
};

dev.giveRealityGlyph = function(level) {
  if (GameCache.glyphInventorySpace.value === 0) return;
  Glyphs.addToInventory(GlyphGenerator.realityGlyph(level));
};

dev.decriminalize = function() {
  SecretAchievement(23).lock();
  EventHub.dispatch(GAME_EVENT.ACHIEVEMENT_UNLOCKED);
};

dev.removeAch = function(name) {
  if (name === "all") {
    Achievements.all.concat(SecretAchievements.all).forEach(ach => ach.lock());
    return "removed all achievements";
  }
  if (isNumber(name)) return Achievement(name).lock();
  if (name.startsWith("r")) return Achievement(parseInt(name.slice(1), 10)).lock();
  if (name.startsWith("s")) return SecretAchievement(parseInt(name.slice(1), 10)).lock();
  return "failed to delete achievement";
};

window.nextNewsMessageId = undefined;

dev.setNextNewsMessage = function(id) {
  nextNewsMessageId = id;
};

dev.implode = function() {
  bigCrunchAnimation();
};

dev.eternify = function() {
  eternityAnimation();
};

dev.dilate = function() {
  animateAndDilate();
};

dev.undilate = function() {
  animateAndUndilate();
};

dev.realize = function() {
  runRealityAnimation();
};

dev.respecPerks = function() {
  player.reality.perkPoints = player.reality.perkPoints.add(player.reality.perks.size);
  player.reality.perks = new Set();
  GameCache.achievementPeriod.invalidate();
  GameCache.buyablePerks.invalidate();
};

dev.togglePerformanceStats = function() {
  PerformanceStats.toggle();
};

// Buys all perks, will end up buying semi-randomly if not enough pp
dev.buyAllPerks = function() {
  const visited = [];
  const toVisit = [Perk.firstPerk];
  while (toVisit.length > 0) {
    if (player.reality.perkPoints.lt(1)) break;
    const perk = toVisit.shift();
    visited.push(perk);
    toVisit.push(...perk.connectedPerks.filter(p => !visited.includes(p)));
    perk.purchase();
  }
};

dev.unlockCelestialQuotes = function(celestial) {
  Quotes[celestial].all.forEach(x => x.show());
};

dev.presentCelestialQuotes = function(celestial) {
  Quotes[celestial].all.forEach(x => x.present());
};

// May want to make this command in particular publicly known if automator gating is a common complaint post-release
dev.unlockAutomator = function() {
  player.reality.automator.forceUnlock = true;
};

dev.unlockAllCosmeticSets = function() {
  player.reality.glyphs.cosmetics.unlockedFromNG = Object.keys(GameDatabase.reality.glyphCosmeticSets);
};

// You would never guess what these are for
dev.beTests = {};

dev.beTests.speed = function() {
  dev.speedUp = 1e24;
};

dev.beTests.consecutiveInfinities = function(amnt) {
  player.infinityPoints = player.infinityPoints.add(Currency.infinityPoints.gain.times(amnt));
  player.infinities = player.infinities.add(gainedInfinities().round());
};

dev.beTests.completeChalleges = {};

dev.beTests.completeChalleges.normal = function() {
  for (let i = 1; i < 13; i++) NormalChallenge(i).complete();
};

dev.beTests.completeChalleges.infinity = function() {
  for (let i = 1; i < 9; i++) InfinityChallenge(i).complete();
};

dev.beTests.completeChalleges.eternity = function() {
  for (let i = 1; i < 13; i++) EternityChallenge(i).completions = 5;
};

dev.beTests.completeChalleges.all = function() {
  dev.beTests.completeChalleges.normal();
  dev.beTests.completeChalleges.infinity();
  dev.beTests.completeChalleges.eternity();
};

// eslint-disable-next-line complexity
function nanFuckIteration(value, value2) {
  for (const item in value) {
    if (value[item] instanceof Decimal && value2[item] !== undefined) {
      if (value2[item].neq(0)) {
        if (value[item].lt(0) || value[item].layer > 8e15)
          value[item] = value2[item];
      } else if (value[item].layer > 8e15)
        value[item] = value2[item];
    }
    if (value[item] instanceof Number && value2[item] !== undefined) {
      if (value2[item] === 0) {
        if (value[item] > 1e300) {
          value[item] = value2[item];
        }
      } else if (value[item] > 1e300 || value[item] < 0)
        value[item] = value2[item];
    }
    if ((value[item] instanceof Object || value[item] instanceof Array) &&
      !(value[item] instanceof Decimal) && value2[item] !== undefined)
      value[item] = nanFuckIteration(value[item], value2[item]);
    if ((value[item] === undefined || value[item] === null) && value2[item] !== undefined)
      value[item] = value2[item];
    if ((value[item] === undefined || value[item] === null) && value2[item] !== undefined) {
      // If neither the player object nor default object knows what we're looking it, just remove it.
      delete value[item];
    }
  }
  return value;
};

// This function used to be called nanFuck (as reference to how we would constantly have our saves "fucked" by NaN values)
// and although I want to get rid of the swearing in the name, I will keep the name of the internal function the same, as a tribute.
dev.fixSave = function() {
  player = nanFuckIteration(player, Player.defaultStart);
  GameStorage.save();
};

dev.beTests.prepare = function() {
  dev.beTests.speed();
  GameStorage.import("blob");
  Notation.scientific.setAsCurrent();
  LNotation.stackedScientific.setAsCurrent();
};
