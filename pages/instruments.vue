°
<template>
  <div class="page">
    <InstrumentsInstrumentSwitcher />
  </div>
</template>

<script setup>
import { ref } from "vue";
const { keyboardType } = storeToRefs(useControlStore());
</script>

<style scoped lang="scss">
.page {
  transform: scale(0.85);
  transform-origin: top center;
  height: 100%;
  overflow-y: hidden;
}
</style>
