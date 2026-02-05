<template>
  <div class="page">
    <div class="guitar-body">
      <!-- Controls -->
      <div class="controls">
        <div class="notes-labels control">
          <p class="control-label">Note Labels</p>

          <div class="notes-labels-checkboxes">
            <div class="notes-labels-checkbox">
              <input
                v-model="store.notesDisplayed"
                :class="[
                  'all-notes-checkbox',
                  { active: store.notesDisplayed === 'all' },
                ]"
                type="radio"
                value="all"
              />
              <p class="notes-checkbox">All</p>
            </div>

            <div class="notes-labels-checkbox">
              <input
                v-model="store.notesDisplayed"
                :class="[
                  'chord-notes-checkbox',
                  { active: store.notesDisplayed === 'chord' },
                ]"
                type="radio"
                value="chord"
              />
              <p class="notes-checkbox">Chord</p>
            </div>

            <div class="notes-labels-checkbox">
              <input
                v-model="store.notesDisplayed"
                :class="[
                  'no-notes-checkbox',
                  { active: store.notesDisplayed === 'none' },
                ]"
                type="radio"
                value="none"
              />
              <p class="notes-checkbox">None</p>
            </div>
          </div>
        </div>

        <div class="chord-selector-box control">
          <p class="control-label">Chord</p>
          <div class="chord-selector-inputs">
            <select class="root-note-selector" v-model="store.rootNote">
              <option v-for="note in store.notes" :key="note" :value="note">
                {{ note }}
              </option>
            </select>
            <select class="chord-type-selector" v-model="store.chordType">
              <option
                v-for="type in store.chordTypes"
                :key="type.value"
                :value="type.value"
              >
                {{ type.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Fretboard Component -->
      <Fretboard @fretPlayed="onFretPlayed" @nutPlayed="onNutPlayed" />
    </div>

    <!-- Chord Progression Timeline -->
    <div class="chord-panel">
      <MenuChordProgression :external-play="handleTimelineChordPlay" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useGuitarStore } from "~/stores/guitarStore";
import { useGuitarAudio } from "~/composables/useGuitarAudio";
import { useKeyboardStore } from "~/stores/keyboardStore";
import { storeToRefs } from "pinia";

// Import the Fretboard component
import Fretboard from "./Fretboard.vue";

// Store and audio
const store = useGuitarStore();
const keyboardStore = useKeyboardStore();
const { playChord, stopAll, dispose, isLoaded } = useGuitarAudio();

// Local UI state
const isPlayingChord = ref(false);
const lastFretPlayed = ref("");

// Event handlers from Fretboard
function onFretPlayed({ stringIndex, fret, note }) {
  lastFretPlayed.value = `String ${6 - stringIndex}: Fret ${fret} - ${note}`;
}

function onNutPlayed({ stringIndex, note }) {
  lastFretPlayed.value = `String ${6 - stringIndex}: Open - ${note}`;
}

// Handle chord playback from the progression timeline
function handleTimelineChordPlay(chord) {
  // Update store (visualizer sync)
  store.rootNote = chord.root;
  store.chordType = chord.type;

  // Play guitar audio
  // We use a slight delay to allow store updates to propagate if needed,
  // though sync update is immediate.
  playChord(40);
}

// Chord playback
function handleChordPlay() {
  if (!store.rootNote || !store.chordType || store.chordNotes.length === 0) {
    return;
  }

  isPlayingChord.value = true;
  playChord(40); // Uses store.buildChordVoicing() internally
}

function handleChordStop() {
  isPlayingChord.value = false;
  stopAll();
}

// Sync keyboard store (progression) to guitar store (visualizer)
const { rootNote: kRoot, chordType: kType } = storeToRefs(keyboardStore);

watch([kRoot, kType], ([newRoot, newType]) => {
  if (newRoot && newType) {
    store.rootNote = newRoot;
    store.chordType = newType;
  }
});

// Spacebar handlers for chord playback
function spacePressed(e) {
  if (!e) return;
  if (e.code === "Space" || e.key === " " || e.key === "Spacebar") {
    e.preventDefault();
    if (!e.repeat) {
      handleChordPlay();
    }
  }
}

function spaceReleased(e) {
  if (!e) return;
  if (e.code === "Space" || e.key === " " || e.key === "Spacebar") {
    e.preventDefault();
    handleChordStop();
  }
}

onMounted(() => {
  window.addEventListener("keydown", spacePressed);
  window.addEventListener("keyup", spaceReleased);
});

onUnmounted(() => {
  window.removeEventListener("keydown", spacePressed);
  window.removeEventListener("keyup", spaceReleased);
  stopAll();
  dispose();
});
</script>

<style scoped lang="scss">
@use "~/assets/scss/main.scss" as *;

.controls {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
  min-height: 80px;
  position: relative;
  z-index: 3;
  color: #cbcbcb;
  padding: 1em 2em;
  gap: 3em;
  margin-bottom: 1.5em;
  background: rgba(30, 30, 30, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  .control {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1em;
    padding: 0;

    &-label {
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #888;
      font-weight: 600;
      margin-bottom: 0.2em;
    }
  }
}

.notes-labels-checkboxes {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5em;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5em 1em;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  .notes-labels-checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 0.5em;
    cursor: pointer;
    opacity: 0.7;
    transition: all 0.2s ease;

    &:hover {
      opacity: 1;
    }

    /* When active class is applied to input */
    &:has(input.active) {
      opacity: 1;

      .notes-checkbox {
        color: #f59e0b;
        font-weight: 600;
      }
    }
  }

  input {
    width: 20px;
    height: 20px;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: transparent;
    border: 2px solid #555;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;
    display: grid;
    place-content: center;

    &.active {
      border-color: #f59e0b;
      box-shadow: 0 0 10px rgba(245, 158, 11, 0.3);

      &::before {
        content: "";
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #f59e0b;
      }
    }
  }

  .notes-checkbox {
    font-size: 0.85em;
    color: #aaa;
    transition: color 0.2s;
  }
}

.chord-selector {
  &-box p {
    margin-bottom: 0.5rem;
  }

  &-box select {
    font-size: 1rem;
    font-family: inherit;
    background: #1a1a1a;
    color: #ddd;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 0.6em 1em;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: #555;
      background: #252525;
    }

    &:focus {
      outline: none;
      border-color: #f59e0b;
      box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
    }
  }

  &-inputs {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8em;
  }
}

