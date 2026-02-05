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
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 4px solid #1a1a1a;
}

.nut {
  display: flex;
  flex-direction: column;
  grid-area: nut;
  border-right: 4px solid #1a1a1a;
  background: linear-gradient(to right, #f5f0e1, #e8dcc8); /* Bone/Ivory */
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.4);
  z-index: 10;
}

.nut-note {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background-color: transparent;
  color: #333;
  font-family: "Ubuntu", sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.nut-note:last-child {
  border-bottom: none;
}

.nut-note:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.nut-note.highlighted-note {
  background: radial-gradient(circle, #f59e0b, #d97706);
  color: black;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
}

.nut-note.root-note {
  background: radial-gradient(circle, #f43f5e, #e11d48);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.fretboard {
  position: relative;
  grid-area: fretboard;

  background: linear-gradient(
    to bottom,
    #deb887,
    #d2a679,
    #c19a6b,
    #d2a679,
    #deb887
  );
  width: 941.23px;
  height: 511.81px;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.4);
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
  border-right: 2px solid #8a8a8a; /* Fret wire */
  box-shadow: 1px 0 2px rgba(0, 0, 0, 0.3);
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
  /* Black inlay for Maple fretboard contrast */
  background: radial-gradient(circle at 30% 30%, #333, #000);
  box-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
  opacity: 0.9;
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
  background: linear-gradient(
    to bottom,
    #d1d5db,
    #9ca3af,
    #6b7280
  ); /* Silver/Nickel */
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.4);
  transform: translateY(-50%);
  pointer-events: none;
}

/* Bronze/Gold for lower strings */
.string-4 .string-line,
.string-5 .string-line,
.string-6 .string-line {
  background: linear-gradient(to bottom, #fcd34d, #d97706, #92400e);
}

.string-1 {
  height: 1.5px;
}
.string-2 {
  height: 2px;
}
.string-3 {
  height: 2.5px;
}
.string-4 {
  height: 3.5px;
}
.string-5 {
  height: 4.5px;
}
.string-6 {
  height: 5.5px;
}

.fret {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  z-index: 2;
}

.fret:hover::after {
  content: "";
  position: absolute;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  filter: blur(5px);
}

.fret-note {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: #1f1f1f;
  color: #e5e5e5;
  font-family: "Ubuntu", sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 3;
}

.fret.highlighted-note .fret-note {
  width: 38px;
  height: 38px;
  background: radial-gradient(circle at 30% 30%, #f59e0b, #d97706);
  border: 2px solid white;
  color: black;
  font-size: 1.1rem;
  font-weight: 700;
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.4),
    0 0 10px rgba(245, 158, 11, 0.4);
}

.fret.root-note .fret-note {
  background: radial-gradient(circle at 30% 30%, #f43f5e, #e11d48);
  border: 2px solid white;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.4),
    0 0 10px rgba(244, 63, 94, 0.4);
}
</style>
