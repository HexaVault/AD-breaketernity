import { log as lngamma } from "gamma";

import { DC } from "./constants";

/* eslint-disable no-use-before-define */
/* eslint-disable max-params */

window.LOG10_MAX_VALUE = Math.log10(Number.MAX_VALUE);
window.DLOG10_MAXNUM = Decimal.log10(Number.MAX_VALUE);
window.LN_SQRT_2_PI = 0.5 * Math.log(2 * Math.PI);
window.LOG10_2 = Math.log10(2);
window.LOG10_E = Math.log10(Math.E);

Math.PI_2 = Math.PI * 2;

/**
 * This is a file for general math utilities that can be used by many mechanics
 */

/**
 * @param {Decimal|Number} a Variable before x^2 in ax^2 + bx + c = 0
 * @param {Decimal|Number} a Variable before x in ax^2 + bx + c = 0
 * @param {Decimal|Number} c Variable after x in ax^2 + bx + c = 0
 * @param {Boolean} n Should the root be subtracted to -b?
 * @returns {Decimal}
*/
window.decimalQuadraticSolution = function decimalQuadraticSolution(a, b, c, n = false) {
  const divsr = a.times(2);
  const nb = b.neg();
  const lroot = b.pow(2);
  const rroot = a.times(c).times(4);
  const froot = lroot.sub(rroot).sqrt();
  const top = n ? nb.sub(froot) : nb.add(froot);
  return top.div(divsr);
};

/**
 * @param {Decimal|Number} a Variable before x^3 in ax^3 + bx^2 + cx + d = 0
 * @param {Decimal|Number} b Variable before x^2 in ax^3 + bx^2 + cx + d = 0
 * @param {Decimal|Number} c Variable before x in ax^3 +  bx^2 + cx + d = 0
 * @param {Decimal|Number} d Variable after x in ax^3 +  bx^2 + cx + d = 0
 * @param {Boolean} n Should the square root subtract?
 * @returns {Decimal}
*/
window.decimalCubicSolution = function decimalCubicSolution(a, b, c, d, n = false) {
  const delta0 = b.pow(2).sub(a.times(3).times(c));
  const delta1 = b.pow(3).times(2).sub(a.times(b).times(c).times(9)).add(a.pow(2).times(d).times(27));
  const ne = Decimal.sqrt(delta1.pow(2).sub(delta0.pow(3).times(4))).mul(n ? -1 : 1);
  const C = Decimal.cbrt(delta1.add(ne).div(2));
  const x = DC.D1.div(a.times(3)).neg().times(b.add(C).add(delta0.div(C)));
  return x;
};

/**
 * @param {Decimal|Number} b Variable before x in ax^3 + bx + c = 0
 * @param {Decimal|Number} c Variable after x in ax^3 + bx + c = 0
 * @returns {Decimal}
*/
window.decimalDepressedCubicSolution = function decimalDepressedCubicSolution(b, c) {
  const u1 = Decimal.cbrt(c.neg().div(2).add(Decimal.sqrt(c.pow(2).div(4).add(b.pow(3).div(27)))));
  const u2 = Decimal.cbrt(c.neg().div(2).sub(Decimal.sqrt(c.pow(2).div(4).add(b.pow(3).div(27)))));
  return u1.add(u2);
};

/**
 * @typedef {Object} bulkBuyBinarySearch_result
 * @property {number} quantity amount purchased (relative)
 * @property {Decimal} purchasePrice amount that needs to be paid to get that
 */


// Please, for the love of god, do not use this for ANY equation that is decimal.
// BBBS is far too weak and its worth just writing inverses (or picking an equation that has inverses)
// This is simply because you would need to run cost equations 30+ times which is wasteful
// Again, avoid if possible.

/**
 * bulkBuyBinarySearch is a helper for bulk buyers of non-linear prices. If the price of
 * a thing is f(n), it's hard to figure out how much of it can be bought without an inverse
 * of f. This helper starts at some n0, and then searches forward in powers of 2 until it
 * finds a value that is not affordable. After that, it performs a binary search to figure
 * out how much can actually be bought. Returns an object with a quantity and price, or
 * null if nothing can be bought
 * NOTE: this will not work with slowly increasing prices. This makes the assumption that
 * if you can afford purchase N, you can afford the combined cost of everything before N
 * (it does check and make sure you can afford all of that put together. See below in code
 * for details)
 * @param {Decimal} money Amount of currency available
 * @param {Object} costInfo cost parameters:
 * @param {function(number): Decimal} costInfo.costFunction price of the n'th purchase (starting from 0)
 * @param {Decimal} [costInfo.firstCost] Cost of the next purchase; this is usually available/cached. Will
 *   be calculated from costFunction if not provided.
 * @param {boolean} [costInfo.cumulative] (Defaults to true) specifies whether one must pay a cumulative
 *   cost or just the highest cost.
 * @param {number} alreadyBought amount already purchased
 * @returns {bulkBuyBinarySearch_result | null}
 */
window.bulkBuyBinarySearch = function bulkBuyBinarySearch(money, costInfo, alreadyBought, ignoreWarning = false) {
  // eslint-disable-next-line no-console
  if (!ignoreWarning) console.log("Bulk Buy Binary Search was used");
  const costFunction = costInfo.costFunction;
  const firstCost = costInfo.firstCost === undefined ? costFunction(alreadyBought) : costInfo.firstCost;
  const isCumulative = costInfo.cumulative === undefined ? true : costInfo.cumulative;
  if (money.lt(firstCost)) return null;
  // Attempt to find the max we can purchase. We know we can buy 1, so we try 2, 4, 8, etc
  // to figure out the upper limit
  let cantBuy = 1;
  let nextCost;
  do {
    cantBuy *= 2;
    nextCost = costFunction(alreadyBought + cantBuy - 1);
  } while (money.gte(nextCost));
  // Deal with the simple case of buying just one
  if (cantBuy === 2) {
    return { quantity: 1, purchasePrice: firstCost };
  }
  // The amount we can actually buy is in the interval [canBuy/2, canBuy), we do a binary search
  // to find the exact value:
  let canBuy = cantBuy / 2;
  if (cantBuy > Number.MAX_SAFE_INTEGER) throw new Error("Overflow in binary search");
  while (cantBuy - canBuy > 1) {
    const middle = Math.floor((canBuy + cantBuy) / 2);
    if (money.gte(costFunction(alreadyBought + middle - 1))) {
      canBuy = middle;
    } else {
      cantBuy = middle;
    }
  }
  const baseCost = costFunction(alreadyBought + canBuy - 1);
  if (!isCumulative) {
    return { quantity: canBuy, purchasePrice: baseCost };
  }
  let otherCost = DC.D0;
  // Account for costs leading up to that purchase; we are basically adding things
  // up until they are insignificant
  let count = 0;
  for (let i = canBuy - 1; i > 0; --i) {
    const newCost = otherCost.plus(costFunction(alreadyBought + i - 1));
    if (newCost.eq(otherCost)) break;
    otherCost = newCost;
    if (++count > 1000) throw new Error("unexpected long loop (buggy cost function?)");
  }
  let totalCost = baseCost.plus(otherCost);
  // Check the purchase price again
  if (money.lt(totalCost)) {
    --canBuy;
    // Since prices grow rather steeply, we can safely assume that we can, indeed, buy
    // one less (e.g. if prices were A, B, C, D, we could afford D, but not A+B+C+D; we
    // assume we can afford A+B+C because A+B+C < D)
    totalCost = otherCost;
  }
  return { quantity: canBuy, purchasePrice: totalCost };
};

/**
 * @typedef {Object} dBBBS_result
 * @property {Decimal} quantity amount purchased (relative)
 * @property {Decimal} purchasePrice amount that needs to be paid to get that
 */

