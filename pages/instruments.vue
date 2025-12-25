<template>
  <div class="page">
    <UIInstrumentSelector />
    <Keyboard v-if="selectedInstrument === 'Keyboard'" />
    <Guitar v-else-if="selectedInstrument === 'Guitar'" />
  </div>
</template>

<script setup>
  import { storeToRefs } from 'pinia'
  const { selectedInstrument } = storeToRefs(control)
</script>

<style scoped lang="scss">
.page {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  width: 100vw;
  margin-top: 3em;
  font-family: "Ubuntu", sans-serif;
}
</style>
