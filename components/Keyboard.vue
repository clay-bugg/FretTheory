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
            :value="type.value">
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
    </div>

    <div class="keyboard">
      <div
        v-for="(key, index) in keysDisplayed"
        :key="`${key.note}${key.octave}`"
        :class="[
          'key',
          { 'black': key.sharp, 'white': !key.sharp, 'highlighted-note': chordNotes.includes(key.note), 'root-note': key.note === rootNote }
        ]"
        @mousedown="onMouseDown(key)"
        @mouseenter="onMouseEnter(key)"
        @mouseup="onMouseUp"
      >
        <span v-if="notesDisplayed === 'all'">{{ key.note }}</span>
        <span v-if="notesDisplayed === 'chord' && chordNotes.includes(key.note)">
          {{ key.note }}
        </span>
        <span
          v-if="chordNotes.includes(key.note)"
          class="interval"
          :id="`interval-${chordNotes.indexOf(key.note) + 1}`"
        >
          {{ chordNotes.indexOf(key.note) + 1 }}
        </span>
      </div>
    </div>

    <div class="chord-played" v-if="rootNote && chordType">
      <label for="chord-notes">{{ rootNote }}{{ chordType }}</label>
      <p v-for="(note, index) in chordNotes" :key="index" class="chord-note ":id="`chord-note-${index + 1}`">
        {{ note }}
      </p>
      <button @click="playChord(chordNotes)" id="play-button">
        Play
        <Icon name="line-md:play-filled" id="play-icon" />
      </button>
    </div>

    <div class="settings-panel" v-if="settingsOpened">
      <header>
        <h3>Settings</h3>
        <Icon name="qlementine-icons:close-16" id="settings-close" @click="toggleSettings" />
      </header>
      <div id="settings-body">
        <ul>
          <li>
            <p>Note Labels:</p>
            <div id="notes-labels">
              <input type="radio" name="notes-displayed" v-model="notesDisplayed" value="all" id="all-notes-checkbox" />
              <label for="all-notes-checkbox" class="notes-checkbox">All</label>
              <input type="radio" name="notes-displayed" v-model="notesDisplayed" value="chord" id="chord-notes-checkbox" />
              <label for="chord-notes-checkbox" class="notes-checkbox">Chord</label>
              <input type="radio" name="notes-displayed" v-model="notesDisplayed" value="none" id="no-notes-checkbox" />
              <label for="no-notes-checkbox" class="notes-checkbox">None</label>
            </div>
          </li>
          <li>
            <p>Arpeggiate Chord: </p>
            <input type="checkbox" v-model="arpeggiated" />
          </li>
          <li>
            <p>Arpeggio Delay: </p>
            <input type="number" v-model="arpeggioDelay" id="arpeggio-delay" />
            <p id="ms">ms</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
//------IMPORts
import { ref, computed, watch } from 'vue'

import { Howl } from 'howler'