/**
 * dBBBS is the decimal version of bulkBuyBinarySearch
 * Ironically I think this code might be better then bbbs for values that increment slowly due to the last bit of code,
 * but this is also decimal so I highly advise against that. This code also doesnt work properly, but the whole code
 * no longer uses bbbs (moved to inverses). See BBBS note - dont use this if possible (especially dont use this one).
 * @param {Decimal} money Amount of currency available
 * @param {Object} costInfo cost parameters:
 * @param {function(Decimal): Decimal} costInfo.costFunction price of the n'th purchase (starting from 0)
 * @param {Decimal} [costInfo.firstCost] Cost of the next purchase; this is usually available/cached. Will
 *   be calculated from costFunction if not provided.
 * @param {boolean} [costInfo.cumulative] (Defaults to true) specifies whether one must pay a cumulative
 *   cost or just the highest cost.
 * @param {Decimal} alreadyBought amount already purchased
 * @returns {dBBBS_result | null}
 */
window.dBBBS = function dBBBS(money, costInfo, alreadyBought) {
  const costFunction = costInfo.costFunction;
  const firstCost = costInfo.firstCost === undefined ? costFunction(alreadyBought) : costInfo.firstCost;
  const isCumulative = costInfo.cumulative === undefined ? true : costInfo.cumulative;
  if (money.lt(firstCost)) return null;
  // Attempt to find the max we can purchase. We know we can buy 1, so we try 2, 4, 8, etc
  // to figure out the upper limit
  let canBuy = new Decimal(15.95424252);
  // Have a mag at 15.95424252 - Meaning mags wont drop for next func, never internally used
  let totalCost = new Decimal(0);
  let cantBuy = Decimal.tetrate(10, 9e15).times(9e15 - 1);
  let val = new Decimal(15.95424252);
  val.layer = Math.floor((cantBuy.layer + canBuy.layer) / 2);
  while (val.layer !== cantBuy.layer) {

    const v = (costFunction(val).gt(money));
    val.layer = Math.ceil((cantBuy.layer + canBuy.layer) / 2);
    // Stupid hack, i know, but if we dont do this the entire bit of code loops forever
    const va = (costFunction(val).gt(money));
    val.layer = Math.floor((cantBuy.layer + canBuy.layer) / 2);

    if (v || va) {
      cantBuy.layer = Math.floor((cantBuy.layer + canBuy.layer) / 2);
    }

    if (!(v || va)) {
      canBuy.layer = Math.floor((cantBuy.layer + canBuy.layer) / 2);
    }

    val.layer = Math.floor((cantBuy.layer + canBuy.layer) / 2);
  }

  canBuy = new Decimal(0);
  // We want to see mag to 0, and since the code doesnt actually care about the code
  cantBuy = new Decimal(9e15 - 1);
  val.mag = ((cantBuy.mag + canBuy.mag) / 2);
  // No need to round till the end
  while (cantBuy.mag !== val.mag) {

    const v = (costInfo.costFunction(val).gt(money));

    if (v) {
      cantBuy.mag = (cantBuy.layer + canBuy.layer) / 2;
    }

    if (!v) {
      canBuy.mag = (cantBuy.layer + canBuy.layer) / 2;
    }

    val.mag = ((cantBuy.mag + canBuy.mag) / 2);
    // No need to round till the end
  }

  val = canBuy.floor();
  if (isCumulative) {
    // If the layer > 0 this is far too insignificant to give a fuck about
    if (canBuy.layer === 0) {
      // Go 100 purchases back or to 0. Anything lower shouldnt be significant
      val = Decimal.max(canBuy.sub(100), 0);
      while (val.neq(canBuy) && totalCost.add(costInfo.costFunction(val)).gt(money)) {
        totalCost = totalCost.add(costInfo.costFunction(val));
        val = val.add(1);
      }
    }
  }
  val.sub(alreadyBought);
  if (val.eq(canBuy)) totalCost = costInfo.costFunction(canBuy);
  return { quantity: canBuy, purchasePrice: totalCost };
};

/**
 * LinearMultiplierScaling performs calculations for multipliers that scale up
 * linearly. The simplest case you might consider could be a factorial -- or something
 * much slower, like 2 * 2.01 * 2.02 * 2.03 * ...
 * In terms of accuracy, it's better for slower growing multipliers than fast. For
 * example, with a factorial setup, it evaluates 11! as 39826281.18738219 rather than 39916800
 * The ratio between the estimated 10! and 11! is 10.99999474474497 which is pretty good.
 * For base = 2, growth = 0.1, after 10 purchases, the result is 7268.488254368145, rather
 * than 7268.490028799995. After 100 purchases, it's 4.582662e+79 rather than
 * 4.582664e+79.
 * Note: this doesn't do well with small initial multipliers (close to 1). 1.01 is about low
 * as it's reasonable to go.
 */
window.LinearMultiplierScaling = class LinearMultiplierScaling {
  /**
   * Construct the helper object, which can be invoked for various calculations
   * @param {number} baseRatio The first multiplier
   * @param {number} growth The growth rate; multiplier after purchase N, starting at 0, is baseRatio + N * growth
   */
  constructor(baseRatio, growth) {
    this.baseRatio = baseRatio;
    this.growth = growth;
  }

  /**
   * Multiply both the base ratio and the growth rate by the specified factor
   * @param {number} ratio
   * @returns this object for easy chaining
   */
  scale(ratio) {
    this.baseRatio *= ratio;
    this.growth *= ratio;
    return this;
  }

  /**
   * Shift by the specified number of purchases. For example, if you set up 2, 0.1, but you
   * want the first scale factor to be 2.1, you could shift by 1
   * @param {number} count number of purchases to shift by
   * @returns this
   */
  shift(count) {
    this.baseRatio += this.growth * count;
    return this;
  }

  /**
   * Find the combined multiplier after N purchases. N = 0 means a multiplier of 1 -- since no
   * purchases have been made, no scaling has been applied. N = 1 is baseRatio, N=2 gives
   * baseRatio * (baseRatio + growth), and so on. This is done using a corrected integral
   * approximation
   * @param {number} count number of purchases that have happened
   * @returns {number} the natural log of the combined multiplier
   */
  logTotalMultiplierAfterPurchases(count) {
    if (count === 0) return 0;
    const k = this.growth / this.baseRatio;
    const u = k * count;
    return (1 / k + count - 0.5) * Math.log1p(u) + count * (Math.log(this.baseRatio) - 1) - k * u / (12 * (1 + u));
  }

  /**
   * Invert the function given a combined multiplier. This doesn't do any rounding (so you
   * can choose how to handle that).
   * @param {number} logMult natural logarithm of combined multiplier
   */
  purchasesForLogTotalMultiplier(logMult) {
    if (this.baseRatio < 1.01) throw new Error("Ratio is too small for good calculations");
    const Lb = Math.log(this.baseRatio);
    const k = this.growth / this.baseRatio;
    // Final refinement step, applying 2nd order iteration directly to the formula of
    // logTotalMultiplierAfterPurchases
    const refineFinal = g => {
      const u = k * g;
      const Lg = Math.log1p(u);
      const v = 0.5 * k / (1 + u);
      const fVal = (1 / k + g - 0.5) * Lg + g * (Lb - 1) - (logMult + v * u / 6);
      const fDeriv = Lg + Lb - v * (v / 3 + 1);
      const fD2 = v * (2 + v * (2 + v / 3));
      const delta1 = fVal / fDeriv;
      return g - 2 * delta1 / (1 + Math.sqrt(1 - 2 * delta1 * fD2 / fDeriv));
    };
    // We calculate an initial estimate, assuming that the price doesn't increase:
    const g0 = logMult / Lb;
    // If the growth rate is really slow and there's not many steps, this is great guess
    // the other method (below) doesn't do well in that case.
    if (k * g0 < 0.01) return refineFinal(refineFinal(g0));
    const rhs = this.growth * logMult + this.baseRatio * (Lb - 1);

    // First, we make a good guess at a solution, based on an approximation of the sum sas an
    // uncorrected integral; these parameters came from an optimization. We are solving for
    // the value of base + x * growth - 1 here
    const K1 = 0.183709519164226;
    const K2 = 0.693791942633232;
    const K3 = 0.049293492810849;
    const y = Math.sqrt(2 * (rhs + 1));
    const h0 = y * (1 + K1 * y) / (1 + K2 * Math.log1p(K3 * y));

    // Apply a refinement step; this also shifts the answer by 1
    const h1 = (1 + h0 + rhs) / Math.log1p(h0);

    // At this point we should have a pretty solid guess -- enough that this calcuolation
    // should be pretty accurate; the final refinement
    const g1 = (h1 - this.baseRatio) / this.growth;
    return refineFinal(refineFinal(g1));
  }

  /**
   * Manual calculation, for testing purposes
   * @param {number} count
   */
  logTotalMultiplierAfterPurchasesBaseline(count) {
    let logMult = 0;
    const k = this.growth / this.baseRatio;
    for (let x = 0; x < count; ++x) logMult += Math.log1p(k * x);
    return logMult + count * Math.log(this.baseRatio);
  }
};

