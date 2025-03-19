<template>
<div class="arpeggio-box">
  <p>Arpeggiator</p>
  <p class="arpeggio-display" type="text" placeholder="00.0" value="''">{{ currentArpeggio }}</p>
  <input v-model="currentArpeggio" class="arpeggio-speed" type="number" />
</div>
</template>

<script setup>
import { ref } from 'vue';

const currentArpeggio = ref('');

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
</style>