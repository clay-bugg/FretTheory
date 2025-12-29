<template>
  <div class="tone-selector-box control">
    <p>Tone</p>
    <select v-model="store.currentTone" class="tone-selector">
      <option name="piano" value="piano">Piano</option>
      <option name="synth" value="synth">Synth</option>
    </select>
  </div>
</template>

<script setup>
import { useKeyboardStore } from "~/stores/keyboardStore";

const store = useKeyboardStore();
</script>

<style scoped>
.tone-selector {
  font-size: 1rem;
  font-family: inherit;
  border: 2px solid black;
  border-radius: 0.3em;
  text-align: center;
  font-weight: 500;
  padding: 0.1em;
}
.control {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  gap: 0.5em;
  padding: 0.5em 0;
}
</style>
