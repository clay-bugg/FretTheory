<template>
  <div class="keyboard">
    <KeyboardControls :midi="midi" />

    <!-- Player mode: normal keyboard -->
    <KeyboardKeys
      v-if="controlStore.keyboardType === 'player'"
      @play-key="handlePlayKey"
      @stop-key="handleStopKey"
    />

    <!-- MIDI mode: keyboard with MIDI input -->
    <KeyboardKeys
      v-else-if="controlStore.keyboardType === 'MIDI'"
      :midi-active-notes="midi.activeNotes.value"
      @play-key="handlePlayKey"
      @stop-key="handleStopKey"
    />

    <!-- Finder mode -->
    <FinderKeys v-else />

    <!-- Playing Display - shows notes and chords being played (below keyboard) -->
    <PlayingDisplay
      v-if="controlStore.keyboardType !== 'finder'"
      :active-notes="activeNotes"
    />

    <!-- Chord Selector Panel - styled like finder's chord display -->
    <div class="chord-panel" v-if="controlStore.keyboardType === 'player'">
      <SelectorsRootNoteSelector />
      <ChordsChordGrid />
      <ChordsChordProgression />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useControlStore } from "~/stores/controlStore";
import KeyboardControls from "./Controls";
import KeyboardKeys from "./Keys";
import FinderKeys from "./FinderKeys";
import PlayingDisplay from "./PlayingDisplay";
import { useToneAudio } from "~/composables/useToneAudio";
import { useMIDI } from "~/composables/useMIDI";

const controlStore = useControlStore();

// Track active notes for display
const activeNotes = ref([]);

// Audio composable - uses store internally
const { playKey, stopKey, playChord } = useToneAudio();

// Wrapper functions to track active notes
function handlePlayKey(note, octave) {
  // Add to active notes
  const noteKey = `${note}${octave}`;
  if (!activeNotes.value.find((n) => n.key === noteKey)) {
    activeNotes.value = [...activeNotes.value, { key: noteKey, note, octave }];
  }
  playKey(note, octave);
}

function handleStopKey(note, octave) {
  const noteKey = `${note}${octave}`;
  activeNotes.value = activeNotes.value.filter((n) => n.key !== noteKey);
  stopKey(note, octave);
}

const midi = useMIDI();

midi.onNoteOn((note, octave, velocity) => {
  handlePlayKey(note, octave);
});

midi.onNoteOff((note, octave) => {
  handleStopKey(note, octave);
});

function handleChordPlay() {
  playChord("play");
}

function handleChordStop() {
  playChord("stop");
}

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
  midi.disconnect();
});
</script>

<style scoped lang="scss">
@use "~/assets/scss/main.scss" as *;

.component {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: fit-content;
  position: relative;
}

.instrument-layout {
  display: flex;
  align-items: flex-start;
  gap: 1.5em;
}

.keyboard-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.keyboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: fit-content;
  padding: 0 20px;
  background-color: black;
  border: 3px solid black;
  border-radius: 10px;
  box-shadow: 0 6px 2px black;
}

.chord-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1em;
  width: 100%;
  padding: 1.2em 1em;
  background: linear-gradient(180deg, #151515 0%, #070707 100%);
  border-top: 2px solid #333;
  border-radius: 0 0 8px 8px;
  margin-bottom: 0.5em;
}
</style>
