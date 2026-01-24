<template>
  <div class="controls">
    <div class="LED-controls">
      <ControlsLEDControl :ledAmount="3" label="LABELS" />
      <ControlsLEDControl :ledAmount="6" label="PITCH" />
    </div>
    <MenuChordButtons :midi="midi" />
    <ControlsVolumeSlider />
  </div>
</template>

<script setup>
defineProps({
  midi: {
    type: Object,
    default: null,
  },
});
</script>

<style scoped>
.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 20px;

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
