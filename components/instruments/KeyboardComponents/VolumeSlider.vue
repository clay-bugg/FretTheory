<template>
  <div class="volume-slider">
    <label class="volume-label">VOL</label>
    <input
      type="range"
      v-model="volumeLevel"
      min="0"
      max="100"
      step="1"
      @input="volumeChange"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useToneAudio } from "~/composables/useToneAudio";

const { setVolume } = useToneAudio();
const volumeLevel = ref(80);

function volumeChange() {
  setVolume(volumeLevel.value);
}
</script>

<style scoped lang="scss">
@use "~/assets/scss/main.scss" as *;

.volume-slider {
  display: flex;
  align-items: center;
  gap: 0.8em;

  .volume-label {
    color: #242424;
    font-family: "Lexend", sans-serif;
    font-size: 1rem;
  }

  input {
    width: 120px;
    height: 12px;
    border-radius: 3px;
    background: rgb(21, 21, 21);
    outline: none;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;

    &::-webkit-slider-thumb {
      width: 30px;
      height: 20px;
      border: 1px solid rgb(0, 0, 0);
      border-radius: 3px;
      background: #ababab;
      cursor: pointer;
      box-shadow: 0 1px 0 black, 0 -1px 0 black, 0 3px 6px black;
      appearance: none;
      -webkit-appearance: none;
    }

    &::-moz-range-thumb {
      width: 22px;
      height: 30px;
      border: 1px solid black;
      border-radius: 3px;
      background: #ababab;
      cursor: pointer;
      box-shadow: 0 1px 0 black, 0 -1px 0 black, 0 3px 6px black;
    }
  }
}
</style>
