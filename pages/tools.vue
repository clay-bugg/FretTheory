<template>
  <div id="page">
    <Header :buttons="[
      { url: '/instruments', label: 'Instruments' },
      { url: '/tools', label: 'Tools' }
      ]"
    />
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 2em;
  background-color: #3972A4
}
</style>