// This function is used once. I get why its seperated, but why make it a window function not a local one?????
window.getCostWithLinearCostScaling = function getCostWithLinearCostScaling(
  amountOfPurchases, costScalingStart, initialCost, costMult, costMultGrowth
) {
  const preScalingPurchases = Math.max(0, Math.floor(Math.log(costScalingStart / initialCost) / Math.log(costMult)));
  const preScalingCost = Math.ceil(Math.pow(costMult, Math.min(preScalingPurchases, amountOfPurchases)) * initialCost);
  const scaling = new LinearMultiplierScaling(costMult, costMultGrowth);
  const postScalingCost = Math.exp(scaling.logTotalMultiplierAfterPurchases(
    Math.max(0, amountOfPurchases - preScalingPurchases)));
  return preScalingCost * postScalingCost;
};

// Using the same arguments as getCostWithLinearCostScaling() above, do a binary search for the first purchase with a
// cost of Infinity.
window.findFirstInfiniteCostPurchase = function findFirstInfiniteCostPurchase(
  costScalingStart, initialCost, costMult, costMultGrowth
) {
  let upper = 1;
  while (Number.isFinite(getCostWithLinearCostScaling(upper,
    costScalingStart, initialCost, costMult, costMultGrowth))) {
    upper *= 2;
  }
  let lower = upper / 2;
  while (lower < upper) {
    const mid = Math.floor((lower + upper) / 2);
    const value = getCostWithLinearCostScaling(mid, costScalingStart, initialCost, costMult, costMultGrowth);
    if (Number.isFinite(value)) {
      lower = mid + 1;
    } else {
      upper = mid;
    }
  }
  return lower;
};

/**
 * LinearCostScaling is a helper class for costs that scale linearly. If we
 * know the available resources, initial cost, and cost multiplier, we can
 * figure out the maximum amount of purchases, and also the resulting total
 * cost and cost multiplier.
 *
 * i = initial cost
 * m = cost multiplier
 * p = purchases
 * t = total cost
 *
 * t = i * (1 - m^p) / (1 - m)
 * p = floor(log(1 + t * (m - 1) / i) / log(m))
 */
window.LinearCostScaling = class LinearCostScaling {
  /**
   * @param {Decimal} resourcesAvailable amount of available resources
   * @param {Decimal} initialCost current cost
   * @param {Number} costMultiplier current cost multiplier
   * @param {Number} maxPurchases max amount of purchases
   * @param {Boolean} free signifies if the purchase is free -> if we only need to consider the last cost
   */
  constructor(resourcesAvailable, initialCost, costMultiplier, maxPurchases = DC.BEMAX, free = false) {
    if (free) {
      this._purchases = Decimal.min(Math.floor(
        resourcesAvailable.div(initialCost).log10().div(Math.log10(costMultiplier).add(1))), maxPurchases);
    } else {
      this._purchases = Decimal.min(Decimal.floor(
        resourcesAvailable.mul(costMultiplier.sub(1)).div(initialCost).add(1).log10()
          .div(Decimal.log10(costMultiplier))), maxPurchases);
    }
    this._totalCostMultiplier = Decimal.pow(costMultiplier, this._purchases);
    if (free) {
      this._totalCost = initialCost.mul(Decimal.pow(costMultiplier, this._purchases.sub(1)));
    } else {
      this._totalCost = initialCost.mul(Decimal.sub(1, this._totalCostMultiplier)).div(DC.D1.sub(costMultiplier));
    }
  }

  get purchases() {
    return this._purchases;
  }

  get totalCostMultiplier() {
    return this._totalCostMultiplier;
  }

  get totalCost() {
    return this._totalCost;
  }
};

/**
 * ExponentialCostScaling provides both a max quantity and a price
 * @typedef {Object} QuantityAndPrice
 * @property {number} quantity The new amount that can be bought
 * @property {number} logPrice The logarithm (base 10) of the price
 */

/**
 * This is a a helper class to deal with the more common case of a cost that
 * grows exponentially (past some threshold). NOTE: this assumes that you only
 * have to pay for the highest tier when buying in bulk. That's a little bit cheaper,
 * but for the use cases this encounters, it's not a big deal.
 */
