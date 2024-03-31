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
    let amnt = new Decimal(800);
    if (RealityUpgrade(21).isBought) amnt = DC.E5;
    return amnt;
  }

  static get requirement() {
    return this.requirementAt(player.galaxies);
  }

  /**
   * Figure out what galaxy number we can buy up to
   * @param {number} currency Either dim 8 or dim 6, depends on current challenge
   * @returns {number} Max number of galaxies (total)
   */
  static buyableGalaxies(currency) {
    // eslint-disable-next-line max-len
    // Plz no ask how exponential math work i dont know i just code, see https://discord.com/channels/351476683016241162/439241762603663370/1210707188964659230m
    const minV = Galaxy.costScalingStart.min(Galaxy.remoteStart); // Take the smallest of the two values
    if (currency.lt(Galaxy.baseCost.add(Galaxy.costMult.times(minV) /* Pre exponential/quadratic? */))) {
      return Decimal.max(currency.sub(Galaxy.baseCost).div(Galaxy.costMult).floor(), player.galaxies);
    }
    if (currency.lt(Galaxy.requirementAt(Galaxy.remoteStart).amount)) {
      const dis = Galaxy.costScalingStart;
      const scale = Galaxy.costMult;
      const base = Galaxy.baseCost;
      // Quadratic equation
      const a = DC.D1;
      const b = scale.sub(1).sub(dis.times(2));
      const c = base.add(dis.pow(2)).sub(currency).sub(dis);
      const quad = decimalQuadraticSolution(a, b, c);
      return Decimal.max(quad, player.galaxies);
    }
    // eslint-disable-next-line max-len
    // Might not be perfect but at this point who gives a shit - If we can buy more we will loop a bit at the end to go through till we cant
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
      console.log("Repetitions in remote calculations (line 55-80 of galaxy.js) repeated far more than expected, logging.");
    }
    return Decimal.max(pur, player.galaxies);
  }

  static requirementAt(galaxies) {
    let amount = Galaxy.baseCost.add((galaxies.times(Galaxy.costMult)));

    const type = Galaxy.typeAt(galaxies);

    if (type === GALAXY_TYPE.DISTANT && EternityChallenge(5).isRunning) {
      amount = amount.add(Decimal.pow(galaxies, 2).add(galaxies));
    } else if (type === GALAXY_TYPE.DISTANT || type === GALAXY_TYPE.REMOTE) {
      const galaxyCostScalingStart = this.costScalingStart;
      const galaxiesBeforeDistant = Decimal.clampMin(galaxies.sub(galaxyCostScalingStart.add(1)), 0);
      amount = amount.add(Decimal.pow(galaxiesBeforeDistant, 2).add(galaxiesBeforeDistant));
    }

    if (type === GALAXY_TYPE.REMOTE) {
      amount = amount.times(Decimal.pow(1.002, galaxies.sub(Galaxy.remoteStart.sub(1))));
    }

    amount = amount.sub(Effects.sum(InfinityUpgrade.resetBoost));
    if (InfinityChallenge(5).isCompleted) amount = amount.sub(1);

    if (GlyphAlteration.isAdded("power")) amount *= getSecondaryGlyphEffect("powerpow");

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
    return DC.E2.add(new Decimal(TimeStudy(302).effectOrDefault(0)).add(Effects.sum(
      TimeStudy(223),
      TimeStudy(224),
      EternityChallenge(5).reward,
      GlyphSacrifice.power
    )));
  }

  static get type() {
    return this.typeAt(player.galaxies);
  }

  static typeAt(galaxies) {
    if (galaxies.gte(Galaxy.remoteStart)) {
      return GALAXY_TYPE.REMOTE;
    }
    if (EternityChallenge(5).isRunning || galaxies.gte(this.costScalingStart)) {
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
  if (Notations.current === Notation.emoji) player.requirementChecks.permanent.emojiGalaxies++;
  // This is specifically reset here because the check is actually per-galaxy and not per-infinity
  player.requirementChecks.infinity.noSacrifice = true;
  EventHub.dispatch(GAME_EVENT.GALAXY_RESET_AFTER);
}

export function manualRequestGalaxyReset(bulk) {
  if (!Galaxy.canBeBought || !Galaxy.requirement.isSatisfied) return;
  if (GameEnd.creditsEverClosed) return;
  if (RealityUpgrade(7).isLockingMechanics && player.galaxies > 0) {
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
  if (player.galaxies.gte(limit) || !Galaxy.canBeBought) return false;
  // Check for ability to buy one galaxy (which is pretty efficient)
  const req = Galaxy.requirement;
  if (!req.isSatisfied) return false;
  const dim = AntimatterDimension(req.tier);
  const newGalaxies = Decimal.min(
    Galaxy.buyableGalaxies(Decimal.round(dim.totalAmount)), limit);
  if (Notations.current === Notation.emoji) {
    player.requirementChecks.permanent.emojiGalaxies += newGalaxies - player.galaxies;
  }
  // Galaxy count is incremented by galaxyReset(), so add one less than we should:
  player.galaxies = newGalaxies.sub(1);
  galaxyReset();
  if (Enslaved.isRunning && player.galaxies.gt(1)) EnslavedProgress.c10.giveProgress();
  Tutorial.turnOffEffect(TUTORIAL_STATE.GALAXY);
  return true;
}
