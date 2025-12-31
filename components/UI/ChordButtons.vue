<template>
<div class="chord-selector">

  <div class="dropdown">
    <select v-model="selectedScale">
      <option v-for="scale in scales" :key="scale" :value="scale">
        {{ scale }}
      </option>
    </select>
    <button class="finder-button"></button>
    <button class="player-button"></button>
  </div>

  <div class="chord">
    <h3>{{ selectedChord }}</h3>
  </div>

</div>

<div class="chord-types">
  
</div>
</template>

<script setup>
import { useKeyboardStore } from "~/stores/keyboardStore";

const store = useKeyboardStore();

</script>

<style scoped lang="scss">
@use "~/assets/scss/main.scss" as *;

.chord-buttons {
  display: flex;
  gap: 1em;
  padding: 1em;
  background-color: $bg-button-dark;
  border-radius: 12px;
  font-family: "Ubuntu", sans-serif;
}

.note-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.4em;
}

.chord-type-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.3em;
  max-height: 500px;
  overflow-y: auto;
}

.note-btn,
.chord-btn {
  background-color: $bg-button-hover;
  border: none;
  border-radius: 6px;
  color: $text-light-muted;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}

.note-btn {
  min-width: 70px;
  padding: 0.5em 0.8em;
}

.chord-btn {
  min-width: 90px;
  padding: 0.4em 0.8em;
  text-align: center;
}

.note-btn:hover,
.chord-btn:hover {
  background-color: $bg-button-hover-light;
}

.note-btn.active {
  background-color: $chord-btn-active-note;
  color: white;
}

.chord-btn.active {
  background-color: $chord-btn-active-type;
  color: $chord-btn-active-type-text;
}

.note-pair {
  display: flex;
  gap: 0.5em;
  justify-content: center;
}

.note-pair span {
  background-color: $bg-button-active;
  padding: 0.2em 0.4em;
  border-radius: 4px;
}

.note-btn.active .note-pair span {
  background-color: $overlay-white;
}

.chord-type-buttons::-webkit-scrollbar {
  width: 6px;
}

.chord-type-buttons::-webkit-scrollbar-track {
  background: $bg-scrollbar-track;
  border-radius: 3px;
}

.chord-type-buttons::-webkit-scrollbar-thumb {
  background: $bg-scrollbar-thumb;
  border-radius: 3px;
}

.chord-type-buttons::-webkit-scrollbar-thumb:hover {
  background: $bg-scrollbar-thumb-hover;
}
</style>
