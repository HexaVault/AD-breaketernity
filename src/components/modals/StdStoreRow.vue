<script>
import Payments from "@/core/payments";

export default {
  name: "StdStoreRow",
  props: {
    amount: {
      type: Number,
      required: true
    },
    cost: {
      type: Number,
      required: true
    }
  },
  computed: {
    amntString() {
      return i18n("modal", "STDStoreModalSTDCost", [this.amount]);
    }
  },
  methods: {
    purchase() {
      Payments.buyMoreSTD(this.amount, this.cost);
    }
  },
};
</script>

<template>
  <div class="c-modal-store-btn-container">
    <div class="o-modal-store-label">
      {{ amntString }}
    </div>
    <button
      class="o-modal-store-btn"
      @click="purchase"
    >
      $<span>{{ cost }}</span>
    </button>
  </div>
</template>