.guitar-body {
  width: 1100px;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
}

.chord-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  margin-top: 2em;
  background: rgba(30, 30, 30, 0.4);
  backdrop-filter: blur(8px);
  padding: 1.5em 3em;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  .chord-played {
    display: flex;
    align-items: center;
    width: fit-content;
    justify-content: center;
    gap: 0.5em;

    &-label {
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #888;
      margin-bottom: 0.5em;
    }
  }

  .chord-notes-label {
    font-size: 1.5rem;
    font-weight: 700;
    color: #f59e0b;
    font-family: "Ubuntu", sans-serif;
    margin-right: 0.5em;
  }

  .chord-note {
    font-size: 1.2rem;
    color: #ddd;
    font-weight: 500;
  }
}

.play-chord-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8em;
  margin-top: 1em;

  .play-chord-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6em;
    padding: 0.8em 2em;
    font-size: 1rem;
    font-family: "Orbitron", sans-serif;
    font-weight: 600;
    letter-spacing: 0.05em;
    background: linear-gradient(135deg, #1f1f1f, #141414);
    color: #eee;
    border: 1px solid #333;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    position: relative;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.05),
        transparent
      );
      transform: translateX(-100%);
      transition: transform 0.5s;
    }

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #2a2a2a, #1f1f1f);
      border-color: #f59e0b;
      color: #fff;
      transform: translateY(-2px);
      box-shadow:
        0 6px 20px rgba(0, 0, 0, 0.5),
        0 0 15px rgba(245, 158, 11, 0.2);

      &::before {
        transform: translateX(100%);
      }

      .play-icon {
        transform: scale(1.1) rotate(5deg);
      }
    }

    &:active:not(:disabled),
    &.playing {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      border-color: #d97706;
      color: black;
      transform: translateY(1px);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    }

    &:disabled {
      background: #222;
      color: #555;
      border-color: #333;
      cursor: not-allowed;
      opacity: 0.7;
    }
  }

  .play-icon {
    font-size: 1.2rem;
    transition: transform 0.2s ease;
  }
}

.spacebar-hint {
  font-size: 0.8rem;
  color: #666;
  font-family: "Lexend", sans-serif;

  kbd {
    display: inline-block;
    padding: 0.1em 0.5em;
    font-size: 0.85em;
    background-color: #1a1a1a;
    color: #999;
    border: 1px solid #333;
    border-radius: 4px;
    box-shadow: 0 2px 0 #111;
    margin: 0 0.2em;
  }
}

.chord-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1em;
  width: 100%;
  padding: 1.2em 1em;
  border-top: 2px solid #333;
  margin-top: 2em;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}
</style>
