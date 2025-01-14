<template>
  <div>
    <p id="selected-chord">{{ selectedChord }}</p>
    <div id="keyboard">
      <div v-for="(key, index) in keys"
           :key="index"
           :class="['key', key.type,]"
           :style="{ fontSize: getKeyColor(key.label) }"
           :data-note="key.note"
           :data-label="key.label"
           @mousedown="playNote(key.note, selectedOctave)">
        {{ key.label }}
      </div>
    </div>
    <label for="octave-select">Octave:</label>
    <select id="octave-select"
            v-model="selectedOctave">
      <option v-for="octave in octaves"
              :key="octave.value"
              :value="octave.value">{{ octave.value }}</option>
    </select>
    <select id="chordKey-select"
            v-model="selectedChordKey">
      <option v-for="chordKey in chordKeys"
              :key="chordKey.value"
              :value="chordKey.value"
              @change="selectedChord">{{ chordKey.value }}</option>
    </select>
    <select id="chordType-select"
            v-model="selectedChordType">
      <option v-for="chordType in chordTypes"
              :key="chordType.value"
              :value="chordType.value"
              @change="selectedChord">{{ chordType.value }}</option>
    </select>
  </div>
</template>
<script>

import { Howl, Howler } from 'howler';

export default {
  name: "Keyboard",
  data() {
    return {
      keyColor: '',
      keys: [
        { label: "C", note: "C", type: "white" },
        { label: "C#", note: "Cs", type: "black" },
        { label: "D", note: "D", type: "white" },
        { label: "D#", note: "Ds", type: "black" },
        { label: "E", note: "E", type: "white" },
        { label: "F", note: "F", type: "white" },
        { label: "F#", note: "Fs", type: "black" },
        { label: "G", note: "G", type: "white" },
        { label: "G#", note: "Gs", type: "black" },
        { label: "A", note: "A", type: "white" },
        { label: "A#", note: "As", type: "black" },
        { label: "B", note: "B", type: "white" },
      ],
      selectedOctave: '4',
      octaves: [
        { value: '1' },
        { value: '2' },
        { value: '3' },
        { value: '4' },
        { value: '5' },
        { value: '6' },
        { value: '7' }
      ],
      selectedChordKey: 'C',
      chordKeys: [
        { value: 'A' },
        { value: 'A#' },
        { value: 'B' },
        { value: 'C' },
        { value: 'C#' },
        { value: 'D' },
        { value: 'D#' },
        { value: 'E' },
        { value: 'F' },
        { value: 'F#' },
        { value: 'G' },
        { value: 'G#' }
      ],
      selectedChordType: 'major',
      chordTypes: [
        { value: 'major' },
        { value: 'm' },
        { value: 'm7' },
        { value: '7' },
        { value: 'sus2' },
        { value: 'aug' },
        { value: 'dim' }
      ],
      scales: [
        { value: 'C', scale: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
        { value: 'C#', scale: ['C', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#'] },
        { value: 'D', scale: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'] },
        { value: 'D#', scale: ['D#', 'E#', 'F', 'G#', 'A#', 'B#', 'C'] },
        { value: 'E', scale: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'] },
        { value: 'F', scale: ['F', 'G', 'A', 'A#', 'C', 'D', 'E'] },
        { value: 'F#', scale: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'] },
        { value: 'G', scale: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'] },
        { value: 'G#', scale: ['G#', 'A#', 'B#', 'C#', 'D#', 'E#', 'F'] },
        { value: 'A', scale: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'] },
        { value: 'A#', scale: ['A#', 'C', 'D#', 'E#', 'F', 'G', 'A#'] },
        { value: 'B', scale: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'] }
      ]
    }
  },
  computed: {
    selectedChord() {
      const note = this.selectedChordKey
      const type = this.selectedChordType
      return `${note}${type}`
    },
  },
  methods: {
    playNote(note, pitch) {
      const sound = new Howl({
        src: [`/sounds/keyboard_samples/${note}${pitch}.mp3`]
      });
      sound.play();
    },
    getKeyColor(keyLabel) {
      const currentScale = this.scales.find(
        (scale) => scale.value === this.selectedChordKey
      );
      return currentScale.scale.includes(keyLabel)
        ? "1.3em"
        : "1em";
    }
  }
}
</script>

<style scoped>
#selected-chord {
  margin: 0 auto;
  margin-bottom: 0.5em;
  font-size: 2rem;
  width: fit-content;
  padding: 0;
}

#keyboard {
  display: flex;
  position: relative;
  height: 200px;
  margin: 0 auto;
  font-family: 'Kanit';
  margin-bottom: 0.5em;
}

.key {
  position: relative;
  border: 1px solid black;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  user-select: none;
  border-radius: 5px;
}

.key.white {
  background-color: white;
  width: 50px;
  height: 200px;
  z-index: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 0.3em;
}

.key.black {
  background-color: black;
  width: 30px;
  height: 120px;
  margin-left: -15px;
  margin-right: -15px;
  z-index: 2;
  color: white;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 0.2em;
}

.key.white:hover {
  background-color: rgb(239, 239, 239);
}

.key.white:active {
  background-color: white;
}

.key.black:hover {
  background-color: rgb(37, 37, 37);
}

.key.black:active {
  background-color: rgb(0, 0, 0);
}
</style>