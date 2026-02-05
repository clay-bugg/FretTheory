<template>
  <div class="instrument-switcher">
    <InstrumentsKeyboard
      v-if="
        store.selectedInstrument === 'Piano' ||
        store.selectedInstrument === 'Keyboard'
      "
    />
    <InstrumentsGuitar v-else-if="store.selectedInstrument === 'Guitar'" />
    <InstrumentsDrums v-else-if="store.selectedInstrument === 'Drums'" />
    <div v-else class="fallback">
      <InstrumentsKeyboard />
    </div>
  </div>
</template>

<script setup>
import { useControlStore } from "~/stores/controlStore";
const store = useControlStore();
</script>

<style scoped>
.instrument-switcher {
  width: 100%;
  height: 100%;
}
</style>
