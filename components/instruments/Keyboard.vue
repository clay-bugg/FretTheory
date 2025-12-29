<template>
  <div class="keyboard">
    <KeyboardControls />
    <KeyboardKeys @play-key="playKey" @stop-key="stopKey" />
  </div>
</template>

<script setup>

import KeyboardControls from "./KeyboardComponents/Controls";
import KeyboardKeys from "./KeyboardComponents/Keys";
import { useToneAudio } from "~/composables/useToneAudio";

// Audio composable - uses store internally
const { playKey, stopKey, playChord } = useToneAudio();

// Chord play handlers
function handleChordPlay() {
  playChord("play");
}

function handleChordStop() {
  playChord("stop");
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
</style>
