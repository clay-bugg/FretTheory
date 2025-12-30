import * as Tone from "tone";
import { useKeyboardStore } from "~/stores/keyboardStore";

let sampler = null;
let isInitialized = false;

function initSampler() {
  if (isInitialized) return;

  sampler = new Tone.Sampler({
    urls: {
      A1: "A1.mp3",
      A2: "A2.mp3",
      A3: "A3.mp3",
      A4: "A4.mp3",
      A5: "A5.mp3",
      A6: "A6.mp3",
      A7: "A7.mp3",
    },
    baseUrl: "/sounds/piano_samples/",
    onload: () => {
      console.log("Sampler Loaded");
    },
  }).toDestination();

  isInitialized = true;
}

export function useToneAudio() {
  const store = useKeyboardStore();

  const activeNotes = new Set();
  const activeChord = new Set();

  if (typeof window !== "undefined" && !isInitialized) {
    initSampler();
  }

  async function playKey(note, octave) {
    if (Tone.context.state !== "running") {
      await Tone.start();
    }

    const playedNote = `${note}${octave}`;
    activeNotes.add(playedNote);

    if (sampler) {
      sampler.triggerAttackRelease(playedNote, "2n");
    }

    console.log(`${playedNote} note played.`);
  }

  function playChord(action) {
    const notesWithOctaves = store.assignChordOctaves(
      store.rootNote,
      store.chordNotes
    );
    if (!store.rootNote || !store.chordType) return;

    if (action === "play") {
      if (Tone.context.state !== "running") {
        Tone.start();
      }
      if (sampler) {
        sampler.triggerAttack(notesWithOctaves);

        activeChord.add(notesWithOctaves);

        console.log(`${notesWithOctaves.join(", ")} chord played.`);
      }
    } else if (action === "stop") {
      if (sampler) {
        sampler.triggerRelease(notesWithOctaves);
      }
      activeChord.delete(notesWithOctaves);
    }
  }

  function setVolume(val) {
    const db = val <= 0 ? -Infinity : Tone.gainToDb(val / 100);
    console.log(`Setting volume to ${val}% (${db}dB)`);

    if (sampler) {
      sampler.volume.rampTo(db, 0.1);
    }
  }

  return {
    playKey,
    playChord,
    setVolume,
    activeNotes,
    activeChord,
  };
}
