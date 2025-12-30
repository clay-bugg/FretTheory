import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";

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

export const CHORD_TYPES = [
  // Basic triads
  {
    label: "Major",
    value: "maj",
    intervals: [0, 4, 7],
    formula: ["1", "3", "5"],
  },
  {
    label: "Minor",
    value: "m",
    intervals: [0, 3, 7],
    formula: ["1", "♭3", "5"],
  },
  {
    label: "Augmented",
    value: "+",
    intervals: [0, 4, 8],
    formula: ["1", "3", "♯5"],
  },
  {
    label: "Diminished",
    value: "°",
    intervals: [0, 3, 6],
    formula: ["1", "♭3", "♭5"],
  },
  { label: "Power 5th", value: "5", intervals: [0, 7], formula: ["1", "5"] },
  {
    label: "Add 9",
    value: "add9",
    intervals: [0, 4, 7, 14],
    formula: ["1", "3", "5", "9"],
  },
  // 6th chords
  {
    label: "Major 6th",
    value: "maj6",
    intervals: [0, 4, 7, 9],
    formula: ["1", "3", "5", "6"],
  },
  {
    label: "6/9",
    value: "6/9",
    intervals: [0, 4, 7, 9, 14],
    formula: ["1", "3", "5", "6", "9"],
  },
  // Major 7th family
  {
    label: "Major 7th",
    value: "maj7",
    intervals: [0, 4, 7, 11],
    formula: ["1", "3", "5", "7"],
  },
  {
    label: "Major 9th",
    value: "maj9",
    intervals: [0, 4, 7, 11, 14],
    formula: ["1", "3", "5", "7", "9"],
  },
  {
    label: "Major 13th",
    value: "maj13",
    intervals: [0, 4, 7, 11, 14, 21],
    formula: ["1", "3", "5", "7", "9", "13"],
  },
  {
    label: "Major 7#11",
    value: "maj7#11",
    intervals: [0, 4, 7, 11, 18],
    formula: ["1", "3", "5", "7", "♯11"],
  },
  {
    label: "Major 7#5",
    value: "maj7#5",
    intervals: [0, 4, 8, 11],
    formula: ["1", "3", "♯5", "7"],
  },
  // Dominant 7th family
  {
    label: "Dominant 7th",
    value: "7",
    intervals: [0, 4, 7, 10],
    formula: ["1", "3", "5", "♭7"],
  },
  {
    label: "Dominant 9th",
    value: "9",
    intervals: [0, 4, 7, 10, 14],
    formula: ["1", "3", "5", "♭7", "9"],
  },
  {
    label: "Dominant 13th",
    value: "13",
    intervals: [0, 4, 7, 10, 14, 21],
    formula: ["1", "3", "5", "♭7", "9", "13"],
  },
  {
    label: "7♭9",
    value: "7b9",
    intervals: [0, 4, 7, 10, 13],
    formula: ["1", "3", "5", "♭7", "♭9"],
  },
  {
    label: "13♭9",
    value: "13b9",
    intervals: [0, 4, 7, 10, 13, 21],
    formula: ["1", "3", "5", "♭7", "♭9", "13"],
  },
  {
    label: "7♯9",
    value: "7#9",
    intervals: [0, 4, 7, 10, 15],
    formula: ["1", "3", "5", "♭7", "♯9"],
  },
  {
    label: "7♭13",
    value: "7b13",
    intervals: [0, 4, 7, 10, 20],
    formula: ["1", "3", "5", "♭7", "♭13"],
  },
  {
    label: "7♯5",
    value: "7#5",
    intervals: [0, 4, 8, 10],
    formula: ["1", "3", "♯5", "♭7"],
  },
  {
    label: "7♭9♭13",
    value: "7b9b13",
    intervals: [0, 4, 7, 10, 13, 20],
    formula: ["1", "3", "5", "♭7", "♭9", "♭13"],
  },
  {
    label: "7♯11",
    value: "7#11",
    intervals: [0, 4, 7, 10, 18],
    formula: ["1", "3", "5", "♭7", "♯11"],
  },
  {
    label: "7♭5",
    value: "7b5",
    intervals: [0, 4, 6, 10],
    formula: ["1", "3", "♭5", "♭7"],
  },
  // Minor 7th family
  {
    label: "Minor 7th",
    value: "m7",
    intervals: [0, 3, 7, 10],
    formula: ["1", "♭3", "5", "♭7"],
  },
  // Suspended
  {
    label: "Suspended 2nd",
    value: "sus2",
    intervals: [0, 2, 7],
    formula: ["1", "2", "5"],
  },
  {
    label: "Suspended 4th",
    value: "sus4",
    intervals: [0, 5, 7],
    formula: ["1", "4", "5"],
  },
  {
    label: "Major 7♭5",
    value: "maj7♭5",
    intervals: [0, 4, 6, 11],
    formula: ["1", "3", "♭5", "7"],
  },
];

export const useKeyboardStore = defineStore("keyboard", () => {
  // Notes & chord constants
  const notes = ref(NOTES);
  const chordTypes = ref(CHORD_TYPES);

  // Chord state
  const rootNote = ref("");
  const chordType = ref("");
  const chordNotes = ref([]);

  // Keyboard controls
  const currentPitch = ref(3);

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

  

  // Computed chord notes
  function updateChord() {
    if (!rootNote.value || !chordType.value) return;

    const chord = chordTypes.value.find((c) => c.value === chordType.value);
    if (!chord) return;

    const { intervals, formula } = chord;
    const rootIndex = notes.value.indexOf(rootNote.value);
    const updatedChordNotes = intervals.map(
      (i) => notes.value[(rootIndex + i) % 12]
    );
    chordNotes.value = Array.from(new Set(updatedChordNotes));

    console.log(
      `Chord: ${rootNote.value}${
        chordType.value
      }, Notes: ${chordNotes.value.join(", ")}, Intervals: ${formula.join(
        ", "
      )}`
    );
  }

  // Watchers for chord updates
  watch(rootNote, (newVal) => {
    console.log(`Root note changed to ${newVal}`);
    updateChord();
  });

  watch(chordType, (newVal) => {
    console.log(`Chord type changed to ${newVal}`);
    updateChord();
  });

  // Octave actions
  function changePitch(op) {
    if (op === "+" && currentPitch.value < 6) {
      currentPitch.value++;
    } else if (op === "-" && currentPitch.value > 1) {
      currentPitch.value--;
    }
  }

  // Assign octaves to chord notes for playback
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

  return {
    // State
    notes,
    chordTypes,
    rootNote,
    chordType,
    chordNotes,
    currentPitch,
    notesDisplayed,
    // Actions
    updateChord,
    changePitch,
    changeLabels,
    assignChordOctaves,
  };
});
