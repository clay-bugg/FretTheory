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
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: column;
  padding: 0 2em 1em;
}
.keyboard-inner {
  background-color: rgb(52, 52, 52);
  width: 100%;
  height: 23em;
  border-radius: 35px;
  border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;
  border: 1px solid black;
}
</style>
