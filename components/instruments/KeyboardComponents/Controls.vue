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
    width: 100%;
    background: transparent;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
  }
}
</style>
