import * as Tone from "tone";
import { useDrumStore } from "~/stores/drumStore";

let players = null;
let isInitialized = false;

// Drum sample URLs - using synthesized drums from Tone.js
const drumUrls = {
  kick: "kick.mp3",
  snare: "snare.mp3",
  "hihat-closed": "hihat-closed.mp3",
  "hihat-open": "hihat-open.mp3",
  "tom-high": "tom-high.mp3",
  "tom-mid": "tom-mid.mp3",
  "tom-low": "tom-low.mp3",
  crash: "crash.mp3",
  ride: "ride.mp3",
};

function initPlayers() {
  if (isInitialized) return;

  players = new Tone.Players({
    urls: drumUrls,
    baseUrl: "/sounds/drum_samples/",
    onload: () => {
      console.log("Drum samples loaded!");
    },
    onerror: (err) => {
      console.error("Error loading drum samples:", err);
    },
  }).toDestination();

  isInitialized = true;
}

// Create synthesized drums as fallback
function createSynthDrums() {
  const membraneSynth = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 6,
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.001,
      decay: 0.4,
      sustain: 0.01,
      release: 1.4,
    },
  }).toDestination();

  const noiseSynth = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: {
      attack: 0.001,
      decay: 0.2,
      sustain: 0,
      release: 0.1,
    },
  }).toDestination();

  const metalSynth = new Tone.MetalSynth({
    frequency: 200,
    envelope: {
      attack: 0.001,
      decay: 0.1,
      release: 0.01,
    },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5,
  }).toDestination();

  return { membraneSynth, noiseSynth, metalSynth };
}

let synthDrums = null;

export function useDrumAudio() {
  const store = useDrumStore();

  if (typeof window !== "undefined" && !isInitialized) {
    initPlayers();
    synthDrums = createSynthDrums();
  }

  async function ensureAudioContext() {
    if (Tone.context.state !== "running") {
      await Tone.start();
    }
  }

  async function playDrum(drumId) {
    await ensureAudioContext();
    store.setActive(drumId);

    // Try to play from samples first
    if (players && players.has(drumId)) {
      try {
        players.player(drumId).start();
        console.log(`Playing drum: ${drumId}`);
      } catch (e) {
        // Fallback to synth
        playSynthDrum(drumId);
      }
    } else {
      // Use synthesized drums as fallback
      playSynthDrum(drumId);
    }

    // Auto-release visual after short delay
    setTimeout(() => {
      store.setInactive(drumId);
    }, 150);
  }

  function playSynthDrum(drumId) {
    if (!synthDrums) return;

    const { membraneSynth, noiseSynth, metalSynth } = synthDrums;

    switch (drumId) {
      case "kick":
        membraneSynth.triggerAttackRelease("C1", "8n");
        break;
      case "snare":
        noiseSynth.triggerAttackRelease("8n");
        membraneSynth.triggerAttackRelease("E2", "16n");
        break;
      case "hihat-closed":
        metalSynth.triggerAttackRelease("32n");
        break;
      case "hihat-open":
        metalSynth.triggerAttackRelease("8n");
        break;
      case "tom-high":
        membraneSynth.triggerAttackRelease("G3", "8n");
        break;
      case "tom-mid":
        membraneSynth.triggerAttackRelease("E3", "8n");
        break;
      case "tom-low":
        membraneSynth.triggerAttackRelease("C3", "8n");
        break;
      case "crash":
        metalSynth.triggerAttackRelease("4n");
        break;
      case "ride":
        metalSynth.triggerAttackRelease("16n");
        break;
      default:
        console.warn(`Unknown drum: ${drumId}`);
    }
    console.log(`Playing synth drum: ${drumId}`);
  }

  function setVolume(val) {
    const db = val <= 0 ? -Infinity : Tone.gainToDb(val / 100);
    console.log(`Setting drum volume to ${val}% (${db}dB)`);

    if (players) {
      players.volume.rampTo(db, 0.1);
    }

    if (synthDrums) {
      synthDrums.membraneSynth.volume.rampTo(db, 0.1);
      synthDrums.noiseSynth.volume.rampTo(db, 0.1);
      synthDrums.metalSynth.volume.rampTo(db, 0.1);
    }
  }

  return {
    playDrum,
    setVolume,
  };
}
