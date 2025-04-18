<template>
  <div class="component">

    <div class="guitar-neck">

      <div class="nut"></div>

      <div class="strings">

        <div v-for="(container, containerIndex) in stringContainers" :key="containerIndex" class="string-container" :id="`Container-${container[index]}`">
          <div v-for="(fret, fretIndex) in frets" :key="fretIndex" class="fret" :id="`string-${containerIndex + 1} fret-${fretIndex + 1}`" @click="fretClicked(containerIndex, fretIndex)"></div>
          <div class="string"></div>
        </div>
      
      </div>

    </div>
    <p>{{ fretPlayed }}</p>

  </div>
      
</template>

<script setup>
import { ref } from "vue";

//----GUITAR----//
const stringContainers = ref(6);

const frets = ref(12);

const fretPlayed = '';

function fretClicked(container, fret) {
  fretPlayed.value = `${container}${fret}`
 }


/*----DISPLAY----*/

</script>

<style scoped>
/*----GLOBAL----*/
* {
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
  height: 250px;
  border: 1px solid black;
  display: grid;
  grid-template-columns: 2.5% 97.5%;
  grid-template-rows: 1fr;
  grid-template-areas: "nut strings";
}
.nut {
  grid-area: nut;
  background-color: burlywood;
  border-right: 1px solid black;
}
.strings {
  grid-area: strings;
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: repeat(6, 1fr);
}
.string-container {
  height: 100%;
  display: grid;
  grid-template-columns:
    11.224% 10.59% 9.994% 9.434% 8.908% 8.412%
    7.944% 7.504% 7.092% 6.702% 6.334% 5.986%;
  background-color: rgb(156, 108, 45);
  position: relative;
}
.string {
  position: absolute;
  height: 5px;
  width: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-top: 1px solid black;
  border-bottom: 1px solid rgb(0, 0, 0);
  background-color: rgb(150, 150, 150);
  pointer-events: none;
}
.fret {
  border-left: 2px solid rgb(0, 0, 0);
  border-right: 2px solid rgb(0, 0, 0);
  background-color: rgb(156, 108, 45);
}
.fret:hover {
  filter: brightness(95%);
}
</style>