window.ExponentialCostScaling = class ExponentialCostScaling {
  /**
  * @param {Object} param configuration object with the following fields
  * @param {number|Decimal} param.baseCost the cost of the first purchase
  * @param {number} param.baseIncrease the baseline increase in price
  * @param {number} param.costScale the amount by which the cost scaling increases;
  *  e.g. if it is 10, then the ratio between successive prices goes up by 10
  * @param {number} [param.purchasesBeforeScaling] the number of purchases that can
  *  be made before scaling begins. If baseCost is B, baseIncrease is C, and costScale is S,
  *  and purchasesBeforeScaling is 0, the prices will go: B, B C, B C^2 S, B C^3 S^3, B C^4 S^6, etc.
  * @param {number|Decimal} [param.scalingCostThreshold] an alternative way of specifying
  *  when scaling begins; once the cost is >= this threshold, scaling applies. Using the same
  *  notation: B BC BC^2 .... BC^n <threshold> BC^(n+1) BC^(n+2)S BC^(n+3)S^3 etc. So, the first
  *  price past the threshold has no costScale in it, but everything past that does.
  */

  constructor(param) {
    this._baseCost = param.baseCost;
    this._baseIncrease = param.baseIncrease;
    this._costScale = param.costScale;
    if (param.purchasesBeforeScaling === undefined && param.scalingCostThreshold === undefined) {
      throw new Error("purchasesBeforeScaling or scalingCostThreshold must be defined");
    }
    if (!(param.purchasesBeforeScaling instanceof Decimal || param.scalingCostThreshold instanceof Decimal)) {
      throw new Error("purchasesBeforeScaling or scalingCostThreshold must be Decimal");
    }
    if (param.purchasesBeforeScaling instanceof Decimal) this._purchasesBeforeScaling = param.purchasesBeforeScaling;
    if (param.scalingCostThreshold instanceof Decimal) this._purchasesBeforeScaling =
      (param.scalingCostThreshold.log10().sub(this._baseCost.log10()).div(this._baseIncrease.log10())).ceil();
    this.log = {
      _baseCost: param.baseCost.log10(),
      _baseIncrease: param.baseIncrease.log10(),
      _costScale: param.costScale.log10(),
    };
  }

  updateData(param) {
    this._baseCost = param.baseCost;
    this._baseIncrease = param.baseIncrease;
    this._costScale = param.costScale;
    if (param.purchasesBeforeScaling === undefined && param.scalingCostThreshold === undefined) {
      throw new Error("purchasesBeforeScaling or scalingCostThreshold must be defined");
    }
    if (!(param.purchasesBeforeScaling instanceof Decimal || param.scalingCostThreshold instanceof Decimal)) {
      throw new Error("purchasesBeforeScaling or scalingCostThreshold must be Decimal");
    }
    if (param.purchasesBeforeScaling instanceof Decimal) this._purchasesBeforeScaling = param.purchasesBeforeScaling;
    if (param.scalingCostThreshold instanceof Decimal) this._purchasesBeforeScaling =
      (param.scalingCostThreshold.log10().sub(this._baseCost.log10()).div(this._baseIncrease.log10())).ceil();
    this.log = {
      _baseCost: param.baseCost.log10(),
      _baseIncrease: param.baseIncrease.log10(),
      _costScale: param.costScale.log10(),
    };
  }

  get costScale() {
    return this._costScale;
  }

  set costScale(value) {
    if (!(value instanceof Decimal)) return;
    this._costScale = value;
    this.log._costScale = value.log10();
  }


  calculateCost(currentPurchases) {
    // Define these here just cause theyre easier to type
    const base = this.log._baseCost;
    const inc = this.log._baseIncrease;
    const scale = this.log._costScale;
    const purchases = this._purchasesBeforeScaling;

    // If it never becomes exponential cost, just return linear and stop
    if (currentPurchases.lte(purchases)) {
      return Decimal.pow10(base.add(inc.times(currentPurchases)));
    }

    // Calculate linear cost
    const costBeforeExpo = base.add(inc.times(currentPurchases));
    // How many exponential purchases?
    const expoPurchases = currentPurchases.sub(purchases);
    // eslint-disable-next-line max-len
    // Since we times by scale X times per purchase past max, we can find the triangular number of expoPurchases and just mult that by scale
    const scaleCostFinal = expoPurchases.pow(2).add(expoPurchases).div(2).times(scale);
    // Add and pow10
    return Decimal.pow10(costBeforeExpo.add(scaleCostFinal));
  }

  getMaxBought(currentPurchases, currency, purchasesPerIncrease, roundDown = true) {
    // Copypaste
    const base = this.log._baseCost;
    const inc = this.log._baseIncrease;
    const scale = this.log._costScale;
    const purchases = this._purchasesBeforeScaling;
    const ppIlog = purchasesPerIncrease.log10();
    let logMoney = currency.log10().sub(ppIlog);
    // A console.log(logMoney);
    // First, is the currency before the cost of Exponential? If so we solve it here and return
    if (logMoney.lte(base.add(inc.times(purchases.floor())))) {
      let purchaseAmount = logMoney.sub(base).div(inc).add(1);
      // A console.log(purchaseAmount);
      // Round value DOWN
      if (roundDown) purchaseAmount = purchaseAmount.floor();
      // Return null if its less than the purchases we already have
      if (purchaseAmount.lte(currentPurchases)) return null;
      const cost = this.calculateCost(purchaseAmount).log10().add(ppIlog);
      purchaseAmount = purchaseAmount.sub(currentPurchases);
      purchaseAmount = purchaseAmount.times(purchasesPerIncrease);
      return { quantity: purchaseAmount,
        logPrice: cost };
      // We invert the calc after the floor to find the highest cost
    }

    // Deduct the cost up to the linear limit
    let purchaseAmount = purchases;
    logMoney = logMoney.sub(base.add(inc.times(purchases)));

    // Where does this equation come from?
    // Well it comes from the fact that if we subtract all preScaling costs, the cost is equal to:
    // 0.5s(p^2 + p) + ip (i = log(inc), s = log(scale), p = purchases)
    // Solving for p there gives us a quadratic with -0.5s as a, (-0.5s - i) as b and cost as c
    // Put that into the quadratic (-b - sqrt(b^2 - 4ac))/2a and you get purchases

    logMoney = logMoney.sub(ppIlog);
    const a = new Decimal(0).sub(scale).div(2);
    const b = a.sub(inc);
    const c = logMoney;

    purchaseAmount = purchaseAmount.add(decimalQuadraticSolution(a, b, c, true)).add(1);

    // Technically this only buys up to the nearest set, but post exponential thats a minor flaw at most (and correct?)
    if (roundDown) purchaseAmount = purchaseAmount.floor();

    if (purchaseAmount.lte(currentPurchases)) return null;

    const purchaseCost = this.calculateCost(purchaseAmount).log10().add(ppIlog);
    purchaseAmount = purchaseAmount.sub(currentPurchases);
    if (roundDown) purchaseAmount = purchaseAmount.floor();

    purchaseAmount = purchaseAmount.times(purchasesPerIncrease);
    return { quantity: purchaseAmount, logPrice: purchaseCost };
  }

  getContinuumValue(money, perSet) {
    const continuumBase = this.getMaxBought(0, money, perSet, false);
    return continuumBase ? continuumBase.quantity : continuumBase;
  }
};

// Numerical approximation for values from the Lambert W function, using Newton's method with some algebraic
// changes to make it less likely to overflow. Relative precision of 1e-6 should be good enough for most purposes;
// this should never be turned down to 0 as there can be oscillatory behavior due to floating point quantization
// that never converges to a fixed point. It also seems to take much longer to converge at higher values.
window.productLog = function productLog(x) {
  let curr = x, prev = 0;
  do {
    prev = curr;
    curr -= 1 - (1 + x * Math.exp(-curr)) / (1 + curr);
  } while (Math.abs(curr - prev) > 1e-6 * curr);
  return curr;
};

window.decimalProductLog = function decimalProductLog(x) {
  let curr = x, prev = new Decimal();
  do {
    prev = curr;
    curr = curr.add(1).sub((Decimal.pow(Math.E, curr.neg())).mul(x).add(1).div(curr.add(1)));
  } while (Decimal.abs(curr.sub(prev)).gt(cur.div(1e6)));
  return curr;
};

// Implementation of "Lehmer code" decoding to produce a specific permutation, given a permutation length and a
// lexicographic index for the specified permutation. Calling with a lexicographic index that is too large will
// not throw an error, but will use lexIndex % len! as an index instead.
// This may behave incorrectly if len! > 9e15, which occurs when len > 18.
window.permutationIndex = function permutationIndex(len, lexIndex) {
  let numPerm = 1;
  for (let n = 1; n <= len; n++) numPerm *= n;
  let index = lexIndex % numPerm;
  let remOrder = numPerm / len;
  const ordered = Array.range(0, len);
  const perm = [];
  while (ordered.length > 0) {
    const div = Math.floor(index / remOrder);
    const rem = index % remOrder;
    perm.push(ordered.splice(div, 1)[0]);
    index = rem;
    remOrder /= ordered.length;
  }
  return perm;
};

// This entire function is bullshit, there is 0 reason to notjust use exponentialCostScaling?
// Calculate cost scaling for something that follows getCostWithLinearCostScaling() under Infinity and immediately
// starts accelerated ExponentialCostScaling above Infinity.  Yes this is a fuckton of arguments, sorry.  It sort of
// needs to inherit all arguments from both cost scaling functions.
window.getHybridCostScaling = function getHybridCostScaling(
  amountOfPurchases, linCostScalingStart, linInitialCost, linCostMult, linCostMultGrowth,
  expInitialCost, expCostMult, expCostMultGrowth
) {
  const normalCost = getCostWithLinearCostScaling(amountOfPurchases.toNumber(), linCostScalingStart.toNumber(),
    linInitialCost.toNumber(), linCostMult.toNumber(), linCostMultGrowth.toNumber());
  if (Number.isFinite(normalCost)) {
    return new Decimal(normalCost);
  }
  // This code look like shite? Thats cause it is
  // eslint-disable-next-line max-len
  const postInfinityAmount = amountOfPurchases.sub(findFirstInfiniteCostPurchase(linCostScalingStart.toNumber(),
    linInitialCost.toNumber(), linCostMult.toNumber(), linCostMultGrowth.toNumber()));
  const costScale = new ExponentialCostScaling({
    baseCost: expInitialCost,
    baseIncrease: expCostMult,
    costScale: expCostMultGrowth,
    scalingCostThreshold: DC.NUMMAX
  });
  return costScale.calculateCost(postInfinityAmount);
};

window.logFactorial = (function() {
  const LOGS = Array.range(1, 11).map(Math.log);
  const TABLE = [0];
  for (const x of LOGS) {
    TABLE.push(TABLE[TABLE.length - 1] + x);
  }
  return x => {
    if (typeof x !== "number" || x < 0) return NaN;
    if (x < TABLE.length) return TABLE[x];
    return lngamma(x + 1);
  };
}());

window.exp1m = function(x) {
  if (x.abs().gte(0.001)) {
    return x.exp().minus(1);
  }
  // This sum contains all the terms that are relevant for |x| < 0.001. We could do some sort of loop
  // (add terms as long as they matter) but that probably has a greater fixed overhead, and we don't
  // call this enough for efficiency to be very worrying anyway.
  return x.plus(x.pow(2).div(2)).plus(x.pow(3).div(6)).plus(x.pow(4).div(24)).plus(x.pow(5).div(120));
};

