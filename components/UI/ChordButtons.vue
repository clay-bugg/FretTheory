<template>
  <div class="chord-buttons">
    <!-- Note buttons on the left -->
    <div class="note-buttons">
      <button
        v-for="note in noteButtons"
        :key="note.display"
        :class="['note-btn', { active: store.rootNote === note.value }]"
        @click="store.rootNote = note.value"
      >
        <template v-if="note.alt">
          <span class="note-pair">
            <span>{{ note.display }}</span>
            <span>{{ note.alt }}</span>
          </span>
        </template>
        <template v-else>
          {{ note.display }}
        </template>
      </button>
    </div>

    <!-- Chord type buttons on the right -->
    <div class="chord-type-buttons">
      <button
        v-for="chord in extendedChordTypes"
        :key="chord.value"
        :class="['chord-btn', { active: store.chordType === chord.value }]"
        @click="store.chordType = chord.value"
      >
        {{ chord.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useKeyboardStore } from "~/stores/keyboardStore";

const store = useKeyboardStore();

// Note buttons with enharmonic pairs
const noteButtons = [
  { display: "C", value: "C" },
  { display: "C#", alt: "Db", value: "C#" },
  { display: "D", value: "D" },
  { display: "D#", alt: "Eb", value: "D#" },
  { display: "E", value: "E" },
  { display: "F", value: "F" },
  { display: "F#", alt: "Gb", value: "F#" },
  { display: "G", value: "G" },
  { display: "G#", alt: "Ab", value: "G#" },
  { display: "A", value: "A" },
  { display: "A#", alt: "Bb", value: "A#" },
  { display: "B", value: "B" },
];

// Extended chord types matching the image
const extendedChordTypes = [
  { label: "major", value: "maj" },
  { label: "5", value: "5" },
  { label: "add9", value: "add9" },
  { label: "aug", value: "+" },
  { label: "6", value: "maj6" },
  { label: "6/9", value: "6/9" },
  { label: "maj7", value: "maj7" },
  { label: "maj9", value: "maj9" },
  { label: "maj13", value: "maj13" },
  { label: "maj7(#11)", value: "maj7#11" },
  { label: "maj7(#5)", value: "maj7#5" },
  { label: "7", value: "7" },
  { label: "9", value: "9" },
  { label: "13", value: "13" },
  { label: "7(b9)", value: "7b9" },
  { label: "13(b9)", value: "13b9" },
  { label: "7(#9)", value: "7#9" },
  { label: "7(b13)", value: "7b13" },
  { label: "7(#5)", value: "7#5" },
  { label: "7(b9,b13)", value: "7b9b13" },
  { label: "7(#11)", value: "7#11" },
  { label: "7(b5)", value: "7b5" },
];
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
