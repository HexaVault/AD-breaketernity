const Payments = {
  interval: null,
  windowReference: null,
  // This is here to prevent notification spam; purchase canceling can be called multiple times before the first
  // call's Promise is settled
  hasCanceled: false,

  // Only called from clicking the "Buy More" button in the Shop tab
  // Note: If you actually want this to be functional, you'll need to do something here.
  // For most cases? Probably just add these to player.IAP
  // eslint-disable-next-line no-unused-vars
  buyMoreSTD: STD => player.IAP.std = player.IAP.std.add(STD),

  // Since we aren't actually contacting any database, this code is different to normal
  // eslint-disable-next-line no-unused-vars
  buyUpgrade(upgradeKey, cosmeticName) {
    const cost = ShopPurchase[upgradeKey].cost;
    if (!player.IAP.std.gt(cost)) {
      if (player.options.notifications.studies) GameUI.notify.info(`Could not purchase upgrade (Not enough STD)`);
    }
    player.IAP.std = player.IAP.std.sub(cost);
    player.IAP.purchases[upgradeKey] = player.IAP.purchases[upgradeKey].add(1);
    if (player.options.notifications.studies) GameUI.notify.info(`Successfully spent ${format(cost, 2)} STD coins`, 10000);
  },
};

export default Payments;