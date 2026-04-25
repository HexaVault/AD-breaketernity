import { RebuyableMechanicState } from "./game-mechanics";

import Payments from "./payments";

export const shop = {};

export const ShopPurchaseData = {
  respecAvailable: false,
  lastRespec: DC.BEMAX,
  unlockedCosmetics: [],

  get currentSTD() {
    return player.IAP.std;
  },

  set currentSTD(value) {
    // You can't have less STDs then you have spent
    player.IAP.std = value.clampMin(this.spentSTD);
  },

  get spentSTD() {
    return player.IAP.spentSTD;
  },

  set spentSTD(value) {
    // You can't spend more STDs then you have
    player.IAP.spentSTD = value.clampMax(this.currentSTD);
  },

  get availableSTD() {
    return this.currentSTD.sub(this.spentSTD);
  },

  get isIAPEnabled() {
    return this.availableSTD.gt(0) && player.IAP.enabled;
  },

  // We also allow for respecs if it's been at least 3 days since the last one
  get timeUntilRespec() {
    // Since we aren't actually doing payments, this is linked to the games realtime factor. Change if necessary.
    const msSinceLast = Date.now() - new Date(ShopPurchaseData.lastRespec).getTime();
    return TimeSpan.fromMilliseconds(new Decimal(2592e5 - msSinceLast).max(0));
  },

  get canRespec() {
    return this.respecAvailable || this.timeUntilRespec.totalDays <= 0;
  },

  resetSTD() {
    this.totalSTD = 0;
    this.spentSTD = 0;
    this.respecAvailable = false;
    this.unlockedCosmetics = [];
    for (const key of Object.keys(GameDatabase.shopPurchases)) this[key] = DC.D0;
  },


  respecRequest() {
    if (player.options.confirmations.respecIAP) {
      Modal.respecIAP.show();
    } else {
      this.respecAll();
    }
  },

  respecAll() {
    if (!this.canRespec) {
      // This case only happens if the player is cheating and using the console to make the game think it has a respec
      // when on the backend they don't. Nevertheless, responsive UI rarely hurts
      GameUI.notify.error("You do not have a respec available", 10000);
      return;
    }
    if (stdData.success) GameUI.notify.info("STD respec successful!", 10000);
    else GameUI.notify.error("No purchases to respec!", 10000);
    this.updateLocalSTD(stdData.data);
  },
};

// We track the local state of shop purchases here, so dynamically add all the keys which exist in the gameDB
for (const key of Object.keys(GameDatabase.shopPurchases)) ShopPurchaseData[key] = player.IAP.purchases[key];

class ShopPurchaseState extends RebuyableMechanicState {
  get currency() {
    return ShopPurchaseData.availableSTD;
  }

  get isAffordable() {
    return this.currency >= this.cost;
  }

  get description() {
    const desc = this.config.description;
    return typeof desc === "function" ? desc() : desc;
  }

  get cost() {
    const cost = this.config.cost;
    return typeof cost === "function" ? cost() : cost;
  }

  // ShopPurchaseData for any particular key is undefined in between page load and STD load,
  // so we need to guard against that causing NaNs to propagate through the save
  get purchases() {
    return ShopPurchaseData[this.config.key] ?? 0;
  }

  set purchases(value) {
    if (!Number.isFinite(value)) return;
    ShopPurchaseData[this.config.key] = value;
  }

  isUnlocked() {
    return player.records.fullGameCompletions > 0 || (this.config.isUnlocked?.() ?? true);
  }

  get lockText() {
    return this.config.lockText;
  }

  get shouldDisplayMult() {
    return Boolean(this.config.multiplier);
  }

  get currentMult() {
    if (!this.shouldDisplayMult) return "";
    return this.config.multiplier(ShopPurchaseData.isIAPEnabled ? this.purchases : DC.D0);
  }

  get nextMult() {
    if (!this.shouldDisplayMult) return "";
    return this.config.multiplier(ShopPurchaseData.isIAPEnabled ? this.purchases.add(1) : DC.D0);
  }

  // We want to still display the correct value in the button, so we need separate getters for it
  get currentMultForDisplay() {
    if (!this.shouldDisplayMult) return "";
    return this.config.multiplier(this.purchases);
  }

  get nextMultForDisplay() {
    if (!this.shouldDisplayMult) return "";
    return this.config.multiplier(this.purchases.add(1));
  }

  formatEffect(effect) {
    return this.config.formatEffect?.(effect) || formatX(effect, 2, 0);
  }

  purchase() {
    if (!this.canBeBought) return false;
    if (GameEnd.creditsEverClosed) return false;
    if (this.config.instantPurchase && ui.$viewModel.modal.progressBar) return false;

    const cosmeticId = this.config.key === "singleCosmeticSet"
      ? GlyphAppearanceHandler.chosenFromModal?.id
      : undefined;

    const success = Payments.buyUpgrade(this.config.key, cosmeticId);
    if (!success) return false;

    if (player.IAP.enabled) Speedrun.setSTDUse(true);
    if (this.config.instantPurchase) this.config.onPurchase();
    GameUI.update();
    return true;
  }
}

export const ShopPurchase = mapGameDataToObject(
  GameDatabase.shopPurchases,
  config => new ShopPurchaseState(config)
);

shop.purchaseTimeSkip = function() {
  Speedrun.setSTDUse(true);
  simulateTime(3600 * 6);
};

shop.purchaseLongerTimeSkip = function() {
  Speedrun.setSTDUse(true);
  simulateTime(3600 * 24);
};