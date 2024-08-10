/* eslint-disable line-comment-position */
/* eslint-disable no-inline-comments */
import { DC } from "./constants";

export const GALAXY_TYPE = {
  NORMAL: 0,
  DISTANT: 1,
  REMOTE: 2
};

class GalaxyRequirement {
  constructor(tier, amount) {
    this.tier = tier;
    this.amount = amount;
  }

  get isSatisfied() {
    const dimension = AntimatterDimension(this.tier);
    return dimension.totalAmount.gte(this.amount);
  }
}

export class Galaxy {
  static get remoteStart() {
    return Decimal.max(800, RealityUpgrade(21).effectOrDefault(0));
  }

  static get requirement() {
    return this.requirementAt(player.galaxies);
  }

  /**
   * Figure out what galaxy number we can buy up to
   * @param {number} currency Either dim 8 or dim 6, depends on current challenge
   * @returns {number} Max number of galaxies (total)
   */
  static buyableGalaxies(currency, minVal = player.galaxies) {
    const alter = GlyphAlteration.isAdded("power") ? getSecondaryGlyphEffect("powerpow") : DC.D1;
    const dis = Galaxy.costScalingStart;
    const scale = Galaxy.costMult;
    let base = Galaxy.baseCost.sub(Effects.sum(InfinityUpgrade.resetBoost));
    if (InfinityChallenge(5).isCompleted) base = base.sub(1);
    // eslint-disable-next-line max-len
    // Plz no ask how exponential math work i dont know i just code, see https://discord.com/channels/351476683016241162/439241762603663370/1210707188964659230m
    const minV = Galaxy.costScalingStart.min(Galaxy.remoteStart); // Take the smallest of the two values
    if (currency.lt(Galaxy.requirementAt(minV).amount /* Pre exponential/quadratic? */)) {
      return Decimal.max(currency.sub(base).div(scale).floor().add(1), minVal);
    }

    if (currency.lt(Galaxy.requirementAt(Galaxy.remoteStart).amount)) {
      // Quadratic equation https://discord.com/channels/351476683016241162/1131505261903880244/1261706311901511691
      const a = DC.D1;
      const b = scale.add(1).sub(dis.mul(2));
      const c = base.add(dis.pow(2)).sub(dis).sub(scale).sub(currency.div(alter));
      const quad = decimalQuadraticSolution(a, b, c).floor();
      return Decimal.max(quad, minVal);
    }
    // eslint-disable-next-line multiline-comment-style
    /*
    // Might not be perfect but at this point who gives a shit
      - If we can buy more we will loop a bit at the end to go through till we cant
    const delay = minV;
    const remote = Galaxy.remoteStart;
    const inc = Galaxy.costMult;
    const start = Galaxy.baseCost;
    const A = Decimal.ln(1.008);
    const B = (inc.sub(delay.times(2)).add(3)).div(2);
    const C = Decimal.ln(1.008).pow(2).times(Decimal.pow(1.008, inc.add(3).div(2).add(remote).sub(delay).sub(1)));
    const D = Decimal.ln(1.008).pow(2).times(inc.pow(2).sub(inc.times(2).times(delay))
      .add(inc.times(6)).sub(start.times(4).add(1))).div(4);
    let mzz = C.times(currency);

    const convFunc = m => m.sub(((Decimal.ln(m).pow(2).sub(D)).times(m).sub(C).times(C))
      .div(Decimal.ln(m).pow(2).add(Decimal.ln(m).times(2)).sub(D)));
    while (mzz.sub(convFunc(mzz)).abs().lte(0.05)) {
      mzz = convFunc(mzz);
    }
    let pur = Decimal.ln(mzz).div(A).sub(B).floor();
    let rep = 0;
    while (Galaxy.requirementAt(pur).amount.gt(currency) || rep < 25) {
      if (pur.sub(1).neq(pur)) {
        pur = pur.sub(1);
      } else {
        pur.mag /= 1.001;
        pur.normalize();
      }
      rep++;
    }
    while (this.requirementAt(pur.add(1)).amount.lt(currency) && pur.add(1).neq(pur) || rep < 25) {
      pur = pur.add(1);
      rep++;
    }
    if (rep === 25) {
      // eslint-disable-next-line max-len, no-console
      console.log("Repetitions in remote calculations (line 55-80 of galaxy.js)
        repeated far more than expected, logging.");
    }
    return Decimal.max(pur, player.galaxies);
    */

    if (Galaxy.requirementAt(Decimal.max(1e6, Galaxy.remoteStart)).amount.lt(currency)) {
      return Decimal.log(currency.div(Galaxy.requirementAt(Decimal.max(1e6, Galaxy.remoteStart))), 1.008)
        .add(Decimal.max(1e6, Galaxy.remoteStart)).floor().max(minVal);
    }
    // Ignore BBBS' warning, even though its theoretically quite dangerous
    // We can do this because at most, 1e6 galaxies of dimension would be put into this
    // So at most the output is 1e6, less than its 1e15 max, and for higher we use the above equation
    return new Decimal(bulkBuyBinarySearch(new Decimal(currency), {
      costFunction: x => this.requirementAt(new Decimal(x)).amount,
      cumulative: false,
    }, 0, true).quantity).floor().add(1).max(minVal);
  }

