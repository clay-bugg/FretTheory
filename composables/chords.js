import { ref, computed } from "vue";
import { useKeyboardStore } from "@/stores/keyboardStore";
import { storeToRefs } from "pinia";

export const chordLibrary = ref([
  {
    label: "Major",
    intervals: [0, 4, 7],
    formula: ["1", "3", "5"],
    types: ["triad", "major", "tonic"],
  },
  {
    label: "Major 6",
    intervals: [0, 4, 7, 9],
    formula: ["1", "3", "5", "6"],
    types: ["tetrad", "major", "added note"],
  },
  {
    label: "Dominant 7",
    intervals: [0, 4, 7, 10],
    formula: ["1", "3", "5", "♭7"],
    types: ["tetrad", "dominant", "seventh"],
  },
  {
    label: "Dominant 9",
    intervals: [0, 4, 7, 10, 14],
    formula: ["1", "3", "5", "♭7", "9"],
    types: ["pentad", "dominant", "extended"],
  },
  {
    label: "Dominant 11",
    intervals: [0, 4, 7, 10, 14, 17],
    formula: ["1", "3", "5", "♭7", "9", "11"],
    types: ["extended", "dominant"],
  },
  {
    label: "7#11",
    intervals: [0, 4, 7, 10, 18],
    formula: ["1", "3", "5", "♭7", "♯11"],
    types: ["dominant", "altered", "lydian"],
  },
  {
    label: "Dominant 13",
    intervals: [0, 4, 7, 10, 14, 17, 21],
    formula: ["1", "3", "5", "♭7", "9", "11", "13"],
    types: ["extended", "dominant"],
  },
  {
    label: "Major 7",
    intervals: [0, 4, 7, 11],
    formula: ["1", "3", "5", "7"],
    types: ["tetrad", "major", "seventh"],
  },
  {
    label: "Major 9",
    intervals: [0, 4, 7, 11, 14],
    formula: ["1", "3", "5", "7", "9"],
    types: ["pentad", "major", "extended"],
  },
  {
    label: "Major 11",
    intervals: [0, 4, 7, 11, 14, 17],
    formula: ["1", "3", "5", "7", "9", "11"],
    types: ["extended", "major"],
  },
  {
    label: "7b5",
    intervals: [0, 4, 6, 10],
    formula: ["1", "3", "♭5", "♭7"],
    types: ["dominant", "altered"],
  },
  {
    label: "7b9",
    intervals: [0, 4, 7, 10, 13],
    formula: ["1", "3", "5", "♭7", "♭9"],
    types: ["dominant", "altered"],
  },
  {
    label: "7#9 (Hendrix)",
    intervals: [0, 4, 7, 10, 15],
    formula: ["1", "3", "5", "♭7", "♯9"],
    types: ["dominant", "altered"],
  },
  {
    label: "7#5",
    intervals: [0, 4, 8, 10],
    formula: ["1", "3", "♯5", "♭7"],
    types: ["dominant", "altered"],
  },
  {
    label: "9#5",
    intervals: [0, 4, 8, 10, 14],
    formula: ["1", "3", "♯5", "♭7", "9"],
    types: ["dominant", "altered"],
  },
  {
    label: "7b9#5",
    intervals: [0, 4, 8, 10, 13],
    formula: ["1", "3", "♯5", "♭7", "♭9"],
    types: ["dominant", "altered"],
  },
  {
    label: "7b13",
    intervals: [0, 4, 7, 8, 10],
    formula: ["1", "3", "5", "♭7", "♭13"],
    types: ["dominant", "altered"],
  },
  {
    label: "Major 6/9",
    intervals: [0, 4, 7, 9, 14],
    formula: ["1", "3", "5", "6", "9"],
    types: ["major", "added note"],
  },
  {
    label: "Diminished",
    intervals: [0, 3, 6],
    formula: ["1", "♭3", "♭5"],
    types: ["triad", "diminished"],
  },
  {
    label: "Diminished 7",
    intervals: [0, 3, 6, 9],
    formula: ["1", "♭3", "♭5", "°7"],
    types: ["tetrad", "diminished", "seventh"],
  },
  {
    label: "Augmented",
    intervals: [0, 4, 8],
    formula: ["1", "3", "♯5"],
    types: ["triad", "augmented"],
  },
  {
    label: "Suspended 2",
    intervals: [0, 2, 7],
    formula: ["1", "2", "5"],
    types: ["triad", "suspended"],
  },
  {
    label: "Suspended 4",
    intervals: [0, 5, 7],
    formula: ["1", "4", "5"],
    types: ["triad", "suspended"],
  },
  {
    label: "7 Suspended 4",
    intervals: [0, 5, 7, 10],
    formula: ["1", "4", "5", "♭7"],
    types: ["tetrad", "suspended", "seventh"],
  },
  {
    label: "Minor",
    intervals: [0, 3, 7],
    formula: ["1", "♭3", "5"],
    types: ["triad", "minor"],
  },
  {
    label: "Minor 6",
    intervals: [0, 3, 7, 9],
    formula: ["1", "♭3", "5", "6"],
    types: ["minor", "added note"],
  },
  {
    label: "Minor 7",
    intervals: [0, 3, 7, 10],
    formula: ["1", "♭3", "5", "♭7"],
    types: ["minor", "seventh"],
  },
  {
    label: "Minor 9",
    intervals: [0, 3, 7, 10, 14],
    formula: ["1", "♭3", "5", "♭7", "9"],
    types: ["minor", "extended"],
  },
  {
    label: "Minor 7b5",
    intervals: [0, 3, 6, 10],
    formula: ["1", "♭3", "♭5", "♭7"],
    types: ["minor", "seventh", "diminished"],
  },
  {
    label: "Minor 7b9",
    intervals: [0, 3, 7, 10, 13],
    formula: ["1", "♭3", "5", "♭7", "♭9"],
    types: ["minor", "altered"],
  },
  {
    label: "Minor Major 7",
    intervals: [0, 3, 7, 11],
    formula: ["1", "♭3", "5", "7"],
    types: ["minor", "seventh", "tonic"],
  },
  {
    label: "Minor Major 9",
    intervals: [0, 3, 7, 11, 14],
    formula: ["1", "♭3", "5", "7", "9"],
    types: ["minor", "extended"],
  },
  {
    label: "Minor Augmented",
    intervals: [0, 3, 8],
    formula: ["1", "♭3", "♯5"],
    types: ["triad", "minor", "altered"],
  },
  {
    label: "Minor 6/9",
    intervals: [0, 3, 7, 9, 14],
    formula: ["1", "♭3", "5", "6", "9"],
    types: ["minor", "added note"],
  },
]);

