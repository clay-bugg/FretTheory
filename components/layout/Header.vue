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
  padding: 30px 30px 4px;

  h1 {
    font-size: 3rem;
    font-weight: 700;
    color: #ebebeb;
    position: relative;
    top: 5px;
    &:hover {
      cursor: pointer;
      color: #ffffff;
      text-shadow: 0 0 1px #ffffff;
    }
  }
}

.link {
  text-decoration: none;
}
</style>