/** 32 bit XORSHIFT generator */
window.xorshift32Update = function xorshift32Update(state) {
  /* eslint-disable no-param-reassign */
  state ^= state << 13;
  state ^= state >>> 17;
  state ^= state << 5;
  /* eslint-enable no-param-reassign */
  return state;
};

window.fastRandom = (function() {
  let state = Math.floor(Date.now()) % Math.pow(2, 32);
  const scale = 1 / (Math.pow(2, 32));
  return () => {
    state = xorshift32Update(state);
    return state * scale + 0.5;
  };
}());

// Normal distribution with specified mean and standard deviation
window.normalDistribution = (function() {
  let haveSpare = false;
  let spare = 0;
  return (mean, stdDev) => {
    if (typeof mean !== "number" || typeof stdDev !== "number") return NaN;
    if (haveSpare) {
      haveSpare = false;
      return mean + stdDev * spare;
    }
    let mag, u, v;
    do {
      u = fastRandom() * 2 - 1;
      v = fastRandom() * 2 - 1;
      mag = u * u + v * v;
    } while (mag >= 1 || mag === 0);
    const t = Math.sqrt(-2 * Math.log(mag) / mag);
    haveSpare = true;
    spare = v * t;
    return mean + stdDev * u * t;
  };
}());

// Helper function for BTRD
window.binomialGeneratorFC = (function() {
  // eslint-disable-next-line no-loss-of-precision
  const stirlingBase = x => -8.10614667953272582e-2 + (x + 0.5) * Math.log1p(x) - x;
  const TABLE = Array.range(0, 20).map(x => logFactorial(x) - stirlingBase(x));
  return x => {
    if (typeof x !== "number" || x < 0) return NaN;
    if (x < TABLE.length) return TABLE[x];
    const xr = 1 / (x + 1);
    return (1 / 12 - (1 / 360 - (xr * xr) / 1260) * (xr * xr)) * xr;
  };
}());

/**
 * This manually inverts the cumulative probability distribution
 * @param {number} numSamples number of drawn samples
 * @param {number} p probability
 * @returns {number} number of samples that satisfied p
 */
window.binomialDistributionSmallExpected = function binomialDistributionSmallExpected(numSamples, p) {
  const R = p / (1 - p);
  const NxR = (numSamples + 1) * R;
  // Calculate (1-p)^n without rounding error at 1 - p
  let pdf = Math.exp(Math.log1p(-p) * numSamples);
  const u = fastRandom();
  let cdf = pdf;
  let output = 0;
  while (u > cdf) {
    ++output;
    pdf *= (NxR / output - R);
    if (cdf + pdf === cdf) break;
    cdf += pdf;
  }
  return output;
};

window.binomialDistribution = function binomialDistribution(numSamples, p) {
  if (p === 0) return 0;
  if (numSamples instanceof Decimal) {
    if (numSamples.log10().lt(300)) {
      const pNumber = typeof p === "number" ? p : p.toNumber();
      return new Decimal(binomialDistribution(numSamples.toNumber(), pNumber));
    }
    const expected = numSamples.times(p);
    if (expected.e > 32) return expected;
    return new Decimal(poissonDistribution(numSamples.times(p)));
  }
  const expected = numSamples * p;
  // BTRD is good past 10, but the inversion method we use is faster up to 15 and is exact
  if (expected < 15) return binomialDistributionSmallExpected(numSamples, p);
  if (p > 0.5) return numSamples - binomialDistribution(numSamples, 1 - p);
  // At some point, the variance is so small relative to the expected value that
  // all samples are within eps of the mean
  if (expected > 1e32) return expected;
  const approximateVariance = expected * (1 - p);
  // Normal approximation is good enough for larger distributions
  if (approximateVariance > 1e4) return Math.round(normalDistribution(expected, Math.sqrt(approximateVariance)));
  return binomialDistributionBTRD(numSamples, p);
};

/**
 * Chooses the method of generation based on the input
 * @param {number|Decimal} expected expected value of distribution
 * @returns {number|Decimal} number of poisson process events
 */
window.poissonDistribution = function poissonDistribution(expected) {
  if (expected === 0) return 0;
  if (expected instanceof Decimal) {
    if (expected.log10().gt(32)) return expected;
    return new Decimal(poissonDistribution(expected.toNumber()));
  }
  if (expected > 1e32) return expected;
  if (expected > 1e4) return poissonDistributionViaNormal(expected);
  if (expected < 20) return poissonDistributionSmallExpected(expected);
  return poissonDistributionPTRD(expected);
};

/**
 * Uses a normal approximation to sqrt(x)
 */
window.poissonDistributionViaNormal = function poissonDistributionViaNormal(expected) {
  const x = normalDistribution(Math.sqrt(expected), 0.5);
  return Math.floor(x * x);
};

/**
 * This manually inverts the cumulative probability distribution
 */
window.poissonDistributionSmallExpected = function poissonDistributionSmallExpected(expected) {
  let pdf = Math.exp(-expected);
  let cdf = pdf;
  const u = fastRandom();
  let output = 0;
  while (u > cdf) {
    ++output;
    pdf *= expected / output;
    if (cdf + pdf === cdf) break;
    cdf += pdf;
  }
  return output;
};

/**
 * Algorithm from https://core.ac.uk/download/pdf/11007254.pdf
 */
window.binomialDistributionBTRD = function binomialDistributionBTRD(numSamples, p) {
  const expected = numSamples * p;
  const approximateVariance = expected * (1 - p);
  const approxStdev = Math.sqrt(approximateVariance);
  const m = Math.floor(expected + p);
  const R = p / (1 - p);
  const NxR = (numSamples + 1) * R;
  const b = 1.15 + 2.53 * approxStdev;
  const a = -0.0873 + 0.0248 * b + 0.01 * p;
  const c = expected + 0.5;
  const alpha = (2.83 + 5.1 / b) * approxStdev;
  const kU = 0.43;
  const kV = 0.92 - 4.2 / b;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let v = fastRandom();
    if (v <= 2 * kU * kV) {
      const u = v / kV - kU;
      return Math.floor((2 * a / (0.5 - Math.abs(u)) + b) * u + c);
    }
    let u;
    if (v >= kV) {
      u = fastRandom() - 0.5;
    } else {
      const w = v / kV - 0.93;
      v = fastRandom() * kV;
      u = (w > 0 ? 0.5 : -0.5) - w;
    }
    const us = 0.5 - Math.abs(u);
    const k = Math.floor((2 * a / us + b) * u + c);
    if (k < 0 || k > numSamples) continue;
    v *= alpha / (a / (us * us) + b);
    const km = Math.abs(k - m);
    // These loops are very fast, compared to calculating all the logs and stuff below; the
    // original paper has 15 here but 40 seems to be closer to optimal.
    if (km <= 40) {
      let f = 1;
      if (m < k) {
        for (let i = m + 1; i <= k; ++i) f *= (NxR / i - R);
      } else if (m > k) {
        for (let i = k + 1; i <= m; ++i) v *= (NxR / i - R);
      }
      if (v <= f) return k;
      continue;
    }
    const rho = (km / approximateVariance) * (((km / 3 + 0.625) * km + 1 / 6) / approximateVariance + 0.5);
    const t = -km * km / (2 * approximateVariance);
    const logV = Math.log(v);
    if (logV < t - rho) return k;
    if (logV > t + rho) continue;
    const _nm = numSamples - m + 1;
    const _nk = numSamples - k + 1;
    const h = (m + 0.5) * Math.log((m + 1) / (R * _nm)) +
      binomialGeneratorFC(m) + binomialGeneratorFC(numSamples - m);
    const j = (numSamples + 1) * Math.log(_nm / _nk) + (k + 0.5) * Math.log(_nk * R / (k + 1)) -
      binomialGeneratorFC(k) - binomialGeneratorFC(numSamples - k);
    if (logV <= h + j) return k;
  }
};

