<template>
  <div class="controls">
    <div class="LED-controls">
      <LEDControl :ledAmount="3" label="LABELS" />
      <LEDControl :ledAmount="6" label="PITCH" />
    </div>
    <VolumeSlider />
  </div>
</template>

<script setup>
import LEDControl from "./LEDControl";
import VolumeSlider from "./VolumeSlider";
</script>

<style scoped>
.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  .LED-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2em;
  }

  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    width: 100%;
    cursor: pointer;
  }
}
</style>
