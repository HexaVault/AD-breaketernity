import { BitUpgradeState, RebuyableMechanicState } from "../game-mechanics";
import { DC } from "../constants";
import { GameDatabase } from "../secret-formula/game-database";

import { Quotes } from "./quotes";

export const Teresa = {
  timePoured: 0,
  lastUnlock: "effarig",
  pouredAmountCap: 1e24,
  displayName: "Teresa",
  possessiveName: "Teresa's",
  get isUnlocked() {
    return Achievement(147).isUnlocked;
  },
  pourRM(diff) {
    if (this.pouredAmount >= Teresa.pouredAmountCap) return;
    this.timePoured += diff;
    const rm = Currency.realityMachines.value.max(1e100);
    const rmPoured = Math.min((this.pouredAmount + 1e6) * 0.01 * Math.pow(this.timePoured, 2), rm.toNumber());
    this.pouredAmount += Math.min(rmPoured, Teresa.pouredAmountCap - this.pouredAmount);
    Currency.realityMachines.subtract(rmPoured);
    this.checkForUnlocks();
  },
  checkForUnlocks() {
    for (const info of TeresaUnlocks.all) {
      info.unlock();
    }
  },
  initializeRun() {
    clearCelestialRuns();
    player.celestials.teresa.run = true;
  },
  rewardMultiplier(antimatter) {
    return Decimal.max(Decimal.pow(antimatter.plus(1).log10().div(1.5e8), 12), 1);
  },
  get pouredAmount() {
    return player.celestials.teresa.pouredAmount;
  },
  set pouredAmount(amount) {
    player.celestials.teresa.pouredAmount = amount;
  },
  get fill() {
    return Math.min(Math.log10(this.pouredAmount) / 24, 1);
  },
  get possibleFill() {
    return Decimal.min(Currency.realityMachines.value.plus(this.pouredAmount).max(1).log10().div(24), 1).toNumber();
  },
  get rmMultiplier() {
    return Decimal.max(250 * Math.pow(this.pouredAmount / 1e24, 0.1), 1);
  },
  get runRewardMultiplier() {
    return this.rewardMultiplier(player.celestials.teresa.bestRunAM);
  },
  get isRunning() {
    return player.celestials.teresa.run;
  },
  get runCompleted() {
    return player.celestials.teresa.bestRunAM.gt(1);
  },
  quotes: Quotes.teresa,
  symbol: "Ϟ",

  reset() {
    player.celestials.teresa.pouredAmount = 0;
    player.celestials.teresa.unlockBits = 0;
    player.celestials.teresa.run = false;
    player.celestials.teresa.bestRunAM = DC.D1;
    player.celestials.teresa.bestAMSet = [];
    player.celestials.teresa.perkShop = [DC.D0, DC.D0, DC.D0, DC.D0, DC.D0, DC.D0];
    player.celestials.teresa.lastRepeatedMachines = DC.D0;
    player.celestials.teresa.lastRepeatediM = DC.D0;
  },
};

class PerkShopUpgradeState extends RebuyableMechanicState {
  constructor(config) {
    super(config);
    this.costCap = config.costCap;
  }

  get currency() {
    return Currency.perkPoints;
  }

  get boughtAmount() {
    return player.celestials.teresa.perkShop[this.id];
  }

  set boughtAmount(value) {
    player.celestials.teresa.perkShop[this.id] = value;
  }

  get isCapped() {
    return Decimal.gte(this.cost, this.costCap());
  }

  get isAvailableForPurchase() {
    const otherReq = this.config.otherReq ? this.config.otherReq() : true;
    return this.currency.value.gte(this.cost) && otherReq;
  }

  onPurchased() {
    if (this.id === 0) {
      GameCache.staticGlyphWeights.invalidate();
    }
    if (this.id === 1) {
      Autobuyer.reality.bumpAmount(2);
    }
    // Give a single music glyph
    if (this.id === 4 && !Pelle.isDoomed) {
      if (GameCache.glyphInventorySpace.value === 0) {
        // Refund the perk point if they didn't actually get a glyph
        Currency.perkPoints.add(1);
        GameUI.notify.error("You have no empty inventory space!");
      } else {
        Glyphs.addToInventory(GlyphGenerator.musicGlyph());
        GameUI.notify.success("Created a Music Glyph");
      }
    }
    // Fill the inventory with music glyphs
    if (this.id === 5 && !Pelle.isDoomed) {
      const toCreate = GameCache.glyphInventorySpace.value;
      for (let count = 0; count < toCreate; count++) Glyphs.addToInventory(GlyphGenerator.musicGlyph());
      GameUI.notify.success(`Created ${quantifyInt("Music Glyph", toCreate)}`);
    }
  }
}

class TeresaUnlockState extends BitUpgradeState {
  get bits() { return player.celestials.teresa.unlockBits; }
  set bits(value) { player.celestials.teresa.unlockBits = value; }

  get price() {
    return this.config.price;
  }

  get pelleDisabled() {
    return Pelle.isDoomed && this.config.isDisabledInDoomed;
  }

  get isEffectActive() {
    return !this.pelleDisabled;
  }

  get canBeUnlocked() {
    return !this.isUnlocked && Teresa.pouredAmount >= this.price;
  }

  get description() {
    return typeof this.config.description === "function" ? this.config.description() : this.config.description;
  }

  onUnlock() {
    this.config.onUnlock?.();
  }
}

export const TeresaUnlocks = mapGameDataToObject(
  GameDatabase.celestials.teresa.unlocks,
  config => new TeresaUnlockState(config)
);

export const PerkShopUpgrade = mapGameDataToObject(
  GameDatabase.celestials.perkShop,
  config => new PerkShopUpgradeState(config)
);

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  if (Tab.celestials.teresa.isOpen) Teresa.quotes.initial.show();
});

EventHub.logic.on(GAME_EVENT.GAME_LOAD, () => Teresa.checkForUnlocks());
