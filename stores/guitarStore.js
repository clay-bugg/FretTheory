import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { NOTES, CHORD_TYPES } from "./keyboardStore";

// Standard guitar tuning (from 1st string to 6th string, high to low)
export const STANDARD_TUNING = [
  { note: "E", octave: 4 }, // 1st string (high E)
  { note: "B", octave: 3 }, // 2nd string
  { note: "G", octave: 3 }, // 3rd string
  { note: "D", octave: 3 }, // 4th string
  { note: "A", octave: 2 }, // 5th string
  { note: "E", octave: 2 }, // 6th string (low E)
];

// Fret marker positions (standard inlays)
export const SINGLE_MARKER_FRETS = [3, 5, 7, 9];
export const DOUBLE_MARKER_FRETS = [12];

export const useGuitarStore = defineStore("guitar", () => {
  // Notes & Chord Constants (shared with keyboard)
  const notes = ref(NOTES);
  const chordTypes = ref(CHORD_TYPES);

  // Guitar-specific state
  const openStrings = ref([...STANDARD_TUNING]);
  const frets = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const singleMarkerFrets = ref(SINGLE_MARKER_FRETS);
  const doubleMarkerFrets = ref(DOUBLE_MARKER_FRETS);

  // Notes displayed mode: 'all', 'chord', 'none'
  const notesDisplayed = ref("chord");

  function changeLabels(mode) {
    if (["all", "chord", "none"].includes(mode)) {
      notesDisplayed.value = mode;
    }
  }

  // Chord state
  const rootNote = ref("C");
  const chordType = ref("Major");
  const chordNotes = ref([]);

  // Calculate chord notes based on root and type
  function updateChord() {
    if (!rootNote.value || !chordType.value) return;

    // chordLibrary uses 'label' as the identifier
    const chord = chordTypes.value.find((c) => c.label === chordType.value);
    if (!chord) return;

    const { intervals, formula } = chord;
    const rootIndex = notes.value.indexOf(rootNote.value);
    const updatedChordNotes = intervals.map(
      (i) => notes.value[(rootIndex + i) % 12]
    );
    chordNotes.value = Array.from(new Set(updatedChordNotes));

    console.log(
      `Guitar Chord: ${rootNote.value}${
        chordType.value
      }, Notes: ${chordNotes.value.join(", ")}`
    );
  }

  // Watchers for chord updates
  watch(rootNote, () => updateChord(), { immediate: true });
  watch(chordType, () => updateChord());

  // Calculate the note at a specific string and fret
  function getNoteAtFret(stringIndex, fret) {
    const openNote = openStrings.value[stringIndex].note;
    const openNoteIndex = notes.value.indexOf(openNote);
    const newNoteIndex = (openNoteIndex + fret) % 12;
    return notes.value[newNoteIndex];
  }

  // Get octave at a specific string and fret
  function getOctaveAtFret(stringIndex, fret) {
    const openString = openStrings.value[stringIndex];
    const openNoteIndex = notes.value.indexOf(openString.note);
    const fretOctaveOffset = Math.floor((openNoteIndex + fret) / 12);
    return openString.octave + fretOctaveOffset;
  }

  // Get full note with octave at a specific string and fret
  function getNoteWithOctaveAtFret(stringIndex, fret) {
    const note = getNoteAtFret(stringIndex, fret);
    const octave = getOctaveAtFret(stringIndex, fret);
    return `${note}${octave}`;
  }

  // Build chord voicing for guitar (finds notes on each string in first position)
  function buildChordVoicing() {
    if (!rootNote.value || !chordType.value || chordNotes.value.length === 0) {
      return [];
    }

    const chordVoicing = [];

    // Go through strings from low E (index 5) to high E (index 0)
    for (let stringIndex = 5; stringIndex >= 0; stringIndex--) {
      const openString = openStrings.value[stringIndex];

      // Check open string first
      if (chordNotes.value.includes(openString.note)) {
        chordVoicing.push(`${openString.note}${openString.octave}`);
        continue;
      }

      // Check first 5 frets for a chord note
      for (let fret = 1; fret <= 5; fret++) {
        const note = getNoteAtFret(stringIndex, fret);
        if (chordNotes.value.includes(note)) {
          const octave = getOctaveAtFret(stringIndex, fret);
          chordVoicing.push(`${note}${octave}`);
          break;
        }
      }
    }

    return chordVoicing;
  }

  // Check if a note at a position is part of the current chord
  function isChordNote(stringIndex, fret) {
    const note =
      fret === 0
        ? openStrings.value[stringIndex].note
        : getNoteAtFret(stringIndex, fret);
    return chordNotes.value.includes(note);
  }

  // Check if a note at a position is the root note
  function isRootNote(stringIndex, fret) {
    const note =
      fret === 0
        ? openStrings.value[stringIndex].note
        : getNoteAtFret(stringIndex, fret);
    return note === rootNote.value;
  }

  return {
    // State
    notes,
    chordTypes,
    openStrings,
    frets,
    singleMarkerFrets,
    doubleMarkerFrets,
    notesDisplayed,
    rootNote,
    chordType,
    chordNotes,

    // Actions
    changeLabels,
    updateChord,
    getNoteAtFret,
    getOctaveAtFret,
    getNoteWithOctaveAtFret,
    buildChordVoicing,
    isChordNote,
    isRootNote,
  };
});
