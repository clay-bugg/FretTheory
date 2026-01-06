<template>
  <header>
    <NuxtLink to="/" class="link">
      <h1>FretTheory</h1>
    </NuxtLink>
    <LayoutNavbar />
  </header>
</template>

<script setup>
const buttonSelected = ref("Instruments");

function selectButton(value) {
  buttonSelected.value = value;
}
</script>

<style scoped lang="scss">
@use "~/assets/scss/main.scss" as *;

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
  background-color: black;
  min-width: fit-content;
  font-family: "AR One Sans";
  padding: 30px 30px 4px;

  h1 {
    font-size: 3rem;
    font-weight: 700;
    color: black;
    position: relative;
    top: 5px;
    &:hover {
      cursor: pointer;
      color: black;
      text-shadow: 0 0 1px black;
    }
  }
}

.link {
  text-decoration: none;
}
</style>
