<template>
  <div class="controls">
    <LEDControl :ledAmount="3" label="LABELS" />
    <LEDControl :ledAmount="6" label="PITCH" />
  </div>
</template>

<script setup>
import LEDControl from "./LEDControl";
</script>

<style scoped>
.controls {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  gap: 2em;
  padding: 20px;
}
</style>
