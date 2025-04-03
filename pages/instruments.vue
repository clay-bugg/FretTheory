<template>
  <div class="page">
    <select v-model="selectedInstrument">
      <option v-for="instrument in instrumentOptions" :value="instrument.label">
        {{ instrument.label }}
      </option>
    </select>

    <Keyboard v-if="selectedInstrument === 'Keyboard'" />
    <Guitar v-else-if="selectedInstrument === 'Guitar'" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import Keyboard from "@/components/instruments/Keyboard.vue";
import Guitar from "@/components/instruments/Guitar.vue";

const instrumentOptions = ref([
  {
    label: "Keyboard",
    image: "public/images/backgrounds/nav-button-texture.png",
  },
  {
    label: "Guitar",
    image: "public/images/backgrounds/nav-button-texture.png",
  },
]);

const selectedInstrument = ref("Keyboard");
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
  margin-top: 4em;
    font-family: "Orbitron", sans-serif;
}
select {
  font-size: 1em;
  font-family: "Orbitron";
  border: 2px solid black;
  border-radius: 0.3em;
  padding: 0 0.2em;
}
</style>