  static requirementAt(galaxies) {
    // Beyond 1e6 (or further if remote is beyond that) the other effects are so small in changes that it doesn't matter
    // This does technically make it slightly weaker than vanilla, but its so minor you would rarely ever notice, and it
    // allows the inverse to be correct beyond 1e6 without using any really annoying math methods that i dont understand
    const equivGal = Decimal.min(Decimal.max(1e6, Galaxy.remoteStart), galaxies);
    let amount = Galaxy.baseCost.add((equivGal.times(Galaxy.costMult)));
    const type = Galaxy.typeAt(galaxies);

    if (type === GALAXY_TYPE.DISTANT || type === GALAXY_TYPE.REMOTE) {
      const galaxyCostScalingStart = this.costScalingStart;
      const galaxiesAfterDistant = Decimal.clampMin(equivGal.sub(galaxyCostScalingStart).add(1), 0);
      amount = amount.add(Decimal.pow(galaxiesAfterDistant, 2).add(galaxiesAfterDistant));
    }

    if (type === GALAXY_TYPE.REMOTE) {
      amount = amount.times(Decimal.pow(1.002, galaxies.sub(Galaxy.remoteStart.sub(1))));
    }

    amount = amount.sub(Effects.sum(InfinityUpgrade.resetBoost));
    if (InfinityChallenge(5).isCompleted) amount = amount.sub(1);

    if (GlyphAlteration.isAdded("power")) amount = amount.mul(getSecondaryGlyphEffect("powerpow"));

    amount = Decimal.floor(amount);
    const tier = Galaxy.requiredTier;
    return new GalaxyRequirement(tier, amount);
  }

  static get costMult() {
    return new Decimal(Effects.min(NormalChallenge(10).isRunning ? 90 : 60, TimeStudy(42)));
  }

  static get baseCost() {
    return NormalChallenge(10).isRunning ? DC.D99 : DC.D80;
  }

  static get requiredTier() {
    return NormalChallenge(10).isRunning ? 6 : 8;
  }

  static get canBeBought() {
    if (EternityChallenge(6).isRunning && !Enslaved.isRunning) return false;
    if (NormalChallenge(8).isRunning || InfinityChallenge(7).isRunning) return false;
    if (player.records.thisInfinity.maxAM.gt(Player.infinityGoal) &&
       (!player.break || Player.isInAntimatterChallenge)) return false;
    return true;
  }

  static get lockText() {
    if (this.canBeBought) return null;
    if (EternityChallenge(6).isRunning) return "Locked (Eternity Challenge 6)";
    if (InfinityChallenge(7).isRunning) return "Locked (Infinity Challenge 7)";
    if (InfinityChallenge(1).isRunning) return "Locked (Infinity Challenge 1)";
    if (NormalChallenge(8).isRunning) return "Locked (8th Antimatter Dimension Autobuyer Challenge)";
    return null;
  }

