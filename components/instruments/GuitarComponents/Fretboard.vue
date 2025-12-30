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
  cursor: pointer;
  user-select: none;
}

.nut-note:last-child {
  border-bottom: none;
}

.nut-note:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.nut-note:active {
  background-color: rgba(74, 144, 164, 0.6);
  transform: scale(0.98);
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
  border-radius: 50px;
  font-family: "Ubuntu", sans-serif;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  z-index: 3;
}

.fret.highlighted-note .fret-note {
  background-color: rgb(58, 108, 216);
  color: #000;
  height: 40px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.3rem;
  font-weight: 400;
  border: 3px solid black;
}

.fret.root-note .fret-note {
  background-color: rgb(197, 46, 46);
  color: rgb(0, 0, 0);
  border: 3px solid black;
}
</style>
