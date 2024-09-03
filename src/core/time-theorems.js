import { DC } from "./constants";
import { Currency } from "./currency";

/**
 * @abstract
 */
export class TimeTheoremPurchaseType {
  /**
  * @abstract
  */
  get amount() { throw new NotImplementedError(); }

  /**
  * @abstract
  */
  set amount(value) { throw new NotImplementedError(); }

  add(amount) { this.amount = this.amount.add(amount); }

  /**
  * @abstract
  */
  get currency() { throw new NotImplementedError(); }

  get cost() { return this.costBase.times(this.costIncrement.pow(this.amount)); }

  /**
   * @abstract
   */
  get costBase() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  get costIncrement() { throw new NotImplementedError(); }

  get bulkPossible() {
    if (Perk.ttFree.canBeApplied) {
      return this.currency.value.divide(this.cost).max(1).log10().div(this.costIncrement.max(1).log10()).add(1).floor();
    }
    return Decimal.affordGeometricSeries(this.currency.value, this.cost, this.costIncrement, 0);
  }

  // Note: This is actually just the cost of the largest term of the geometric series. If buying EP without the
  // perk that makes them free, this will be incorrect, but the EP object already overrides this anyway
  bulkCost(amount) {
    return this.cost.times(this.costIncrement.pow(amount.sub(1)));
  }

  purchase(bulk = false) {
    if (Currency.timeTheorems.gte(115) && Pelle.isDoomed) PelleStrikes.ECs.trigger();
    if (!this.canAfford) return false;

    if (!bulk) {
      if (!Perk.ttFree.canBeApplied && this.currency.layer <= 1) this.currency.subtract(this.cost);
      Currency.timeTheorems.add(1);
      this.add(1);
      player.requirementChecks.reality.noPurchasedTT = false;
      if (Currency.timeTheorems.gte(115) && Pelle.isDoomed) PelleStrikes.ECs.trigger();
      return true;
    }
    const canBuy = this.currency.value.sub(this.costBase)
      .clampMin(this.costIncrement.recip()).log(this.costIncrement);
    let amntPur = canBuy.sub(this.amount).floor();
    // We can definitely afford x - 1
    amntPur = amntPur.sub(1).max(0);
    Currency.timeTheorems.add(amntPur);
    this.add(amntPur);
    if (!Perk.ttFree.canBeApplied && this.currency.layer <= 1 && amntPur.neq(0)) this.currency.subtract(this.cost);
    // Can we afford another? If not, just return that we definitely bought some already
    if (this.currency.lt(this.cost) && amntPur.neq(0)) return true;
    Currency.timeTheorems.add(1);
    if (!Perk.ttFree.canBeApplied && this.currency.layer <= 1) this.currency.subtract(this.cost);
    this.add(1);
    player.requirementChecks.reality.noPurchasedTT = false;
    if (Currency.timeTheorems.gte(115) && Pelle.isDoomed) PelleStrikes.ECs.trigger();
    return true;
  }

  get canAfford() {
    return this.currency.gte(this.cost) && !player.eternities.eq(0);
  }

  reset() {
    this.amount = DC.D0;
  }
}

TimeTheoremPurchaseType.am = new class extends TimeTheoremPurchaseType {
  get amount() { return player.timestudy.amBought; }
  set amount(value) { player.timestudy.amBought = value; }

  get currency() { return Currency.antimatter; }
  get costBase() { return DC.E20000; }
  get costIncrement() { return DC.E20000; }
}();

TimeTheoremPurchaseType.ip = new class extends TimeTheoremPurchaseType {
  get amount() { return player.timestudy.ipBought; }
  set amount(value) { player.timestudy.ipBought = value; }

  get currency() { return Currency.infinityPoints; }
  get costBase() { return DC.D1; }
  get costIncrement() { return DC.E100; }
}();

TimeTheoremPurchaseType.ep = new class extends TimeTheoremPurchaseType {
  get amount() { return player.timestudy.epBought; }
  set amount(value) { player.timestudy.epBought = value; }

  get currency() { return Currency.eternityPoints; }
  get costBase() { return DC.D1; }
  get costIncrement() { return DC.D2; }

  bulkCost(amount) {
    if (Perk.ttFree.canBeApplied || this.currency.layer > 1) return this.cost.times(this.costIncrement.pow(amount));
    return this.cost.times(this.costIncrement.pow(amount.sub(1)));
  }
}();

export const TimeTheorems = {
  checkForBuying(auto) {
    if (PlayerProgress.realityUnlocked() || TimeDimension(1).bought.neq(0)) return true;
    if (!auto) Modal.message.show(`You need to buy at least ${formatInt(1)} Time Dimension before you can purchase
      Time Theorems.`, { closeEvent: GAME_EVENT.REALITY_RESET_AFTER });
    return false;
  },

  buyOne(auto = false, type) {
    if (!this.checkForBuying(auto)) return DC.D0;
    if (!TimeTheoremPurchaseType[type].purchase(false)) return DC.D0;
    return DC.D1;
  },

  // This is only called via automation and there's no manual use-case, so we assume auto is true and simplify a bit
  buyOneOfEach() {
    if (!this.checkForBuying(true)) return;
    this.buyOne(true, "am");
    this.buyOne(true, "ip");
    this.buyOne(true, "ep");
  },

  buyMax(auto = false) {
    if (!this.checkForBuying(auto)) return;
    TimeTheoremPurchaseType.am.purchase(true);
    TimeTheoremPurchaseType.ip.purchase(true);
    TimeTheoremPurchaseType.ep.purchase(true);
  },

  totalPurchased() {
    return TimeTheoremPurchaseType.am.amount
      .add(TimeTheoremPurchaseType.ip.amount)
      .add(TimeTheoremPurchaseType.ep.amount);
  },

  calculateTimeStudiesCost() {
    let totalCost = TimeStudy.boughtNormalTS()
      .map(ts => ts.cost)
      .reduce(Decimal.sumReducer, new Decimal());
    const ecStudy = TimeStudy.eternityChallenge.current();
    if (ecStudy !== undefined) {
      totalCost = totalCost.add(ecStudy.cost);
    }
    if (Enslaved.isRunning && player.celestials.enslaved.hasSecretStudy) totalCost = totalCost.sub(100);
    return totalCost;
  }
};
