import { ref, computed } from "vue";
import { usePianoStore } from "@/stores/pianoStore";
import { storeToRefs } from "pinia";

export const chordLibrary = ref([
  // --- TRIADS ---
  {
    label: "Major",
    intervals: [0, 4, 7],
    formula: ["1", "3", "5"],
    type: "triad",
    description:
      "Bright and stable sound. The major 3rd defines its happy, resolved quality.",
  },

  {
    label: "Minor",
    intervals: [0, 3, 7],
    formula: ["1", "♭3", "5"],
    type: "triad",
    description:
      "Darker, sadder tone created by lowering the 3rd by a semitone.",
  },

  {
    label: "Diminished",
    intervals: [0, 3, 6],
    formula: ["1", "♭3", "♭5"],
    type: "triad",
    description:
      "Tense and unstable. The flattened 5th creates a dissonant, unresolved sound.",
  },

  {
    label: "Augmented",
    intervals: [0, 4, 8],
    formula: ["1", "3", "#5"],
    type: "triad",
    description:
      "Dreamlike and bright. The raised 5th adds tension and ambiguity.",
  },

  {
    label: "Power Chord",
    intervals: [0, 7],
    formula: ["1", "5"],
    type: "triad",
    description:
      "No 3rd, so neither major nor minor. Strong, open, and harmonically neutral.",
  },

  // --- SUSPENDED ---
  {
    label: "Suspended 2nd",
    intervals: [0, 2, 7],
    formula: ["1", "2", "5"],
    type: "suspended",
    description: "Replaces the 3rd with a 2nd for an airy, unresolved quality.",
  },
  {
    label: "Suspended 4th",
    intervals: [0, 5, 7],
    formula: ["1", "4", "5"],
    type: "suspended",
    description:
      "Replaces the 3rd with a 4th, creating strong tension that resolves downward.",
  },
  {
    label: "7 Suspended 2nd",
    intervals: [0, 2, 7, 10],
    formula: ["1", "2", "5", "♭7"],
    type: "suspended",
    description:
      "A dominant 7th with a 2nd instead of a 3rd. Open yet bluesy feel.",
  },
  {
    label: "7 Suspended 4th",
    intervals: [0, 5, 7, 10],
    formula: ["1", "4", "5", "♭7"],
    type: "suspended",
    description:
      "Dominant 7th flavor with a suspended 4th replacing the 3rd for added tension.",
  },
  {
    label: "9 Suspended 4th",
    intervals: [0, 5, 7, 10, 14],
    formula: ["1", "4", "5", "♭7", "9"],
    type: "suspended",
    description:
      "Extended suspended chord with a 9th. Smooth yet unresolved sound.",
  },

  // --- SIXTH & ADDED TONE ---
  {
    label: "6th",
    intervals: [0, 4, 7, 9],
    formula: ["1", "3", "5", "6"],
    type: "added",
    description:
      "Adds a 6th to a major triad, creating warmth and nostalgic color.",
  },
  {
    label: "Minor 6th",
    intervals: [0, 3, 7, 9],
    formula: ["1", "♭3", "5", "6"],
    type: "added",
    description:
      "Minor with a 6th. A bittersweet, jazzy sound often used in film or Latin music.",
  },
  {
    label: "6/9",
    intervals: [0, 4, 7, 9, 14],
    formula: ["1", "3", "5", "6", "9"],
    type: "added",
    description:
      "Adds both 6th and 9th for a lush, modern jazz voicing with no harshness.",
  },
  {
    label: "Minor 6/9",
    intervals: [0, 3, 7, 9, 14],
    formula: ["1", "♭3", "5", "6", "9"],
    type: "added",
    description:
      "Minor chord with 6th and 9th. Smooth, melancholic, and harmonically rich.",
  },
  {
    label: "Add9",
    intervals: [0, 4, 7, 14],
    formula: ["1", "3", "5", "9"],
    type: "added",
    description:
      "Major triad with an added 9th for a bright, open pop or acoustic sound.",
  },
  {
    label: "Minor Add9",
    intervals: [0, 3, 7, 14],
    formula: ["1", "♭3", "5", "9"],
    type: "added",
    description:
      "Minor chord with an added 9th. Adds emotional depth and expressive color.",
  },

  // --- SEVENTHS ---
  {
    label: "Dominant 7th",
    intervals: [0, 4, 7, 10],
    formula: ["1", "3", "5", "♭7"],
    type: "seventh",
    description:
      "Major triad with a lowered 7th. Creates strong tension that resolves a fifth below.",
  },
  {
    label: "Major 7th",
    intervals: [0, 4, 7, 11],
    formula: ["1", "3", "5", "7"],
    type: "seventh",
    description:
      "Smooth and romantic. The natural 7th adds rich but gentle tension.",
  },
  {
    label: "Minor 7th",
    intervals: [0, 3, 7, 10],
    formula: ["1", "♭3", "5", "♭7"],
    type: "seventh",
    description:
      "Relaxed and soulful. Common in jazz and funk for its mellow groove.",
  },
  {
    label: "Minor Major 7th",
    intervals: [0, 3, 7, 11],
    formula: ["1", "♭3", "5", "7"],
    type: "seventh",
    description:
      "Unusual blend of minor sadness and major 7th brightness, creating inner tension.",
  },
  {
    label: "Half-Diminished 7th",
    intervals: [0, 3, 6, 10],
    formula: ["1", "♭3", "♭5", "♭7"],
    type: "seventh",
    description:
      "Tense but controlled. The flat 5 adds drama without full dissonance.",
  },
  {
    label: "Diminished 7th",
    intervals: [0, 3, 6, 9],
    formula: ["1", "♭3", "♭5", "♭♭7"],
    type: "seventh",
    description:
      "Fully symmetrical tension. Each note is a minor 3rd apart, creating total instability.",
  },

  // --- EXTENDED CHORDS ---
  {
    label: "Dominant 9th",
    intervals: [0, 4, 7, 10, 14],
    formula: ["1", "3", "5", "♭7", "9"],
    type: "extended",
    description:
      "Adds a 9th to the dominant 7th. Smooth tension used in funk and jazz.",
  },
  {
    label: "Major 9th",
    intervals: [0, 4, 7, 11, 14],
    formula: ["1", "3", "5", "7", "9"],
    type: "extended",
    description:
      "Major 7th plus a 9th. Silky, rich sound common in R&B and modern harmony.",
  },
  {
    label: "Minor 9th",
    intervals: [0, 3, 7, 10, 14],
    formula: ["1", "♭3", "5", "♭7", "9"],
    type: "extended",
    description:
      "Minor 7th with a 9th. Adds emotional color and sophistication.",
  },
  {
    label: "Dominant 11th",
    intervals: [0, 4, 7, 10, 14, 17],
    formula: ["1", "3", "5", "♭7", "9", "11"],
    type: "extended",
    description:
      "Dominant 9th extended with an 11th. Wide, lush harmony with gentle tension.",
  },
  {
    label: "Major 11th",
    intervals: [0, 4, 7, 11, 14, 17],
    formula: ["1", "3", "5", "7", "9", "11"],
    type: "extended",
    description:
      "Major 9th with added 11th. Expansive, ambient chord used in orchestral or fusion music.",
  },
  {
    label: "Dominant 13th",
    intervals: [0, 4, 7, 10, 14, 17, 21],
    formula: ["1", "3", "5", "♭7", "9", "11", "13"],
    type: "extended",
    description:
      "Adds 13th to a dominant chord. Full, rich sound often used in big-band voicings.",
  },
  {
    label: "Major 13th",
    intervals: [0, 4, 7, 11, 14, 17, 21],
    formula: ["1", "3", "5", "7", "9", "11", "13"],
    type: "extended",
    description:
      "Major 7th chord extended with all color tones up to 13. Smooth and luxurious.",
  },

  // --- ALTERED DOMINANTS ---
  {
    label: "Dominant 7#5",
    intervals: [0, 4, 8, 10],
    formula: ["1", "3", "#5", "♭7"],
    type: "altered",
    description:
      "Dominant 7th with a raised 5th. Bright, edgy tension before resolution.",
  },
  {
    label: "Dominant 7♭5",
    intervals: [0, 4, 6, 10],
    formula: ["1", "3", "♭5", "♭7"],
    type: "altered",
    description:
      "Dominant 7th with a flattened 5th. Adds dark tension and grit.",
  },
  {
    label: "Dominant 7#9",
    intervals: [0, 4, 7, 10, 15],
    formula: ["1", "3", "5", "♭7", "#9"],
    type: "altered",
    description:
      "Classic Hendrix chord. Combines major and minor color via the raised 9th.",
  },
  {
    label: "Dominant 7♭9",
    intervals: [0, 4, 7, 10, 13],
    formula: ["1", "3", "5", "♭7", "♭9"],
    type: "altered",
    description:
      "Dominant with flattened 9th. Dark, unstable sound that resolves strongly.",
  },
  {
    label: "Dominant 7#9#5",
    intervals: [0, 4, 8, 10, 15],
    formula: ["1", "3", "#5", "♭7", "#9"],
    type: "altered",
    description:
      "Combines raised 5th and 9th. Maximum dissonance and tension before resolving.",
  },
  {
    label: "Dominant 7♭9#5",
    intervals: [0, 4, 8, 10, 13],
    formula: ["1", "3", "#5", "♭7", "♭9"],
    type: "altered",
    description:
      "Dark and complex. The raised 5th and flattened 9th create harsh tension.",
  },
  {
    label: "Dominant 7♭9♭5",
    intervals: [0, 4, 6, 10, 13],
    formula: ["1", "3", "♭5", "♭7", "♭9"],
    type: "altered",
    description:
      "Flattened 5th and 9th together. Deeply unstable, resolves dramatically.",
  },
  {
    label: "Dominant 7#9♭5",
    intervals: [0, 4, 6, 10, 15],
    formula: ["1", "3", "♭5", "♭7", "#9"],
    type: "altered",
    description:
      "Raised 9th with flat 5th. Bluesy but tense, used in modern jazz resolutions.",
  },
  {
    label: "Altered (alt)",
    intervals: [0, 4, 6, 8, 10, 13, 15],
    formula: ["1", "3", "♭5", "#5", "♭7", "♭9", "#9"],
    type: "altered",
    description:
      "Umbrella for all altered dominants. Extreme tension and dissonance for strong resolutions.",
  },

  // --- EXOTIC / RARE ---
  {
    label: "Augmented 7th",
    intervals: [0, 4, 8, 10],
    formula: ["1", "3", "#5", "♭7"],
    type: "rare",
    description:
      "Dominant 7th with raised 5th. Bright but gritty tension, used in blues and fusion.",
  },
  {
    label: "Minor 7 ♭9",
    intervals: [0, 3, 7, 10, 13],
    formula: ["1", "♭3", "5", "♭7", "♭9"],
    type: "rare",
    description:
      "Minor 7th with flattened 9th. Creates mysterious, cinematic tension.",
  },
  {
    label: "Quartal (Stacked Fourths)",
    intervals: [0, 5, 10, 15],
    formula: ["1", "4", "♭7", "11"],
    type: "rare",
    description:
      "Built from stacked 4ths instead of 3rds. Open, ambiguous, and modern sound.",
  },
  {
    label: "Add11",
    intervals: [0, 4, 7, 17],
    formula: ["1", "3", "5", "11"],
    type: "rare",
    description:
      "Major triad with added 11th. Expands the chord without extra tension.",
  },
]);

