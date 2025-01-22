<template>
  <div class="component">
    <div class="controls">
      <div class="chord-selector-box">

        <select id="root-note-selector" v-model="rootNote">
          <option
            v-for="note in rootNotes"
            :key="note"
            :value="note">
              {{ note }}
          </option>
        </select>

        <select id="chord-type-selector" v-model="chordType">
          <option
            v-for="type in chordTypes"
            :key="type"
            :value="type.value">
              {{ type.label }}
          </option>
        </select> 
      </div>

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
    </div>

    <div class="keyboard">
      <div v-for="(key,index) in keysDisplayed" @mousedown="playKey(key.note,key.octave)"
        :key="key"
        :class="[
          'key',
          key.sharp ? 'black' : 'white',
          chordNotes.includes(key.note) ? 'chord-note' : '',
          key.note === rootNote ? 'root-note' : ''
          ]">
        <span v-if="chordNotes.includes(key.note)"
           :class= "key.note === rootNote ? 'root-note-number' : 'chord-note-number'">
          {{ chordNotes.indexOf(key.note) + 1}}
        </span>
        {{ key.note }}
      </div>
    </div>

    <div class="root-note-key">
      <label for="root-note-color">Root Note =</label>
      <span id="root-note-color"></span>
    </div>

    <div v-if="rootNote && chordType" class="chord-played">
      <label for="chord-notes">{{ rootNote }}{{ chordType }}</label>
      <p id="chord-notes">{{ chordNotes }}</p>
      <button @click="playChord(chordNotes)">Play Chord</button>
    </div>  

  </div>

</template>

<script>
import { Howl } from 'howler';

export default {
  data() { 
    return {
      numberOfKeys: 24,
      pianoKeys: this.generateKeys(3, 5),
      rootNote: '',
      chordType: '',
      chordNotes: [],
      rootNotes: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
      chordTypes: [
        { label: 'Major', value: 'M' },
        { label: 'Minor', value: 'm' },
        { label: 'Augmented', value: '+' },
        { label: 'Diminished', value: '°' },
        { label: 'Dominant 7th', value: '7' },
        { label: 'Minor 7th', value: 'm7' },
        { label: 'Major 7th', value: 'maj7'}
      ],
      chordIntervals: {
        'M': [0, 4, 7],
        'm': [0, 3, 7],
        '+': [0, 4, 8],
        '°': [0, 3, 6],
        '7': [0, 4, 7, 10],
        'm7': [0, 3, 7, 10],
        'maj7': [0, 4, 7, 11]
      }
    }
  },
  computed: {
    keysDisplayed() { 
      return this.pianoKeys.slice(0, this.numberOfKeys);
    }
  },
  watch: {
    rootNote(newVal, oldVal) { 
      console.log(`Root note changed from ${oldVal} to ${newVal}`);
      this.updateChord();
    },
    chordType(newVal, oldVal) { 
      console.log(`Chord type changed from ${oldVal} to ${newVal}`);
      this.updateChord();
    },
  },
  methods: {
    generateKeys() { 
      const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      const keys = [];
      const octavesArray = [3, 4, 5];
      
      for (let i = 0; i < octavesArray.length; i++) { 
        notes.forEach((note) => { 
          const appendedOctave = octavesArray[i]
          keys.push({
            note: `${note}`,
            octave: appendedOctave,
            sharp: note.includes('#')
          });
        })
      }
      return keys;
    },

    playKey(note,octave) { 
      const encodedNote = encodeURIComponent(note);
      const sound = new Howl({
        src: [`/sounds/keyboard_samples/${encodedNote}${octave}.mp3`]
      });
      console.log(`${note} note played.`)
      sound.play();

      setTimeout(() => {
        sound.stop();
      }, 7000);
    },

    playChord() { 
      this.chordNotes.forEach((note => { 
        const encodedNote = encodeURIComponent(note);
        const sound = new Howl({
          src: [`/sounds/keyboard_samples/${encodedNote}4.mp3`]
        });
        sound.play();
      }))
    },

    updateChord() {
      const rootNote = this.rootNote;
      const chordType = this.chordType
      const intervals = this.chordIntervals[chordType] || '';
      console.log(`Chord changed to ${rootNote}${chordType}`)

      if (!rootNote || !chordType) return;

      const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      const rootIndex = notes.indexOf(rootNote);

      const chordNotes = [];
    

      this.pianoKeys.forEach((key, index) => {
        const interval = (index - rootIndex) % 12;
        if (intervals.includes(interval)) { 
          chordNotes.push(key.note);
        }
        });

      this.chordNotes = chordNotes;

      console.log(`Chord Notes: ${chordNotes}`);
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

.component {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.controls {
  display: flex;
  align-items: center;
  justify-content: center;
}
.keyboard {
  width: fit-content;
  height: 16em;
  border: 3px solid black;
  display: flex;  
}
.key {
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}
.key:hover {
  cursor: pointer;
  filter: brightness(95%);
}
.white {
  width: 4em;
  background-color: white;;
}
.black {
  width: 2.25em;
  height: 10em;
  position: relative;
  margin: 0 -18px;
  background-color: black;
  z-index: 1;
  border: 2px solid black;
  color: #fff;
}
.root-note {
  background-color: rgba(178, 59, 59, 0.647) !important;
}
.chord-note {
  background-color: rgba(94, 94, 175, 0.523);;
}

.root-note-number {
    width: 1.8em;
  height: 1.8em;
  display: flex;
  align-items: center ;
  justify-content: center;
  border: 1px solid black;
  border-radius: 50%;
  background-color: rgb(178, 59, 59);
  color: white;
}

.chord-note-number {
  width: 1.8em;
  height: 1.8em;
  display: flex;
  align-items: center ;
  justify-content: center;
  border: 1px solid black;
  border-radius: 50%;
  background-color: black;
  color: white;
}

.root-note-key {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8em;
  position: relative;
  right: 22em;
}
#root-note-color {
  width: 1em;
  height: 1em;
  border: 1px solid black;
  background-color: rgb(178, 59, 59)!important;
}
.chord-played {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1em;
}
</style>