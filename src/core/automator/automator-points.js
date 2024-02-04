export const AutomatorPoints = {
  get perks() {
    return Perks.all.filter(p => p.automatorPoints);
  },

  // This also rejects rebuyables, where automatorPoints is undefined
  get upgrades() {
    return RealityUpgrades.all.filter(p => p.automatorPoints);
  },

  get pointsFromPerks() {
    return this.perks
      .filter(p => p.isBought)
      .map(p => p.automatorPoints)
      .sum().toNumber();
  },

  get pointsFromUpgrades() {
    return this.upgrades
      .filter(p => p.isBought)
      .map(p => p.automatorPoints)
      .sum().toNumber();
  },

  get pointsFromOther() {
    return GameDatabase.reality.automator.otherAutomatorPoints.map(s => s.automatorPoints()).sum().toNumber();
  },

  get totalPoints() {
    return this.pointsFromPerks + this.pointsFromUpgrades + this.pointsFromOther;
  },

  get pointsForAutomator() {
    return 100;
  }
};
