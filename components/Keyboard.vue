<template>
  <div class="component">
    <div class="controls">
      <div class="keys-selector-box">
        <label for="key-selector">Keys: </label>
        <input
          id="key-selector"
          v-model="numberOfKeys"
          type="range"
          step="1"
          min="12"
          max="36"
        />
        <span id="keys-amount-label">{{ numberOfKeys }}</span>
      </div>

      <div class="chord-selector-box">
        <label for="root-note-selector">Chord: </label>
        <select id="root-note-selector" v-model="rootNote">
          <option v-for="note in Notes" :key="note" :value="note">
            {{ note }}
          </option>
        </select>

        <select id="chord-type-selector" v-model="chordType">
          <option
            v-for="type in chordTypes"
            :key="type.value"
            :value="type.value"
          >
            {{ type.label }}
          </option>
        </select>

        <button id="settings-button">
          <Icon
            id="settings-icon"
            name="mi:options-horizontal"
            @click="toggleSettings"
          />
        </button>
      </div>

      <Transition name="slide">
        <div class="settings-panel" v-if="settingsOpened">
          <ul>
            <li>
              <p>Note Labels:</p>
              <div id="notes-labels">
                <input
                  type="radio"
                  name="notes-displayed"
                  v-model="notesDisplayed"
                  value="all"
                  id="all-notes-checkbox"
                />
                <label for="all-notes-checkbox" class="notes-checkbox"
                  >All</label
                >
                <input
                  type="radio"
                  name="notes-displayed"
                  v-model="notesDisplayed"
                  value="chord"
                  id="chord-notes-checkbox"
                />
                <label for="chord-notes-checkbox" class="notes-checkbox"
                  >Chord</label
                >
                <input
                  type="radio"
                  name="notes-displayed"
                  v-model="notesDisplayed"
                  value="none"
                  id="no-notes-checkbox"
                />
                <label for="no-notes-checkbox" class="notes-checkbox"
                  >None</label
                >
              </div>
            </li>
            <li>
              <p>Arpeggiate Chord:</p>
              <input type="checkbox" v-model="arpeggiated" />
            </li>
            <li>
              <p>Arpeggio Delay:</p>
              <input
                type="number"
                v-model="arpeggioDelay"
                id="arpeggio-delay"
              />
              <p id="ms">ms</p>
            </li>
          </ul>
        </div>
      </Transition>
    </div>

    <div class="keyboard">
      <div
        v-for="(key, index) in keysDisplayed"
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
]
  "
        @mousedown="onMouseDown(key)"
        @mouseenter="onMouseEnter(key)"
        @mouseup="onMouseUp"
      >
        <span v-if="notesDisplayed === 'all'">{{ key.note }}</span>
        <span
          v-if="notesDisplayed === 'chord' && chordNotes.includes(key.note)"
        >
          {{ key.note }}
        </span>
      </div>
    </div>

    <div class="chord-played" v-if="rootNote && chordType">
      <label for="chord-notes">{{ rootNote }}{{ chordType }}</label>
      <p
        v-for="(note, index) in chordNotes"
        :key="index"
        class="chord-note"
        :id="`chord-note-${index + 1}`"
      >
        {{ note }}
      </p>
      <button @click="playChord(chordNotes)" id="play-button">
        <Icon name="line-md:play-filled" id="play-icon" />
      </button>
    </div>
  </div>
</template>

<script setup>
//------IMPORts
import { ref, computed, watch } from "vue";

import { Howl } from "howler";

