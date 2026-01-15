import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { chordLibrary } from "~/composables/chords";

export const NOTES = [
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

// Re-export chordLibrary as CHORD_TYPES_DATA for external use
export const CHORD_TYPES_DATA = chordLibrary.value;
// Alias for backwards compatibility
export const CHORD_TYPES = CHORD_TYPES_DATA;

export const useKeyboardStore = defineStore("keyboard", () => {
  // Current Pitch
  const currentPitch = ref(3);

  function changePitch(index) {
    currentPitch.value = index + 1;
  }

  // Notes Displayed
  const notesDisplayed = ref("all");

  function changeLabels(index) {
    switch (index) {
      case 0:
        notesDisplayed.value = "all";
        break;
      case 1:
        notesDisplayed.value = "chord";
        break;
      case 2:
        notesDisplayed.value = "none";
        break;
      default:
        console.error("Invalid index on notesDisplayed  ", index);
        break;
    }
  }

  // Notes & Chord Constants
  const notes = ref(NOTES);
  const chordTypes = ref(CHORD_TYPES_DATA);

  // Chord State
  const rootNote = ref("");
  const chordType = ref("");
  const chordNotes = ref([]);
  const chordIntervals = ref({});

  // Computed Chord Notes
  function updateChord() {
    if (!rootNote.value || !chordType.value) return;

    // chordLibrary uses 'label' as the identifier
    const chord = chordTypes.value.find((c) => c.label === chordType.value);
    if (!chord) return;

    const { intervals, formula } = chord;
    const rootIndex = notes.value.indexOf(rootNote.value);

    // Reset intervals map
    const newIntervalsMap = {};

    const updatedChordNotes = intervals.map((i, index) => {
      const note = notes.value[(rootIndex + i) % 12];
      // Map scale degree formula to the note
      // If a note appears multiple times (unlikely in this logic but possible in theory), latest one wins or we handle it.
      // For basic chord display, 1:1 mapping is usually fine.
      newIntervalsMap[note] = formula[index];
      return note;
    });

    chordIntervals.value = newIntervalsMap;
    chordNotes.value = Array.from(new Set(updatedChordNotes));

    console.log(
      `Chord: ${rootNote.value}${
        chordType.value
      }, Notes: ${chordNotes.value.join(", ")}, Intervals: ${formula.join(
        ", "
      )}`
    );
  }

  // Watchers for Chord Updates
  watch(rootNote, (newVal) => {
    console.log(`Root note changed to ${newVal}`);
    updateChord();
  });

  watch(chordType, (newVal) => {
    console.log(`Chord type changed to ${newVal}`);
    updateChord();
  });

  // Pitch Controls
  function changePitch(op) {
    if (op === "+" && currentPitch.value < 6) {
      currentPitch.value++;
    } else if (op === "-" && currentPitch.value > 1) {
      currentPitch.value--;
    }
  }

  // Assign Octaves to Chord Notes for Playback

  function assignChordOctaves(root, chordNotesArray) {
    let currentOctave = currentPitch.value;
    let lastNoteIndex = notes.value.indexOf(root);

    const chordWithOctaves = [];

    chordNotesArray.forEach((note) => {
      const noteIndex = notes.value.indexOf(note);
      if (noteIndex <= lastNoteIndex) {
        currentOctave++;
      }

      chordWithOctaves.push(`${note}${currentOctave}`);
      lastNoteIndex = noteIndex;
    });

    return chordWithOctaves;
  }

  // Map flat notes to their enharmonic sharp equivalents
  const flatToSharpMap = {
    "D♭": "C#",
    "E♭": "D#",
    "F♭": "E",
    "G♭": "F#",
    "A♭": "G#",
    "B♭": "A#",
    "C♭": "B",
  };

  function changeRootNote(note) {
    // Convert flat notes to their sharp equivalents for internal use
    const normalizedNote = flatToSharpMap[note] || note;
    rootNote.value = normalizedNote;
  }

  return {
    // State
    notes,
    chordTypes,
    rootNote,
    chordType,
    chordNotes,
    chordIntervals,
    currentPitch,
    notesDisplayed,

    // Actions
    updateChord,
    changePitch,
    changeLabels,
    assignChordOctaves,
    changeRootNote,
  };
});
