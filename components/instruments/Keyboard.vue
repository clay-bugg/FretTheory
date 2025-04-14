<template>
  <div class="component">

    <div class="keyboard">

      <div class="controls">
        
        <div class="starting-octave control">

          <p class="control-label">Starting Octave</p>

          <div class="starting-octave-selector">
            <button class="starting-octave-button" @click="changeStartingOctave('-')">-</button>
            {{ startingOctave }}
            <button class="starting-octave-button" @click="changeStartingOctave('+')">+</button>
          </div>

        </div>

        <div class="octave-select control">

          <p class="octave-selector-label control-label">Octaves<br/>Displayed: {{ octaveAmount }}</p>

          <div class="octave-selector">
            <input v-model="octaveAmount" :class="{ active: octaveAmount === '1' }" type="radio" value="1" />
            <input v-model="octaveAmount" :class="{ active: octaveAmount === '2' }" type="radio" value="2" />
            <input v-model="octaveAmount" :class="{ active: octaveAmount === '3' }" type="radio" value="3" />
          </div>
        </div>

        <div class="notes-labels control">
          <p class="note-labels-title control-label">Note Labels</p>
            <div class="notes-labels-checkboxes">

              <div class="notes-labels-checkbox">
                <p class="notes-checkbox">All</p>
                <input v-model="notesDisplayed" :class="['all-notes-checkbox', { active: notesDisplayed === 'all' }]" type="radio" value="all" />
              </div>

              <div class="notes-labels-checkbox">
                <p class="notes-checkbox">Chord</p>
                <input v-model="notesDisplayed" :class="['chord-notes-checkbox', { active: notesDisplayed === 'chord' }]" type="radio" value="chord" />
              </div>

              <div class="notes-labels-checkbox">
                <p class="notes-checkbox">None</p>
                <input v-model="notesDisplayed" :class="['no-notes-checkbox', { active: notesDisplayed === 'none' }]" type="radio" value="none" />
              </div>

            </div>

        </div>

        <div class="chord-selector-box control">

          <p class="control-label">Chord</p>

          <div class="chord-selector-inputs">
            <select class="root-note-selector" v-model="rootNote">
              <option v-for="note in notes" :key="note" :value="note">
                {{ note }}
              </option>
            </select>

            <select class="chord-type-selector" v-model="chordType">
              <option
                v-for="type in chordTypes"
                :key="type.value"
                :value="type.value"
              >
                {{ type.label }}
              </option>
            </select>
          </div>

        </div>

      </div>

      <div class="keys">

        <div v-for="(key, index) in pianoKeys"
          :key="`${key.note}${key.octave}`"
          :id="`interval-${chordNotes.indexOf(key.note) + 1}`"
          :class="[
            'key',
            {
              black: key.sharp,
              white: !key.sharp,
              'highlighted-note': chordNotes.includes(key.note),
              'interval': chordNotes.includes(key.note),
              'root-note': key.note === rootNote,
            },
          ]"
          @mousedown="playKey(key.note, key.octave)"
          @mouseup="stopKey(key.note, key.octave)"
          @mouseleave="stopKey(key.note, key.octave)"
        >
          <span v-if="notesDisplayed === 'all'">{{ key.note }}</span>
          <span
            v-if="notesDisplayed === 'chord' && chordNotes.includes(key.note)"
          >
            {{ key.note }}
          </span>
        </div>
        
      </div>

    </div>

    <p class="chord-played-label">Chord Played</p>

    <div class="chord-played">

      <p class="chord-notes-label">{{ rootNote }}{{ chordType }} | </p>

      <p v-for="(note, index) in chordNotes"
        :key="index"
        class="chord-note"
        :id="`chord-note-${index + 1}`">
        {{ note }}
      </p>

      <button @mousedown="playChord('play')" @mouseup="playChord('stop')" class="play-button">
        <Icon name="line-md:play-filled" class="play-icon" />
      </button>

    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed, watch } from 'vue';

import * as Tone from "tone";

//--------Generate Keys--------//
const notes = ref(["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",]);

const pianoKeys = computed(() => {
  const start = 3;
  const octavesArray = Array.from({ length: octaveAmount.value }, (_, i) => start + i);

  const keys = [];
  for (const octave of octavesArray) {
    notes.value.forEach((note) => {
      keys.push({
        note,
        octave,
        sharp: note.includes('#'),
      });
    });
  }

  return keys;
});

//--------Octaves--------//
const octaveAmount = ref(2);

const startingOctave = ref(3)

