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
.volume-slider {
  display: flex;
  align-items: center;
  gap: 0.8em;

  .volume-label {
    font-family: "Lexend", sans-serif;
    font-size: 1rem;
    color: #ebebeb;
  }

  input {
    -webkit-appearance: none;
    appearance: none;
    width: 120px;
    height: 12px;
    background: #000;
    border-radius: 3px;
    outline: none;
    cursor: pointer;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 28px;
      height: 22px;
      background: linear-gradient(
          to bottom,
          transparent 0px,
          transparent 5px,
          rgba(0, 0, 0, 0.6) 5px,
          rgba(0, 0, 0, 0.6) 7px,
          transparent 7px,
          transparent 9px,
          rgba(0, 0, 0, 0.6) 9px,
          rgba(0, 0, 0, 0.6) 11px,
          transparent 11px,
          transparent 13px,
          rgba(0, 0, 0, 0.6) 13px,
          rgba(0, 0, 0, 0.6) 15px,
          transparent 15px
        ),
        linear-gradient(
          to bottom,
          #9a9a9a 0%,
          #808080 30%,
          #6a6a6a 50%,
          #5a5a5a 70%,
          #4a4a4a 100%
        );
      border-radius: 3px;
      cursor: pointer;
      border: 1px solid #333;
      box-shadow: 0 1px 0 rgba(255, 255, 255, 0.3) inset,
        0 -1px 0 rgba(0, 0, 0, 0.4) inset, 0 3px 6px rgba(0, 0, 0, 0.7);
    }

    &::-moz-range-thumb {
      width: 28px;
      height: 22px;
      background: linear-gradient(
          to bottom,
          transparent 0px,
          transparent 5px,
          rgba(255, 0, 0, 0.6) 5px,
          rgba(255, 0, 0, 0.6) 7px,
          transparent 7px,
          transparent 9px,
          rgba(255, 0, 0, 0.6) 9px,
          rgba(255, 0, 0, 0.6) 11px,
          transparent 11px,
          transparent 13px,
          rgba(0, 0, 0, 0.6) 13px,
          rgba(0, 0, 0, 0.6) 15px,
          transparent 15px
        ),
        linear-gradient(
          to bottom,
          #9a9a9a 0%,
          #808080 30%,
          #6a6a6a 50%,
          #5a5a5a 70%,
          #4a4a4a 100%
        );
      border-radius: 3px;
      cursor: pointer;
      border: 1px solid #333;
      box-shadow: 0 1px 0 rgba(255, 255, 255, 0.3) inset,
        0 -1px 0 rgba(0, 0, 0, 0.4) inset, 0 3px 6px rgba(0, 0, 0, 0.7);
    }
  }
}
</style>
