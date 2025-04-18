<template>
  <div class="component">

    <div class="keyboard">

      <div class="controls">
        
        <div class="starting-octave control">

          <p class="control-label">Octave Range</p>

          <div class="starting-octave-selector">
            <button class="starting-octave-button" @click="changeStartingOctave('-')">-</button>
            <p v-if="octaveAmount === '1'">{{ startingOctave }}</p>
            <p v-else-if="octaveAmount === '2'">{{ startingOctave }}-{{ startingOctave + 1 }}</p>
            <p v-else-if="octaveAmount === '3'">{{ startingOctave }}-{{ startingOctave + 2 }}</p>
            <button class="starting-octave-button" @click="changeStartingOctave('+')">+</button>
          </div>

        </div>

        <div class="octave-select control">

          <p class="control-label">Octaves: {{ octaveAmount }}</p>

          <div class="octave-selector">
            <input v-model="octaveAmount" :class="{ active: octaveAmount === '1' }" type="radio" value="1" />
            <input v-model="octaveAmount" :class="{ active: octaveAmount === '2' }" type="radio" value="2" />
            <input v-model="octaveAmount" :class="{ active: octaveAmount === '3' }" type="radio" value="3" />
          </div>
        </div>

        <div class="notes-labels control">

          <p class="control-label">Note Labels</p>

            <div class="notes-labels-checkboxes">

              <div class="notes-labels-checkbox">
                <input v-model="notesDisplayed" :class="['all-notes-checkbox', { active: notesDisplayed === 'all' }]" type="radio" value="all" />
                <p class="notes-checkbox">All</p>
              </div>

              <div class="notes-labels-checkbox"> 
                <input v-model="notesDisplayed" :class="['chord-notes-checkbox', { active: notesDisplayed === 'chord' }]" type="radio" value="chord" />
                <p class="notes-checkbox">Chord</p>
              </div>

              <div class="notes-labels-checkbox">      
                <input v-model="notesDisplayed" :class="['no-notes-checkbox', { active: notesDisplayed === 'none' }]" type="radio" value="none" />
                <p class="notes-checkbox">None</p>
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

      <div class="keys" :style="keyStyles">

        <div v-for="(key, index) in pianoKeys"
          :key="`${key.note}${key.octave}`"
          :style="{'fontSize': keyFontSize}"
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
  const octavesArray = Array.from({ length: octaveAmount.value }, (_, i) => startingOctave.value + i);

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

const keyStyles = computed(() => { 

const whiteKeyCount = computed(() =>
  pianoKeys.value.filter((k) => !k.sharp).length
);

const keysHeight = computed(() => { 
  if (octaveAmount.value === '1') {
    return '350px'
} else if (octaveAmount.value === '2') { 
      return '260px'
    } else if (octaveAmount.value === '3') { 
        return '180px'
  }
})

  return {   
    '--white-key-count': whiteKeyCount.value,
    'height': keysHeight.value
}
})

const keyFontSize = computed(() => { 
    if (octaveAmount.value === '1') {
    return '1.6rem'
} else if (octaveAmount.value === '2') { 
      return '1rem'
    } else if (octaveAmount.value === '3') { 
        return '0.8rem'
  }
})


//--------Octaves--------//
const octaveAmount = ref('2');

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
  {
    label: "Major",
    value: "maj",
    intervals: [0, 4, 7],
    formula: ["1", "3", "5"]  
  },
  {
    label: "Minor",
    value: "m",
    intervals: [0, 3, 7],
    formula: ["1", "♭3", "5"]  
  },
  {
    label: "Augmented",
    value: "+",
    intervals: [0, 4, 8],
    formula: ["1", "3", "♯5"]  
  },
  {
    label: "Diminished",
    value: "°",
    intervals: [0, 3, 6],
    formula: ["1", "♭3", "♭5"]  
  },
  {
    label: "Dominant 7th",
    value: "7",
    intervals: [0, 4, 7, 10],
    formula: ["1", "3", "5", "♭7"] 
  },
  {
    label: "Major 7th",
    value: "maj7",
    intervals: [0, 4, 7, 11],
    formula: ["1", "3", "5", "7"]  
  },
  {
    label: "Minor 7th",
    value: "m7",
    intervals: [0, 3, 7, 10],
    formula: ["1", "♭3", "5", "♭7"]  
  },
  {
    label: "Suspended 2nd",
    value: "sus2",
    intervals: [0, 2, 7],
    formula: ["1", "2", "5"]  
  },
  {
    label: "Suspended 4th",
    value: "sus4",
    intervals: [0, 5, 7],
    formula: ["1", "4", "5"]  
  },
  {
    label: "Major 6th",
    value: "maj6",
    intervals: [0, 4, 7, 9],
    formula: ["1", "3", "5", "6"] 
  },
  {
    label: "Major 7♭5",
    value: "maj7♭5",
    intervals: [0, 4, 6, 11],
    formula: ["1", "3", "♭5", "7"]
  }
]);