function changeStartingOctave(op) { 
  if (op === '+') {
    if (startingOctave.value === 6) {
      return;
    } else {
      startingOctave.value++
    }

  } else if (op === '-') {
    if (startingOctave.value === 1) {
      return;
    } else {
      startingOctave.value--
    }
  }
}

//--------Update Chord--------//
const rootNote = ref("");

watch(rootNote, (newVal) => {
  console.log(`Root note changed to ${newVal}`);
  updateChord();
});

const chordType = ref("");

watch(chordType, (newVal) => {
  console.log(`Chord type changed to ${newVal}`);
  updateChord();
});

const chordTypes = ref([
  { label: "Major", value: "maj" },
  { label: "Major 6th", value: "maj6" },
  { label: "Major 6/9", value: "6/9" },
  { label: "Major 7th", value: "maj7" },
  { label: "Major 9th", value: "maj9" },
  { label: "Major 11th", value: "maj11" },
  { label: "Major 13th", value: "maj13" },
  { label: "Minor", value: "m" },
  { label: "Minor 7th", value: "m7" },
  { label: "Dominant 7th", value: "7" },
  { label: "Diminished", value: "°" },
  { label: "Augmented", value: "+" },
]);

const chordIntervals = {
  "maj": [0, 4, 7],
  "maj6": [0, 4, 7, 9],
  "6/9": [0, 4, 7, 9, 14],
  "maj7": [0, 4, 7, 11],
  "maj9": [0, 4, 7, 11, 14],
  "maj11":[0, 4, 7, 11, 14, 17],
  "maj13": [0, 4, 7, 11, 14, 17, 21],
  "m": [0, 3, 7],
  "+": [0, 4, 8],
  "°": [0, 3, 6],
  "7": [0, 4, 7, 10],
  "m7": [0, 3, 7, 10]
};

const chordNotes = ref([]);

const notesDisplayed = ref("all");

function updateChord() {

  if (!rootNote.value || !chordType.value) return;

  const intervals = chordIntervals[chordType.value] || [];

  const rootIndex = notes.value.indexOf(rootNote.value);

  let updatedChordNotes = intervals.map((interval) => {
    return notes.value[(rootIndex + interval) % 12];
  });

  updatedChordNotes = Array.from(new Set(updatedChordNotes));
  chordNotes.value = updatedChordNotes;

  console.log(`Chord changed to ${rootNote.value}${chordType.value}`);
}
function assignChordOctaves(root, chordNotesArray, baseOctave = 2) {
  let currentOctave = baseOctave;
  let lastNoteIndex = notes.value.indexOf(root);
  const chordWithOctaves = [];

  chordNotesArray.forEach((note) => {
    const noteIndex = notes.value.indexOf(note);
    if (noteIndex <= lastNoteIndex) {
      currentOctave++;
    }
    chordWithOctaves.push(`${note}${currentOctave}`);
    lastNoteIndex = noteIndex;
  });

  return chordWithOctaves;
}

//--------Synth--------//
let synth;

let polySynth;

onMounted(() => { 

  if (typeof window !== 'undefined') { 

  synth = new Tone.Synth().toDestination();

  polySynth = new Tone.PolySynth(Tone.Synth).toDestination();
  }
});

const activeNotes = new Set();

function playKey(note, octave) {

  const playedNote = `${note}${octave}`;

  synth.triggerAttack(playedNote);

  activeNotes.add(playedNote);

  console.log(`${playedNote} note played.`);
}

function stopKey(note, octave) {

  if (!synth) return;

  const playedNote = `${note}${octave}`;

  activeNotes.delete(playedNote);

  synth.triggerRelease();

}

const activeChord = new Set();

function playChord(action) {

  const notesWithOctaves = assignChordOctaves(rootNote.value, chordNotes.value);

  if (!rootNote.value || !chordType.value) return;

  if (action === 'play') {

      polySynth.triggerAttack(notesWithOctaves);

      activeChord.add(notesWithOctaves);

      console.log(`${notesWithOctaves.join(", ")} chord played.`);

    } else if (action === 'stop') {

      polySynth.triggerRelease(notesWithOctaves);

      activeChord.delete(notesWithOctaves)

    }
  }

</script>


<style scoped>

/*--------GLOBAL---------*/
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.component {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4em;
  width: fit-content;
  position: relative;
  background-color: rgb(0, 0, 0, 0);
  justify-content: flex-start;
  font-family: "Orbitron";
}
input {
  font-family: "Ubuntu";
}

