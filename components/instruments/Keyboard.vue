<template>
  <div class="component">
    <InstrumentsChordSelector />

    <div class="keyboard">
      <KeyboardControls
        :starting-octave="startingOctave"
        :octave-amount="octaveAmount"
        :notes-displayed="notesDisplayed"
        :root-note="rootNote"
        :chord-type="chordType"
        :notes="notes"
        :chord-types="chordTypes"
        :current-tone="currentTone"
        @update:starting-octave="startingOctave = $event"
        @update:octave-amount="octaveAmount = $event"
        @update:notes-displayed="notesDisplayed = $event"
        @update:root-note="rootNote = $event"
        @update:chord-type="chordType = $event"
        @update:current-tone="currentTone = $event"
      />

      <KeyboardKeys
        :notes="notes"
        :octave-amount="octaveAmount"
        :starting-octave="startingOctave"
        :chord-notes="chordNotes"
        :root-note="rootNote"
        :notes-displayed="notesDisplayed"
        @play-key="playKey"
        @stop-key="stopKey"
      />
    </div>

    <ChordDisplay
      :root-note="rootNote"
      :chord-type="chordType"
      :chord-notes="chordNotes"
      @play="handleChordPlay"
      @stop="handleChordStop"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import KeyboardControls from "./keyboard/KeyboardControls.vue";
import KeyboardKeys from "./keyboard/KeyboardKeys.vue";
import ChordDisplay from "./keyboard/ChordDisplay.vue";
import { useChordCalculation } from "~/composables/useChordCalculation";
import { useToneAudio } from "~/composables/useToneAudio";

// Octave state
const octaveAmount = ref("2");
const startingOctave = ref(3);
const notesDisplayed = ref("all");

// Chord calculation composable
const { notes, chordTypes, rootNote, chordType, chordNotes } =
  useChordCalculation();

// Audio composable
const { currentTone, playKey, stopKey, playChord } = useToneAudio(
  startingOctave,
  notes
);

// Chord play handlers
function handleChordPlay() {
  playChord("play", rootNote.value, chordType.value, chordNotes.value);
}

function handleChordStop() {
  playChord("stop", rootNote.value, chordType.value, chordNotes.value);
}

// Spacebar handlers
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
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.component {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: fit-content;
  position: relative;
  justify-content: flex-start;
  font-family: "Orbitron";
}
input {
  font-family: "Ubuntu";
}
.keyboard {
  border: 1px solid black;
  border-radius: 15px;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  background-color: rgb(42, 42, 42);
  width: 1100px;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  padding: 2em 4em 1em;
}
</style>
