<template>
  <div @click="toggleArpeggiator" :class="['arpeggio-switch-box', { on: arpeggiator }]">
    <input v-model="arpeggiator" type="checkbox" :class="'arpeggio-switch', { on: arpeggiator }"/>
    <span :class="['arpeggio-switch-button', { on: arpeggiator }]"></span>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const arpeggiator = ref(false);

function toggleArpeggiator() { 
  const value = arpeggiator.value === true ? 'on' : 'off';
  arpeggiator.value = !arpeggiator.value;
  console.log(`Arpeggiator ${value}`);
} 
</script>

<style scoped>
  * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Orbitron";
}
.arpeggio-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
}
.arpeggiator-title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  gap: 0.5em;
}
.arpeggiator-title p {
  font-weight: 800;
  color: rgb(234, 234, 234);
  font-family: "Orbitron";
  font-size: 1.2em;
}
.arpeggio-switch-box {
  position: relative;
  cursor: pointer;
  width: 46px;
  height: 25px;
  background-color: rgb(200, 41, 41);
  border: 1px solid black;
  border-radius: 2px;
}
.arpeggio-switch-box.on {
  background-color: rgb(124, 207, 0);
}
.arpeggio-switch {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}
.arpeggio-switch-button {
  position: absolute;
  width: 20px;
  height: 20px;
  left: 2px;
  top: 2px;
  background-color: rgb(41, 41, 41);
  border: 1px solid black;
  border-radius: 2px;
  transform: translateX(0%);
  z-index: 2;
  transition: transform 0.4s ease-out;
}
.arpeggio-switch-button.on {
  transform: translate(100%);
}
.arpeggio-display {
  height: 50px;
  width: 140px;
  font-size: 2em;
  border-radius: 4px;
  text-align: center;
  color: black;
  background-color: rgb(216, 191, 82);
  font-family: "Orbitron";
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1em;
  border: 1px solid black;
}
.arpeggio-speed {
  appearance: none;
  -webkit-appearance: none;
}
button {
  width: 80px;
  height: 30px;
  font-size: 1.2em;
} 
.buttons {
  display: flex;
  justify-content: space-between;
  width: fit-content;
  gap: 0.5em;
}
</style>