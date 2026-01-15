<template>
  <div class="chord-selector">
    <!-- Category Dropdown + Root Notes Row -->
    <div class="selector-row">
      <select class="category-dropdown" v-model="selectedCategory">
        <option value="major">Major</option>
        <option value="minor">Minor</option>
        <option value="dominant">Dominant</option>
        <option value="altered">Altered</option>
        <option value="susdim">Sus/Dim</option>
      </select>

      <div class="root-notes">
        <button
          v-for="note in notes"
          :key="note"
          class="root-btn"
          :class="{ active: store.rootNote === note }"
          @click="selectRoot(note)"
        >
          {{ note }}
        </button>
      </div>
    </div>

    <!-- Chord Variants Row -->
    <div class="variants-row">
      <button
        v-for="chord in filteredChords"
        :key="chord.label"
        class="variant-btn"
        :class="{ active: store.chordType === chord.label }"
        @click="selectChord(chord.label)"
        draggable="true"
        @dragstart="dragStart($event, chord.label)"
      >
        {{ formatLabel(chord.label) }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { chordLibrary } from "~/composables/chords";

const store = useKeyboardStore();
const { notes } = storeToRefs(store);

const selectedCategory = ref("major");

// Filter chords based on selected category
const filteredChords = computed(() => {
  return chordLibrary.value.filter((chord) => {
    const types = chord.types || [];
    switch (selectedCategory.value) {
      case "major":
        return types.includes("major") && !types.includes("minor");
      case "minor":
        return types.includes("minor");
      case "dominant":
        return types.includes("dominant") && !types.includes("altered");
      case "altered":
        return types.includes("altered");
      case "susdim":
        return (
          types.includes("suspended") ||
          (types.includes("diminished") && !types.includes("minor"))
        );
      default:
        return false;
    }
  });
});

// Format chord labels for display
function formatLabel(label) {
  const shortLabels = {
    Major: "major",
    "Major 6": "6",
    "Major 7": "maj7",
    "Major 9": "maj9",
    "Major 11": "11",
    "Major 6/9": "6/9",
    Minor: "minor",
    "Minor 6": "m6",
    "Minor 7": "m7",
    "Minor 9": "m9",
    "Minor 7b5": "m7b5",
    "Minor 7b9": "m7b9",
    "Minor Major 7": "mMaj7",
    "Minor Major 9": "mMaj9",
    "Minor Augmented": "m+",
    "Minor 6/9": "m6/9",
    "Dominant 7": "7",
    "Dominant 9": "9",
    "Dominant 11": "11",
    "Dominant 13": "13",
    "7b5": "7b5",
    "7b9": "7b9",
    "7#9 (Hendrix)": "7#9",
    "7#5": "7#5",
    "9#5": "9#5",
    "7b9#5": "7b9#5",
    "7b13": "7b13",
    "7#11": "7#11",
    "Suspended 2": "sus2",
    "Suspended 4": "sus4",
    "7 Suspended 4": "7sus4",
    Diminished: "dim",
    "Diminished 7": "dim7",
    Augmented: "aug",
  };
  return shortLabels[label] || label;
}

function selectRoot(note) {
  store.changeRootNote(note);
}

function selectChord(label) {
  store.chordType = label;
}

// Auto-select first chord variant when category changes
watch(selectedCategory, () => {
  if (filteredChords.value.length > 0) {
    store.chordType = filteredChords.value[0].label;
  }
});

function dragStart(event, label) {
  // ChordProgression expects JSON with { root, type } using application/json
  const chordData = {
    root: store.rootNote,
    type: label,
  };
  event.dataTransfer.setData("application/json", JSON.stringify(chordData));
  event.dataTransfer.effectAllowed = "move";
}
</script>

<style scoped>
.chord-selector {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 0.5em;
  background: #1a1a1a;
  border-radius: 8px;
}

.selector-row {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.category-dropdown {
  padding: 0.4em 0.6em;
  font-size: 0.85rem;
  font-family: inherit;
  background: #2a2a2a;
  color: #fff;
  border: 2px solid #444;
  border-radius: 6px;
  cursor: pointer;
  min-width: 80px;
}

.category-dropdown:hover {
  border-color: #666;
}

.category-dropdown:focus {
  outline: none;
  border-color: #e6a700;
}

.root-notes {
  display: flex;
  gap: 0.25em;
  flex-wrap: wrap;
}

.root-btn {
  padding: 0.35em 0.6em;
  font-size: 0.85rem;
  font-family: inherit;
  background: #2a2a2a;
  color: #ccc;
  border: 2px solid #444;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  min-width: 32px;
}

.root-btn:hover {
  background: #3a3a3a;
  border-color: #666;
}

.root-btn.active {
  background: #e6a700;
  color: #1a1a1a;
  border-color: #e6a700;
  font-weight: 600;
}

.variants-row {
  display: flex;
  gap: 0.25em;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

.variant-btn {
  padding: 0.35em 0.6em;
  width: 50px;
  font-size: 0.85rem;
  font-family: inherit;
  background: #2a2a2a;
  color: #ccc;
  border: 2px solid #444;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.variant-btn:hover {
  background: #3a3a3a;
  border-color: #666;
}

.variant-btn.active {
  background: #e6a700;
  color: #1a1a1a;
  border-color: #e6a700;
  font-weight: 600;
}
</style>
