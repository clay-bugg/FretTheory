<template>
  <div class="chord-grid">
    <div class="chord-row" v-for="(row, rowIndex) in chordRows" :key="rowIndex">
      <button
        v-for="chord in row"
        :key="chord.label"
        class="chord-button"
        :class="{ active: selectedChordLabel === chord.label }"
        draggable="true"
        @click="selectChord(chord)"
        @dragstart="handleDragStart($event, chord)"
      >
        {{ formatLabel(chord.label) }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { chordLibrary } from "~/composables/chords";

const { chordType, rootNote, chordNotes } = storeToRefs(useKeyboardStore());
const { notes } = useKeyboardStore();

const selectedChordLabel = ref("");

// Organize chords into rows for the grid layout
const chordRows = computed(() => {
  const chords = chordLibrary.value;
  const rows = [];

  // Row 1: Basic triads and simple chords
  rows.push(
    chords.filter((c) =>
      [
        "Major",
        "Minor",
        "Diminished",
        "Augmented",
        "Suspended 2",
        "Suspended 4",
      ].includes(c.label),
    ),
  );

  // Row 2: 6th and 7th chords
  rows.push(
    chords.filter((c) =>
      [
        "Major 6",
        "Minor 6",
        "Major 6/9",
        "Minor 6/9",
        "Dominant 7",
        "Major 7",
        "Minor 7",
        "Diminished 7",
      ].includes(c.label),
    ),
  );

  // Row 3: 9th chords
  rows.push(
    chords.filter((c) =>
      [
        "Dominant 9",
        "Major 9",
        "Minor 9",
        "7 Suspended 4",
        "Minor Major 7",
        "Minor Major 9",
      ].includes(c.label),
    ),
  );

  // Row 4: Extended chords
  rows.push(
    chords.filter((c) =>
      ["Dominant 11", "Major 11", "Dominant 13", "7#11"].includes(c.label),
    ),
  );

  // Row 5: Altered chords
  rows.push(
    chords.filter((c) =>
      [
        "7b5",
        "7b9",
        "7#9 (Hendrix)",
        "7#5",
        "9#5",
        "7b9#5",
        "7b13",
        "Minor 7b5",
        "Minor 7b9",
        "Minor Augmented",
      ].includes(c.label),
    ),
  );

  return rows.filter((row) => row.length > 0);
});

// Format label for display (shorten some labels)
function formatLabel(label) {
  const shortLabels = {
    "Dominant 7": "7",
    "Dominant 9": "9",
    "Dominant 11": "11",
    "Dominant 13": "13",
    "Major 7": "maj7",
    "Major 9": "maj9",
    "Major 11": "maj11",
    "Major 6": "6",
    "Major 6/9": "6/9",
    "Minor 7": "m7",
    "Minor 9": "m9",
    "Minor 6": "m6",
    "Minor 6/9": "m6/9",
    "Minor 7b5": "m7b5",
    "Minor 7b9": "m7b9",
    "Minor Major 7": "mMaj7",
    "Minor Major 9": "mMaj9",
    "Minor Augmented": "m(#5)",
    "Suspended 2": "sus2",
    "Suspended 4": "sus4",
    "7 Suspended 4": "7sus4",
    "7#9 (Hendrix)": "7#9",
    Augmented: "aug",
    Diminished: "dim",
    "Diminished 7": "°7",
  };
  return shortLabels[label] || label;
}

// Select chord and update store
function selectChord(chord) {
  selectedChordLabel.value = chord.label;

  // Set chord type directly to the label (chordLibrary uses label as identifier)
  chordType.value = chord.label;

  // Calculate chord notes if root is selected
  if (rootNote.value) {
    const rootIndex = notes.indexOf(rootNote.value);
    const calculatedNotes = chord.intervals.map(
      (interval) => notes[(rootIndex + interval) % 12],
    );
    chordNotes.value = calculatedNotes;
  }
}

// Handle drag start for chord progression builder
function handleDragStart(e, chord) {
  // First select the chord
  selectChord(chord);

  // Then set drag data
  const dragData = {
    root: rootNote.value || "C",
    type: chord.label,
  };
  e.dataTransfer.setData("application/json", JSON.stringify(dragData));
  e.dataTransfer.effectAllowed = "copy";
}
</script>

<style scoped lang="scss">
.chord-grid {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 0.4em;
  padding: 0.5em;
}

.chord-row {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  gap: 0.4em;
  justify-content: flex-start;
}

.chord-button {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  min-width: 50px;
  height: 36px;
  padding: 0.4em 0.8em;
  border: 1px solid #1a1a1a;
  border-radius: 4px;
  background: #242424;
  color: #c0c0c0;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.1s ease;
  white-space: nowrap;
  text-wrap: nowrap;

  &:hover {
    background-color: #333333;
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(1px);
    filter: brightness(0.9);
  }

  &.active {
    background: #ffc552;
    color: #000000;
    font-weight: 700;
    border-color: #ffc552;

    &:hover {
      filter: brightness(1.05);
    }
  }
}
</style>
