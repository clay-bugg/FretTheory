<template>
<div class="arpeggio-box">
  <p>Arpeggiator</p>
  <p class="arpeggio-display" type="text" placeholder="00.0" value="''">{{ currentArpeggio }}</p>
  <div class="buttons">
    <button @click="changeArpeggioValue('&lt;')"><</button>
    <button @click="changeArpeggioValue('&gt;')">></button>
  </div>
</div>
</template>

<script setup>
import { ref } from 'vue';

const currentArpeggio = ref(0);

function changeArpeggioValue(inc) { 
  if (currentArpeggio === 0 || currentArpeggio === '') return;

  let currentNum = 0;


  if (inc === '>') {
    currentArpeggio.value += 1;
  } else if (inc === '<' && inc) {
    currentArpeggio.value -= 1;
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Orbitron';
}
p {
  color: rgb(234, 234, 234);
  letter-spacing: 0.2em;
  font-family: '1.2em';
  font-size: 1.2em;
}
  .arpeggio-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5em;
  }
  .arpeggio-display {
    height: 50px;
    width: 140px;
    font-size: 2em;
    border-radius: 4px;
    text-align: center;
    color: black;
    background-color: rgb(216, 191, 82);;
    font-family: 'Orbitron';
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