/**
 * "The transformed rejection method for generating Poisson random variables"
 * http://epub.wu.ac.at/352/1/document.pdf
 * @param {number} mu expected value of distribution
 * @returns {number} (integer) number of events in poisson process
 */
window.poissonDistributionPTRD = function poissonDistributionPTRD(mu) {
  const sMu = Math.sqrt(mu);
  const b = 0.931 + 2.53 * sMu;
  const a = -0.059 + 0.02483 * b;
  const iAlpha = 1.1239 + 1.328 / (b - 3.4);
  const vR = 0.9277 - 3.6224 / (b - 2);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let v = Math.random();
    if (v < 0.86 * vR) {
      const u = v / vR - 0.43;
      return Math.floor((2 * a / (0.5 - Math.abs(u)) + b) * u + mu + 0.445);
    }
    let u;
    if (v >= vR) {
      u = fastRandom() - 0.5;
    } else {
      const w = v / vR - 0.93;
      u = (w > 0 ? 0.5 : -0.5) - w;
      v = fastRandom() * vR;
    }
    const us = 0.5 - Math.abs(u);
    if (us < 0.013 && us < v) continue;
    const k = Math.floor((2 * a / us + b) * u + mu + 0.445);
    v *= iAlpha / (a / us / us + b);
    const ik = 1 / k;
    if (k >= 10) {
      const t = (k + 0.5) * Math.log(mu * ik) - mu - LN_SQRT_2_PI + k - (1 / 12 - ik * ik / 360) * ik;
      if (Math.log(v * sMu) <= t) return k;
    } else if (Math.log(v) <= k * Math.log(mu) - mu - logFactorial(k)) return k;
  }
};

window.depressedCubicRealRoots = function depressedCubicRealRoots(k3, k1, k0) {
  if (k3 === 0) {
    if (k1 === 0) return [];
    return [-k0 / k1];
  }
  /* eslint-disable no-param-reassign */
  k1 /= k3;
  k0 /= k3;
  /* eslint-enable no-param-reassign */
  if (k0 === 0) {
    if (k1 === 0) return [0];
    if (k1 > 0) return [];
    const r = Math.sqrt(-k1);
    return [r, -r];
  }
  if (k1 === 0) {
    return [Math.cbrt(-k0)];
  }
  let innerDisc = 0.25 * k0 * k0 + k1 * k1 * k1 / 27;
  if (innerDisc >= 0) {
    innerDisc = Math.sqrt(innerDisc);
    return [Math.cbrt(-0.5 * k0 + innerDisc) + Math.cbrt(-0.5 * k0 - innerDisc)];
  }
  const po3 = 2 * Math.sqrt(-k1 / 3);
  const theta = Math.acos(3 * k0 / (k1 * po3)) / 3;
  return [
    po3 * Math.cos(theta),
    po3 * Math.cos(theta - 2 * Math.PI / 3),
    po3 * Math.cos(theta - 4 * Math.PI / 3),
  ];
};

window.quadraticRealRoots = function quadraticRealRoots(k2, k1, k0) {
  if (k2 === 0) {
    if (k1 === 0) return [];
    return [-k0 / k1];
  }
  if (k1 === 0) {
    const ktmp = k0 / k2;
    if (ktmp > 0) return [];
    return [Math.sqrt(-ktmp), -Math.sqrt(-ktmp)];
  }
  const disc = k1 * k1 - 4 * k2 * k0;
  if (disc < 0) return [];
  if (disc === 0) return [-k1 / (2 * k2)];
  const bdsc = -k1 - Math.sign(k1) * Math.sqrt(disc);
  return [
    bdsc / (2 * k2),
    2 * k0 / bdsc
  ];
};

window.cubicRealRoots = function cubicRealRoots(k3, k2, k1, k0) {
  if (k3 === 0) {
    return quadraticRealRoots(k2, k1, k0);
  }
  if (k2 === 0) return depressedCubicRealRoots(k3, k1, k0);
  const bo3a = k2 / (3 * k3);
  const bo3a2 = bo3a * bo3a;
  const coa = k1 / k3;
  const p = coa - 3 * bo3a2;
  const q = 2 * bo3a * bo3a2 - bo3a * coa + k0 / k3;
  const dcrr = depressedCubicRealRoots(1, p, q);
  return dcrr.map(t => t - bo3a);
};

window.testCRR = function testCRR(k3, k2, k1, k0) {
  const r = cubicRealRoots(k3, k2, k1, k0);
  // eslint-disable-next-line no-console
  console.log(r);
  // eslint-disable-next-line no-console
  console.log(r.map(x => k0 + x * (k1 + x * (k2 + x * k3))));
};

window.depressedQuarticRealRoots = function depressedQuarticRealRoots(k4, k2, k1, k0) {
  if (k4 === 0) return quadraticRealRoots(k2, k1, k0);
  if (k0 === 0) {
    const reducedSol = depressedCubicRealRoots(k4, k2, k1);
    if (!reducedSol.includes(0)) reducedSol.push(0);
    return reducedSol;
  }
  if (k1 === 0) {
    const squareSol = quadraticRealRoots(k4, k2, k0);
    const solution = [];
    for (const sr of squareSol) {
      if (sr < 0) continue;
      if (sr === 0) solution.push(0);
      else solution.push(Math.sqrt(sr), -Math.sqrt(sr));
    }
    return solution;
  }
  /* eslint-disable no-param-reassign */
  k2 /= k4;
  k1 /= k4;
  k0 /= k4;
  /* eslint-enable no-param-reassign */
  const mSol = cubicRealRoots(8, 8 * k2, 2 * k2 * k2 - 8 * k0, -k1 * k1);
  const m = mSol.max();
  // I don't think this can happen, but I haven't double checked the math
  if (m <= 0) return [];
  const sqrt2m = Math.sqrt(2 * m);
  const dInner = 2 * k1 / sqrt2m;
  const d1 = -(2 * k2 + 2 * m + dInner);
  const solution = [];
  if (d1 > 0) {
    solution.push(0.5 * (sqrt2m + Math.sqrt(d1)), 0.5 * (sqrt2m - Math.sqrt(d1)));
  } else if (d1 === 0) {
    solution.push(0.5 * sqrt2m);
  }
  const d2 = -(2 * k2 + 2 * m - dInner);
  if (d2 > 0) {
    solution.push(0.5 * (-sqrt2m + Math.sqrt(d2)), 0.5 * (-sqrt2m - Math.sqrt(d2)));
  } else if (d2 === 0) {
    solution.push(-0.5 * sqrt2m);
  }
  return solution;
};

window.testDQRR = function testDQRR(k4, k2, k1, k0) {
  const r = depressedQuarticRealRoots(k4, k2, k1, k0);
  // eslint-disable-next-line no-console
  console.log(r);
  // eslint-disable-next-line no-console
  console.log(r.map(x => k0 + x * (k1 + x * (k2 + x * x * k4))));
};

window.solveSimpleBiquadratic = function solveSimpleBiquadratic(A, B, C, D, E, F) {
  const solutions = [];
  if (A === 0) {
    if (B === 0 || E === 0) return [];
    const y = -C / B;
    if (D === 0) return [{ x: -F / E, y }];
    return [{ x: (-F - D * y * y) / E, y }];
  }
  if (D === 0) {
    if (B === 0 || E === 0) return [];
    const x = -F / E;
    return [{ x, y: (-C - A * x * x) / B }];
  }
  if (B === 0) {
    const xSol = quadraticRealRoots(A, 0, C);
    for (const x of xSol) {
      const yTmp = F + E * x;
      const ySol = quadraticRealRoots(D, 0, yTmp);
      for (const y of ySol) solutions.push({ x, y });
    }
    return solutions;
  }
  if (E === 0) {
    const ySol = quadraticRealRoots(D, 0, F);
    for (const y of ySol) {
      const xTmp = C + B * y;
      const xSol = quadraticRealRoots(A, 0, xTmp);
      for (const x of xSol) solutions.push({ x, y });
    }
    return solutions;
  }
  const AoB = A / B;
  const CoB = C / B;
  const xSol = depressedQuarticRealRoots(D * AoB * AoB, 2 * D * AoB * CoB, E, F + D * CoB * CoB);
  for (const x of xSol) solutions.push({ x, y: -(AoB * x * x + CoB) });
  return solutions;
};

