<template>
  <div id="component">

    <label for="keys-input">Keys</label>

    <input id="keys-input"
           v-model="keysAmount"
           type="range"
           step="1"
           min="7"
           max="36" />
    <span id="keys-display">{{ keysAmount }}</span>

    <div id="keyboard">
      <div v-for="(key, index) in displayedKeys"
           :key="key"
           :class="['key', key.isSharp ? 'black' : 'white']"
           @mousedown="playNote(key.note)">
        {{ key.note }}
      </div>
    </div>

    <div id="chord-select-container">
      <label for="chord-select">Chord Finder:</label>

      <select id="chord-select"
              v-model="selectedChord">
        <option value="A">A</option>
        <option value="A#">A#</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="C#">C#</option>
        <option value="D">D</option>
        <option value="D#">D#</option>
        <option value="E">E</option>
        <option value="F">F</option>
        <option value="F#">F#</option>
        <option value="G">G</option>
        <option value="G#">G#</option>
      </select>

      <select id="chord-type-select"
              v-model="selectedChordType">
        <option value="M">Major</option>
        <option value="m">m</option>
        <option value="7">7</option>
        <option value="add9">add9</option>
        <option value="sus2">sus2</option>
      </select>
    </div>
  </div>
</template>

<script>
import { Howl } from 'howler';

export default {
  data() {
    return {
      keysAmount: 12,
      keys: [
        { note: 'C3', isSharp: false },
        { note: 'Cs3', isSharp: true },
        { note: 'D3', isSharp: false },
        { note: 'Ds3', isSharp: true },
        { note: 'E3', isSharp: false },
        { note: 'F3', isSharp: false },
        { note: 'Fs3', isSharp: true },
        { note: 'G3', isSharp: false },
        { note: 'Gs3', isSharp: true },
        { note: 'A3', isSharp: false },
        { note: 'As3', isSharp: true },
        { note: 'B3', isSharp: false },

        { note: 'C4', isSharp: false },
        { note: 'Cs4', isSharp: true },
        { note: 'D4', isSharp: false },
        { note: 'Ds4', isSharp: true },
        { note: 'E4', isSharp: false },
        { note: 'F4', isSharp: false },
        { note: 'Fs4', isSharp: true },
        { note: 'G4', isSharp: false },
        { note: 'Gs4', isSharp: true },
        { note: 'A4', isSharp: false },
        { note: 'As4', isSharp: true },
        { note: 'B4', isSharp: false },

        { note: 'C5', isSharp: false },
        { note: 'Cs5', isSharp: true },
        { note: 'D5', isSharp: false },
        { note: 'Ds5', isSharp: true },
        { note: 'E5', isSharp: false },
        { note: 'F5', isSharp: false },
        { note: 'Fs5', isSharp: true },
        { note: 'G5', isSharp: false },
        { note: 'Gs5', isSharp: true },
        { note: 'A5', isSharp: false },
        { note: 'As5', isSharp: true },
        { note: 'B5', isSharp: false }
      ],
      selectedChordType: '',
      selectedChord: ''
    };
  },
  watch: {
    selectedChordType(newVal, oldVal) {
      console.log('Option changed from', oldVal, 'to', newVal);
    },
    selectedChord(newVal, oldVal) {
      console.log('Option changed from', oldVal, 'to', newVal);
    },
  },
  computed: {
    displayedKeys() {
      return this.keys.slice(0, this.keysAmount);
    }
  },
  methods: {
    playNote(note) {
      const sound = new Howl({
        src: [`/sounds/keyboard_samples/${note}.mp3`],
      });
      sound.play();

      setTimeout(() => { sound.stop() }, 6000)
    },
    keysArray(length) {
      return Array.from({ length }, (_, i) => i + 1);
    }
  },
  }


</script>


<style scoped>
#component {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4em;
}

#keyboard {
  width: fit-content;
  height: 16em;
  border: 3px solid rgb(0, 0, 0);
  display: flex;
  margin-bottom: 1em;
  background-color: rgba(0, 0, 0, 0.64);
}

.key {
  border: 1px solid black;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
}

.key:hover {
  cursor: pointer;
  filter: brightness(95%);
}

.white {
  width: 4em;
  z-index: 0;

}

.black {
  width: 2.25em;
  position: relative;
  background-color: black;
  color: white;
  height: 10em;
  margin: 0 -18px;
  z-index: 1;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

#chord-select-container {
  display: flex;
  place-items: center;
  gap: 0.5em;
}
</style>