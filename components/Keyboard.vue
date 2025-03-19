<template>
  <div class="keyboard">
    <div class="volume-container">
      <label for="volume-slider">Vol</label>
      <input class="slider" type="range" min="0" max="100" value="50" />
    </div>

    <div class="keyboard-inner">
      <div class="controls">
        <div class="control note-labels-selector">
          <div
            v-for="(noteButton, index) in noteButtons"
            :key="index"
            class="note-button-container"
          >
            <NoteButton />
          </div>
        </div>

        <div class="control arpeggiator">
          <Arpeggiator />
        </div>

        <div class="control volume-tone">
          <div class="tone">
            <label for="piano-tone">Piano</label>
            <NoteButton id="piano-tone" />
          </div>
          <div class="tone">
            <label for="synth-tone">Synth</label>
            <NoteButton id="synth-tone" />
          </div>
        </div>
      

  <div class="keys" v-for="note in notes" :key="note">
  </div>
        
  </div>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const arpeggiated = ref(false);

const noteButtons = ref(['All', 'Chord', 'None']);
  
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
  align-items: flex-start;
  width: 100%;
  padding-right: 2em;
  position: relative; bottom: 30px;
}
.keyboard-inner {
  background-color: rgb(52, 52, 52);
  width: 100%;
  height: 23em;
  border-radius: 35px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border: 1px solid black;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 35% 65%;
}
.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2em;
  border-bottom: 10px solid black;
}
.control {
  width: fit-content;
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
.tone {
  display: flex;
  justify-content: center;
  align-items: center;
  height: fit-content;
}
.slider {
  appearance: none;
    -webkit-appearance: none;
    width: 20%;
    height: 10px;
    background: #ddd;
    border-radius: 5px;
    outline: none;
    transition: background 0.3s;
    position: relative;
}
.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 30px;
    height: 50px;
    border-radius: 5px;
    cursor: pointer;
    background-image: url('public/Slider Notch.png');
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    background-size: cover;
    background-position: center;
    position: relative;
    top: 2px;
  }
.slider:hover {
    background: #bbb;
}
.slider:focus {
    outline: none;
}



</style>
