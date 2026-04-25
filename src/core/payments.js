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
  buyMoreSTD: STD => false,

  // Since we aren't actually contacting any database, this code is different to normal
  // eslint-disable-next-line no-unused-vars
  buyUpgrade(upgradeKey, cosmeticName) {
    GameUI.notify.info(`Successfully spent ${stdData.amountSpent} STD coins`, 10000);
  },
};

export default Payments;