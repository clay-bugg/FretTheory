<template>
  <div class="component">

    <div class="keyboard-container">

      <div class="instrument-selector">
        <select>
          <option v-for="option in options" :key="option">{{ option }}</option>
        </select>
      </div>

      <div class="keyboard">
        <div class="keyboard-inner">
          <div class="controls">
            <div class="note-labels-selector"></div>
            <div class="arpeggiator"></div>
            <div class="volume/tone"></div>
          </div>
          <div class="keys"></div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { ref } from 'vue';

const options = ref(['Keyboard', 'Guitar'])
</script>

<style scoped>
.component {
  width: 100%;
  height: 100vh;

}
.keyboard-container {
  width: 70em;
  height: 25em;
  margin: 0 auto;
  margin-top: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.instrument-selector {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
}

.instrument-selector select {
  margin-right: 3em;
  font-size: 1.1rem;
  font-family: 'Orbitron';
  border-radius: 5px;
  padding: 0.1em;
}

.keyboard {
  width: 100%;
  height: 100%;
  background-color: rgb(46, 46, 46);
  border-radius: 35px;
}
</style>