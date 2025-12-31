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
    color: $text-light;
    font-family: "Lexend", sans-serif;
    font-size: 1rem;
  }

  input {
    width: 120px;
    height: 12px;
    border-radius: 3px;
    background: $slider-track;
    outline: none;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;

    &::-webkit-slider-thumb {
      width: 28px;
      height: 22px;
      border: 1px solid $slider-thumb-border;
      border-radius: 3px;
      background: linear-gradient(
          to bottom,
          transparent 0px,
          transparent 5px,
          $slider-groove 5px,
          $slider-groove 7px,
          transparent 7px,
          transparent 9px,
          $slider-groove 9px,
          $slider-groove 11px,
          transparent 11px,
          transparent 13px,
          $slider-groove 13px,
          $slider-groove 15px,
          transparent 15px
        ),
        linear-gradient(
          to bottom,
          $slider-thumb-gradient-1 0%,
          $slider-thumb-gradient-2 30%,
          $slider-thumb-gradient-3 50%,
          $slider-thumb-gradient-4 70%,
          $slider-thumb-gradient-5 100%
        );
      cursor: pointer;
      box-shadow: 0 1px 0 $shadow-btn-inset-light inset,
        0 -1px 0 $shadow-btn-inset-dark inset, 0 3px 6px $shadow-btn-drop;
      appearance: none;
      -webkit-appearance: none;
    }

    &::-moz-range-thumb {
      width: 28px;
      height: 22px;
      border: 1px solid $slider-thumb-border;
      border-radius: 3px;
      background: linear-gradient(
          to bottom,
          transparent 0px,
          transparent 5px,
          $slider-groove 5px,
          $slider-groove 7px,
          transparent 7px,
          transparent 9px,
          $slider-groove 9px,
          $slider-groove 11px,
          transparent 11px,
          transparent 13px,
          $slider-groove 13px,
          $slider-groove 15px,
          transparent 15px
        ),
        linear-gradient(
          to bottom,
          $slider-thumb-gradient-1 0%,
          $slider-thumb-gradient-2 30%,
          $slider-thumb-gradient-3 50%,
          $slider-thumb-gradient-4 70%,
          $slider-thumb-gradient-5 100%
        );
      cursor: pointer;
      box-shadow: 0 1px 0 $shadow-btn-inset-light inset,
        0 -1px 0 $shadow-btn-inset-dark inset, 0 3px 6px $shadow-btn-drop;
    }
  }
}
</style>
