import { DC } from "../../constants";
import { Quotes } from "../quotes";

import { DarkMatterDimensions } from "./dmd";

export const Laitela = {
  displayName: "Lai'tela",
  possessiveName: "Lai'tela's",
  get celestial() {
    return player.celestials.laitela;
  },
  get isUnlocked() {
    return ImaginaryUpgrade(15).isBought;
  },
  initializeRun() {
    clearCelestialRuns();
    this.celestial.run = true;
  },
  get isRunning() {
    return this.celestial.run;
  },
  get difficultyTier() {
    return player.celestials.laitela.difficultyTier;
  },
  set difficultyTier(tier) {
    player.celestials.laitela.difficultyTier = tier;
  },
  get maxAllowedDimension() {
    return 8 - this.difficultyTier;
  },
  get isFullyDestabilized() {
    return Laitela.maxAllowedDimension === 0;
  },
  get continuumUnlocked() {
    return ImaginaryUpgrade(15).isBought && !Pelle.isDisabled("continuum");
  },
  get continuumActive() {
    return this.continuumUnlocked && !player.auto.disableContinuum && !Pelle.isDisabled("continuum");
  },
  setContinuum(x) {
    player.auto.disableContinuum = !x;
    // If continuum is now not disabled (i.e. is enabled) we update the relevant requirement check.
    if (!player.auto.disableContinuum) {
      player.requirementChecks.reality.noContinuum = false;
    }
  },
  get matterExtraPurchaseFactor() {
    return Decimal.pow(Currency.darkMatter.max.add(1).max(1).log10().div(50), 0.4)
      .times((SingularityMilestone.continuumMult.effectOrDefault(DC.D0)).add(1)).div(2).add(1);
  },
  get realityReward() {
    return Decimal.clampMin(Decimal.pow(100, this.difficultyTier)
      .mul(Decimal.pow(player.celestials.laitela.fastestCompletion.recip().mul(360), 2)), 1);
  },
  // Note that entropy goes from 0 to 1, with 1 being completion
  get entropyGainPerSecond() {
    return Decimal.clamp(Decimal.pow(Currency.antimatter.value.add(1).log10().div(1e11), 2), 0, 100).div(200);
  },
  get darkMatterMultGain() {
    return Decimal.pow(Currency.darkMatter.value.dividedBy(this.annihilationDMRequirement)
      .plus(1).log10(), 1.5).mul(ImaginaryUpgrade(21).effectOrDefault(1));
  },
  get darkMatterMult() {
    return this.celestial.darkMatterMult;
  },
  get darkMatterMultRatio() {
    return (this.celestial.darkMatterMult.add(this.darkMatterMultGain)).div(this.celestial.darkMatterMult);
  },
  get annihilationUnlocked() {
    return ImaginaryUpgrade(19).isBought;
  },
  get annihilationDMRequirement() {
    return 1e60;
  },
  get canAnnihilate() {
    return Laitela.annihilationUnlocked && Currency.darkMatter.gte(this.annihilationDMRequirement);
  },
  annihilate(force) {
    if (!force && !this.canAnnihilate) return false;
    this.celestial.darkMatterMult = this.celestial.darkMatterMult.add(this.darkMatterMultGain);
    DarkMatterDimensions.reset();
    Laitela.quotes.annihilation.show();
    Achievement(176).unlock();
    return true;
  },
  // Max purchase interval, then DM, then DE, working highest tier down in each case. No reason for the order.
  maxAllDMDimensions(maxTier) {
    // Note that tier is 1-indexed
    const unlockedDimensions = DarkMatterDimensions.all
      .filter(d => d.isUnlocked && d.tier <= maxTier);
    for (let i = 0; i < maxTier; i++) {
      unlockedDimensions[i].buyManyInterval(Infinity);
    }
    for (let i = 0; i < maxTier; i++) {
      unlockedDimensions[i].buyManyPowerDM(Infinity);
    }
    for (let i = 0; i < maxTier; i++) {
      unlockedDimensions[i].buyManyPowerDE(Infinity);
    }
  },
  reset() {
    this.annihilate(true);
    this.celestial.darkMatterMult = DC.D1;
    Currency.darkMatter.max = DC.D1;
    Currency.darkMatter.reset();
    Currency.singularities.reset();
    this.celestial.fastestCompletion = new Decimal(3600);
    this.celestial.difficultyTier = 0;
    this.celestial.singularityCapIncreases = DC.D0;
  },
  quotes: Quotes.laitela,
  symbol: "ᛝ"
};

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  if (Tab.celestials.laitela.isOpen) Laitela.quotes.unlock.show();
});
