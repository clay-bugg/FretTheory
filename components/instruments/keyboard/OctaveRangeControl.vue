<template>
  <div class="starting-octave control">
    <p class="control-label">Octave Range</p>
    <div class="starting-octave-selector">
      <button
        class="starting-octave-button"
        @click="store.changeStartingOctave('-')"
      >
        -
      </button>
      <p v-if="store.octaveAmount === '1'">{{ store.startingOctave }}</p>
      <p v-else-if="store.octaveAmount === '2'">
        {{ store.startingOctave }}-{{ store.startingOctave + 1 }}
      </p>
      <p v-else-if="store.octaveAmount === '3'">
        {{ store.startingOctave }}-{{ store.startingOctave + 2 }}
      </p>
      <button
        class="starting-octave-button"
        @click="store.changeStartingOctave('+')"
      >
        +
      </button>
    </div>
  </div>
</template>

<script setup>
import { useKeyboardStore } from "~/stores/keyboardStore";

const store = useKeyboardStore();
</script>

<style scoped>
.starting-octave-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: fit-content;
  gap: 0.4em;
  font-size: 1.2rem;
  font-weight: 700;
}
.starting-octave-button {
  width: 25px;
  height: 25px;
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
.control-label {
  font-size: 1rem;
  text-align: center;
  text-wrap: nowrap;
}
</style>