export const scaleLibrary = [
  // --- Western Scales ---
  {
    label: "Major",
    type: "Western",
    intervals: [0, 2, 4, 5, 7, 9, 11],
  },
  {
    label: "Natural Minor",
    type: "Western",
    intervals: [0, 2, 3, 5, 7, 8, 10],
  },
  {
    label: "Harmonic Minor",
    type: "Western",
    intervals: [0, 2, 3, 5, 7, 8, 11],
  },
  {
    label: "Melodic Minor",
    type: "Western",
    intervals: [0, 2, 3, 5, 7, 9, 11],
  },

  // --- Modes ---
  { label: "Ionian", type: "Modes", intervals: [0, 2, 4, 5, 7, 9, 11] },
  { label: "Dorian", type: "Modes", intervals: [0, 2, 3, 5, 7, 9, 10] },
  { label: "Phrygian", type: "Modes", intervals: [0, 1, 3, 5, 7, 8, 10] },
  { label: "Lydian", type: "Modes", intervals: [0, 2, 4, 6, 7, 9, 11] },
  { label: "Mixolydian", type: "Modes", intervals: [0, 2, 4, 5, 7, 9, 10] },
  { label: "Aeolian", type: "Modes", intervals: [0, 2, 3, 5, 7, 8, 10] },
  { label: "Locrian", type: "Modes", intervals: [0, 1, 3, 5, 6, 8, 10] },

  // --- Pentatonic/Blues ---
  {
    label: "Pentatonic Major",
    type: "Pentatonic/Blues",
    intervals: [0, 2, 4, 7, 9],
  },
  {
    label: "Pentatonic Minor",
    type: "Pentatonic/Blues",
    intervals: [0, 3, 5, 7, 10],
  },
  { label: "Blues", type: "Pentatonic/Blues", intervals: [0, 3, 5, 6, 7, 10] },
  {
    label: "Minor Blues",
    type: "Pentatonic/Blues",
    intervals: [0, 3, 5, 6, 7, 10],
  },
  {
    label: "Major Blues",
    type: "Pentatonic/Blues",
    intervals: [0, 2, 3, 4, 7, 9],
  },

  // --- Whole/Halfstep ---
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

  // --- Exotic Scales ---
  { label: "Arabic", type: "Exotic", intervals: [0, 2, 4, 5, 6, 8, 10] },
  {
    label: "Byzantine",
    type: "Exotic",
    intervals: [0, 1, 4, 5, 7, 8, 11],
  },
  { label: "Egyptian", type: "Exotic", intervals: [0, 2, 5, 7, 10] },
  { label: "Hirajoshi", type: "Exotic", intervals: [0, 2, 3, 7, 8] },
  { label: "Iwato", type: "Exotic", intervals: [0, 1, 5, 6, 10] },
  { label: "Japanese In", type: "Exotic", intervals: [0, 1, 5, 7, 8] },
  {
    label: "Japanese Insen",
    type: "Exotic",
    intervals: [0, 1, 5, 7, 10],
  },
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
  {
    label: "Chinese Mongolian",
    type: "Exotic",
    intervals: [0, 2, 4, 7, 9],
  },
  {
    label: "Persian",
    type: "Exotic",
    intervals: [0, 1, 4, 5, 6, 8, 11],
  },
  {
    label: "Arabian",
    type: "Exotic",
    intervals: [0, 2, 4, 5, 6, 8, 10],
  },
  { label: "Jewish", type: "Exotic", intervals: [0, 1, 4, 5, 7, 8, 10] },
  {
    label: "Spanish Gypsy",
    type: "Exotic",
    intervals: [0, 1, 4, 5, 7, 8, 10],
  },
  {
    label: "Ukrainian Dorian",
    type: "Exotic",
    intervals: [0, 2, 3, 6, 7, 9, 10],
  },
  {
    label: "Prometheus",
    type: "Exotic",
    intervals: [0, 2, 4, 6, 9, 10],
  },
  {
    label: "Enigmatic",
    type: "Exotic",
    intervals: [0, 1, 4, 6, 8, 10, 11],
  },
  {
    label: "Double Harmonic",
    type: "Exotic",
    intervals: [0, 1, 4, 5, 7, 8, 11],
  },

  // --- Symmetrical/Synthetic ---
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
