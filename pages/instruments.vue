<template>
  <div class="page">
    <InstrumentsInstrument />
    <InstrumentsKeyboardComponentsMenuPanel />
  </div>
</template>

<script setup>
import { ref } from "vue";
</script>

<style scoped lang="scss">
.page {
  transform: scale(0.85);
  transform-origin: top center;
  height: 110vh;
  overflow-y: hidden;
}
</style>
