<template>
  <div class="keys">
    <div
      v-for="(key, index) in pianoKeys"
      :key="`${key.note}${key.octave}`"
      :style="{ fontSize: keyFontSize }"
      :id="`interval-${chordNotes.indexOf(key.note) + 1}`"
      :class="[
        'key',
        {
          black: key.sharp,
          white: !key.sharp,
          'highlighted-note': chordNotes.includes(key.note),
          interval: chordNotes.includes(key.note),
          'root-note': key.note === rootNote,
        },
      ]"
      @mousedown="$emit('playKey', key.note, key.octave)"
      @mouseup="$emit('stopKey', key.note, key.octave)"
      @mouseleave="$emit('stopKey', key.note, key.octave)"
    >
      <span v-if="notesDisplayed === 'all'">{{ key.note }}</span>
      <span v-if="notesDisplayed === 'chord' && chordNotes.includes(key.note)">
        {{ key.note }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { useKeyboardStore } from "~/stores/keyboardStore";

const store = useKeyboardStore();
const { currentPitch, chordNotes, rootNote, notesDisplayed, notes } =
  storeToRefs(store);

defineEmits(["playKey", "stopKey"]);

const pianoKeys = computed(() => {
  const octavesArray = Array.from(
    { length: 2 },
    (_, i) => currentPitch.value + i
  );

  const keys = [];
  for (const octave of octavesArray) {
    notes.value.forEach((note) => {
      keys.push({
        note,
        octave,
        sharp: note.includes("#"),
      });
    });
  }

  return keys;
});
</script>

<style scoped lang="scss">
@use "~/assets/scss/main.scss" as *;

.keys {
  position: relative;
  display: flex;
  width: 100%;
  height: 240px;
  overflow: hidden;
  border-top: 15px solid black;
  border-right: 2px solid black;
  border-left: 2px solid black;
  margin-bottom: 1em;
  font-family: "Lexend";
  z-index: 0;
}

.key {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  border: 1px solid black;
  padding-bottom: 0.2em;
  font-size: 0.9rem;
  font-weight: 600;
}

.key:hover {
  cursor: pointer;
}

.white {
  position: relative;
  flex: 1;
  width: 100%;
  height: 100%;
  border: 1px solid black;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  padding: 0.6em;
  background-color: $key-white;
  color: black;
  z-index: 1;
}

.white:hover {
  background-color: $key-white-hover;
}

.black {
  position: relative;
  left: 1.9em;
  width: 3.6em;
  height: 55%;
  overflow: hidden;
  border: 1px solid black;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  margin-left: -3.6em;
  padding-bottom: 0.6em;
  background-color: $key-black;
  color: $text-white;
  box-shadow: -2px 0 1px $key-shadow;
  z-index: 2;
}

.black:hover {
  background-color: $key-black-hover;
}

.white.interval {
  background-color: $key-interval;
}

.black.interval {
  background-color: $key-interval;
  color: black;
}

.root-note {
  background-color: $key-root !important;
  color: white;
}
</style>
