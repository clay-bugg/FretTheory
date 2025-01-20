<template>
  <div id="component">

    <div id="controls">

      <div id="chord-select-container">
        <label for="chord-select">Chord Finder:</label>
        <select id="chord-select" v-model="selectedChord">
          <option v-for="chord in chordOptions" :key="chord" :value="chord">{{ chord }}</option>
        </select>
        <select id="chord-type-select" v-model="selectedChordType">
          <option v-for="type in chordTypeOptions" :key="type.value":value="type.value">
            {{ type.label }}
          </option>
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

    <div id="color-note-container">
      <label for="root-note-color-key">Root Note = </label>
      <div class="note-key-color"
           id="root-note-color"></div>
    </div>
    <p id="chord-played"> {{ notesPlayed }}</p>

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
      notesPlayed: null,
      chordOptions: ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'],
      chordTypeOptions: [
        { label: 'Major', value: 'M' },
        { label: 'Minor', value: 'm' },
        { label: 'Augmented', value: '+' },
        { label: 'Diminished', value: '°' },
        { label: 'Dominant 7th', value: '7' },
        { label: 'Minor 7th', value: 'm7' },
        { label: 'Major 7th', value: 'maj7' },
        { label: 'Diminished 7th', value: '°7' },
        { label: 'Suspended 2nd', value: 'sus2' },
        { label: 'Suspended 4th', value: 'sus4' },
        { label: 'Dominant 7th Suspended 4th', value: '7sus4' },
        { label: 'Major 9th', value: 'maj9' },
        { label: 'Major 11th', value: 'maj11' },
        { label: 'Major 13th', value: 'maj13' }
      ],
      chordIntervals: {
        'M': [0, 4, 7],
        'm': [0, 3, 7],
        '+': [0, 4, 8],
        '°': [0, 3, 6],
        '7': [0, 4, 7, 10],
        'm7': [0, 3, 7, 10],
        'maj7': [0, 4, 7, 11],
        '°7': [0, 3, 6, 9],
        'sus2': [0, 2, 7],
        'sus4': [0, 5, 7],
        '7sus4': [0, 5, 7, 10],
        'maj9': [0, 4, 7, 11, 14],
        'maj11': [0, 4, 7, 11, 14, 17],
        'maj13': [0, 4, 7, 11, 14, 21]
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
        this.notesPlayed = [];
        return;
      }

      const rootNote = this.selectedChord;
      const intervals = this.chordIntervals[this.selectedChordType] || [];

      if (!intervals) {
        console.warn(`Chord type ${this.selectedChordType} is not defined.`);
        this.highlightedNotes = [];
        this.notePlayed = [];
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

      const notesArray = Array.from(chordNotes);
      const oneOctaveNotes = notesArray.filter(note => note.endsWith('3'))

      this.highlightedNotes = notesArray;
      this.notesPlayed = oneOctaveNotes.map(note => note.replace(/\d/, ''));
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
  gap: 0.4em;
  ;
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
  background-color: transparent;
}

.key {
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
  font-weight: 700;

}

.white {
  width: 4em;
  z-index: 0;
  background-color: rgb(255, 255, 255);
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
  border: 2px solid black;
}

.key:hover {
  cursor: pointer;
  filter: brightness(95%);
}

.highlighted {
  background-color: rgb(81, 109, 151);
  color: black
}



#color-note-container {
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  left: 22em;
  bottom: 0.8em;
  gap: 0.8em;
}

#root-note-color {
  width: 1em;
  height: 1em;
  border: 1px solid black;
  background-color: rgb(168, 42, 42);
}

.root-note {
  background-color: rgb(168, 42, 42) !important;
}

#chord-played {
  font-size: 1.5em;
  position: relative;
  bottom: 2em
}
</style>