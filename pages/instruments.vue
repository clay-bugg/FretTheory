<template>
  <div class="page">

    <div class="instrument-selector">

      <p class="instrument-selector-label">Instrument: </p>
      <select v-model="selectedInstrument">

        <option v-for="instrument in instrumentOptions" :value="instrument.label">
          {{ instrument.label }}
        </option>
        
      </select>
    </div>

    <Keyboard v-if="selectedInstrument === 'Keyboard'" />
    <Guitar v-else-if="selectedInstrument === 'Guitar'" />
  </div>
</template>


<script setup>

import { ref } from "vue";

import Keyboard from "@/components/instruments/Keyboard.vue";

import Guitar from "@/components/instruments/Guitar.vue";

const instrumentOptions = ref([
  { label: "Keyboard", image: "public/images/backgrounds/nav-button-texture.png"},
  { label: "Guitar", image: "public/images/backgrounds/nav-button-texture.png"},
]);

const selectedInstrument = ref("Keyboard");
</script>


<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  width: 100vw;
  margin-top: 3em;
  font-family: "Ubuntu", sans-serif;
}
.instrument-selector {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0.4em;
}
.instrument-selector-label {
  font-size: 1.2rem;
}
select {
  font-size: 1.2em;
  border: 2px solid black;
  border-radius: 0.3em;
  padding: 0 0.2em;
  margin-bottom: 2em;
}
</style>
