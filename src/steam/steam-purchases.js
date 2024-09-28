import * as PlayFab from "./bindings/playfab";
import { MAC } from "@/env";

export async function loginPlayFabWithSteam(ticket, screenName) {
  await PlayFab.LoginWithSteam(ticket);
  PlayFab.UpdateUserTitleDisplayName(screenName);
  validatePurchases();
}

let validateTimeout = 0;
let pendingValidations = [];
let isValidating = false;
let retryValidation = false;

export async function validatePurchases() {
  if (isValidating) {
    retryValidation = true;
    return;
  }

  clearTimeout(validateTimeout);
  isValidating = true;
  // Copy pendingValidations, because it will be modified in validatePurchase
  const orders = [...pendingValidations];
  for (const order of orders) {
    try {
      await validatePurchase(order);
    } catch {
      // Do nothing, will be retried.
    }
  }
  isValidating = false;
  const timeout = retryValidation ? 0 : 2000;
  validateTimeout = setTimeout(validatePurchases, timeout);
  retryValidation = false;
}

async function validatePurchase(orderId) {
  const confirm = await PlayFab.ConfirmPurchase(orderId);
  const purchaseName = confirm.Items[0].ItemId;
  const purchaseInstance = confirm.Items[0].ItemInstanceId;

  await PlayFab.ConsumeItem(purchaseInstance, 1);
  const stdsBought = Number(purchaseName.replace("STD", ""));
  pendingValidations = pendingValidations.filter(item => item !== orderId);
  await PlayFab.AddUserVirtualCurrency(stdsBought, "ST");
  GameUI.notify.info(`${stdsBought} STDs Obtained!`);
}

export function hasPendingPurchaseConfirmations() {
  return MAC && pendingValidations.length > 0;
}


export async function purchaseShopItem(key, cost, cosmeticId) {
  await PlayFab.PurchaseItem(key, cost, "ST");
  if (cosmeticId !== undefined) {
    await storeCosmetic(cosmeticId);
  }
}

async function storeCosmetic(id) {
  const userData = await PlayFab.GetUserData();
  const cosmetics = new Set(userData.Data?.Cosmetics?.Value?.split(",") ?? []);
  cosmetics.add(id);
  const updatedCosmetics = [...cosmetics];
  await PlayFab.UpdateUserData({
    Cosmetics: updatedCosmetics.join(",")
  });
  GameUI.update();
}
