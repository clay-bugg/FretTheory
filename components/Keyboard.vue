<template>
  <div class="component">

    <div class="controls">

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

    </div>

    <div class="keyboard">

      <div v-for="(key,index) in keysDisplayed"
        :key="key"
        :class="[
          'key',
          {
            'black': key.sharp,
            'white': !key.sharp,
            'highlighted-note': highlightedNotes.includes(key.note),
            'root-note': key.note === rootNote
          }]"  
        @mousedown="playKey(key.note,key.octave)">

          <span v-if="highlightedNotes.includes(key.note)">{{ key.note }}</span>
          <span v-if="highlightedNotes.includes(key.note)" :class="key.note === rootNote ? 'root-note-number' : 'chord-note-number'" :id="`interval-${highlightedNotes.indexOf(key.note) + 1}`">
            {{ highlightedNotes.indexOf(key.note) + 1}}
          </span>

      </div>

    </div>

    <div class="chord-played"
      v-if="rootNote && chordType">
        <label for="chord-notes">{{ rootNote }}{{ chordType }}</label>
        <p id="chord-notes">{{ chordNotes }}</p>
        <button @click="playChord(chordNotes)"><Icon name="icon-park:play-one" id="play-icon" /></button>
    </div>  

  </div>

</template>

<script>
import { Howl } from 'howler';

export default {
  setup() {
    const activeChordNotes = ref([]);
    const soundsCache = {};

    const preloadSounds = (notes) => { 
      notes.forEach((note) => {
        if (!soundsCache[note]) {
          soundsCache[note] = new Howl({
            src: [`/sounds/keyboard_samples/${encodeURIComponent(note)}4.mp3`],
            preload: true,
          });
        }
      });
    }

    const playChord = (notes) => {
      preloadSounds(notes);
    

      if (activeChordNotes.value.length) {
        activeChordNotes.value.forEach((sound) => sound.stop());
      }

      const playingSounds = notes.map((note) => soundsCache[note]);

      playingSounds.forEach((sound) => {
        sound.seek(0);
        sound.play();
      });

      activeChordNotes.value = playingSounds;

    };

    return { playChord, activeChordNotes };
  },
  
  data() { 
    return {
      numberOfKeys: 24,
      pianoKeys: this.generateKeys(3, 5),
      rootNote: '',
      chordType: '',
      highlightedNotes: [],
      chordNotes: [],
      rootNotes: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
      chordTypes: [
        { label: 'Major', value: 'M' },
        { label: 'Major 6th', value: 'maj6' },
        { label: 'Major 6/9', value: '6/9' },
        { label: 'Major 7th', value: '7' },
        { label: 'Major 9th', value: '9' },
        { label: 'Major 11th', value: '11' },
        { label: 'Major 13th', value: '13'},
        { label: 'Minor', value: 'm' },
        { label: 'Minor 7th', value: 'm7' },
        { label: 'Dominant 7th', value: '7' },
        { label: 'Diminished', value: '°' },
        { label: 'Augmented', value: '+' },
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

        updateChord() {
      const rootNote = this.rootNote;
      const chordType = this.chordType
      const intervals = this.chordIntervals[chordType] || '';
      console.log(`Chord changed to ${rootNote}${chordType}`)

      if (!rootNote || !chordType) return;

      const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      const rootIndex = notes.indexOf(rootNote);

      const highlightedNotes = [];
      const chordNotes = new Set();

      this.pianoKeys.forEach((key, index) => {
        const interval = (index - rootIndex) % 12;
        if (intervals.includes(interval)) { 
          highlightedNotes.push(key.note);
          chordNotes.add(key.note);
        }
        });

      this.highlightedNotes = highlightedNotes;
      this.chordNotes = Array.from(chordNotes);
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
  gap: 0.4em;
}
.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 55em;
}

.keys-selector-box {
  display: flex;
  align-items: center;
  gap: 0.4em;
  font-size: 1.1em;
}

.chord-selector-box {
  display: flex;
  align-items: center;
  gap: 0.4em;
}

.chord-selector-box select {
  font-size: 1em;
  font-family: inherit;
  border: 2px solid black;
  border-radius: 0.3em;
  padding: 0 0.2em;
}

.keyboard {
  width: fit-content;
  height: 16em;
  border: 0.2em solid black;
  border-top: 0.6em solid black;
  display: flex;
  border-top-left-radius: 0.3em;
  border-top-right-radius: 0.3em;
  overflow: hidden;
  margin-bottom: 1em;
}
.key {
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5em;
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
  width: 2.5em;
  height: 9.5em;
  position: relative;
  margin: 0 -1.25em;
  background-color: black;
  border: 2px solid black;
  border-bottom-left-radius: 0.4em;
  border-bottom-right-radius: 0.4em;
  color: #fff;
  z-index: 1;
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
  position: relative;
  bottom: 0.3em;
}

.black.chord-note-number {
  background-color: white;
  color: black;
}

#interval-1 {
  width: 1.8em;
  height: 1.8em;
  display: flex;
  align-items: center ;
  justify-content: center;
  border: 1px solid black;
  border-radius: 50%;
  background-color: black;
  color: white;
  position: relative;
  bottom: 0.3em;
  background-color: #7B2929;
}

#interval-2 {
  width: 1.8em;
  height: 1.8em;
  display: flex;
  align-items: center ;
  justify-content: center;
  border: 1px solid black;
  border-radius: 50%;
  background-color: black;
  color: white;
  position: relative;
  bottom: 0.3em;
  background-color: #975097;
}

#interval-3 {
  width: 1.8em;
  height: 1.8em;
  display: flex;
  align-items: center ;
  justify-content: center;
  border: 1px solid black;
  border-radius: 50%;
  background-color: black;
  color: white;
  position: relative;
  bottom: 0.3em;
  background-color: #2d2d7a;
}

#interval-4 {
  width: 1.8em;
  height: 1.8em;
  display: flex;
  align-items: center ;
  justify-content: center;
  border: 1px solid black;
  border-radius: 50%;
  background-color: black;
  color: white;
  position: relative;
  bottom: 0.3em;
  background-color: #a7461d;
}

.chord-played {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1em;
  font-weight: 900;
  font-size: 1.3em;
}

.chord-played button {
  font-family: inherit;
  width: 3rem;
  height: 1.5rem;
  border: 1px solid black;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.1em;
  font-size: 0.8em;
  font-weight: 550;
  box-shadow: -0.5px 0.5px 0.5px rgba(0,0,0,0.5);
  position: relative;
  top: 0.1em;
}

.chord-played button:hover {
  cursor: pointer;
  filter: brightness(120%);
}

.chord-played button:active {
  filter: brightness(100%);
  transform: translate(-0.5px, 0.5px);
  box-shadow: inset -0.5px 0.5px 0.5px rgba(0,0,0,0.5);
}



#play-icon {
  width: 1.6em;
  height: 1.6em;
}
</style>