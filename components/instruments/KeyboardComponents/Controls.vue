<template>
  <div class="controls">
    <div class="LED-controls">
      <UILEDControl :ledAmount="3" label="LABELS" />
      <UILEDControl :ledAmount="6" label="PITCH" />
    </div>
    <UIVolumeSlider />
  </div>
</template>

<script setup>
  
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
