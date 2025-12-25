<template>
  <div class="octave-select control">
    <p class="control-label">Octaves: {{ store.octaveAmount }}</p>
    <div class="octave-selector">
      <input
        :checked="store.octaveAmount === '1'"
        :class="{ active: store.octaveAmount === '1' }"
        type="radio"
        value="1"
        @change="store.octaveAmount = '1'"
      />
      <input
        :checked="store.octaveAmount === '2'"
        :class="{ active: store.octaveAmount === '2' }"
        type="radio"
        value="2"
        @change="store.octaveAmount = '2'"
      />
      <input
        :checked="store.octaveAmount === '3'"
        :class="{ active: store.octaveAmount === '3' }"
        type="radio"
        value="3"
        @change="store.octaveAmount = '3'"
      />
    </div>
  </div>
</template>

<script setup>
import { useKeyboardStore } from "~/stores/keyboardStore";

const store = useKeyboardStore();
</script>

<style scoped>
.octave-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5em;
}
.octave-selector input {
  width: 25px;
  height: 25px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: 2px solid black;
  background-color: rgb(152, 12, 12);
  border-radius: 5px;
}
.octave-selector input.active {
  background-color: rgb(133, 206, 23);
}
.octave-selector input:hover {
  cursor: pointer;
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