// --------FUNCTIONS--------
function generateKeys() {
  const notes = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const keys = [];
  const octavesArray = [3, 4, 5];
  for (const octave of octavesArray) {
    notes.forEach((note) => {
      keys.push({
        note,
        octave,
        sharp: note.includes("#"),
      });
    });
  }
  return keys;
}
function updateChord() {
  if (!rootNote.value || !chordType.value) return;

  const intervals = chordIntervals[chordType.value] || [];
  const notes = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const rootIndex = notes.indexOf(rootNote.value);

  let updatedChordNotes = intervals.map((interval) => {
    return notes[(rootIndex + interval) % 12];
  });
  // Remove duplicate notes
  updatedChordNotes = Array.from(new Set(updatedChordNotes));
  chordNotes.value = updatedChordNotes;

  console.log(`Chord changed to ${rootNote.value}${chordType.value}`);
}
function assignChordOctaves(root, chordNotesArray, baseOctave = 3) {
  const noteOrder = Notes.value;
  let currentOctave = baseOctave;
  let lastNoteIndex = noteOrder.indexOf(root);
  const chordWithOctaves = [];

  chordNotesArray.forEach((note) => {
    const noteIndex = noteOrder.indexOf(note);
    if (noteIndex <= lastNoteIndex) {
      currentOctave++;
    }
    chordWithOctaves.push(`${note}${currentOctave}`);
    lastNoteIndex = noteIndex;
  });

  return chordWithOctaves;
}
function playKey(note, octave) {
  const encodedNote = encodeURIComponent(note);
  const sound = new Howl({
    src: [`/sounds/keyboard_samples/${encodedNote}${octave}.mp3`],
  });
  console.log(`${note}${octave} note played.`);
  sound.play();

  setTimeout(() => {
    sound.stop();
  }, 7000);
}
function playChord(notes) {
  if (!rootNote.value || !chordType.value) return;

  const chordNotesWithOctaves = assignChordOctaves(rootNote.value, notes);
  const playingSounds = chordNotesWithOctaves.map((fullNote) => {
    if (!soundsCache[fullNote]) {
      soundsCache[fullNote] = new Howl({
        src: [`/sounds/keyboard_samples/${encodeURIComponent(fullNote)}.mp3`],
        preload: true,
      });
    }
    return { sound: soundsCache[fullNote] };
  });

  if (activeChordNotes.value.length) {
    activeChordNotes.value.forEach(({ sound }) => sound.stop());
  }

  const delay = arpeggiated.value ? arpeggioDelay.value : 20;

  playingSounds.forEach(({ sound }, index) => {
    setTimeout(() => {
      sound.seek(0);
      sound.play();
    }, index * delay);
  });

  activeChordNotes.value = playingSounds;
}
// --------REACIVITY--------
const pianoKeys = ref(generateKeys());
const numberOfKeys = ref(24);
const Notes = ref([
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
]);
const rootNote = ref("");
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
const chordType = ref("");
const chordNotes = ref([]);
const activeChordNotes = ref([]);
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
const soundsCache = reactive({});
const isMouseDown = ref(false);
const settingsOpened = ref(false);
const notesDisplayed = ref("all");
const arpeggiated = ref(false);
const arpeggioDelay = ref(200);

//--------COMPUTED--------
const keysDisplayed = computed(() =>
  pianoKeys.value.slice(0, numberOfKeys.value)
);

// ------EVENT HANDLERS--------
function onMouseDown(key) {
  isMouseDown.value = true;
  console.log(isMouseDown.value);
  playKey(key.note, key.octave);
}

function onMouseEnter(key) {
  if (isMouseDown.value) {
    playKey(key.note, key.octave);
  }
}

function onMouseUp() {
  console.log(isMouseDown.value);
  isMouseDown.value = false;
}

function toggleSettings() {
  settingsOpened.value = !settingsOpened.value;
}

// -------- WATCHERS --------
watch([rootNote, chordType], () => {
  console.log(`Root note changed to ${rootNote.value}`);
  console.log(`Chord type changed to ${chordType.value}`);
  updateChord();
});

