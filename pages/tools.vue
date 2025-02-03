<template>
  <div id="page">
    <Header :buttons="[
      { url: '/instruments', label: 'Instruments' },
      { url: '/tools', label: 'Tools' }
      ]"
    />
  </div>
</template>

<script>
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  gap: 2em;
  background-color: #3972A4
}
</style>