// --------FUNCTIONS--------
function generateKeys() {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const keys = []
  const octavesArray = [3, 4, 5]
  for (const octave of octavesArray) {
    notes.forEach((note) => {
      keys.push({
        note,
        octave,
        sharp: note.includes('#')
      })
    })
  }
  return keys
}
function updateChord() {
  if (!rootNote.value || !chordType.value) return

  const intervals = chordIntervals[chordType.value] || []
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const rootIndex = notes.indexOf(rootNote.value)

  let updatedChordNotes = intervals.map((interval) => {
    return notes[(rootIndex + interval) % 12]
  })
  // Remove duplicate notes
  updatedChordNotes = Array.from(new Set(updatedChordNotes))
  chordNotes.value = updatedChordNotes

  console.log(`Chord changed to ${rootNote.value}${chordType.value}`)
}
function assignChordOctaves(root, chordNotesArray, baseOctave = 3) {
  const noteOrder = Notes.value
  let currentOctave = baseOctave
  let lastNoteIndex = noteOrder.indexOf(root)
  const chordWithOctaves = []

  chordNotesArray.forEach((note) => {
    const noteIndex = noteOrder.indexOf(note)
    if (noteIndex <= lastNoteIndex) {
      currentOctave++
    }
    chordWithOctaves.push(`${note}${currentOctave}`)
    lastNoteIndex = noteIndex
  })

  return chordWithOctaves
}
function playKey(note, octave) {
  const encodedNote = encodeURIComponent(note)
  const sound = new Howl({
    src: [`/sounds/keyboard_samples/${encodedNote}${octave}.mp3`]
  })
  console.log(`${note}${octave} note played.`)
  sound.play()

  setTimeout(() => {
    sound.stop()
  }, 7000)
}
function playChord(notes) {
  if (!rootNote.value || !chordType.value) return

  const chordNotesWithOctaves = assignChordOctaves(rootNote.value, notes)
  const playingSounds = chordNotesWithOctaves.map((fullNote) => {
    if (!soundsCache[fullNote]) {
      soundsCache[fullNote] = new Howl({
        src: [`/sounds/keyboard_samples/${encodeURIComponent(fullNote)}.mp3`],
        preload: true
      })
    }
    return { sound: soundsCache[fullNote] }
  })

  if (activeChordNotes.value.length) {
    activeChordNotes.value.forEach(({ sound }) => sound.stop())
  }

  const delay = arpeggiated.value ? arpeggioDelay.value : 20

  playingSounds.forEach(({ sound }, index) => {
    setTimeout(() => {
      sound.seek(0)
      sound.play()
    }, index * delay)
  })

  activeChordNotes.value = playingSounds
}
// --------REACIVITY--------
const pianoKeys = ref(generateKeys())
const numberOfKeys = ref(24)
const Notes = ref(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])
const rootNote = ref('')
const chordTypes = ref([
  { label: 'Major', value: 'maj' },
  { label: 'Major 6th', value: 'maj6' },
  { label: 'Major 6/9', value: '6/9' },
  { label: 'Major 7th', value: 'maj7' },
  { label: 'Major 9th', value: 'maj9' },
  { label: 'Major 11th', value: 'maj11' },
  { label: 'Major 13th', value: 'maj13' },
  { label: 'Minor', value: 'm' },
  { label: 'Minor 7th', value: 'm7' },
  { label: 'Dominant 7th', value: '7' },
  { label: 'Diminished', value: '°' },
  { label: 'Augmented', value: '+' }
])
const chordType = ref('')
const chordNotes = ref([])
const activeChordNotes = ref([])
const chordIntervals = {
  maj: [0, 4, 7],
  maj6: [0, 4, 7, 9],
  '6/9': [0, 4, 7, 9, 14],
  maj7: [0, 4, 7, 11],
  maj9: [0, 4, 7, 11, 14],
  maj11: [0, 4, 7, 11, 14, 17],
  maj13: [0, 4, 7, 11, 14, 17, 21],
  m: [0, 3, 7],
  '+': [0, 4, 8],
  '°': [0, 3, 6],
  '7': [0, 4, 7, 10],
  m7: [0, 3, 7, 10]
}
const soundsCache = reactive({})
const isMouseDown = ref(false)
const settingsOpened = ref(false)
const notesDisplayed = ref('none')
const arpeggiated = ref(false)
const arpeggioDelay = ref(70)

//--------COMPUTED--------
const keysDisplayed = computed(() =>
  pianoKeys.value.slice(0, numberOfKeys.value)
)

// ------EVENT HANDLERS--------
function onMouseDown(key) {
  isMouseDown.value = true
  console.log(isMouseDown.value)
  playKey(key.note, key.octave)
}

function onMouseEnter(key) {
  if (isMouseDown.value) {
    playKey(key.note, key.octave)
  }
}

function onMouseUp() {
  console.log(isMouseDown.value)
  isMouseDown.value = false
}

function toggleSettings() {
  settingsOpened.value = !settingsOpened.value
}

// -------- WATCHERS --------
watch([rootNote, chordType], () => {
  console.log(`Root note changed to ${rootNote.value}`)
  console.log(`Chord type changed to ${chordType.value}`)
  updateChord()
})