/*--------CONTROLS---------*/
.controls {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  height: 6em;
  position: relative;
  z-index: 3;
  color: rgb(215, 215, 215);
  padding: 0 1em 1em;
  gap: 3em;
}

.control {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  gap: 0.5em;
  padding: 0.5em 0;
}
/*--------STARTINGOCTAVE--------*/
.starting-octave-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: fit-content;
  gap: 0.4em;
  font-size: 1.2rem;
  font-weight: 700;
}
.starting-octave-button {
  width: 25px;
  height: 25px;
}
/*--------OCTAVESELECT--------*/
.octave-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5em;

}
.octave-selector-label {
  text-align: center;
}
.octave-selector input {
  width: 25px;
  height: 25px;
  appearance: none;;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: 2px solid black;
  background-color: rgb(152, 12, 12);
  border-radius: 5px;
}
.octave-selector input.active {
  background-color: rgb(133, 206, 23);
}
.octave-selector input:hover {
  cursor: pointer;
}
/*--------=NOTELABELS--------*/
.notes-labels-checkboxes {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5em;
}
.notes-labels-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.2em;
  width: 2.5em;
}
.notes-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.3em;
}
.notes-labels-checkboxes input {
  width: 25px;
  height: 25px;
  appearance: none;;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: 2px solid black;
  background-color: rgb(152, 12, 12);
  border-radius: 5px;
}
.notes-labels-checkboxes input.active {
  background-color: rgb(133, 206, 23);
}
.notes-labels-checkboxes input:hover {
  cursor: pointer;
}
.notes-checkbox {
  font-size: 0.8em
}
/*---------CHORDSELECT--------*/
.chord-selector-box select {
  font-size: 1em;
  font-family: inherit;
  border: 2px solid black;
  border-radius: 0.3em;
  text-align: center;
  font-weight: 500;
  padding: 0.1em;
}
.chord-selector-inputs {
  display: flex;
  align-items: center;
  justify-content: center;

}

/*--------KEYBOARD---------*/
.keyboard {
  border: 1px solid black;
  border-radius: 15px;
  background-color: rgb(42, 42, 42);
  width: fit-content;
  height: 28em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  padding: 2em 4em 1em;
}

.keys {
  width: fit-content;
  height: 250px;
  display: flex;
  overflow: hidden;
  margin-bottom: 1em;
  z-index: 0;
  border-top: 5px solid black; 
}

.key {
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  font-weight: 900;
  font-size: 1.3em;
  padding-bottom: 0.2em;
  font-weight: 600;
  font-family: "Ubuntu";
  border-bottom-left-radius: 5px; 
  border-bottom-right-radius: 5px;
}
.key:hover {
  cursor: pointer;
}
.white {
  width: 70px;
  background-color: rgb(255, 255, 255);
  color: black;
}
.white:hover {
  background-color: rgb(240, 240, 240);
}
.black {
  width: 45px;
  height: 140px;
  position: relative;
  margin: 0 -22.5px;
  background-color: rgb(0, 0, 0);
  border: 2px solid black;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  color: #fff;
  z-index: 1;
  overflow: hidden;
  border-top: 1px solid black;
  font-size: 1.1em;
}
.black:hover {
  background-color: rgb(20, 20, 20);
}
.white.interval {
  background-color: rgb(113, 162, 211);
}
.white.interval:hover {
  background-color: rgb(97, 147, 196);
}
.black.interval {
  background-color: rgb(83, 132, 181);
  color: black;
}
.black.interval:hover {
  background-color: rgb(68, 117, 166);
}
.root-note {
  background-color: rgb(173, 59, 59) !important;
}
.root-note:hover {
  background-color: rgb(158, 44, 44) !important;
}
/*--------DISPLAY---------*/
.chord-played-label {
  font-size: 1.5rem;
  margin-top: 2em;
}
.chord-played {
  display: flex;
  align-items: center;
  width: 400px;
  justify-content: space-between;
  font-size: 1.2em;
  font-weight: 600;
  padding: 0.5em 0.6em;
  border: 5px solid black;
  border-radius: 15px;
  font-family: "Ubuntu";
}
.chord-notes-label {
  display: flex;
  align-items: center;
  width: fit-content;
  
  
}
.play-button {
  font-family: inherit;
  width: 30px;
  height: 30px;
  border: 2px solid black;
  border-radius: 20px;
  font-weight: 300;
  font-size: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
}
.play-button:hover {
  cursor: pointer;
}

</style>
