<template>
  <div class="keyboard">
    <div class="keyboard-inner">
      <div class="controls">
        <div class="note-labels-selector"></div>
        <div class="arpeggiator"></div>
        <div class="volume-tone"></div>
      </div>
      <div class="keys"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
</script>

<style scoped>
.keyboard {
  width: 100%;
  height: 100%;
  background-color: rgb(46, 46, 46);
  border-radius: 35px;
}
.keyboard-inner {
  color: black;
}
</style>