watch(notesDisplayed, (newVal) => {
  console.log(`Notes displayed set to ${newVal}`);
});
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
}
/*--------CONTROLS---------*/
.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  position: relative;
  padding-left: 0.6em;
  padding-right: 0.3em;
  z-index: 3;
}
.keys-selector-box {
  display: flex;
  align-items: center;
  gap: 0.4em;
  font-size: 1.1em;
  z-index: 1;
}
.keys-selector-box input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
}
.keys-selector-box input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 1.2em;
  width: 1.2em;
  background-color: white;
  border-radius: 50px;
  cursor: pointer;
  position: relative;
  bottom: 0.4em;
  border: 2px solid black;
}
.keys-selector-box input[type="range"]::-webkit-slider-runnable-track {
  height: 0.4em;
  border-radius: 2px;
}
.chord-selector-box {
  display: flex;
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
#settings-button {
  display: inline-block;
  width: 2em;
  height: 2em;
  border-radius: 5px;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e0e0e0;
  z-index: 2;
}
#settings-button:hover {
  cursor: pointer;
  transform: scale(1.06);
  background-color: #fff;
}
#settings-button:active {
  transform: scale(1);
}
#settings-icon {
  width: 100%;
  height: 100%;
}
.settings-panel {
  width: 35%;
  color: white;
  background-color: rgba(79, 79, 79, 0.96);
  backdrop-filter: blur(1px);
  border-radius: 5px;
  border: 5px solid black;
  position: absolute;
  top: 120%;
  right: -2%;
  z-index: 0;
  padding: 1.5em 0;
  font-family: inherit;
  font-size: 1.2em;

}
.settings-panel header {
  height: 1.5em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1em 0.5em;
  background-color: #cecece;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  font-size: 1.2em;
}
.settings-panel ul {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  gap: 0.8em;;
}
.settings-panel li {
  display: flex;
  align-items: center;
  width: fit-content;
  justify-content: space-between;
  gap: 0.4em;
}
.settings-panel input[type="number"] {
  border: 1px solid black;
  border-radius: 4px;
  font-size: 1;
  width: 4.5em;
  padding: 0.1em;
}
.notes-checkbox {
  font-size: 0.9em;
}
#settings-close:hover {
  cursor: pointer;
}
#ms {
  display: inline;
  margin-left: 0.1em;
  font-size: 0.8em;
}
/*--------SETTINGS TRANSITION--------*/
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease-in-out, opacity 0.4s;
}
.slide-enter-from {
  transform: translateY(-20%);
  opacity: 0;
  
}
.slide-enter-to {
  transform: translateY(0);
  opacity: 1;
  
}
.slide-leave-from {
  transform: translateY(0);
  opacity: 1;
  
}
.slide-leave-to {
  transform: translateY(-20%);
  opacity: 0;
  
}
/*--------KEYBOARD---------*/
.keyboard {
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
}
.key:hover {
  cursor: pointer;
}
.white {
  width: 70px;
  background-color: white;
  color: black;
  opacity: 0.6;
  
}
.white:hover {
  opacity: 0.7;
}
.black {
  width: 45px;
  height: 140px;
  position: relative;
  margin: 0 -22.5px;
  background-color: black;
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
  background-color: rgb(65, 65, 65);
}
.interval:hover {
  filter: brightness(110%);
}
.white.interval {
  opacity: 0.7;
  border: 3px solid black;
  background-color: rgba(172, 216, 218, 0.561);
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  color: white;
}
.black.interval {
  color: black;
  border: 4px solid black;
  border-top: 1px solid black;
  background-color: rgb(46, 122, 122);
  color: black;
}
/*--------DISPLAY---------*/
.chord-played {
  display: flex;
  align-items: center;
  width: fit-content;
  justify-content: space-between;
  width: fit-content;
  font-size: 1.2em;
  font-weight: 600;
  color: white;
  gap: 1em;
  background-color: rgba(178, 178, 178, 0.5);
  padding: 0.5em 0.6em;
  border-radius: 25px;
  border: 4px solid black;
}
#play-button {
  font-family: inherit;
  width: 30px;
  height: 30px;
  border: 1px solid black;
  border-radius: 20px;
  font-weight: 300;
  font-size: 2em;
  box-shadow: -0.7px 0.7px 0.7px rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
#play-button:hover {
  cursor: pointer;
  filter: brightness(120%);
}
#play-button:active {
  filter: brightness(100%);
  transform: translate(-0.7px, 0.7px);
  box-shadow: inset -0.7px 0.7px 0.7px rgba(0, 0, 0, 0.5);
}
</style>
