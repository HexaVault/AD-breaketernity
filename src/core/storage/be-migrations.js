/* eslint-disable max-len */
function D(x) {
  return new Decimal(x);
}

const BEMAX = new Decimal("10^^9000000000000000");

function updateGlyphs(glyph) {
  if (glyph.effects instanceof Array) return;
  let intIDindex = (glyph.isGenerated === true ? 32 : 0);
  const effectList = [];
  for (let i = 0; i < 32; i++) {
    if (glyph.effects >> i % 2 === 1) {
      // eslint-disable-next-line no-loop-func
      effectList.push(GlyphEffects.all.filter(e => e.intID = intIDindex)[0].id);
    }
    intIDindex += 1;
  }
  glyph.effects = effectList;
  delete glyph.isGenerated;
  glyph.level = D(glyph.level);
  glyph.rawLevel = D(glyph.rawLevel);
  glyph.strength = D(glyph.strength);
}

function repForArray(array, func) {
  newArray = [];
  for (i = 0; i < array.length; i++) {
    newArray.push(func(array[i]));
  }
  return newArray;
}

export function beMigration(player) {
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
  // eslint-disable-next-line eqeqeq, max-statements-per-line
  if (player.celestials.teresa.bestAMSet != []) { repForArray(player.celestials.teresa.bestAMSet, updateGlyphs); }
  player.celestials.teresa.lastRepeatedMachines = new Decimal();
  player.celestials.teresa.lastRepeatediM = new Decimal();
  if (player.lastRepeatedMachines.gte("1e5000")) {
    player.celestials.teresa.lastRepeatedMachines = new Decimal("1e1000");
    player.celestials.teresa.lastRepeatediM = player.celestials.teresa.lastRepeatedMachines.div("1e10000");
  }
  player.chall2pow = D(chall2pow);
  player.chall3pow = D(chall3pow);
  player.chall8TotalSacrifice = D(player.chall8TotalSacrifice);
  player.chall9TickspeedCostBumps = D(player.chall9TickspeedCostBumps);
  player.challenge.infinity.bestTimes = repForArray(player.challenge.infinity.bestTimes, n => (n > 1.6e308 ? BEMAX : D(n)));
  player.challenge.normal.bestTimes = repForArray(player.challenge.normal.bestTimes, n => (n > 1.6e308 ? BEMAX : D(n)));
  player.dilation.baseTachyonGalaxies = D(player.dilation.baseTachyonGalaxies);
  player.dilation.nextThreshold = D(player.dilation.nextThreshold);
  player.dilation.totalTachyonGalaxies = D(player.dilation.totalTachyonGalaxies);
  for (let i = 1; i < 14; i < 3 ? i++ : i = 11) {
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
  if (player.options.lastOpenSubtab[2] === 3) player.options.lastOpenSubtab[2] = 1;
  player.options.lnotation = "Stacked Scientific";
  player.partSimulatedReality = D(player.partSimulatedReality);
  player.realities = D(player.realities);
  player.reality.achTimer = D(player.reality.achTimer);
  player.reality.glyphs.active = repForArray(player.reality.glyphs.active, updateGlyphs);
  player.reality.glyphs.inventory = repForArray(player.reality.glyphs.inventory, updateGlyphs);
  player.reality.sac.dilation = D(player.reality.sac.dilation);
  player.reality.sac.effarig = D(player.reality.sac.effarig);
  player.reality.sac.infinity = D(player.reality.sac.infinity);
  player.reality.sac.power = D(player.reality.sac.power);
  player.reality.sac.reality = D(player.reality.sac.reality);
  player.reality.sac.replication = D(player.reality.sac.replication);
  player.reality.sac.time = D(player.reality.sac.time);
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
  player.records.bestReality.RMSet = repForArray(player.records.bestReality.RMSet, updateGlyphs);
  player.records.bestReality.RMminSet = repForArray(player.records.bestReality.RMminSet, updateGlyphs);
  player.records.bestReality.bestEP = repForArray(player.records.bestReality.bestEP, updateGlyphs);
  player.records.bestReality.glyphLevel = D(player.records.bestReality.glyphLevel);
  player.records.bestReality.glyphLevelSet = repForArray(player.records.bestReality.glyphLevelSet, updateGlyphs);
  player.records.bestReality.glyphStrength = D(player.records.bestReality.glyphStrength);
  player.records.bestReality.imCapSet = repForArray(player.records.bestReality.imCapSet, updateGlyphs);
  player.records.bestReality.laitelaSet = repForArray(player.records.bestReality.laitelaSet, updateGlyphs);
  player.records.bestReality.realTime = D(player.records.bestReality.realTime);
  if (player.records.bestReality.realTime.gt("e308")) player.records.bestReality.realTime = BEMAX;
  player.records.bestReality.speedSet = repForArray(player.records.bestReality.speedSet, updateGlyphs);
  player.records.bestReality.time = D(player.records.bestReality.time);
  if (player.records.bestReality.time.gt("e308")) player.records.bestReality.time = BEMAX;
  player.records.previousRunRealTime = D(player.records.previousRunRealTime);
  player.records.realTimeDoomed = D(player.records.realTimeDoomed);
  player.records.realTimePlayed = D(player.records.realTimePlayed);
}