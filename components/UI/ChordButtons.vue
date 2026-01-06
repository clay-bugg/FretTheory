<template>
  <div class="chord-selector">
    <div class="dropdown">
      <select v-model="selectedScale">
        <option v-for="scale in scales" :key="scale" :value="scale">
          {{ scale }}
        </option>
      </select>

      <div class="keyboard-type-buttons">
        <button
          v-for="button in buttons"
          :key="button.name"
          class="keyboard-type-button"
        >
          <img
            :src="`/images/buttons/${button.name}.png`"
            :style="button.style"
          />
        </button>
      </div>
    </div>

    <div class="chord">
      <h3>{{ selectedChord }}</h3>
    </div>
  </div>

  <div class="chord-types"></div>
</template>

<script setup>
import { useKeyboardStore } from "~/stores/keyboardStore";

const store = useKeyboardStore();

const buttons = ref([
  {
    name: "player",
    style: { width: "100%", height: "30px" },
  },
  {
    name: "finder",
    logo: "/images/buttons/finder.png",
    style: { width: "100%", height: "auto" },
  },
  {
    name: "MIDI",
    logo: "/images/buttons/MIDI.png",
    style: { width: "100%", height: "auto" },
  },
]);
</script>

<style scoped lang="scss">
@use "~/assets/scss/main.scss" as *;

.dropdown {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: fit-content;
  gap: 0.3em;

  .keyboard-type-buttons {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 0.2em;

    .keyboard-type-button {
      width: 100%;
      height: 40px;
      background: $black-panel;
      border-radius: 10px;
      border: 4px solid black;
      padding: 0.5em 0;
      color: white;
    }
  }
}
</style>
