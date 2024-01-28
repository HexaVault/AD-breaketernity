<script>
export default {
  name: "ShopButton",
};
</script>

<template>
</template>

<style scoped>
.c-shop-button-container {
  display: flex;
  flex-direction: column;
  width: 30rem;
  height: 18rem;
  justify-content: space-between;
  color: white;
  background: #3c3c3c;
  border: var(--var-border-width, 0.2rem) solid #1f7d1f;
  border-radius: var(--var-border-radius, 0.5rem);
  margin: 0.5rem;
  padding: 1rem;
}

.o-shop-button-button {
  display: flex;
  align-items: center;
  font-family: Typewriter;
  background: turquoise;
  border: none;
  border-radius: var(--var-border-radius, 0.5rem);
  margin: 0 auto;
  padding: 0.5rem 2rem;
  cursor: pointer;
}

.o-shop-button-button--disabled {
  background: rgb(150, 150, 150);
  cursor: default;
}

.o-shop-button-button__img {
  height: 40px;
  margin-left: 1rem;
}

.o-shop-button-multiplier {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

.o-shop-button-multiplier--disabled {
  color: red;
  text-decoration: line-through;
}

.o-shop-button-locked-text {
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-bad);
}
</style>