window.testSSBQ = function testSSBQ(A, B, C, D, E, F) {
  // eslint-disable-next-line no-console
  console.log({ A, B, C, D, E, F });
  const sols = solveSimpleBiquadratic(A, B, C, D, E, F);
  for (const s of sols) {
    const e1 = A * s.x * s.x + B * s.y + C;
    const e2 = D * s.y * s.y + E * s.x + F;
    // eslint-disable-next-line no-console
    console.log(`${s.x} ${s.y} ${e1} ${e2}`);
  }
};

window.AffineTransform = class AffineTransform {
  constructor(a00 = 1, a01 = 0, a10 = 0, a11 = 1, o0 = 0, o1 = 0) {
    this.a00 = a00;
    this.a01 = a01;
    this.a10 = a10;
    this.a11 = a11;
    this.o0 = o0;
    this.o1 = o1;
  }

  times(ot) {
    if (ot instanceof AffineTransform) {
      return new AffineTransform(
        this.a00 * ot.a00 + this.a01 * ot.a10, this.a00 * ot.a01 + this.a01 * ot.a11,
        this.a10 * ot.a00 + this.a11 * ot.a10, this.a10 * ot.a01 + this.a11 * ot.a11,
        this.a00 * ot.o0 + this.a01 * ot.o1 + this.o0,
        this.a10 * ot.o0 + this.a11 * ot.o1 + this.o1
      );
    }
    if (ot instanceof Vector) return ot.transformedBy(this);
    throw new Error("unsupported operation");
  }

  translated(offX, offY = undefined) {
    if (offX instanceof Vector) {
      return new AffineTransform(this.a00, this.a01, this.a10, this.a11, this.o0 + offX.x, this.o1 + offX.y);
    }
    return new AffineTransform(this.a00, this.a01, this.a10, this.a11, this.o0 + offX, this.o1 + offY);
  }

  rotated(angle) {
    return AffineTransform.rotation(angle).times(this);
  }

  scaled(scale) {
    return AffineTransform.scale(scale).times(this);
  }

  get withoutTranslation() {
    return new AffineTransform(this.a00, this.a01, this.a10, this.a11);
  }

  static translation(offX, offY) {
    if (offX instanceof Vector) {
      return new AffineTransform(1, 0, 0, 1, offX.x, offX.y);
    }
    return new AffineTransform(1, 0, 0, 1, offX, offY);
  }

  static rotation(angle) {
    const c = Math.cos(angle), s = Math.sin(angle);
    return new AffineTransform(c, -s, s, c);
  }

  static scale(sc) {
    return new AffineTransform(sc, 0, 0, sc);
  }

  static identity() {
    return new AffineTransform();
  }
};