  static get costScalingStart() {
    if (EternityChallenge(5).isRunning) return DC.D0;
    return DC.E2.plusEffectsOf(
      TimeStudy(223),
      TimeStudy(224),
      TimeStudy(302),
      EternityChallenge(5).reward
    ).add(GlyphInfo.power.sacrificeInfo.effect());
  }

  static get type() {
    return this.typeAt(player.galaxies);
  }

  static typeAt(galaxies) {
    if (galaxies.gte(Galaxy.remoteStart)) {
      return GALAXY_TYPE.REMOTE;
    }
    if (galaxies.gte(this.costScalingStart)) {
      return GALAXY_TYPE.DISTANT;
    }
    return GALAXY_TYPE.NORMAL;
  }
}

export function galaxyReset() {
  EventHub.dispatch(GAME_EVENT.GALAXY_RESET_BEFORE);
  player.galaxies = player.galaxies.add(1);
  if (!Achievement(143).isUnlocked || (Pelle.isDoomed && !PelleUpgrade.galaxyNoResetDimboost.canBeApplied)) {
    player.dimensionBoosts = DC.D0;
  }
  softReset(0);
  if (Notations.current === Notation.emoji) player.requirementChecks.permanent.emojiGalaxies =
  player.requirementChecks.permanent.emojiGalaxies.add(1);
  // This is specifically reset here because the check is actually per-galaxy and not per-infinity
  player.requirementChecks.infinity.noSacrifice = true;
  EventHub.dispatch(GAME_EVENT.GALAXY_RESET_AFTER);
}

export function manualRequestGalaxyReset(bulk) {
  if (!Galaxy.canBeBought || !Galaxy.requirement.isSatisfied) return;
  if (GameEnd.creditsEverClosed) return;
  if (RealityUpgrade(7).isLockingMechanics && player.galaxies.gt(0)) {
    RealityUpgrade(7).tryShowWarningModal();
    return;
  }
  if (player.options.confirmations.antimatterGalaxy) {
    Modal.antimatterGalaxy.show({ bulk: bulk && EternityMilestone.autobuyMaxGalaxies.isReached });
    return;
  }
  requestGalaxyReset(bulk);
}

// All galaxy reset requests, both automatic and manual, eventually go through this function; therefore it suffices
// to restrict galaxy count for RUPG7's requirement here and nowhere else
export function requestGalaxyReset(bulk, limit = Number.MAX_VALUE) {
  const restrictedLimit = RealityUpgrade(7).isLockingMechanics ? DC.D1 : limit;
  if (EternityMilestone.autobuyMaxGalaxies.isReached && bulk) return maxBuyGalaxies(restrictedLimit);
  if (player.galaxies.gte(restrictedLimit) || !Galaxy.canBeBought || !Galaxy.requirement.isSatisfied) return false;
  Tutorial.turnOffEffect(TUTORIAL_STATE.GALAXY);
  galaxyReset();
  return true;
}

function maxBuyGalaxies(limit = DC.BEMAX) {
  if (player.galaxies.gte(limit) || !Galaxy.canBeBought || !Galaxy.requirement.isSatisfied) return false;
  // Check for ability to buy one galaxy (which is pretty efficient)
  const req = Galaxy.requirement;
  if (!req.isSatisfied) return false;
  const dim = AntimatterDimension(req.tier);
  if (Galaxy.buyableGalaxies(Decimal.round(dim.totalAmount)).lte(player.galaxies)) return false;
  const newGalaxies = Decimal.min(
    Galaxy.buyableGalaxies(Decimal.round(dim.totalAmount)), limit);
  if (Notations.current === Notation.emoji) {
    player.requirementChecks.permanent.emojiGalaxies = player.requirementChecks.permanent.emojiGalaxies
      .add(newGalaxies.sub(player.galaxies));
  }
  // Galaxy count is incremented by galaxyReset(), so add one less than we should:
  player.galaxies = newGalaxies.sub(1);
  galaxyReset();
  if (Enslaved.isRunning && player.galaxies.gt(1)) EnslavedProgress.c10.giveProgress();
  Tutorial.turnOffEffect(TUTORIAL_STATE.GALAXY);
  return true;
}
