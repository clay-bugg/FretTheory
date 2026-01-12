<template>
  <div class="guitar-neck">
    <!-- Nut with open string notes -->
    <div class="nut">
      <div
        v-for="(stringNote, index) in store.openStrings"
        :key="index"
        :class="[
          'nut-note',
          {
            'highlighted-note': store.isChordNote(index, 0),
            'root-note': store.isRootNote(index, 0),
          },
        ]"
        @mousedown="nutClicked(index)"
        @mouseup="nutReleased(index)"
        @mouseleave="nutReleased(index)"
      >
        <span v-if="store.notesDisplayed === 'all'">{{ stringNote.note }}</span>
        <span
          v-if="store.notesDisplayed === 'chord' && store.isChordNote(index, 0)"
          >{{ stringNote.note }}</span
        >
      </div>
    </div>

    <!-- Fretboard -->
    <div class="fretboard">
      <!-- Fret markers (inlays) -->
      <div class="fret-markers">
        <div v-for="fret in store.frets" :key="fret" class="marker-column">
          <div
            v-if="store.singleMarkerFrets.includes(fret)"
            class="single-marker"
          >
            <div class="marker-dot"></div>
          </div>
          <div
            v-else-if="store.doubleMarkerFrets.includes(fret)"
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
          v-for="(stringNote, stringIndex) in store.openStrings"
          :key="stringIndex"
          class="string-container"
        >
          <div
            v-for="fret in store.frets"
            :key="fret"
            :class="[
              'fret',
              {
                'highlighted-note': store.isChordNote(stringIndex, fret),
                'root-note': store.isRootNote(stringIndex, fret),
              },
            ]"
            @mousedown="fretClicked(stringIndex, fret)"
            @mouseup="fretReleased(stringIndex, fret)"
            @mouseleave="fretReleased(stringIndex, fret)"
          >
            <span class="fret-note" v-if="store.notesDisplayed === 'all'">
              {{ store.getNoteAtFret(stringIndex, fret) }}
            </span>
            <span
              class="fret-note"
              v-if="
                store.notesDisplayed === 'chord' &&
                store.isChordNote(stringIndex, fret)
              "
              >{{ store.getNoteAtFret(stringIndex, fret) }}</span
            >
          </div>
          <div class="string-line" :class="`string-${stringIndex + 1}`"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGuitarStore } from "~/stores/guitarStore";
import { useGuitarAudio } from "~/composables/useGuitarAudio";

// Store for guitar state
const store = useGuitarStore();

// Audio composable
const { playFret, stopFret, playOpenString, stopOpenString } = useGuitarAudio();

// Emit events for parent components
const emit = defineEmits(["fretPlayed", "nutPlayed"]);

// Handle fret click - play sound
function fretClicked(stringIndex, fret) {
  const note = store.getNoteAtFret(stringIndex, fret);
  emit("fretPlayed", { stringIndex, fret, note });
  console.log(`String ${6 - stringIndex}: Fret ${fret} - ${note}`);
  playFret(stringIndex, fret);
}

// Handle fret release - stop sound
function fretReleased(stringIndex, fret) {
  stopFret(stringIndex, fret);
}

// Handle open string (nut) click - play sound
function nutClicked(stringIndex) {
  const openString = store.openStrings[stringIndex];
  emit("nutPlayed", { stringIndex, note: openString.note });
  console.log(`String ${6 - stringIndex}: Open - ${openString.note}`);
  playOpenString(stringIndex);
}

// Handle open string (nut) release - stop sound
function nutReleased(stringIndex) {
  stopOpenString(stringIndex);
}
</script>

<style scoped lang="scss">
.guitar-neck {
  display: grid;
  grid-template-columns: 40px 1fr;
  grid-template-areas: "nut fretboard";
  width: 100%;
  height: 280px;
  overflow: hidden;
  border-radius: 5px;
}

.nut {
  display: flex;
  flex-direction: column;
  grid-area: nut;
  border-right: 4px solid black;
  background: rgb(162, 127, 82);
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.4);
}

.nut-note {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background-color: transparent;
  color: black;
  font-family: "Ubuntu", sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.nut-note:last-child {
  filter: brightness(0.9);
}

.nut-note:hover {
  background-color: black;
}

.nut-note:active {
  background-color: black;
}

.nut-note.highlighted-note {
  background-color: black;
  color: black;
}

.nut-note.root-note {
  background-color: black;
  color: white;
}

.fretboard {
  position: relative;
  grid-area: fretboard;
  background-color: black;
}

.fret-markers {
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns:
    11.224% 10.59% 9.994% 9.434% 8.908% 8.412%
    7.944% 7.504% 7.092% 6.702% 6.334% 5.986%;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
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
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, black, black);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 2px 4px black;
}

.strings {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.string-container {
  position: relative;
  display: grid;
  flex: 1;
  grid-template-columns:
    11.224% 10.59% 9.994% 9.434% 8.908% 8.412%
    7.944% 7.504% 7.092% 6.702% 6.334% 5.986%;
}

.string-line {
  position: absolute;
  top: 50%;
  width: 100%;
  height: 3px;
  background: linear-gradient(to bottom, black, black, black);
  box-shadow: 0 1px 2px black;
  transform: translateY(-50%);
  pointer-events: none;
}

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

.fret {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 3px solid black;
  cursor: pointer;
  transition: all 0.15s ease;
  z-index: 2;
}

.fret:hover {
  filter: brightness(0.9);
}

.fret-note {
  border-radius: 50px;
  padding: 2px 6px;
  background-color: black;
  color: white;
  font-family: "Ubuntu", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-shadow: black;
  z-index: 3;
}

.fret.highlighted-note .fret-note {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 3px solid black;
  filter: brightness(0.9);
  color: black;
  font-size: 1.3rem;
  font-weight: 400;
}

.fret.root-note .fret-note {
  border: 3px solid black;
  color: black;
}
</style>
