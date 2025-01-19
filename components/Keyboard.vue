<template>
  <div id="component">

    <div id="controls">

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
      <div id="keys-select-container">
        <label for="keys-input">Keys: </label>
        <input id="keys-input"
               v-model="keysAmount"
               type="range"
               step="1"
               min="7"
               max="36" />
        <span id="keys-display">{{ keysAmount }}</span>
      </div>
    </div>

    <div id="keyboard">
      <div v-for="(key, index) in displayedKeys"
           :key="key.note"
           :class="[
            'key', key.isSharp ? 'black' : 'white',
             highlightedNotes.includes(key.note) ? 'highlighted' : '',
             key.note.replace(/\d/, '') === selectedChord ? 'root-note' : ''
           ]"
           @mousedown="playNote(key.note)">
        {{ key.note }}
      </div>
    </div>

  </div>
</template>

<script>
import { Howl } from 'howler';

export default {
  data() {
    return {
      keysAmount: 24,
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
      const encodedNote = encodeURIComponent(note);
      console.log(encodedNote);
      const sound = new Howl({
        src: [`/sounds/keyboard_samples/${encodedNote}.mp3`],
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

      const noteOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

      const getBaseNoteIndex = (note) => {
        const baseNote = note.replace(/\d/, '');
        return noteOrder.indexOf(baseNote);
      };

      const rootIndex = getBaseNoteIndex(rootNote);
      const chordNotes = new Set();

      this.keys.forEach(key => {
        const keyBaseIndex = getBaseNoteIndex(key.note);

        intervals.forEach(interval => {
          const targetIndex = (rootIndex + interval) % 12;
          if (keyBaseIndex === targetIndex) {
            chordNotes.add(key.note);
          }
        });
      });

      console.log('Highlighted Chord Notes:', Array.from(chordNotes));
      this.highlightedNotes = Array.from(chordNotes);
      }
    }
  }
  


</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#component {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4em;;
}

#controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10em;
}

#chord-select-container {
  display: flex;
  place-items: center;
  gap: 0.5em;
}

#chord-select-container select {
  border: 1px solid black;
  border-radius: 5px;
}

#keys-select-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
}

.white {
  width: 4em;
  z-index: 0;
  background-color: white;
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

.key:hover {
  cursor: pointer;
  filter: brightness(95%);
}

.highlighted {
  background-color: rgb(118, 140, 174);
}

.root-note {
  background-color: rgb(176, 65, 65) !important;
}
</style>