/* eslint-disable max-len */
function D(x) {
  return new Decimal(x);
}

const BEMAX = new Decimal("10^^9000000000000000");

function updateGlyphs(glyph) {
  if (glyph.effects instanceof Array) return glyph;
  let intIDindex = (["companion", "cursed", "reality"].includes(glyph.type) ? 28 : 0);
  const effectList = [];
  for (let i = 0; i < 32; i++) {
    if ((glyph.effects >> i) % 2 === 1) {
      // eslint-disable-next-line no-loop-func, eqeqeq
      effectList.push(GlyphEffects.all.filter(e => e.intID == intIDindex)[0].id);
    }
    intIDindex += 1;
  }
  glyph.effects = effectList;
  delete glyph.isGenerated;
  glyph.level = D(glyph.level);
  glyph.rawLevel = D(glyph.rawLevel);
  glyph.strength = D(glyph.strength);
  // eslint-disable-next-line consistent-return
  return glyph;
}

function raFix(player) {
  const array = [];
  for (let i = 0; i < 32; i++) {
    if ((player.celestials.ra.unlockBits >> i) % 2 === 1) {
      array.push(i);
    }
  }
  return array;
}

// eslint-disable-next-line complexity
export function beMigration(player) {
  player.auto.annihilation.multiplier = D(player.auto.annihilation.multiplier);
  player.auto.dimBoost.galaxies = D(player.auto.dimBoost.galaxies);
  player.auto.dimBoost.maxDimboosts = D(player.auto.dimBoost.maxDimboosts);
  player.auto.galaxy.maxGalaxies = D(player.auto.galaxy.maxGalaxies);
  player.auto.reality.glyph = D(player.auto.reality.glyph);
  player.auto.reality.shard = D(player.auto.reality.shard);
  player.blackHole[0].activations = D(player.blackHole[0].activations);
  player.blackHole[0].durationUpgrades = D(player.blackHole[0].durationUpgrades);
  player.blackHole[0].phase = D(player.blackHole[0].phase);
  player.blackHole[0].powerUpgrades = D(player.blackHole[0].powerUpgrades);
  player.blackHole[0].intervalUpgrades = D(player.blackHole[0].intervalUpgrades);
  player.blackHole[1].activations = D(player.blackHole[1].activations);
  player.blackHole[1].durationUpgrades = D(player.blackHole[1].durationUpgrades);
  player.blackHole[1].phase = D(player.blackHole[1].phase);
  player.blackHole[1].powerUpgrades = D(player.blackHole[1].powerUpgrades);
  player.blackHole[1].intervalUpgrades = D(player.blackHole[1].intervalUpgrades);
  player.blackHolePauseTime = D(player.blackHolePauseTime);
  player.celestials.effarig.relicShards = D(player.celestials.effarig.relicShards);
  player.celestials.enslaved.stored = D(player.celestials.enslaved.stored);
  player.celestials.enslaved.storedReal = D(player.celestials.enslaved.storedReal);
  player.celestials.enslaved.tesseracts = D(player.celestials.enslaved.tesseracts);
  player.celestials.laitela.darkEnergy = D(player.celestials.laitela.darkEnergy);
  player.celestials.laitela.darkMatterMult = D(player.celestials.laitela.darkMatterMult);
  player.celestials.laitela.entropy = D(player.celestials.laitela.entropy);
  player.celestials.laitela.fastestCompletion = D(player.celestials.laitela.fastestCompletion);
  player.celestials.laitela.singularities = D(player.celestials.laitela.singularities);
  player.celestials.pelle.realityShards = D(player.celestials.pelle.realityShards);
  player.celestials.pelle.rebuyables.antimatterDimensionMult = D(player.celestials.pelle.rebuyables.antimatterDimensionMult);
  player.celestials.pelle.rebuyables.galaxyGeneratorAdditive = D(player.celestials.pelle.rebuyables.galaxyGeneratorAdditive);
  player.celestials.pelle.rebuyables.galaxyGeneratorAntimatterMult = D(player.celestials.pelle.rebuyables.galaxyGeneratorAntimatterMult);
  player.celestials.pelle.rebuyables.galaxyGeneratorEPMult = D(player.celestials.pelle.rebuyables.galaxyGeneratorEPMult);
  player.celestials.pelle.rebuyables.galaxyGeneratorIPMult = D(player.celestials.pelle.rebuyables.galaxyGeneratorIPMult);
  player.celestials.pelle.rebuyables.galaxyGeneratorMultiplicative = D(player.celestials.pelle.rebuyables.galaxyGeneratorMultiplicative);
  player.celestials.pelle.rebuyables.galaxyPower = D(player.celestials.pelle.rebuyables.galaxyPower);
  player.celestials.pelle.rebuyables.glyphLevels = D(player.celestials.pelle.rebuyables.glyphLevels);
  player.celestials.pelle.rebuyables.infConversion = D(player.celestials.pelle.rebuyables.infConversion);
  player.celestials.pelle.rebuyables.timeSpeedMult = D(player.celestials.pelle.rebuyables.timeSpeedMult);
  player.celestials.pelle.remnants = D(player.celestials.pelle.remnants);
  player.celestials.pelle.rifts.decay.fill = D(player.celestials.pelle.rifts.decay.fill);
  player.celestials.pelle.rifts.paradox.fill = D(player.celestials.pelle.rifts.paradox.fill);
  player.celestials.pelle.rifts.recursion.fill = D(player.celestials.pelle.rifts.recursion.fill);
  player.celestials.pelle.rifts.vacuum.fill = D(player.celestials.pelle.rifts.vacuum.fill);
  for (let i = 0; i < 21; i++) {
    player.celestials.ra.alchemy[i].amount = D(player.celestials.ra.alchemy[i].amount);
  }
  player.celestials.ra.highestRefinementValue.dilation = D(player.celestials.ra.highestRefinementValue.dilation);
  player.celestials.ra.highestRefinementValue.effarig = D(player.celestials.ra.highestRefinementValue.effarig);
  player.celestials.ra.highestRefinementValue.infinity = D(player.celestials.ra.highestRefinementValue.infinity);
  player.celestials.ra.highestRefinementValue.power = D(player.celestials.ra.highestRefinementValue.power);
  player.celestials.ra.highestRefinementValue.replication = D(player.celestials.ra.highestRefinementValue.replication);
  player.celestials.ra.highestRefinementValue.time = D(player.celestials.ra.highestRefinementValue.time);
  player.celestials.ra.momentumTime = D(player.celestials.ra.momentumTime);
  player.celestials.ra.peakGamespeed = D(player.celestials.ra.peakGamespeed);
  player.celestials.ra.pets.effarig.memories = D(player.celestials.ra.pets.effarig.memories);
  player.celestials.ra.pets.effarig.memoryChunks = D(player.celestials.ra.pets.effarig.memoryChunks);
  player.celestials.ra.pets.enslaved.memories = D(player.celestials.ra.pets.enslaved.memories);
  player.celestials.ra.pets.enslaved.memoryChunks = D(player.celestials.ra.pets.enslaved.memoryChunks);
  player.celestials.ra.pets.teresa.memories = D(player.celestials.ra.pets.teresa.memories);
  player.celestials.ra.pets.teresa.memoryChunks = D(player.celestials.ra.pets.teresa.memoryChunks);
  player.celestials.ra.pets.v.memories = D(player.celestials.ra.pets.v.memories);
  player.celestials.ra.pets.effarig.v = D(player.celestials.ra.pets.v.memoryChunks);
  player.celestials.ra.unlocks = raFix(player);
  delete player.celestials.ra.unlockBits;
  // eslint-disable-next-line eqeqeq, max-statements-per-line
  player.celestials.teresa.bestAMSet = player.celestials.teresa.bestAMSet.map(n => updateGlyphs(n));
  player.celestials.teresa.lastRepeatediM = new Decimal();
  if (player.celestials.teresa.lastRepeatedMachines.gte("1e5000")) {
    player.celestials.teresa.lastRepeatedMachines = new Decimal("1e1000");
    player.celestials.teresa.lastRepeatediM = player.celestials.teresa.lastRepeatedMachines.div("1e10000");
  }
  player.celestials.v.runGlyphs = player.celestials.v.runGlyphs.map(n => n.map(g => updateGlyphs(g)));
  player.celestials.v.runRecords[1] = D(player.celestials.v.runRecords[1]);
  player.celestials.v.runRecords[2] = D(player.celestials.v.runRecords[2]);
  player.celestials.v.runRecords[3] = D(player.celestials.v.runRecords[3]);
  player.celestials.v.runRecords[4] = D(player.celestials.v.runRecords[4]);
  player.celestials.v.runRecords[5] = D(player.celestials.v.runRecords[5]);
  player.celestials.v.runRecords[7] = D(player.celestials.v.runRecords[7]);
  player.celestials.v.runRecords[8] = D(player.celestials.v.runRecords[8]);
  player.chall2Pow = D(player.chall2Pow);
  player.chall3Pow = D(player.chall3Pow);
  player.chall8TotalSacrifice = D(player.chall8TotalSacrifice);
  player.chall9TickspeedCostBumps = D(player.chall9TickspeedCostBumps);
  player.challenge.infinity.bestTimes = player.challenge.infinity.bestTimes.map(n => ((!(n instanceof Decimal) && n > 1.6e308) ? BEMAX : D(n)));
  player.challenge.normal.bestTimes = player.challenge.normal.bestTimes.map(n => ((!(n instanceof Decimal) && n > 1.6e308) ? BEMAX : D(n)));
  player.dilation.baseTachyonGalaxies = D(player.dilation.baseTachyonGalaxies);
  player.dilation.nextThreshold = D(player.dilation.nextThreshold);
  player.dilation.totalTachyonGalaxies = D(player.dilation.totalTachyonGalaxies);
  // eslint-disable-next-line no-negated-condition
  for (let i = 1; i < 14; i !== 3 ? i++ : i = 11) {
    player.dilation.rebuyables[i] = D(player.dilation.rebuyables[i]);
  }
  player.dimensionBoosts = D(player.dimensionBoosts);
  for (let i = 0; i < 8; i++) {
    player.dimensions.antimatter[i].bought = D(player.dimensions.antimatter[i].bought);
    player.dimensions.antimatter[i].costBumps = D(player.dimensions.antimatter[i].costBumps);
    player.dimensions.infinity[i].baseAmount = D(player.dimensions.infinity[i].baseAmount);
    player.dimensions.infinity[i].bought = D(player.dimensions.infinity[i].bought);
    player.dimensions.time[i].bought = D(player.dimensions.time[i].bought);
  }
  player.epmultUpgrades = D(player.epmultUpgrades);
  player.galaxies = D(player.galaxies);
  player.infinityRebuyables[0] = D(player.infinityRebuyables[0]);
  player.infinityRebuyables[1] = D(player.infinityRebuyables[1]);
  player.infinityRebuyables[2] = D(player.infinityRebuyables[2]);
  player.IPMultPurchases = D(player.IPMultPurchases);
  if (player.options.lastOpenSubtab[2] === 3) player.options.lastOpenSubtab[2] = 1;
  player.options.lnotation = "Stacked Scientific";
  player.partSimulatedReality = D(player.partSimulatedReality);
  player.realities = D(player.realities);
  player.reality.achTimer = D(player.reality.achTimer);
  player.reality.glyphs.active = player.reality.glyphs.active.map(n => updateGlyphs(n));
  player.reality.glyphs.inventory = player.reality.glyphs.inventory.map(n => updateGlyphs(n));
  for (const item in player.reality.glyphs.filter.types) {
    player.reality.glyphs.filter.types[item].rarity = D(player.reality.glyphs.filter.types[item].rarity);
    // Eplayer.reality.glyphs.filter.types[item].score = D(player.reality.glyphs.filter.types[item].score);
    player.reality.glyphs.filter.types[item].effectScores = {};
    const effectList = [];
    for (let i = 0; i < 30; i++) {
      if ((player.reality.glyphs.filter.types[item].specifiedMask >> i) % 2 === 1) {
      // eslint-disable-next-line no-loop-func, eqeqeq
        effectList.push(GlyphEffects.all.filter(e => e.intID == i)[0].id);
      }
      if (i <= 26 && GlyphEffects.all[i].glyphTypes.includes(item)) {
        player.reality.glyphs.filter.types[item].effectScores[GlyphEffects.all[i].id] = 0;
      }
      player.reality.glyphs.filter.types[item].specifiedMask = effectList;
    }
  }
  if (player.reality.glyphs.sac !== undefined) {
    player.reality.glyphs.sac.dilation = D(player.reality.glyphs.sac.dilation);
    player.reality.glyphs.sac.effarig = D(player.reality.glyphs.sac.effarig);
    player.reality.glyphs.sac.infinity = D(player.reality.glyphs.sac.infinity);
    player.reality.glyphs.sac.power = D(player.reality.glyphs.sac.power);
    player.reality.glyphs.sac.reality = D(player.reality.glyphs.sac.reality);
    player.reality.glyphs.sac.replication = D(player.reality.glyphs.sac.replication);
    player.reality.glyphs.sac.time = D(player.reality.glyphs.sac.time);
  }
  for (let i = 0; i < 7; i++) {
    player.reality.glyphs.sets[i].glyphs = player.reality.glyphs.sets[i].glyphs.map(n => updateGlyphs(n));
  }
  player.reality.iMcap = D(player.reality.iMcap);
  player.reality.imaginaryMachines = D(player.reality.imaginaryMachines);
  player.reality.lastAutoEC = D(player.reality.lastAutoEC);
  player.reality.perkPoints = D(player.reality.perkPoints);
  for (let i = 1; i <= 5; i++) {
    player.reality.rebuyables[i] = D(player.reality.rebuyables[i]);
  }
  player.records.bestEternity.realTime = D(player.records.bestEternity.realTime);
  if (player.records.bestEternity.realTime.gt("e308")) player.records.bestEternity.realTime = BEMAX;
  player.records.bestEternity.time = D(player.records.bestEternity.time);
  if (player.records.bestEternity.time.gt("e308")) player.records.bestEternity.time = BEMAX;
  player.records.bestInfinity.realTime = D(player.records.bestInfinity.realTime);
  if (player.records.bestInfinity.realTime.gt("e308")) player.records.bestInfinity.realTime = BEMAX;
  player.records.bestInfinity.time = D(player.records.bestInfinity.time);
  if (player.records.bestInfinity.time.gt("e308")) player.records.bestInfinity.time = BEMAX;
  player.records.bestReality.RMSet = player.records.bestReality.RMSet?.map(n => updateGlyphs(n));
  player.records.bestReality.RMminSet = player.records.bestReality.RMminSet?.map(n => updateGlyphs(n));
  player.records.bestReality.glyphLevel = D(player.records.bestReality.glyphLevel);
  player.records.bestReality.glyphLevelSet = player.records.bestReality.glyphLevelSet?.map(n => updateGlyphs(n));
  player.records.bestReality.glyphStrength = D(player.records.bestReality.glyphStrength);
  player.records.bestReality.imCapSet = player.records.bestReality.imCapSet?.map(n => updateGlyphs(n));
  player.records.bestReality.laitelaSet = player.records.bestReality.laitelaSet?.map(n => updateGlyphs(n));
  player.records.bestReality.realTime = D(player.records.bestReality.realTime);
  if (player.records.bestReality.realTime.gt("e308")) player.records.bestReality.realTime = BEMAX;
  player.records.bestReality.speedSet = player.records.bestReality.speedSet?.map(n => updateGlyphs(n));
  player.records.bestReality.time = D(player.records.bestReality.time);
  if (player.records.bestReality.time.gt("e308")) player.records.bestReality.time = BEMAX;
  player.records.previousRunRealTime = D(player.records.previousRunRealTime);
  player.records.realTimeDoomed = D(player.records.realTimeDoomed);
  player.records.realTimePlayed = D(player.records.realTimePlayed);
  player.records.trueTimePlayed = player.records.realTimePlayed.toNumber();
  for (let i = 0; i < 10; i++) {
    player.records.recentEternities[i][6] = D(player.records.recentEternities[i][5]);
    player.records.recentEternities[i][5] = player.records.recentEternities[i][4];
    player.records.recentEternities[i][4] = D(player.records.recentEternities[i][3]);
    player.records.recentEternities[i][3] = D(player.records.recentEternities[i][2]);
    player.records.recentEternities[i][2] = D(player.records.recentEternities[i][1]);
    player.records.recentEternities[i][1] = D(player.records.recentEternities[i][0]);
    if (player.records.recentEternities[i][5] instanceof Decimal) {
      player.records.recentEternities[i][5] = "";
    }
    player.records.recentInfinities[i][5] = player.records.recentInfinities[i][4];
    player.records.recentInfinities[i][4] = D(player.records.recentInfinities[i][3]);
    player.records.recentInfinities[i][3] = D(player.records.recentInfinities[i][2]);
    player.records.recentInfinities[i][2] = D(player.records.recentInfinities[i][1]);
    player.records.recentInfinities[i][1] = D(player.records.recentInfinities[i][0]);
    player.records.recentRealities[i][8] = D(player.records.recentRealities[i][7]);
    player.records.recentRealities[i][7] = D(player.records.recentRealities[i][6]);
    player.records.recentRealities[i][6] = D(player.records.recentRealities[i][5]);
    player.records.recentRealities[i][5] = player.records.recentRealities[i][4];
    player.records.recentRealities[i][4] = D(player.records.recentRealities[i][3]);
    player.records.recentRealities[i][3] = D(player.records.recentRealities[i][2]);
    player.records.recentRealities[i][2] = D(player.records.recentRealities[i][1]);
    player.records.recentRealities[i][1] = D(player.records.recentRealities[i][0]);
  }
  player.records.thisEternity.realTime = D(player.records.thisEternity.realTime);
  player.records.thisEternity.time = D(player.records.thisEternity.time);
  player.records.thisEternity.trueTime = player.records.thisEternity.realTime.toNumber();
  player.records.thisInfinity.realTime = D(player.records.thisInfinity.realTime);
  player.records.thisInfinity.time = D(player.records.thisInfinity.time);
  player.records.thisInfinity.trueTime = player.records.thisInfinity.realTime.toNumber();
  player.records.thisReality.realTime = D(player.records.thisReality.realTime);
  player.records.thisReality.time = D(player.records.thisReality.time);
  player.records.thisReality.trueTime = player.records.thisReality.realTime.toNumber();
  player.records.thisReality.bestRSmin = D(player.records.thisReality.bestRSmin);
  player.records.thisReality.bestRSminVal = D(player.records.thisReality.bestRSminVal);
  player.records.timePlayedAtBHUnlock = D(player.records.timePlayedAtBHUnlock);
  player.records.totalTimePlayed = D(player.records.totalTimePlayed);
  player.replicanti.boughtGalaxyCap = D(player.replicanti.boughtGalaxyCap);
  player.replicanti.chance = D(player.replicanti.chance);
  player.replicanti.galaxies = D(player.replicanti.galaxies);
  player.replicanti.interval = D(player.replicanti.interval);
  player.replicanti.timer = D(player.replicanti.timer);
  player.requirementChecks.reality.slowestBH = D(player.requirementChecks.reality.slowestBH);
  player.requirementChecks.reality.maxID1 = D(player.requirementChecks.reality.maxID1);
  player.totalTickGained = D(player.totalTickGained);
  player.totalTickBought = D(player.totalTickBought);
}