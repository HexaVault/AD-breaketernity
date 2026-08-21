<script>
import ModalWrapper from "@/components/modals/ModalWrapper";
import StdStoreRow from "@/components/modals/StdStoreRow";

export default {
  name: "StdStoreModal",
  components: {
    ModalWrapper,
    StdStoreRow
  },
  data() {
    return {
      macPurchaser: false,
    };
  },
  computed: {
    topLabel() {
      return i18n("modal", "STDStoreModalTitle");
    },
    confirmPurchase() {
      return i18n("modal", "STDStoreModalConfirm");
    },
    mac() {
      return i18n("modal", "STDStoreModalRequiredOnMac");
    },
  },
  methods: {
    update() {
      this.macPurchaser = false;
      // SteamRuntime.hasPendingPurchaseConfirmations;
    },
    macConfirm() {
      // SteamRuntime.validatePurchases();
    }
  },
};
</script>

<template>
  <ModalWrapper class="c-shop-modal">
    <template #header>
      {{ topLabel }}
    </template>
    <span v-if="macPurchaser">
      <button
        class="o-shop-button-button"
        @click="macConfirm()"
      >
        {{ confirmPurchase }}
      </button>
      <br><span>{{ mac }}</span><br>
    </span>
    <div class="l-modal-store-content">
      <img src="/images/std_coin.png">
      <div class="c-modal-store-buttons">
        <StdStoreRow
          :amount="30"
          :cost="2.99"
        />
        <StdStoreRow
          :amount="60"
          :cost="4.99"
        />
        <StdStoreRow
          :amount="140"
          :cost="9.99"
        />
        <StdStoreRow
          :amount="300"
          :cost="19.99"
        />
        <StdStoreRow
          :amount="1000"
          :cost="49.99"
        />
      </div>
    </div>
  </ModalWrapper>
</template>