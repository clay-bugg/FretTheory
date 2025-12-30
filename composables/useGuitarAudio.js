import * as Tone from "tone";
import { ref } from "vue";
import { useGuitarStore } from "~/stores/guitarStore";

// Shared singleton sampler - all components use the same instance
let sampler = null;
let polySampler = null;
let isInitialized = false;

// Guitar sample URLs - keys use # for sharps (Tone.js format), values use 's' (file naming convention)
const guitarSampleUrls = {
  E2: "E2.mp3",
  F2: "F2.mp3",
  "F#2": "Fs2.mp3",
  G2: "G2.mp3",
  "G#2": "Gs2.mp3",
  A2: "A2.mp3",
  "A#2": "As2.mp3",
  B2: "B2.mp3",
  C3: "C3.mp3",
  "C#3": "Cs3.mp3",
  D3: "D3.mp3",
  "D#3": "Ds3.mp3",
  E3: "E3.mp3",
  F3: "F3.mp3",
  "F#3": "Fs3.mp3",
  G3: "G3.mp3",
  "G#3": "Gs3.mp3",
  A3: "A3.mp3",
  "A#3": "As3.mp3",
  B3: "B3.mp3",
  C4: "C4.mp3",
  "C#4": "Cs4.mp3",
  D4: "D4.mp3",
  "D#4": "Ds4.mp3",
  E4: "E4.mp3",
  F4: "F4.mp3",
  "F#4": "Fs4.mp3",
  G4: "G4.mp3",
  "G#4": "Gs4.mp3",
  A4: "A4.mp3",
  "A#4": "As4.mp3",
  B4: "B4.mp3",
  C5: "C5.mp3",
  "C#5": "Cs5.mp3",
  D5: "D5.mp3",
};

// Base path for guitar samples
const basePath =
  "/sounds/guitar-samples/tonejs-instruments-master/tonejs-instruments-master/samples/guitar-acoustic/";

const isLoaded = ref(false);

function initSampler() {
  if (isInitialized) return;

  try {
    // Single note sampler for individual fret clicks
    sampler = new Tone.Sampler({
      urls: guitarSampleUrls,
      baseUrl: basePath,
      onload: () => {
        console.log("Guitar Sampler Loaded");
        isLoaded.value = true;
      },
      onerror: (err) => {
        console.error("Failed to load guitar samples:", err);
      },
    }).toDestination();

    // PolySynth sampler for chords (using the same samples)
    polySampler = new Tone.Sampler({
      urls: guitarSampleUrls,
      baseUrl: basePath,
      onload: () => {
        console.log("Guitar Poly Sampler Loaded");
      },
    }).toDestination();

    isInitialized = true;
  } catch (err) {
    console.error("Error initializing guitar audio:", err);
  }
}

export function useGuitarAudio() {
  const store = useGuitarStore();
  const activeNotes = new Set();

  // Initialize sampler on first use (client-side only)
  if (typeof window !== "undefined" && !isInitialized) {
    initSampler();
  }

  // Play a single note on the guitar
  async function playNote(note, octave) {
    if (!sampler || !isLoaded.value) {
      console.warn("Guitar sampler not loaded yet");
      return;
    }

    if (Tone.context.state !== "running") {
      await Tone.start();
    }

    const playedNote = `${note}${octave}`;
    activeNotes.add(playedNote);

    try {
      sampler.triggerAttack(playedNote);
      console.log(`Guitar: ${playedNote} played`);
    } catch (err) {
      console.error("Error playing note:", err);
    }
  }

  // Stop a single note
  function stopNote(note, octave) {
    if (!sampler) return;

    const playedNote = `${note}${octave}`;
    activeNotes.delete(playedNote);

    try {
      sampler.triggerRelease(playedNote);
    } catch (err) {
      console.error("Error stopping note:", err);
    }
  }

  // Play a fret on a specific string (uses store for calculations)
  function playFret(stringIndex, fret) {
    const note = store.getNoteAtFret(stringIndex, fret);
    const octave = store.getOctaveAtFret(stringIndex, fret);
    playNote(note, octave);
    return { note, octave };
  }

  // Stop a fret on a specific string
  function stopFret(stringIndex, fret) {
    const note = store.getNoteAtFret(stringIndex, fret);
    const octave = store.getOctaveAtFret(stringIndex, fret);
    stopNote(note, octave);
  }

  // Play open string
  function playOpenString(stringIndex) {
    const openString = store.openStrings[stringIndex];
    playNote(openString.note, openString.octave);
    return { note: openString.note, octave: openString.octave };
  }

  // Stop open string
  function stopOpenString(stringIndex) {
    const openString = store.openStrings[stringIndex];
    stopNote(openString.note, openString.octave);
  }

  // Play the current chord from the store (strummed effect)
  async function playChord(strumDelay = 40) {
    if (!polySampler || !isLoaded.value) {
      console.warn("Guitar sampler not loaded yet");
      return;
    }

    const chordVoicing = store.buildChordVoicing();
    if (chordVoicing.length === 0) return;

    if (Tone.context.state !== "running") {
      await Tone.start();
    }

    try {
      // Strum effect - play notes with slight delay between each
      chordVoicing.forEach((noteWithOctave, index) => {
        setTimeout(() => {
          polySampler.triggerAttackRelease(noteWithOctave, "2n");
        }, index * strumDelay);
      });

      console.log(`Guitar chord: ${chordVoicing.join(", ")}`);
    } catch (err) {
      console.error("Error playing chord:", err);
    }
  }

  // Play custom notes as a chord (for external voicings)
  async function playCustomChord(notesWithOctaves, strumDelay = 40) {
    if (!polySampler || !isLoaded.value) {
      console.warn("Guitar sampler not loaded yet");
      return;
    }

    if (Tone.context.state !== "running") {
      await Tone.start();
    }

    try {
      notesWithOctaves.forEach((noteWithOctave, index) => {
        setTimeout(() => {
          polySampler.triggerAttackRelease(noteWithOctave, "2n");
        }, index * strumDelay);
      });

      console.log(`Guitar chord: ${notesWithOctaves.join(", ")}`);
    } catch (err) {
      console.error("Error playing chord:", err);
    }
  }

  // Stop all active notes
  function stopAll() {
    if (sampler) {
      sampler.releaseAll();
    }
    if (polySampler) {
      polySampler.releaseAll();
    }
    activeNotes.clear();
  }

  // Set volume (matches keyboard API)
  function setVolume(val) {
    const db = val <= 0 ? -Infinity : Tone.gainToDb(val / 100);
    console.log(`Setting guitar volume to ${val}% (${db}dB)`);

    if (sampler) {
      sampler.volume.rampTo(db, 0.1);
    }
    if (polySampler) {
      polySampler.volume.rampTo(db, 0.1);
    }
  }

  // Cleanup function
  function dispose() {
    if (sampler) {
      sampler.dispose();
      sampler = null;
    }
    if (polySampler) {
      polySampler.dispose();
      polySampler = null;
    }
    activeNotes.clear();
    isLoaded.value = false;
    isInitialized = false;
  }

  return {
    playNote,
    stopNote,
    playFret,
    stopFret,
    playOpenString,
    stopOpenString,
    playChord,
    playCustomChord,
    stopAll,
    setVolume,
    dispose,
    activeNotes,
    isLoaded,
  };
}
