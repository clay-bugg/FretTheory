<template>
  <div class="component">
    <div class="guitar-neck">

      <div class="nut"></div>

      <div class="strings">
        <div v-for="(string, index) in guitarStrings" :key="index" class="string" :id="string.name">
          <div v-for="(fret, index) in frets" :key="index" class="fret" :id="`fret-${index + 1}`" @click="console.log(`fret-${index + 1} clicked`)"></div>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

//----GUITAR----//
const guitarStrings = ref([
  { name: 'e' },
  { name: 'B' },
  { name: 'G' },
  { name: 'D' },
  { name: 'A' },
  { name: 'E' }
]);

const frets = ref(Array.from({ length: 12 }, (_, i) => i + 1));
</script>

<style scoped>
/*----GLOBAL----*/
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.component {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4em;
  width: fit-content;
  position: relative;
  justify-content: flex-start;
  font-family: "Orbitron";
}
/*----GUITAR----*/
.guitar-neck {
  width: 1200px;
  height: 300px;
  border: 1px solid black;
  display: grid;
  grid-template-columns: 2% 98%;
  grid-template-rows: 1fr;
  grid-template-areas: "nut strings";
}
.nut {
  grid-area: nut;
  background-color: burlywood;
}
.strings {
  grid-area: strings;
  background-color: rgb(118, 76, 22);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}
.string {
  width: 100%;
  height: 10px;
  background-color: grey;
  display: grid;
  grid-template-columns:
    11.224%
    10.590%
    9.994%
    9.434%
    8.908%
    8.412%
    7.944%
    7.504%
    7.092%
    6.702%
    6.334%
    5.986%;
  grid-template-rows: 1fr
}
.fret {
  border-left: 3px solid rgb(75, 75, 75);
}
.fret:hover {
  cursor: pointer;
  filter: brightness(95%);
}
</style>