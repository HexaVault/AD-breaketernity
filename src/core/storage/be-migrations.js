/* eslint-disable max-len */
function D(x) {
  return new Decimal(x);
}

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
  if (player.celestials.teresa.bestAMSet != []) { updateGlyphs(player.celestials.teresa.bestAMSet); }
  player.celestials.lastRepeatedMachines = new Decimal();
  // Temp if player.lastRe
}