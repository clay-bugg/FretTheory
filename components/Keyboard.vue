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
           :key="key.note"
           :class="['key', key.isSharp ? 'black' : 'white', highlightedNotes.includes(key.note) ? 'highlighted' : '']"
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
        <option value="dim">dim</option>
        <option value="Maj7">maj7</option>
        <option value="m7">m7</option>
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
      keys: this.generateKeys(3, 5),
      selectedChordType: '',
      selectedChord: '',
      highlightedNotes: [],
      chordIntervals: {
        'M': [0, 4, 7],
        'm': [0, 3, 7],
        'dim': [0, 3, 6],
        'aug': [0, 4, 8],
        'Maj7': [0, 4, 7, 11],
        'm7': [0, 3, 7, 10]
      }
    }
  },
  computed: {
    displayedKeys() {
      return this.keys.slice(0, this.keysAmount);
    }
  },
  watch: {
    selectedChordType(newVal, oldVal) {
      console.log('Chord type changed from', oldVal, 'to', newVal);
      this.updateChord();
    },
    selectedChord(newVal, oldVal) {
      console.log('Chord root changed from', oldVal, 'to', newVal);
      this.updateChord();
    },
    keysAmount(newVal) { 
      if (newVal < 7) this.keysAmount = 7;
      if (newVal > this.keys.length) this.keysAmount = this.keys.length;
    }
  },
  methods: {
    generateKeys(startOctave, endOctave) {
      const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      const keys = [];

      for (let octave = startOctave; octave <= endOctave; octave++) {
        notes.forEach(note => {
          keys.push({
            note: `${note}${octave}`,
            isSharp: note.includes('#')
          });
        });
      }

      return keys;
    },

    playNote(note) {
      const sound = new Howl({
        src: [`/sounds/keyboard_samples/${note}.mp3`],
      });
      sound.play();

      setTimeout(() => { sound.stop() }, 6000)
      console.log(`Note played:${note}`)
    },

    keysArray(length) {
      return Array.from({ length }, (_, i) => i + 1);
    },

    updateChord() { 
      if (!this.selectedChord || !this.selectedChordType) {
        this.highlightedNotes = [];
        return;
      }

      const rootNote = this.selectedChord;
      const intervals = this.chordIntervals[this.selectedChordType];

      if (!intervals) {
        console.warn(`Chord type ${this.selectedChordType} is not defined.`);
        this.highlightedNotes = [];
        return;
      }

      const getNoteIndex = (note) => { 
        const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const hasOctave = /\d$/.test(note);
        const baseNote = hasOctave ? note.slice(0, -1) : note;
        return noteOrder.indexOf(baseNote);
      }

      const chordNotes = [];

      this.keys.forEach(key => {
        const keyIndex = getNoteIndex(key.note);
        if (keyIndex === -1) return;

        intervals.forEach(interval => {
          const targetIndex = (getNoteIndex(rootNote) + interval) % 12;
          if (keyIndex === targetIndex && !chordNotes.includes(key.note)) {
            chordNotes.push(key.note);
          }
        });
      });

      console.log('Highlighted Chord Notes:', chordNotes);
      this.highlightedNotes = chordNotes;
      }
    }
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

.highlighted.white {
  background-color: rgb(218, 130, 130);
}

.highlighted.black {
  background-color: rgb(218, 130, 130);
}

#chord-select-container {
  display: flex;
  place-items: center;
  gap: 0.5em;
}
</style>