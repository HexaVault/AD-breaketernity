<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "RespecIAPModal",
  components: {
    ModalWrapperChoice
  },
  computed: {
    topLabel() {
      return i18n("modal", "respecIAPModalTitle");
    },
    messageA() {
      return i18n("modal", "respecIAPModalAreYouSure", [this.returnedSTDCount()], true)[0];
    },
    messageB() {
      return i18n("modal", "respecIAPModalAreYouSure", [this.returnedSTDCount()], true)[1];
    },
    notCompleteRefund() {
      return i18n("modal", "respecIAPModalNotAllRefund");
    },
    warningLabel() {
      return i18n("modal", "respecIAPModalBuyMoreToRespec");
    },
  },
  methods: {
    returnedSTDCount() {
      let std = DC.D0;
      for (const purchase of ShopPurchase.all) {
        if (purchase.config.instantPurchase) continue;
        std = std.add(purchase.purchases.mul(purchase.cost));
      }
      return std;
    },
    handleYesClick() {
      ShopPurchaseData.respecAll();
      EventHub.ui.offAll(this);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="respecIAP"
    @confirm="handleYesClick"
  >
    <template #header>
      {{ topLabel }}
    </template>
    <div class="c-modal-message__text">
      {{ messageA }}
      <img
        src="images/std_coin.png"
        class="o-shop-button-button__img"
      > {{ messageB }}
      <br>
      <br>
      {{ notCompleteRefund }}
      <br>
      <br>
      <b class="o-warning">{{ warningLabel }}</b>
    </div>
  </ModalWrapperChoice>
</template>

<style scoped>
.c-modal-message__text {
  vertical-align: middle;
}

.o-shop-button-button__img {
  height: 2.5rem;
  vertical-align: middle;
}

.o-warning {
  color: var(--color-infinity);
}
</style>