export const scaleLibrary = [
  {
    label: "Major",
    type: "Standard",
    intervals: [0, 2, 4, 5, 7, 9, 11],
  },
  {
    label: "Natural Minor",
    type: "Standard",
    intervals: [0, 2, 3, 5, 7, 8, 10],
  },
  {
    label: "Harmonic Minor",
    type: "Standard",
    intervals: [0, 2, 3, 5, 7, 8, 11],
  },
  {
    label: "Melodic Minor",
    type: "Standard",
    intervals: [0, 2, 3, 5, 7, 9, 11],
  },
  { label: "Ionian", type: "Mode", intervals: [0, 2, 4, 5, 7, 9, 11] },
  { label: "Dorian", type: "Mode", intervals: [0, 2, 3, 5, 7, 9, 10] },
  { label: "Phrygian", type: "Mode", intervals: [0, 1, 3, 5, 7, 8, 10] },
  { label: "Lydian", type: "Mode", intervals: [0, 2, 4, 6, 7, 9, 11] },
  { label: "Mixolydian", type: "Mode", intervals: [0, 2, 4, 5, 7, 9, 10] },
  { label: "Aeolian", type: "Mode", intervals: [0, 2, 3, 5, 7, 8, 10] },
  { label: "Locrian", type: "Mode", intervals: [0, 1, 3, 5, 6, 8, 10] },
  {
    label: "Pentatonic Major",
    type: "Pentatonic",
    intervals: [0, 2, 4, 7, 9],
  },
  {
    label: "Pentatonic Minor",
    type: "Pentatonic",
    intervals: [0, 3, 5, 7, 10],
  },

  {
    label: "Minor Blues",
    type: "Pentatonic",
    intervals: [0, 3, 5, 6, 7, 10],
  },
  {
    label: "Major Blues",
    type: "Pentatonic",
    intervals: [0, 2, 3, 4, 7, 9],
  },
  {
    label: "Whole Tone",
    type: "Whole/Halfstep",
    intervals: [0, 2, 4, 6, 8, 10],
  },
  {
    label: "Chromatic",
    type: "Whole/Halfstep",
    intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  },
  {
    label: "Diminished Half",
    type: "Whole/Halfstep",
    intervals: [0, 1, 3, 4, 6, 7, 9, 10],
  },
  {
    label: "Diminished Whole",
    type: "Whole/Halfstep",
    intervals: [0, 2, 3, 5, 6, 8, 9, 11],
  },
  { label: "Arabic", type: "Exotic", intervals: [0, 2, 4, 5, 6, 8, 10] },
  { label: "Byzantine", type: "Exotic", intervals: [0, 1, 4, 5, 7, 8, 11] },
  { label: "Egyptian", type: "Exotic", intervals: [0, 2, 5, 7, 10] },
  { label: "Hirajoshi", type: "Exotic", intervals: [0, 2, 3, 7, 8] },
  { label: "Iwato", type: "Exotic", intervals: [0, 1, 5, 6, 10] },
  { label: "Japanese In", type: "Exotic", intervals: [0, 1, 5, 7, 8] },
  { label: "Japanese Insen", type: "Exotic", intervals: [0, 1, 5, 7, 10] },
  {
    label: "Hungarian Minor",
    type: "Exotic",
    intervals: [0, 2, 3, 6, 7, 8, 11],
  },
  {
    label: "Neapolitan Minor",
    type: "Exotic",
    intervals: [0, 1, 3, 5, 7, 8, 11],
  },
  {
    label: "Neapolitan Major",
    type: "Exotic",
    intervals: [0, 1, 3, 5, 7, 9, 11],
  },
  {
    label: "Romanian Minor",
    type: "Exotic",
    intervals: [0, 2, 3, 6, 7, 9, 10],
  },
  { label: "Balinese", type: "Exotic", intervals: [0, 1, 3, 7, 8] },
  { label: "Chinese", type: "Exotic", intervals: [0, 4, 6, 7, 11] },
  { label: "Chinese Mongolian", type: "Exotic", intervals: [0, 2, 4, 7, 9] },
  { label: "Persian", type: "Exotic", intervals: [0, 1, 4, 5, 6, 8, 11] },
  { label: "Arabian", type: "Exotic", intervals: [0, 2, 4, 5, 6, 8, 10] },
  { label: "Jewish", type: "Exotic", intervals: [0, 1, 4, 5, 7, 8, 10] },
  { label: "Spanish Gypsy", type: "Exotic", intervals: [0, 1, 4, 5, 7, 8, 10] },
  {
    label: "Ukrainian Dorian",
    type: "Exotic",
    intervals: [0, 2, 3, 6, 7, 9, 10],
  },
  { label: "Prometheus", type: "Exotic", intervals: [0, 2, 4, 6, 9, 10] },
  { label: "Enigmatic", type: "Exotic", intervals: [0, 1, 4, 6, 8, 10, 11] },
  {
    label: "Double Harmonic",
    type: "Exotic",
    intervals: [0, 1, 4, 5, 7, 8, 11],
  },
  {
    label: "Augmented",
    type: "Symmetrical/Synthetic",
    intervals: [0, 3, 4, 7, 8, 11],
  },
  {
    label: "Tritone",
    type: "Symmetrical/Synthetic",
    intervals: [0, 1, 4, 6, 7, 10],
  },
  {
    label: "Hexatonic Blues",
    type: "Symmetrical/Synthetic",
    intervals: [0, 3, 5, 6, 7, 10],
  },
];

export function useChordInfo() {
  const pianoStore = usePianoStore();
  const { notes, rootNote, selectedChordType } = storeToRefs(pianoStore);

  const chordInfo = computed(() => {
    const chord = chordLibrary.value.find(
      (c) => c.label === selectedChordType.value
    );
    if (!chord || !rootNote.value) return null;

    const rootIndex = notes.value.indexOf(rootNote.value);
    if (rootIndex === -1) return null;

    const chordNotes = chord.intervals.map((interval) => {
      const noteIndex = (rootIndex + interval) % 12;
      return notes.value[noteIndex];
    });

    return {
      label: `${rootNote.value} ${chord.label}`,
      intervals: chord.intervals,
      formula: chord.formula,
      description: chord.description,
      chordNotes,
    };
  });

  return { chordInfo };
}
