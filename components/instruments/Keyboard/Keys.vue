<template>
  <div
    class="keys"
    @mousedown="isMouseDown = true"
    @mouseup="handleGlobalMouseUp"
    @mouseleave="handleGlobalMouseUp"
  >
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
        'midi-playing': isMidiActive(key.note, key.octave),
        playing: isKeyPlaying(key.note, key.octave),
      }"
      @mousedown.prevent="handleKeyMouseDown(key)"
      @mouseup="handleKeyMouseUp(key)"
      @mouseenter="handleKeyMouseEnter(key)"
      @mouseleave="handleKeyMouseLeave(key)"
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

const emit = defineEmits(["playKey", "stopKey"]);

const props = defineProps({
  midiActiveNotes: {
    type: Set,
    default: () => new Set(),
  },
});

// Mouse drag state for glissando
const isMouseDown = ref(false);
const playingKeys = ref(new Set());

// Check if a specific key is currently playing (for visual feedback)
function isKeyPlaying(note, octave) {
  return playingKeys.value.has(`${note}${octave}`);
}

// Handle mouse down on a key - start playing
function handleKeyMouseDown(key) {
  isMouseDown.value = true;
  startPlayingKey(key);
}

// Handle mouse up on a key - stop playing
function handleKeyMouseUp(key) {
  stopPlayingKey(key);
}

// Handle mouse enter on a key - play if dragging
function handleKeyMouseEnter(key) {
  if (isMouseDown.value) {
    startPlayingKey(key);
  }
}

// Handle mouse leave on a key - stop if was playing
function handleKeyMouseLeave(key) {
  if (isKeyPlaying(key.note, key.octave)) {
    stopPlayingKey(key);
  }
}

// Handle global mouse up - stop all and reset state
function handleGlobalMouseUp() {
  isMouseDown.value = false;
  // Stop all currently playing keys
  playingKeys.value.forEach((keyStr) => {
    const note = keyStr.slice(0, -1);
    const octave = parseInt(keyStr.slice(-1));
    emit("stopKey", note, octave);
  });
  playingKeys.value.clear();
}

// Start playing a key
function startPlayingKey(key) {
  const keyStr = `${key.note}${key.octave}`;
  if (!playingKeys.value.has(keyStr)) {
    playingKeys.value.add(keyStr);
    emit("playKey", key.note, key.octave);
  }
}

// Stop playing a key
function stopPlayingKey(key) {
  const keyStr = `${key.note}${key.octave}`;
  if (playingKeys.value.has(keyStr)) {
    playingKeys.value.delete(keyStr);
    emit("stopKey", key.note, key.octave);
  }
}

// MIDI note conversion
const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

function noteToMidi(note, octave) {
  const noteIndex = NOTE_NAMES.indexOf(note);
  if (noteIndex === -1) return -1;
  return (octave + 1) * 12 + noteIndex;
}

function isMidiActive(note, octave) {
  const midiNumber = noteToMidi(note, octave);
  return props.midiActiveNotes?.has?.(midiNumber) || false;
}

const pianoKeys = computed(() => {
  const octavesArray = Array.from(
    { length: 2 },
    (_, i) => currentPitch.value + i,
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

// Global mouseup listener to handle when mouse released outside keyboard
onMounted(() => {
  window.addEventListener("mouseup", handleGlobalMouseUp);
});

onUnmounted(() => {
  window.removeEventListener("mouseup", handleGlobalMouseUp);
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
  background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
  color: black;
  border: 3px solid black;
  border-top: none;
  font-weight: 800;
}

.black.interval {
  background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
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

// MIDI visual feedback
.white.midi-playing {
  background-color: #22d3ee;
  color: black;
  border: 3px solid #0891b2;
  border-top: none;
  font-weight: 700;
}

.black.midi-playing {
  background-color: #22d3ee;
  color: black;
  border: 3px solid #0891b2;
  border-top: none;
  font-weight: 700;
}

// Visual feedback when key is pressed/playing
.white.playing {
  filter: brightness(0.85);
  transform: translateY(2px);
}

.black.playing {
  filter: brightness(1.3);
  transform: translateY(2px);
}

#interval-1 {
  background: #ab2828 !important;
}
#interval-2 {
  background: #f58637 !important;
}
#interval-3 {
  background: #e4d63b !important;
}
#interval-4 {
  background: #5dd0cc;
}
#interval-5 {
  background: #8a57c4 !important;
}
#interval-6 {
  background: blue !important;
}
#interval-7 {
  background: #d05aa1 !important;
}
</style>