const chordNotes = ref([]);

const notesDisplayed = ref("all");

function updateChord() {
  if (!rootNote.value || !chordType.value) return;

  const chord = chordTypes.value.find(c => c.value === chordType.value);
  if (!chord) return;

  const { intervals, formula } = chord;
  const rootIndex = notes.value.indexOf(rootNote.value);

  const updatedChordNotes = intervals.map(i => notes.value[(rootIndex + i) % 12]);

  chordNotes.value = Array.from(new Set(updatedChordNotes));
  // Optional: store formula too if you want to display them
  console.log(`Chord: ${rootNote.value}${chordType.value}, Notes: ${chordNotes.value.join(", ")}, Intervals: ${formula.join(", ")}`);
}
function assignChordOctaves(root, chordNotesArray) {
  let currentOctave = startingOctave.value;
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
  width: fit-content;
  position: relative;
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
  margin-bottom: 0.5em;
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
.control-label {
  font-size: 1.2rem;
  text-align: center;
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
  gap: 0.4em;
  width: 2.5em;
  position: relative;
  top: 0.4em;
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
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  background-color: rgb(42, 42, 42);
  width: 1000px;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  padding: 2em 4em 1em;
}
.keys {
  width: 100%;
  display: flex;
  overflow: hidden;
  margin-bottom: 1em;
  z-index: 0;
  border-top: 10px solid black;
  border-left: 2px solid black; 
  border-right: 2px solid black;
  position: relative;
}
.key {
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 0.2em;
  font-weight: 600;
  font-family: "Ubuntu";
  border-bottom-left-radius: 5px; 
  border-bottom-right-radius: 5px;
  font-size: 0.9rem;
}
.key:hover {
  cursor: pointer;
}
.white {
  background-color: rgb(255, 255, 255);
  color: black;
  flex: 1;
  height: 100%;
  position: relative;
  z-index: 1;
}
.white:hover {
  background-color: rgb(240, 240, 240);
}
.black {
  width: calc(100% / var(--white-key-count) * 0.6);
  height: 60%;
  position: relative;
  background-color: rgb(0, 0, 0);
  border: 2px solid black;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  color: #fff;
  z-index: 2;
  overflow: hidden;
  border-top: 1px solid black;
  margin-left: calc(100% / var(--white-key-count) * -0.6);
  left: calc(100% / var(--white-key-count) * 0.3);
  padding-bottom: 0.4em;
  box-shadow: -2px 0 1px rgba(0,0,0,0.5);
}
.black:hover {
  background-color: rgb(20, 20, 20);
}
.white.interval {
  background-color: rgb(126, 145, 215);
}
.black.interval {
  background-color: rgb(126, 145, 215);
  color: black;
}
.root-note {
  background-color: rgb(57, 82, 175) !important;
  color: white
}
/*--------DISPLAY---------*/
.chord-played-label {
  font-size: 1.5rem;
  margin-top: 2em;
}
.chord-played {
  display: flex;
  align-items: center;
  width: fit-content;
  justify-content: space-between;
  font-size: 1.2em;
  font-weight: 800;
  font-family: "Ubuntu";
  gap: 1em;
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
  font-weight: 500;
  font-size: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
}
.play-button:hover {
  cursor: pointer;
  transform: scale(1.1);
}
</style>
