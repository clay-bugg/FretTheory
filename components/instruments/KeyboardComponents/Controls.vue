<template>
  <div class="controls">
    <LEDControl :ledAmount="6" label="PITCH" />
    <LEDControl :ledAmount="3" label="LABELS" />
  </div>
</template>

<script setup>
import OctaveRangeControl from './OctaveRangeControl'
import LEDControl from './LEDControl'
</script>

<style scoped>
.controls {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}
</style>
