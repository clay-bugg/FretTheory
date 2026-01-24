import * as Tone from "tone";
import { useKeyboardStore } from "~/stores/keyboardStore";

let sampler = null;
let isInitialized = false;

// Metronome synths
let metronomeHigh = null; // Downbeat (beat 1)
let metronomeLow = null; // Other beats

function initAudio() {
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
    // Add release envelope for smoother chord transitions
    release: 0.8, // Notes fade out over 0.8 seconds for natural piano sound
    onload: () => {
      console.log("Sampler Loaded");
    },
  }).toDestination();

  // Initialize metronome click synths
  // High click for downbeat (beat 1) - brighter, more prominent
  metronomeHigh = new Tone.MembraneSynth({
    pitchDecay: 0.008,
    octaves: 2,
    envelope: {
      attack: 0.001,
      decay: 0.1,
      sustain: 0,
      release: 0.1,
    },
  }).toDestination();
  metronomeHigh.volume.value = -6;

  // Low click for other beats - softer, subtle
  metronomeLow = new Tone.MembraneSynth({
    pitchDecay: 0.008,
    octaves: 1.5,
    envelope: {
      attack: 0.001,
      decay: 0.08,
      sustain: 0,
      release: 0.08,
    },
  }).toDestination();
  metronomeLow.volume.value = -10;

  isInitialized = true;
}

export function useToneAudio() {
  const store = useKeyboardStore();

  const activeNotes = new Set();
  const activeChord = new Set();

  if (typeof window !== "undefined" && !isInitialized) {
    initAudio();
  }

  async function playKey(note, octave) {
    if (Tone.context.state !== "running") {
      await Tone.start();
    }

    const playedNote = `${note}${octave}`;
    activeNotes.add(playedNote);

    if (sampler) {
      sampler.triggerAttack(playedNote);
    }

    console.log(`${playedNote} note played.`);
  }

  function stopKey(note, octave) {
    const playedNote = `${note}${octave}`;
    activeNotes.delete(playedNote);

    if (sampler) {
      sampler.triggerRelease(playedNote);
    }

    console.log(`${playedNote} note released.`);
  }

  // Store active arpeggio timeouts for cancellation
  let arpeggiateTimeouts = [];

  function playChord(action) {
    const notesWithOctaves = store.assignChordOctaves(
      store.rootNote,
      store.chordNotes,
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

  /**
   * Arpeggiate a chord - play notes sequentially with a delay
   * @param {string} action - "play" or "stop"
   * @param {object} options - Arpeggiator options
   * @param {string} options.pattern - "up", "down", "upDown", "downUp", "random"
   * @param {number} options.noteDelay - Delay between each note in ms
   * @param {number} options.noteDuration - How long each note rings (ms), null for sustained
   */
  function arpeggiate(action, options = {}) {
    const { pattern = "up", noteDelay = 100, noteDuration = null } = options;

    const notesWithOctaves = store.assignChordOctaves(
      store.rootNote,
      store.chordNotes,
    );
    if (!store.rootNote || !store.chordType) return;

    if (action === "stop") {
      // Clear all pending arpeggio notes
      arpeggiateTimeouts.forEach((timeout) => clearTimeout(timeout));
      arpeggiateTimeouts = [];

      if (sampler) {
        sampler.triggerRelease(notesWithOctaves);
      }
      activeChord.clear();
      return;
    }

    if (action === "play") {
      if (Tone.context.state !== "running") {
        Tone.start();
      }

      // Arrange notes based on pattern
      let orderedNotes = [...notesWithOctaves];

      switch (pattern) {
        case "down":
          orderedNotes = orderedNotes.reverse();
          break;
        case "upDown":
          if (orderedNotes.length > 2) {
            const middle = orderedNotes.slice(1, -1).reverse();
            orderedNotes = [...orderedNotes, ...middle];
          }
          break;
        case "downUp":
          orderedNotes = orderedNotes.reverse();
          if (orderedNotes.length > 2) {
            const middle = orderedNotes.slice(1, -1).reverse();
            orderedNotes = [...orderedNotes, ...middle];
          }
          break;
        case "random":
          orderedNotes = orderedNotes.sort(() => Math.random() - 0.5);
          break;
        // "up" is default, no change needed
      }

      // Clear any existing arpeggio
      arpeggiateTimeouts.forEach((timeout) => clearTimeout(timeout));
      arpeggiateTimeouts = [];

      // Play each note with a delay
      orderedNotes.forEach((note, index) => {
        const timeout = setTimeout(() => {
          if (sampler) {
            sampler.triggerAttack(note);
            activeChord.add(note);
            console.log(`Arpeggio: ${note} played`);

            // If noteDuration is set, release after duration
            if (noteDuration && noteDuration > 0) {
              const releaseTimeout = setTimeout(() => {
                sampler.triggerRelease(note);
                activeChord.delete(note);
              }, noteDuration);
              arpeggiateTimeouts.push(releaseTimeout);
            }
          }
        }, index * noteDelay);

        arpeggiateTimeouts.push(timeout);
      });

      console.log(`Arpeggiating ${orderedNotes.join(", ")} (${pattern})`);
    }
  }

  function stopAllNotes() {
    // Clear arpeggio timeouts
    arpeggiateTimeouts.forEach((timeout) => clearTimeout(timeout));
    arpeggiateTimeouts = [];

    if (sampler) {
      sampler.releaseAll();
    }
    activeNotes.clear();
    activeChord.clear();
  }

  function setVolume(val) {
    const db = val <= 0 ? -Infinity : Tone.gainToDb(val / 100);
    console.log(`Setting volume to ${val}% (${db}dB)`);

    if (sampler) {
      sampler.volume.rampTo(db, 0.1);
    }
  }

  /**
   * Play a metronome click
   * @param {boolean} isDownbeat - True for beat 1 (accented), false for other beats
   * @param {number} volume - Volume from 0-100 (default 70)
   */
  async function playMetronomeClick(isDownbeat = false, volume = 70) {
    if (Tone.context.state !== "running") {
      await Tone.start();
    }

    const db = volume <= 0 ? -Infinity : Tone.gainToDb(volume / 100);

    if (isDownbeat && metronomeHigh) {
      metronomeHigh.volume.value = db;
      metronomeHigh.triggerAttackRelease("G5", "32n");
    } else if (metronomeLow) {
      metronomeLow.volume.value = db - 4; // Slightly quieter for off-beats
      metronomeLow.triggerAttackRelease("C5", "32n");
    }
  }

  /**
   * Set metronome volume
   * @param {number} val - Volume from 0-100
   */
  function setMetronomeVolume(val) {
    const db = val <= 0 ? -Infinity : Tone.gainToDb(val / 100);
    if (metronomeHigh) metronomeHigh.volume.value = db;
    if (metronomeLow) metronomeLow.volume.value = db - 4;
  }

  return {
    playKey,
    stopKey,
    playChord,
    arpeggiate,
    stopAllNotes,
    setVolume,
    playMetronomeClick,
    setMetronomeVolume,
    activeNotes,
    activeChord,
  };
}