window.Vector = class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  plus(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  cross(v) {
    // Produces scalar, z term of 3D vectors
    return this.x * v.y - this.y * v.x;
  }

  minus(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  times(s) {
    return new Vector(this.x * s, this.y * s);
  }

  asTranslate() {
    return `translate(${this.x}, ${this.y})`;
  }

  asRotate() {
    return `rotate(${180 / Math.PI * Math.atan2(this.y, this.x)})`;
  }

  toString() {
    return `${this.x}, ${this.y}`;
  }

  round(factor) {
    return new Vector(Math.round(this.x * factor) / factor, Math.round(this.y * factor) / factor);
  }

  get copy() {
    return new Vector(this.x, this.y);
  }

  matrixTransform(a00, a01, a10, a11) {
    return new Vector(a00 * this.x + a01 * this.y, a10 * this.x + a11 * this.y);
  }

  transformedBy(tform) {
    return new Vector(tform.a00 * this.x + tform.a01 * this.y + tform.o0,
      tform.a10 * this.x + tform.a11 * this.y + tform.o1);
  }

  get negative() {
    return new Vector(-this.x, -this.y);
  }

  get normalized() {
    return this.times(1 / this.length);
  }

  get right90() {
    return new Vector(this.y, -this.x);
  }

  get left90() {
    return new Vector(-this.y, this.x);
  }

  get angle() {
    return Math.atan2(this.y, this.x);
  }

  static horiz(x) {
    return new Vector(x, 0);
  }

  static unitFromRadians(rad) {
    return new Vector(Math.cos(rad), Math.sin(rad));
  }

  static unitFromDegrees(deg) {
    return Vector.unitFromRadians(deg * Math.PI / 180);
  }
};


window.Curve = class Curve {
  /**
   * @abstract
   * @param {number} t
   * @returns {Vector}
  */
  position() {
    throw new NotImplementedError();
  }

  /**
   * @abstract
   * @param {number} t
   * @returns {Vector}
  */
  derivative() {
    throw new NotImplementedError();
  }

  /**
   * @abstract
   * @param {number} t
   * @returns {Vector}
  */
  secondDerivative() {
    throw new NotImplementedError();
  }

  /**
   * @param {number} t
   * @returns {number}
   */
  curvature(t) {
    const d = this.derivative(t);
    const dd = this.secondDerivative(t);
    const dMag = d.length;
    return d.cross(dd) / (dMag * dMag * dMag);
  }

  shapeAt(t) {
    const d = this.derivative(t);
    return {
      t,
      position: this.position(t),
      derivative: d,
      direction: d.normalized,
      curvature: this.curvature(t),
    };
  }

  minimumDistanceTo(pDes, tMin, tMax) {
    let tGuess = 0.5 * (tMin + tMax);
    const tTol = Math.max(Math.abs(tMax), Math.abs(tMin)) * Number.EPSILON * 16;
    for (let iter = 0; ; ++iter) {
      const p = this.position(tGuess);
      const d = this.derivative(tGuess);
      const dd = this.secondDerivative(tGuess);
      const offset = p.minus(pDes);
      const dist = offset.length;
      const distDeriv = offset.dot(d) * 2;
      /* eslint-disable no-param-reassign */
      if (distDeriv > 0) tMax = tGuess;
      else tMin = tGuess;
      /* eslint-enable no-param-reassign */
      const distSecondDeriv = (offset.dot(dd) + d.dot(d)) * 2;
      const tStep = distSecondDeriv < 0 ? -dist / distDeriv : -distDeriv / distSecondDeriv;
      if (Math.abs(tStep) < tTol || iter >= 16) return dist;
      tGuess = Math.clamp(tGuess + tStep, tMin, tMax);
    }
  }
};

window.LinearPath = class LinearPath extends Curve {
  constructor(p0, p1) {
    super();
    this.p0 = p0.copy;
    this.p1 = p1.copy;
  }

  position(t) {
    return this.p0.times(1 - t).plus(this.p1.times(t));
  }

  derivative() {
    return this.p1.minus(this.p0);
  }

  secondDerivative() {
    return new Vector(0, 0);
  }

  // eslint-disable-next-line no-unused-vars
  curvature(t) {
    return 0;
  }

  trimStart(len) {
    const dir = this.p1.minus(this.p0).normalized;
    return new LinearPath(this.p0.plus(dir.times(len)), this.p1);
  }

  trimEnd(len) {
    const dir = this.p1.minus(this.p0).normalized;
    return new LinearPath(this.p0, this.p1.minus(dir.times(len)));
  }

  transformed(tform) {
    return new LinearPath(this.p0.transformedBy(tform), this.p1.transformedBy(tform));
  }

  get relativeSVG() {
    const d1 = this.p1.minus(this.p0);
    return `l ${d1.x} ${d1.y}\n`;
  }

  createOffsetLine(offset, t0 = 0, t1 = 1) {
    const off = this.p1.minus(this.p0).normalized.right90.times(offset);
    return new LinearPath(this.position(t0).plus(off), this.position(t1).plus(off));
  }

  static connectCircles(p0, r0, p1, r1) {
    const dir = p1.minus(p0).normalized;
    return new LinearPath(p0.plus(dir.times(r0)), p1.minus(dir.times(r1)));
  }
};

class CubicBezier extends Curve {
  constructor(p0, p1, p2, p3) {
    super();
    this.p0 = p0.copy;
    this.p1 = p1.copy;
    this.p2 = p2.copy;
    this.p3 = p3.copy;
  }

  position(t) {
    const nt2 = (1 - t) * (1 - t);
    const t2 = t * t;
    return this.p0.times((1 - t) * nt2)
      .plus(this.p1.times(3 * t * nt2))
      .plus(this.p2.times(3 * t2 * (1 - t)))
      .plus(this.p3.times(t2 * t));
  }

  derivative(t) {
    return this.p1.minus(this.p0).times(3 * (1 - t) * (1 - t))
      .plus(this.p2.minus(this.p1).times(6 * t * (1 - t)))
      .plus(this.p3.minus(this.p2).times(3 * t * t));
  }

  secondDerivative(t) {
    return this.p2.minus(this.p1.times(2)).plus(this.p0).times(6 * (1 - t))
      .plus(this.p3.minus(this.p2.times(2)).plus(this.p1).times(6 * t));
  }

  transformed(tform) {
    return new CubicBezier(this.p0.transformedBy(tform), this.p1.transformedBy(tform),
      this.p2.transformedBy(tform), this.p3.transformedBy(tform));
  }

  get relativeSVG() {
    const d1 = this.p1.minus(this.p0);
    const d2 = this.p2.minus(this.p0);
    const d3 = this.p3.minus(this.p0);
    return `c ${d1.x} ${d1.y} ${d2.x} ${d2.y} ${d3.x} ${d3.y}\n`;
  }

  get reverse() {
    return new CubicBezier(this.p3, this.p2, this.p1, this.p0);
  }

  static fitCurveSection(shape0, shape1) {
    const dP = shape1.position.minus(shape0.position);
    const reversed = shape0.t > shape1.t;
    const pathRotation = shape0.direction.cross(shape1.direction);
    let magSol = solveSimpleBiquadratic(
      1.5 * shape0.curvature, pathRotation, -shape0.direction.cross(dP),
      1.5 * shape1.curvature, pathRotation, shape1.direction.cross(dP));
    magSol = reversed ? magSol.filter(o => o.x <= 0 && o.y <= 0) : magSol.filter(o => o.x >= 0 && o.y >= 0);
    if (magSol.length === 0) return null;
    return new CubicBezier(
      shape0.position, shape0.position.plus(shape0.direction.times(magSol[0].x)),
      shape1.position.minus(shape1.direction.times(magSol[0].y)), shape1.position);
  }
}

// This is an "inset/outset" kind of transform
window.OffsetCurve = class OffsetCurve extends Curve {
  constructor(baseCurve, offset) {
    super();
    this.base = baseCurve;
    this.offset = offset;
  }

  position(t) {
    const p = this.base.position(t);
    const d = this.base.derivative(t);
    return p.plus(d.normalized.right90.times(this.offset));
  }

  derivative(t) {
    return this.base.derivative(t);
  }

  // 2nd derivative not implemented as only curvature is used atm
  curvature(t) {
    const c = this.base.curvature(t);
    return 1 / (1 / c + this.offset);
  }

  shapeAt(t) {
    const shape = this.base.shapeAt(t);
    return {
      t: shape.t,
      position: shape.position.plus(shape.direction.right90.times(this.offset)),
      derivative: shape.derivative,
      direction: shape.direction,
      curvature: shape.curvature / (1 + this.offset * shape.curvature),
    };
  }
};

window.LogarithmicSpiral = class LogarithmicSpiral extends Curve {
  constructor(center, scale, rate) {
    super();
    this.center = center;
    this.scale = scale;
    this.rate = rate;
  }

  position(t) {
    return Vector.unitFromRadians(t)
      .times(this.scale * Math.exp(this.rate * t))
      .plus(this.center);
  }

  derivative(t) {
    const unit = Vector.unitFromRadians(t);
    const radius = this.scale * Math.exp(this.rate * t);
    return unit.times(radius * this.rate).plus(unit.left90.times(radius));
  }

  secondDerivative(t) {
    const unit = Vector.unitFromRadians(t);
    const radius = this.scale * Math.exp(this.rate * t);
    return unit.times(radius * (this.rate * this.rate - 1))
      .plus(unit.left90.times(2 * radius * this.rate));
  }

  shapeAt(t) {
    const unit = Vector.unitFromRadians(t);
    const radius = this.scale * Math.exp(this.rate * t);
    const ur = unit.times(radius);
    const d = ur.times(this.rate).plus(ur.left90);
    return {
      t,
      position: ur.plus(this.center),
      derivative: d,
      direction: d.normalized,
      curvature: 1 / (Math.abs(radius) * Math.sqrt(1 + this.rate * this.rate))
    };
  }

  angleFromRadius(r) {
    return Math.log(r / this.scale) / this.rate;
  }

  static fromPolarEndpoints(center, theta0, r0, theta1, r1) {
    const rate = Math.log(r1 / r0) / (theta1 - theta0);
    return new LogarithmicSpiral(center, r0 / Math.exp(rate * theta0), rate);
  }
};

window.PiecewisePath = class PiecewisePath {
  constructor(data = undefined) {
    this.path = data ? data : [];
  }

  push(element) {
    this.path.push(element);
  }

  transformedBy(tform) {
    return new PiecewisePath(this.path.map(x => x.transformed(tform)));
  }

  toSVG(initialPrefix) {
    const p0 = this.path[0].position(0);
    const lines = [`${initialPrefix} ${p0.x} ${p0.y}\n`];
    for (const part of this.path) lines.push(part.relativeSVG);
    return lines.join("");
  }

  static cubicBezierFitToCurveSection(curve, t0, t1, tol = 1, minPieces = 1) {
    const output = new PiecewisePath();
    const shape0 = curve.shapeAt(t0);
    const shape1 = curve.shapeAt(t1);
    function subdivide(shapeStart, shapeEnd, maxDepth = 8) {
      const shapeMid = curve.shapeAt(0.5 * (shapeStart.t + shapeEnd.t));
      return single(shapeStart, shapeMid, maxDepth - 1) &&
        single(shapeMid, shapeEnd, maxDepth - 1);
    }
    function single(shapeStart, shapeEnd, maxDepth = 8) {
      const singleFit = CubicBezier.fitCurveSection(shapeStart, shapeEnd);
      if (singleFit === null) {
        if (maxDepth <= 0) throw new Error("coulnd't decompose curve");
        return subdivide(shapeStart, shapeEnd, maxDepth);
      }
      const tMid = 0.5 * (shapeStart.t + shapeEnd.t);
      const err = singleFit.minimumDistanceTo(curve.position(tMid), 0, 1);
      if (err > tol) {
        return subdivide(shapeStart, shapeEnd, maxDepth);
      }
      output.push(singleFit);
      return true;
    }
    if (minPieces > 1) subdivide(shape0, shape1);
    else single(shape0, shape1);
    return output;
  }
};

// https://stackoverflow.com/a/9201081
window.ExponentialMovingAverage = class ExponentialMovingAverage {
  constructor(alpha = 0.02, maxOutliers = 5, highOutlierThreshold = 3, lowOutlierThreshold = 0.4) {
    this.alpha = alpha;
    this.maxOutliers = maxOutliers;
    this.highOutlierThreshold = highOutlierThreshold;
    this.lowOutlierThreshold = lowOutlierThreshold;
    this.outliers = 0;
    this._average = new Decimal(0);
  }

  get average() {
    if (this._average.eq(0)) {
      return 0;
    }
    return this._average;
  }

  addValue(value) {
    if (this._average.eq(0)) {
      this._average = value;
    } else {
      this._average = this._average.add((value.sub(this._average)).mul(this.average));

      const absValue = Decimal.abs(value);
      const absAverage = Decimal.abs(this._average);
      const highOutlier = absValue.gt(absAverage.mul(this.highOutlierThreshold));
      const lowOutlier = absValue.lt(absAverage.mul(this.lowOutlierThreshold));
      const outlier = highOutlier || lowOutlier;

      if (outlier) {
        this.outliers++;
        if (this.outliers >= this.maxOutliers) {
          this._average = value;
          this.outliers = 0;
        }
      } else {
        this.outliers = 0;
      }
    }
  }
};
