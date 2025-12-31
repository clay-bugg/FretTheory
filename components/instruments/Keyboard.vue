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
  background-color: $bg-keyboard;
  border: 3px solid $border-black;
  border-radius: 10px;
  box-shadow: 0 6px 2px $shadow-medium;
}
</style>
