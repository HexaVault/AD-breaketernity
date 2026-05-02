export const shopPurchases = {
  dimPurchases: {
    key: "dimPurchases",
    cost: new Decimal(30),
    description: "Double all your Antimatter Dimension multipliers. Forever.",
    multiplier: purchases => Decimal.pow(2, purchases),
    formatEffect: x => formatX(x, 2),
  },
  allDimPurchases: {
    key: "allDimPurchases",
    cost: new Decimal(60),
    description: () => `Double BASE Dimension multipliers (multiplicative until ${formatX(32, 1, 1)}, then adding ${formatX(2, 0, 0)} each). Forever.`,
    multiplier: purchases => Decimal.min(Decimal.pow(2, purchases), purchases.mul(2).add(22)),
    formatEffect: x => formatX(x, 2),
  },
  IPPurchases: {
    key: "IPPurchases",
    cost: new Decimal(40),
    description: "Double your Infinity Point gain from all sources. (additive)",
    multiplier: purchases => purchases.mul(2).clampMin(1),
    formatEffect: x => formatX(x, 2),
    isUnlocked: () => PlayerProgress.infinityUnlocked(),
    lockText: "Infinity",
  },
  replicantiPurchases: {
    key: "replicantiPurchases",
    cost: new Decimal(60),
    description: "Increase your Replicanti gain by 50%. (additive)",
    multiplier: purchases => purchases.div(2).add(1),
    formatEffect: x => formatX(x, 2, 1),
    isUnlocked: () => Replicanti.areUnlocked || PlayerProgress.eternityUnlocked(),
    lockText: "Replicanti",
  },
  EPPurchases: {
    key: "EPPurchases",
    cost: new Decimal(50),
    description: "Triple your Eternity Point gain from all sources. (additive)",
    multiplier: purchases => purchases.mul(2).clampMin(1),
    formatEffect: x => formatX(x, 2),
    isUnlocked: () => PlayerProgress.eternityUnlocked(),
    lockText: "Eternity",
  },
  dilatedTimePurchases: {
    key: "dilatedTimePurchases",
    cost: new Decimal(40),
    description: () => `Increase your Dilated Time gain by ${formatPercents(0.5, 0, 0)}. (additive)`,
    multiplier: purchases => purchases.div(2).add(1),
    formatEffect: x => formatX(x, 2, 1),
    isUnlocked: () => PlayerProgress.dilationUnlocked() || PlayerProgress.realityUnlocked(),
    lockText: "Dilation",
  },
  RMPurchases: {
    key: "RMPurchases",
    cost: new Decimal(60),
    description: () => `Increase your Reality Machine gain by ${formatPercents(1, 0, 0)}. (additive)`,
    multiplier: purchases => purchases.add(1),
    formatEffect: x => formatX(x, 2),
    isUnlocked: () => PlayerProgress.realityUnlocked(),
    lockText: "Reality",
  },
  smallTimeSkip: {
    key: "smallTimeSkip",
    cost: new Decimal(10),
    description: () => `Get ${formatInt(6)} hours worth of offline production. (Autobuyers might not work at full speed)`,
    instantPurchase: true,
    onPurchase: () => {
      shop.purchaseTimeSkip();
    }
  },
  bigTimeSkip: {
    key: "bigTimeSkip",
    cost: new Decimal(20),
    description: () => `Get ${formatInt(24)} hours worth of offline production. (Autobuyers won't work at full speed)`,
    instantPurchase: true,
    onPurchase: () => {
      shop.purchaseLongerTimeSkip();
    }
  },
  singleCosmeticSet: {
    key: "singleCosmeticSet",
    cost: new Decimal(20),
    description: "Unlock a Glyph cosmetic set of your choice",
    instantPurchase: true,
    onPurchase: () => {
      // The actual unlocks are handled in the ShopPurchaseData object, so we just show notifications here
      if (player.options.notifications.shop) GameUI.notify.info(
        `You have purchased the "${GlyphAppearanceHandler.chosenFromModal.name}" Set for Glyph cosmetics!`,
        10000);
      GlyphAppearanceHandler.chosenFromModal = null;
      GlyphAppearanceHandler.applyNotification();
    },
    isUnlocked: () => PlayerProgress.realityUnlocked(),
    lockText: "Reality",
  },
  allCosmeticSets: {
    key: "allCosmeticSets",
    cost: () => {
      // Both of these are also on the payment backend, which would need to be changed as well
      const baseCost = 420;
      const totalSets = Object.keys(GameDatabase.reality.glyphCosmeticSets).length;

      // Using this instead of the actual set count maintains consistency with the backend price,
      // at the cost of the frontend UI being wrong for cheated saves
      const currentSetCount = player.records.fullGameCompletions;
      return Decimal.floor(baseCost * (totalSets - currentSetCount) / totalSets);
    },
    description: "Unlock all remaining Glyph cosmetic sets at once",
    instantPurchase: true,
    onPurchase: () => {
      // The actual unlocks are handled in the ShopPurchaseData object, so we just show notifications here
      if (player.options.notifications.shop) GameUI.notify.info(`You have unlocked all sets for Glyph cosmetics!`, 15000);
      GlyphAppearanceHandler.applyNotification();
    },
    isUnlocked: () => PlayerProgress.realityUnlocked(),
    lockText: "Reality",
  },
};