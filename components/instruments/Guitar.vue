<template>
  <div class="component">
    <div class="guitar-body">
      <div class="controls">
        <div class="notes-labels control">
          <p class="control-label">Note Labels</p>
          <div class="notes-labels-checkboxes">
            <div class="notes-labels-checkbox">
              <input
                v-model="notesDisplayed"
                :class="[
                  'all-notes-checkbox',
                  { active: notesDisplayed === 'all' },
                ]"
                type="radio"
                value="all"
              />
              <p class="notes-checkbox">All</p>
            </div>
            <div class="notes-labels-checkbox">
              <input
                v-model="notesDisplayed"
                :class="[
                  'chord-notes-checkbox',
                  { active: notesDisplayed === 'chord' },
                ]"
                type="radio"
                value="chord"
              />
              <p class="notes-checkbox">Chord</p>
            </div>
            <div class="notes-labels-checkbox">
              <input
                v-model="notesDisplayed"
                :class="[
                  'no-notes-checkbox',
                  { active: notesDisplayed === 'none' },
                ]"
                type="radio"
                value="none"
              />
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

      <div class="guitar-neck">
        <!-- Nut with open string notes -->
        <div class="nut">
          <div
            v-for="(stringNote, index) in openStrings"
            :key="index"
            :class="[
              'nut-note',
              {
                'highlighted-note': chordNotes.includes(stringNote.note),
                'root-note': stringNote.note === rootNote,
              },
            ]"
          >
            <span v-if="notesDisplayed === 'all'">{{ stringNote.note }}</span>
            <span
              v-if="
                notesDisplayed === 'chord' &&
                chordNotes.includes(stringNote.note)
              "
              >{{ stringNote.note }}</span
            >
          </div>
        </div>

        <!-- Fretboard -->
        <div class="fretboard">
          <!-- Fret markers (inlays) -->
          <div class="fret-markers">
            <div v-for="fret in frets" :key="fret" class="marker-column">
              <div
                v-if="singleMarkerFrets.includes(fret)"
                class="single-marker"
              >
                <div class="marker-dot"></div>
              </div>
              <div
                v-else-if="doubleMarkerFrets.includes(fret)"
                class="double-marker"
              >
                <div class="marker-dot"></div>
                <div class="marker-dot"></div>
              </div>
            </div>
          </div>

          <!-- Strings with frets -->
          <div class="strings">
            <div
              v-for="(stringNote, stringIndex) in openStrings"
              :key="stringIndex"
              class="string-container"
            >
              <div
                v-for="fret in frets"
                :key="fret"
                :class="[
                  'fret',
                  {
                    'highlighted-note': chordNotes.includes(
                      getNoteAtFret(stringIndex, fret)
                    ),
                    'root-note': getNoteAtFret(stringIndex, fret) === rootNote,
                  },
                ]"
                @click="fretClicked(stringIndex, fret)"
              >
                <span class="fret-note" v-if="notesDisplayed === 'all'">{{
                  getNoteAtFret(stringIndex, fret)
                }}</span>
                <span
                  class="fret-note"
                  v-if="
                    notesDisplayed === 'chord' &&
                    chordNotes.includes(getNoteAtFret(stringIndex, fret))
                  "
                  >{{ getNoteAtFret(stringIndex, fret) }}</span
                >
              </div>
              <div
                class="string-line"
                :class="`string-${stringIndex + 1}`"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chord display -->
    <p class="chord-played-label">Selected Chord</p>
    <div class="chord-played">
      <p v-if="rootNote && chordType" class="chord-notes-label">
        {{ rootNote }}{{ chordType }} |
      </p>
      <p v-for="(note, index) in chordNotes" :key="index" class="chord-note">
        {{ note }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

//----NOTES & TUNING----//
const notes = ref([
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

// Standard guitar tuning (from 6th string to 1st string, low to high)
const openStrings = ref([
  { note: "E", octave: 4 }, // 1st string (high E)
  { note: "B", octave: 3 }, // 2nd string
  { note: "G", octave: 3 }, // 3rd string
  { note: "D", octave: 3 }, // 4th string
  { note: "A", octave: 2 }, // 5th string
  { note: "E", octave: 2 }, // 6th string (low E)
]);

const frets = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

// Fret marker positions
const singleMarkerFrets = [3, 5, 7, 9];
const doubleMarkerFrets = [12];

// Calculate the note at a specific string and fret
function getNoteAtFret(stringIndex, fret) {
  const openNote = openStrings.value[stringIndex].note;
  const openNoteIndex = notes.value.indexOf(openNote);
  const newNoteIndex = (openNoteIndex + fret) % 12;
  return notes.value[newNoteIndex];
}

//----CHORD SELECTOR----//
const rootNote = ref("C");
const chordType = ref("maj");
const notesDisplayed = ref("chord");

const chordTypes = ref([
  { label: "Major", value: "maj", intervals: [0, 4, 7] },
  { label: "Minor", value: "m", intervals: [0, 3, 7] },
  { label: "Augmented", value: "+", intervals: [0, 4, 8] },
  { label: "Diminished", value: "°", intervals: [0, 3, 6] },
  { label: "Dominant 7th", value: "7", intervals: [0, 4, 7, 10] },
  { label: "Major 7th", value: "maj7", intervals: [0, 4, 7, 11] },
  { label: "Minor 7th", value: "m7", intervals: [0, 3, 7, 10] },
  { label: "Suspended 2nd", value: "sus2", intervals: [0, 2, 7] },
  { label: "Suspended 4th", value: "sus4", intervals: [0, 5, 7] },
  { label: "Major 6th", value: "maj6", intervals: [0, 4, 7, 9] },
]);

const chordNotes = ref([]);

function updateChord() {
  if (!rootNote.value || !chordType.value) return;

  const chord = chordTypes.value.find((c) => c.value === chordType.value);
  if (!chord) return;

  const { intervals } = chord;
  const rootIndex = notes.value.indexOf(rootNote.value);
  const updatedChordNotes = intervals.map(
    (i) => notes.value[(rootIndex + i) % 12]
  );
  chordNotes.value = Array.from(new Set(updatedChordNotes));
}

watch(rootNote, () => updateChord(), { immediate: true });
watch(chordType, () => updateChord());

//----FRET CLICK----//
const fretPlayed = ref("");

function fretClicked(stringIndex, fret) {
  const note = getNoteAtFret(stringIndex, fret);
  fretPlayed.value = `String ${6 - stringIndex}: Fret ${fret} - ${note}`;
  console.log(fretPlayed.value);
}
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

/*----CONTROLS----*/
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
  font-size: 1rem;
  text-align: center;
  text-wrap: nowrap;
}

/*----NOTE LABELS----*/
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

.notes-labels-checkboxes input {
  width: 25px;
  height: 25px;
  appearance: none;
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
  font-size: 0.8em;
}

/*----CHORD SELECTOR----*/
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

/*----GUITAR BODY----*/
.guitar-body {
  border: 1px solid black;
  border-radius: 15px;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  background-color: rgb(42, 42, 42);
  width: 1100px;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  padding: 2em 2em 1.5em;
}

/*----GUITAR NECK----*/
.guitar-neck {
  width: 100%;
  height: 280px;
  display: grid;
  grid-template-columns: 40px 1fr;
  grid-template-areas: "nut fretboard";
  border-radius: 5px;
  overflow: hidden;
}

/*----NUT----*/
.nut {
  grid-area: nut;
  background: linear-gradient(to right, #f5f5dc, #e8e4c9);
  border-right: 4px solid #1a1a1a;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.3);
}

.nut-note {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: #333;
  font-family: "Ubuntu", sans-serif;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.nut-note:last-child {
  border-bottom: none;
}

.nut-note.highlighted-note {
  background-color: rgb(126, 145, 215);
  color: #000;
}

.nut-note.root-note {
  background-color: rgb(57, 82, 175);
  color: white;
}

/*----FRETBOARD----*/
.fretboard {
  grid-area: fretboard;
  background-color: rgb(101, 67, 33);
  position: relative;
}

/*----FRET MARKERS----*/
.fret-markers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns:
    11.224% 10.59% 9.994% 9.434% 8.908% 8.412%
    7.944% 7.504% 7.092% 6.702% 6.334% 5.986%;
  pointer-events: none;
  z-index: 0;
}

.marker-column {
  display: flex;
  align-items: center;
  justify-content: center;
}

.single-marker,
.double-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 60px;
}

.marker-dot {
  width: 20px;
  height: 20px;
  background: radial-gradient(circle at 30% 30%, #fff, #d4d4d4);
  border-radius: 50%;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.3);
}

/*----STRINGS----*/
.strings {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 1;
}

.string-container {
  flex: 1;
  display: grid;
  grid-template-columns:
    11.224% 10.59% 9.994% 9.434% 8.908% 8.412%
    7.944% 7.504% 7.092% 6.702% 6.334% 5.986%;
  position: relative;
}

.string-line {
  position: absolute;
  height: 3px;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(to bottom, #9a9a9a, #d4d4d4, #9a9a9a);
  pointer-events: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* String thickness varies from thin (1st string) to thick (6th string) */
.string-1 {
  height: 2px;
}
.string-2 {
  height: 2.5px;
}
.string-3 {
  height: 3px;
}
.string-4 {
  height: 4px;
}
.string-5 {
  height: 5px;
}
.string-6 {
  height: 6px;
}

/*----FRETS----*/
.fret {
  border-right: 3px solid #888;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  z-index: 2;
  transition: all 0.15s ease;
}

.fret:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.fret-note {
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: "Ubuntu", sans-serif;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  z-index: 3;
}

.fret.highlighted-note {
  background-color: rgba(126, 145, 215, 0.6);
}

.fret.highlighted-note .fret-note {
  background-color: rgb(126, 145, 215);
  color: #000;
}

.fret.root-note {
  background-color: rgba(57, 82, 175, 0.7);
}

.fret.root-note .fret-note {
  background-color: rgb(57, 82, 175);
  color: white;
}

/*----CHORD DISPLAY----*/
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
</style>
