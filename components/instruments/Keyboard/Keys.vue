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
      class="key"
      :class="[
        {
          black: key.sharp,
          white: !key.sharp,
          highlighted: chordNotes.includes(key.note),
          interval: chordNotes.includes(key.note),
          rootnote: key.note === rootNote,
          extendednote: isExtended(key.note),
          'midi-playing': isMidiActive(key.note, key.octave),
          playing: isKeyPlaying(key.note, key.octave),
        },
        chordNotes.includes(key.note)
          ? `interval-${chordNotes.indexOf(key.note) + 1}`
          : '',
      ]"
      @mousedown.prevent="handleKeyMouseDown(key)"
      @mouseup="handleKeyMouseUp(key)"
      @mouseenter="handleKeyMouseEnter(key)"
      @mouseleave="handleKeyMouseLeave(key)"
    >
      <span
        v-if="
          notesDisplayed === 'all' ||
          (notesDisplayed === 'chord' && chordNotes.includes(key.note))
        "
        :class="`interval interval-${chordNotes.indexOf(key.note) + 1}`"
      >
        <div class="note-name">{{ key.note }}</div>
        <div v-if="chordNotes.includes(key.note)" class="interval-name">
          {{ getInterval(key.note) }}
        </div>
      </span>
    </div>
  </div>
</template>

<script setup>
import { useKeyboardStore } from "~/stores/keyboardStore";

const store = useKeyboardStore();
const {
  currentPitch,
  chordNotes: storedChordNotes,
  chordIntervals: storedChordIntervals,
  rootNote,
  notesDisplayed,
  notes,
  previewChordNotes,
  previewChordIntervals,
  isPreviewing,
} = storeToRefs(store);

const chordNotes = computed(() =>
  isPreviewing.value ? previewChordNotes.value : storedChordNotes.value,
);

const chordIntervals = computed(() =>
  isPreviewing.value ? previewChordIntervals.value : storedChordIntervals.value,
);

const keyFontSize = ref("1rem"); // Default font size for keys

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

function getInterval(noteName) {
  return chordIntervals.value[noteName] || "";
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
  /* overflow: hidden; Removed to allow intervals to show outside */
  border-top: 15px solid black;
  border-right: 2px solid black;
  border-left: 2px solid black;
  margin-bottom: 2.5em; /* Added space for intervals */
  font-family: "Lexend";
  z-index: 0;
}

.key {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  border: 1px solid black;
  font-weight: 600;
}

.key:hover {
  cursor: pointer;
}

.white {
  position: relative;
  flex: 1;
  width: auto;
  min-width: 0;
  height: 100%;
  border: 1px solid black;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  background-color: $white-keyboard-key;
  color: #242424;
  z-index: 1;
  font-size: 1.1rem;
  /* overflow: hidden; Removed */
}

.white:hover {
  filter: brightness(0.9);
  /* background-color: #f3f3f3; */
}

.black {
  position: relative;
  bottom: 4px;
  left: 1.9em;
  width: 3.6em;
  height: 55%;
  /* overflow: hidden; Removed */
  border: 2px solid black;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  margin-left: -3.6em;
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
  color: black;
  border: 3px solid black;
  border-top: none;
  font-weight: 800;
}

.black.interval {
  color: black;
  border: 3px solid black;
  border-top: none;
  font-weight: 800;
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
}

span.interval {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0.2em;
  font-weight: 800;
  line-height: 1.1;
}

.note-name {
  font-size: 1em;
  position: relative;
  z-index: 2;
}

.interval-name {
  position: absolute;
  bottom: -30px; /* Position below the 240px height keyboard */
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 0.8em;
  font-weight: 600;
  opacity: 0.9;
  color: #ccc; /* Subtle color */
  pointer-events: none; /* Let clicks pass through */
  z-index: 10;
}

span.interval-1 {
  background: #d2ae38 !important;
  border-top: 2px solid black;
}
span.interval-2 {
  background: #d2ae38 !important;
  border-top: 2px solid black;
}
span.interval-3 {
  background: #d2ae38 !important;
  border-top: 2px solid black;
}
span.interval-4 {
  background: #d2ae38 !important;
  border-top: 2px solid black;
}
span.interval-5 {
  background: #d2ae38 !important;
  border-top: 2px solid black;
}
span.interval-6 {
  background: #d2ae38 !important;
  border-top: 2px solid black;
}
span.interval-7 {
  background: #d2ae38 !important;
  border-top: 2px solid black;
}
</style>
