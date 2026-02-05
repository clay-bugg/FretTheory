<template>
  <div class="finder-container">
    <div class="keys">
      <div
        v-for="(key, index) in pianoKeys"
        :key="`${key.note}${key.octave}`"
        :style="{ fontSize: keyFontSize }"
        class="key"
        :class="{
          black: key.sharp,
          white: !key.sharp,
          highlighted: isSelected(key),
          rootnote: key.note === identifiedRoot,
          finder: true,
        }"
        @mousedown="toggleNote(key)"
      >
        <span v-if="isSelected(key)">{{ key.note }}</span>
      </div>
    </div>

    <!-- Chord Display Panel -->
    <div class="chord-display">
      <div class="chord-name">
        <span v-if="identifiedRoot && identifiedChord">
          {{ identifiedRoot }}{{ identifiedChord.abbr }}
        </span>
        <span
          v-else-if="selectedKeys.length > 0 && chordType === 'Unknown'"
          class="unknown"
        >
          Unknown Chord
        </span>
        <span v-else class="placeholder">Click notes to identify a chord</span>
      </div>
      <div v-if="selectedKeys.length > 0" class="selected-notes">
        <span class="notes-label">Notes:</span>
        <span class="notes-list">{{ uniqueNoteNames.join(" - ") }}</span>
      </div>
      <button
        v-if="selectedKeys.length > 0"
        class="clear-btn"
        @click="clearNotes"
      >
        Clear
      </button>
    </div>
  </div>
</template>

<script setup>
import { useKeyboardStore } from "~/stores/keyboardStore";
import { chordLibrary } from "~/composables/chords";

const store = useKeyboardStore();
const { notes, rootNote, chordType, currentPitch } = storeToRefs(store);

const selectedKeys = ref([]); // Stores { note, octave } objects
const identifiedRoot = ref(null);

// Get unique note names from selected keys for chord identification
const uniqueNoteNames = computed(() => {
  const noteSet = new Set(selectedKeys.value.map((k) => k.note));
  return [...noteSet];
});

defineEmits(["playKey", "stopKey"]);

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

// Get the full chord object for the identified chord
const identifiedChord = computed(() => {
  if (!chordType.value || chordType.value === "Unknown") return null;
  return chordLibrary.value.find((c) => c.label === chordType.value);
});

function isSelected(key) {
  return selectedKeys.value.some(
    (k) => k.note === key.note && k.octave === key.octave,
  );
}

function clearNotes() {
  selectedKeys.value = [];
  identifiedRoot.value = null;
  rootNote.value = "";
  chordType.value = "";
  store.chordNotes = [];
}

function toggleNote(key) {
  const existingIndex = selectedKeys.value.findIndex(
    (k) => k.note === key.note && k.octave === key.octave,
  );

  if (existingIndex !== -1) {
    selectedKeys.value.splice(existingIndex, 1);
  } else {
    selectedKeys.value.push({ note: key.note, octave: key.octave });
  }
  identifyChord();
}

function identifyChord() {
  if (uniqueNoteNames.value.length === 0) {
    identifiedRoot.value = null;
    rootNote.value = "";
    chordType.value = "";
    store.chordNotes = [];
    return;
  }

  // Helper to normalize note index
  const getNoteIndex = (n) => notes.value.indexOf(n);

  let matchFound = false;

  // Try every selected note as the potential root
  for (const potentialRoot of uniqueNoteNames.value) {
    const rootIndex = getNoteIndex(potentialRoot);

    // Calculate intervals relative to this root (normalized to 0-11)
    const currentIntervals = uniqueNoteNames.value
      .map((n) => {
        let interval = getNoteIndex(n) - rootIndex;
        if (interval < 0) interval += 12;
        return interval;
      })
      .sort((a, b) => a - b); // Sort to compare with library intervals

    // Check against library - normalize library intervals to 0-11 for comparison
    // This allows matching extended chords (9ths, 11ths, 13ths) since we only have note names
    const matchedChord = chordLibrary.value.find((c) => {
      // Normalize library intervals to 0-11 and remove duplicates
      const normalizedLibraryIntervals = [
        ...new Set(c.intervals.map((i) => i % 12)),
      ].sort((a, b) => a - b);

      if (normalizedLibraryIntervals.length !== currentIntervals.length)
        return false;
      return normalizedLibraryIntervals.every(
        (val, index) => val === currentIntervals[index],
      );
    });

    if (matchedChord) {
      // identified!
      identifiedRoot.value = potentialRoot;
      rootNote.value = potentialRoot;
      chordType.value = matchedChord.label; // Store the label (e.g., "Minor")
      store.chordNotes = uniqueNoteNames.value; // Ensure store reflects selection
      matchFound = true;
      break;
    }
  }

  if (!matchFound) {
    identifiedRoot.value = null;
    // Just show the notes without a chord label if unknown
    rootNote.value = "";
    chordType.value = "Unknown";
    store.chordNotes = uniqueNoteNames.value;
  }
}
</script>

<style scoped lang="scss">
@use "~/assets/scss/main.scss" as *;

.finder-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.keys {
  position: relative;
  display: flex;
  width: 100%;
  height: 240px;
  overflow: hidden;
  border-top: 15px solid black;
  border-right: 2px solid black;
  border-left: 2px solid black;
  font-family: "Lexend";
  z-index: 0;
}

.chord-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  padding: 1.2em 1em;
  background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
  border: 2px solid black;
  border-top: none;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  margin-bottom: 1em;

  .chord-name {
    font-size: 2.5rem;
    font-weight: 700;
    font-family: "Lexend";
    color: #ffc552;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);

    .unknown {
      color: #ff6b6b;
      font-size: 1.5rem;
    }

    .placeholder {
      color: #666;
      font-size: 1.2rem;
      font-weight: 400;
    }
  }

  .selected-notes {
    display: flex;
    align-items: center;
    gap: 0.5em;
    font-family: "Lexend";

    .notes-label {
      color: #888;
      font-size: 0.9rem;
    }

    .notes-list {
      color: #cfcfcf;
      font-size: 1rem;
      font-weight: 500;
    }
  }

  .clear-btn {
    margin-top: 0.5em;
    padding: 0.4em 1.5em;
    background: #333;
    border: 2px solid #444;
    border-radius: 8px;
    color: #ccc;
    font-family: "Lexend";
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: #444;
      border-color: #555;
      color: #fff;
    }
  }
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

  &:hover {
    filter: brightness(0.9);
  }
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

// Finder specific highlighting
.white.highlighted {
  background-color: #ffc552;
  color: black;
  border: 3px solid black;
  border-top: none;
  font-weight: 800;
}

.black.highlighted {
  background-color: #ffc552;
  color: black;
  border: 3px solid black;
  border-top: none;
  font-weight: 800;
}

.rootnote {
  background-color: #b81f1f !important;
  color: black !important;
  border-color: black;
}
</style>
