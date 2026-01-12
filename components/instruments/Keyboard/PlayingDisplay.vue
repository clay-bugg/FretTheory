<template>
  <div
    class="playing-display"
    v-if="displayedNotes.length > 0 || displayedChord"
  >
    <div class="display-content">
      <!-- Notes Display -->
      <div class="notes-section">
        <span class="label">Notes:</span>
        <div class="notes-list">
          <span
            v-for="note in displayedNotes"
            :key="note"
            class="note-badge"
            :class="{ sharp: note.includes('#') }"
          >
            {{ note }}
          </span>
        </div>
      </div>

      <!-- Chord Display -->
      <div class="chord-section" v-if="displayedChord">
        <span class="label">Chord:</span>
        <span class="chord-name">{{ displayedChord }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useKeyboardStore, CHORD_TYPES, NOTES } from "~/stores/keyboardStore";

const props = defineProps({
  activeNotes: {
    type: Array,
    default: () => [],
  },
});

const store = useKeyboardStore();
const { rootNote, chordType, chordNotes } = storeToRefs(store);

// Display the notes being played
const displayedNotes = computed(() => {
  // Get unique note names (without octave) from activeNotes
  const noteNames = [...new Set(props.activeNotes.map((n) => n.note))];
  return noteNames;
});

// Detect chord from played notes
const displayedChord = computed(() => {
  // If chord mode is active and we have a selected chord, display it
  // chordType now stores the label directly (e.g., "Major", "Minor 7")
  if (rootNote.value && chordType.value && chordNotes.value.length > 0) {
    return `${rootNote.value} ${chordType.value}`;
  }

  // Otherwise, try to detect chord from played notes
  if (displayedNotes.value.length >= 2) {
    return detectChord(displayedNotes.value);
  }

  return null;
});

// Simple chord detection algorithm
function detectChord(notes) {
  if (notes.length < 2) return null;

  // Convert note names to semitone intervals
  const noteIndices = notes
    .map((n) => NOTES.indexOf(n))
    .filter((i) => i !== -1);
  if (noteIndices.length < 2) return null;

  // Sort by pitch
  noteIndices.sort((a, b) => a - b);

  // Try each note as root and see if intervals match any chord
  for (let i = 0; i < noteIndices.length; i++) {
    const rootIndex = noteIndices[i];
    const rootNote = NOTES[rootIndex];

    // Calculate intervals relative to this root
    const intervals = noteIndices.map((idx) => {
      let interval = idx - rootIndex;
      if (interval < 0) interval += 12;
      return interval;
    });

    // Sort and dedupe intervals
    const sortedIntervals = [...new Set(intervals)].sort((a, b) => a - b);

    // Check against known chord types
    for (const chordDef of CHORD_TYPES) {
      const chordIntervals = [...chordDef.intervals].map((i) => i % 12);
      const uniqueChordIntervals = [...new Set(chordIntervals)].sort(
        (a, b) => a - b
      );

      // Check if intervals match
      if (
        sortedIntervals.length === uniqueChordIntervals.length &&
        sortedIntervals.every((v, idx) => v === uniqueChordIntervals[idx])
      ) {
        return `${rootNote} ${chordDef.label}`;
      }
    }
  }

  return null;
}
</script>

<style scoped lang="scss">
@use "~/assets/scss/main.scss" as *;

.playing-display {
  width: 100%;
  padding: 0.8em 1em;
  background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
  border-top: 2px solid #333;
  border-radius: 0 0 8px 8px;
  font-family: "Lexend";
}

.display-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2em;
  flex-wrap: wrap;
}

.notes-section,
.chord-section {
  display: flex;
  align-items: center;
  gap: 0.6em;
}

.label {
  color: #888;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.notes-list {
  display: flex;
  gap: 0.4em;
}

.note-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2em;
  padding: 0.3em 0.5em;
  background: linear-gradient(180deg, #ffc552 0%, #e0a830 100%);
  border: 2px solid #000;
  border-radius: 6px;
  color: #000;
  font-size: 0.9rem;
  font-weight: 700;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

  &.sharp {
    background: linear-gradient(180deg, #555 0%, #333 100%);
    color: #ffc552;
    border-color: #ffc552;
  }
}

.chord-name {
  padding: 0.4em 0.8em;
  background: linear-gradient(180deg, #b81f1f 0%, #8a1515 100%);
  border: 2px solid #000;
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}
</style>
