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

    <!-- Chord display -->
    <div class="chord-section">
      <p class="chord-played-label">Selected Chord</p>
      <div class="chord-played">
        <p v-if="store.rootNote && store.chordType" class="chord-notes-label">
          {{ store.rootNote }}{{ store.chordType }} |
        </p>
        <p
          v-for="(note, index) in store.chordNotes"
          :key="index"
          class="chord-note"
        >
          {{ note }}
        </p>
      </div>

      <!-- Play chord button -->
      <div class="play-chord-section">
        <button
          class="play-chord-btn"
          :class="{ playing: isPlayingChord }"
          @mousedown="handleChordPlay"
          @mouseup="handleChordStop"
          @mouseleave="handleChordStop"
          :disabled="!isLoaded"
        >
          <span class="play-icon">🎸</span>
          {{ isLoaded ? "Strum Chord" : "Loading..." }}
        </button>
        <p class="spacebar-hint">Press <kbd>Space</kbd> to strum</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useGuitarStore } from "~/stores/guitarStore";
import { useGuitarAudio } from "~/composables/useGuitarAudio";

// Import the Fretboard component
import Fretboard from "~/components/instruments/GuitarComponents/Fretboard.vue";

// Store and audio
const store = useGuitarStore();
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

<style scoped>
/*----CONTROLS----*/
.controls {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  height: 6em;
  position: relative;
  z-index: 3;
  color: rgb(215, 215, 215);
  padding: 0 1em 0.5em;
  gap: 3em;
  margin-bottom: 0.5em;
}

.control {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  gap: 0.5em;
  padding: 0.5em 0;
}

.control-label {
  font-size: 1rem;
  text-align: center;
  text-wrap: nowrap;
}

/*----NOTE LABELS----*/
.notes-labels-checkboxes {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5em;
}

.notes-labels-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.4em;
  width: 2.5em;
  position: relative;
  top: 0.4em;
}

.notes-labels-checkboxes input {
  width: 25px;
  height: 25px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: 2px solid black;
  background-color: rgb(152, 12, 12);
  border-radius: 50px;
}

.notes-labels-checkboxes input.active {
  background-color: rgb(133, 206, 23);
}

.notes-labels-checkboxes input:hover {
  cursor: pointer;
}

.notes-checkbox {
  font-size: 0.8em;
}

/*----CHORD SELECTOR----*/
.chord-selector-box select {
  font-size: 1em;
  font-family: inherit;
  border: 2px solid black;
  border-radius: 0.3em;
  text-align: center;
  font-weight: 500;
  padding: 0.1em;
}

.chord-selector-inputs {
  display: flex;
  align-items: center;
  justify-content: center;
}

/*----GUITAR BODY----*/
.guitar-body {
  width: 1100px;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
}

/*----CHORD DISPLAY----*/
.chord-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  margin-top: 1.5em;
}

.chord-played-label {
  font-size: 1.5rem;
}

.chord-played {
  display: flex;
  align-items: center;
  width: fit-content;
  justify-content: space-between;
  font-size: 1.2em;
  font-weight: 800;
  font-family: "Ubuntu";
  gap: 1em;
}

.chord-notes-label {
  display: flex;
  align-items: center;
  width: fit-content;
}

/*----PLAY CHORD SECTION----*/
.play-chord-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
  margin-top: 0.5em;
}

.play-chord-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  padding: 0.8em 1.5em;
  font-size: 1.1rem;
  font-family: "Orbitron", sans-serif;
  font-weight: 600;
  background: linear-gradient(135deg, #4a90a4, #357a8f);
  color: white;
  border: 2px solid #255c6b;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(74, 144, 164, 0.3);
}

.play-chord-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #5aa0b4, #45899f);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 144, 164, 0.4);
}

.play-chord-btn:active:not(:disabled),
.play-chord-btn.playing {
  background: linear-gradient(135deg, #3a7f94, #256a7f);
  transform: translateY(1px);
  box-shadow: 0 2px 10px rgba(74, 144, 164, 0.3);
}

.play-chord-btn:disabled {
  background: linear-gradient(135deg, #666, #555);
  border-color: #444;
  cursor: not-allowed;
  opacity: 0.7;
}

.play-icon {
  font-size: 1.2em;
}

.spacebar-hint {
  font-size: 0.85rem;
  color: #888;
  font-family: "Ubuntu", sans-serif;
}

.spacebar-hint kbd {
  display: inline-block;
  padding: 0.2em 0.5em;
  font-size: 0.9em;
  background-color: #333;
  color: #fff;
  border: 1px solid #555;
  border-radius: 4px;
  box-shadow: 0 2px 0 #222;
}
</style>
