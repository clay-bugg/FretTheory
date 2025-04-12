<template>
  <div class="component">

    <div class="keyboard">

      <div class="controls">

        <div class="arpeggio-box control">

          <div class="arpeggio-label">
            <p>Arpeggio:</p>
            <input
              type="checkbox"
              v-model="arpeggiated"
              :style="{
                backgroundColor: arpeggiated ? 'rgb(133, 206, 23)' : 'red',
              }"
            />
          </div>

          <div class="arpeggio-delay">
            <input
              type="number"
              v-model="arpeggioDelay"
              class="arpeggio-delay"
            />
            <p class="ms">ms</p>
          </div>

        </div>

        <div class="notes-labels control">
          <div class="notes-selector">
            <input
              type="radio"
              name="notes-displayed"
              v-model="notesDisplayed"
              value="all"
              class="all-notes-checkbox"
              :class="{ active: notesDisplayed === 'all' }"
            />
            <label for="all-notes-checkbox" class="notes-checkbox">All</label>
          </div>

          <div class="notes-selector">
            <input
              type="radio"
              name="notes-displayed"
              v-model="notesDisplayed"
              value="chord"
              class="chord-notes-checkbox"
              :class="{ active: notesDisplayed === 'chord' }"
            />
            <label for="chord-notes-checkbox" class="notes-checkbox"
              >Chord</label
            >
          </div>

          <div class="notes-selector">
            <input
              type="radio"
              name="notes-displayed"
              v-model="notesDisplayed"
              value="none"
              class="no-notes-checkbox"
              :class="{ active: notesDisplayed === 'none' }"
            />
            <label
              for="no-notes-checkbox"
              class="notes-checkbox"
              id="no-notes-label"
              >None</label
            >
          </div>

        </div>

        <div class="chord-selector-box control">

          <label for="root-note-selector">Chord: </label>

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

        <Transition name="slide">
          <div class="settings-panel" v-if="settingsOpened">
            <ul>
              <li></li>
            </ul>
          </div>
        </Transition>
      </div>

      <div class="keys">

        <div v-for="(key, index) in keysDisplayed"
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
//------IMPORtssatch } from "vue";

import * as Tone from "tone";



//--------Generate Keys--------//
const notes = ref(["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",]);

const pianoKeys = ref(generateKeys());

const numberOfKeys = ref(24);

const keysDisplayed = computed(() =>
  pianoKeys.value.slice(0, numberOfKeys.value)
);

function generateKeys() {

  const keys = [];

  const octavesArray = [3, 4, 5];

  for (const octave of octavesArray) {
    notes.value.forEach((note) => {
      keys.push({
        note,
        octave,
        sharp: note.includes("#"),
      });
    });
  }
  return keys;
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
  maj: [0, 4, 7],
  maj6: [0, 4, 7, 9],
  "6/9": [0, 4, 7, 9, 14],
  maj7: [0, 4, 7, 11],
  maj9: [0, 4, 7, 11, 14],
  maj11: [0, 4, 7, 11, 14, 17],
  maj13: [0, 4, 7, 11, 14, 17, 21],
  m: [0, 3, 7],
  "+": [0, 4, 8],
  "°": [0, 3, 6],
  7: [0, 4, 7, 10],
  m7: [0, 3, 7, 10],
};

const chordNotes = ref([]);

const notesDisplayed = ref("all");

const arpeggiated = ref(false);

const arpeggioDelay = ref(200);

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

let polySynth

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
  justify-content: space-evenly;
  width: 100%;
  height: 6em;
  position: relative;
  z-index: 3;
  color: rgb(215, 215, 215);
  padding: 0 1em 1em;
}
.control {
  width: 270px;
}
.notes-labels {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1em;
  font-size: 20px;
}
.notes-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.3em;
}
.notes-selector input {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  height: 40px;
  width: 40px;
  border: 3px solid black;
  border-radius: 50px;
  background-color: red;
  cursor: pointer;
  position: relative;
}
.notes-selector input::after {
  content: "";
  position: absolute;
  top: 1.5px;
  bottom: 0;
  left: 1.4px;
  right: 0;
  width: 32px;
  height: 32px;
  background-image: url("public/images/backgrounds/nav-button-texture.png");
  background-position: center;

  border-radius: 50px;
}
.notes-selector input.active {
  background-color: rgb(133, 206, 23);
}
.notes-checkbox {
  font-size: 0.6em;
}
.arpeggio-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4em;
  margin-bottom: 0.5em;
}
.arpeggio-label input {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  width: 40px;
  height: 25px;
  border: 3px solid rgb(0, 0, 0);
  position: relative;
  border-radius: 5px;
  background-color: red;
}
.arpeggio-label input::after {
  content: "";
  position: absolute;
  top: 1px;
  bottom: 0;
  left: 2px;
  right: 0;
  width: 13px;
  height: 13px;
  border: 2px solid black;
  background-color: rgb(54, 54, 54);
  border-radius: 3px;
  transform: translateX(0%);
  transition: linear 80ms;
}
.arpeggio-label input:checked::after {
  transform: translateX(80%);
  transition: linear 80ms;
}
.arpeggio-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2em;
}
.arpeggio-delay input {
  width: 6em;
}
.ms {
  display: inline;
  margin-left: 0.1em;
  font-size: 0.8em;
}
.chord-selector-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4em;
  z-index: 1;
}
.chord-selector-box select {
  font-size: 1em;
  font-family: inherit;
  border: 2px solid black;
  border-radius: 0.3em;
  padding: 0 0.2em;
}

/*--------KEYBOARD---------*/
.keyboard {
  border: 1px solid black;
  padding: 1em;
  border-radius: 15px;
  background-color: rgb(42, 42, 42);
}
.keys {
  width: fit-content;
  height: 250px;
  border: 5px solid black;
  display: flex;
  border-top-left-radius: 0.3em;
  border-top-right-radius: 0.3em;
  overflow: hidden;
  margin-bottom: 1em;
  z-index: 0;
}
.key {
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 0.1em;
  font-weight: 900;
  font-size: 1.3em;
  padding-bottom: 0.2em;
  font-weight: 600;
  font-family: "Ubuntu";
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
.root-note {
  background-color: rgb(173, 59, 59) !important;
}
.root-note:hover {
  background-color: rgb(158, 44, 44) !important;
}
</style>
