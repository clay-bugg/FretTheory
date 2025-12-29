<template>
  <header>
    <h1>FretTheory</h1>
    <nav>
      <NuxtLink
        v-for="button in ['Instruments', 'Theory']"
        class="button"
        :class="{ selected: buttonSelected === button }"
        @click="selectButton(button)"
        >{{ button }}</NuxtLink
      >
    </nav>
  </header>
</template>

<script setup>
const buttonSelected = ref("Instruments");

function selectButton(value) {
  buttonSelected.value = value;
}
</script>

<style scoped>
header {
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid black;
  position: relative;
  z-index: 1;
  font-family: "Montaserif";
  background-color: #1f1f1f;
  min-width: fit-content;
  font-family: "AR One Sans";
  padding: 20px 30px 4px;
}

h1 {
  font-size: 3rem;
  font-weight: 700;
  color: #ebebeb;
  position: relative;
  top: 5px;
}

nav {
  display: flex;
  height: 100%;
  justify-content: center;
  width: fit-content;
  align-items: flex-end;
  gap: 20px;
  .button {
    text-decoration: none;
    color: #ebebeb;
    font-size: 1.4rem;
    font-weight: 400;
    &:hover {
      cursor: pointer;
      color: #ffffff;
    }
    &.selected {
      font-weight: 600;
    }
  }
}
</style>