watch(notesDisplayed, (newVal) => {
  console.log(`Notes displayed set to ${newVal}`)
})
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
}

/*--------CONTROLS---------*/
.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 56em;
  position: relative;
  padding-left: 0.7em;
}
.keys-selector-box {
  display: flex;
  align-items: center;
  gap: 0.4em;
  font-size: 1.1em;
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
  width: 12em;
  height: 18em;
  border: 1px solid black;
  background-color: #f2f2f2;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(240%, -50%);
  z-index: 2;
  border-radius: 10px;
  color: black;
  
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
#notes-labels {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.settings-panel ul {
  font-size: 1.2em;
}
.settings-panel input[type='number'] {
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
#settings-body {
  text-align: center;
}
#settings-body label {
  margin-right: 0.5em;
}
#settings-body li {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5em;
  display: block;
  border: 1px solid rgba(0, 0, 0, 0.3);
  padding: 0.3em 0.5em;
}
#ms {
  display: inline;
  margin-left: 0.1em;
  font-size: 0.8em;
}
/*--------KEYBOARD---------*/
.keyboard {
  width: fit-content;
  height: 15em;
  border: 0.2em solid black;
  border-top: 0.6em solid black;
  display: flex;
  border-top-left-radius: 0.3em;
  border-top-right-radius: 0.3em;
  overflow: hidden;
  margin-bottom: 1em;
}
.key {
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 0.1em;
}
.key:hover {
  cursor: pointer;
  filter: brightness(95%);
}
.white {
  width: 4em;
  background-color: white;
  color: black;
}
.black {
  width: 2.5em;
  height: 9em;
  position: relative;
  margin: 0 -1.25em;
  background-color: black;
  border: 2px solid black;
  border-bottom-left-radius: 0.4em;
  border-bottom-right-radius: 0.4em;
  color: #fff;
  z-index: 1;
  overflow: hidden;
}
.interval {
  width: 100%;
  height: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 2px solid black;
  color: black;
  font-weight: 500;
  font-size: 1.1em;
}
#interval-1,
#interval-5 {
  background-color: #c71111;
}
#chord-note-1,
#chord-note-5 {
  color: #c71111;
}
#interval-2,
#interval-6 {
  background-color: #445ccf;
}
#chord-note-2,
#chord-note-6 {
  color: #445ccf;
}
#interval-3,
#interval-7
 {
  background-color: #d8d643;
}
#chord-note-3,
#chord-note-7 {
  color: #d8d643;
}
#interval-4 {
  background-color: #41bf41;
}
#chord-note-4 {
  color: #41bf41;
}
#interval-5,
#interval-6,
#interval-7 {
  width: 1.1em;
  height: 1.1em;
  border-radius: 50px;
  border: 2px solid black;
  margin-bottom: 0.1em;

}

.note-name {
  font-size: 0.8em;
  color: white;
  border: 1px solid rgb(181, 101, 101);
  width: 1em;
  height: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1em;
  background-color: black;
}
.black .note-name {
  background-color: white;
  border-radius: 50px;
  color: black;
  position: relative;
  bottom: 0.2em;
}
.white .note-name {
  border-radius: 50px;
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
  background-color: rgba(178, 178, 178, 0.1);
  padding: 0.5em 0.6em;
  border: 0.5px solid rgba(255, 255, 255, 0.529);
  border-radius: 25px;
  backdrop-filter: blur(1.5px);
 
}
#play-button {
  font-family: inherit;
  width: 4rem;
  height: 1.6rem;
  border: 1px solid black;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.5em;
  font-weight: 300;
  box-shadow: -0.7px 0.7px 0.7px rgba(0, 0, 0, 0.5);
  padding: 0 0.8em;
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
label[for="arpeggiate-notes"] {
  font-weight: 300;
}
#play-icon {
  height: 3em;
  width: 3em;
  position: relative;
  top: 0.1em;
}
</style>
