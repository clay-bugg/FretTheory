<template>
  <div class="keys">
    <div
      v-for="(key, index) in pianoKeys"
      :key="`${key.note}${key.octave}`"
      :style="{ fontSize: keyFontSize }"
      :id="`interval-${chordNotes.indexOf(key.note) + 1}`"
      class="key"
      :class="{
        black: key.sharp,
        white: !key.sharp,
        highlighted: chordNotes.includes(key.note),
        interval: chordNotes.includes(key.note),
        rootnote: key.note === rootNote,
        extendednote: isExtended(key.note),
      }"
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
const {
  currentPitch,
  chordNotes,
  chordIntervals,
  rootNote,
  notesDisplayed,
  notes,
} = storeToRefs(store);

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

function isExtended(noteName) {
  const interval = chordIntervals.value[noteName];
  if (!interval) return false;
  return ["9", "11", "13"].some((ext) => interval.includes(ext));
}
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
  padding: 0.4em;
  background-color: $white-keyboard-key;
  color: #242424;
  z-index: 1;
  font-size: 1.1rem;
}

.white:hover {
  filter: brightness(0.9);
}

.black {
  position: relative;
  left: 1.9em;
  width: 3.6em;
  height: 55%;
  overflow: hidden;
  border: 2px solid black;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  margin-left: -3.6em;
  padding-bottom: 0.6em;
  background-color: #101010;
  color: #cbcbcb;
  box-shadow: 0 2px 2px black;
  z-index: 2;
  font-size: 1rem;

  &:hover {
    background-color: #1a1a1a;
  }
}

.white.interval {
  background-color: #ffc552;
  color: black;
  border: 3px solid black;
  border-top: none;
  font-weight: 800;
}

.black.interval {
  background-color: #ffc552;
  color: black;
  border: 3px solid black;
  border-top: none;
  font-weight: 800;
}

.rootnote,
.black.rootnote,
.white.rootnote {
  background-color: #b81f1f;
  color: black;
  border: 3px solid black;
  border-top: none;
}

.black.extendednote,
.white.extendednote {
  color: black;
}
</style>
