<template>
  <div class="chord-selector-box">
    <label for="root-note-selector">Chord: </label>
    <select class="root-note-selector" v-model="store.rootNote">
      <option v-for="note in store.notes" :key="note" :value="note">
        {{ note }}
      </option>
    </select>

    <select class="chord-type-selector" v-model="store.chordType">
      <option
        v-for="type in store.chordTypes"
        :key="type.value"
        :value="type.value"
      >
        {{ type.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { useKeyboardStore } from "~/stores/keyboardStore";

const store = useKeyboardStore();
</script>

<style scoped>
.chord-selector-box {
  display: flex;
  align-items: center;
  gap: 0.4em;
  z-index: 1;
}
.chord-selector-box select {
  font-size: 1em;
  font-family: inherit;
  border: 2px solid black;
  border-radius: 0.3em;
  padding: 0 0.2em;
}
</style>
