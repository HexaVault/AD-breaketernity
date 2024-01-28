<script>
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "ShopTab",
};
</script>

<template>
  <div class="tab shop">
    <div>
      STD's cannot be bought on games made with the Break Eternity port of AD.
    </div>
  </div>
</template>

<style scoped>
.shop {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--color-text);
}

.c-shop-disclaimer {
  width: 80%;
  max-width: 100rem;
  font-size: 1.8rem;
  font-weight: bold;
  color: black;
  background: var(--color-bad);
  border: var(--var-border-width, 0.2rem) solid black;
  border-radius: var(--var-border-radius, 1rem);
  margin-top: 0.8rem;
}

.t-s1 .c-shop-disclaimer,
.t-s6 .c-shop-disclaimer,
.t-s10 .c-shop-disclaimer {
  color: var(--color-bad);
  background: black;
  border-color: var(--color-bad);
}

.c-login-info {
  font-size: 1.5rem;
}

.c-shop-header {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  margin: 1rem 0;
}

.c-shop-header__img {
  height: 40px;
  margin: 0 1rem;
}

.o-shop-button-button {
  display: flex;
  align-items: center;
  font-family: Typewriter;
  background: turquoise;
  border: none;
  border-radius: var(--var-border-radius, 0.5rem);
  margin: auto;
  margin-top: 1rem;
  padding: 0.5rem 2rem;
  cursor: pointer;
}

.o-shop-button-button--disabled {
  background: rgb(150, 150, 150);
  cursor: default;
}

.l-shop-buttons-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 93rem;
  margin: auto;
}

.c-shop-header .o-shop-button-button {
  margin: 0;
}
</style>
