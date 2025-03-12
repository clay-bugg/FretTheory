<template>
  <div class="keyboard">

    <div class="volume-container">
      <label for="volume-slider">Vol</label>
      <input type="range" id="volume-slider" />
    </div>

    <div class="keyboard-inner">

      <div class="controls">

        <div class="control note-labels-selector">
          <div v-for="(noteButton, index) in noteButtons" :key="noteButton" class="note-button-container">
            <NoteButton />
          </div>
        </div>

        <div class="control arpeggiator">
          <div class="arpeggiator-switch-container">
            <label for="arpeggiator">Arppeggiator</label>
            <input v-model="arpeggiated" type="checkbox" />
          </div>
          <input type="number" />
        </div>

        <div class="control volume-tone">

        </div>

      </div>

      <div class="keys"></div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const noteButtons = ref([
  'All', 'Chord', 'None'
])

const arpeggiated = ref(false);

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

.volume-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: row;
}
.keyboard-inner {
  background-color: rgb(52, 52, 52);
  width: 100%;
  height: 23em;
  border-radius: 35px;
  border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;
  border: 1px solid black;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 30% 70%;
}

.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2em;
  border-bottom: 10px solid black;
}
.control {
  width: 160px;
}

.note-labels-selector {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  justify-content: space-evenly;
  gap: 0.2em;
}

.note-button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 0.2em;
}

.arpeggiator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: fit-content;
  gap: 0.5em;
}


</style>
