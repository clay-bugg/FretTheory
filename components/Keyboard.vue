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
        
        <Icon id="settings-button" name="mingcute:settings-6-line" @click="toggleSettings()"/>
    
      </div>

    </div>

    <div class="keyboard">

      <div v-for="(key,index) in keysDisplayed"
        :key="`${key.note}${key.octave}`"
        :class="[
          'key',
          {
            'black': key.sharp,
            'white': !key.sharp,
            'highlighted-note': chordNotes.includes(key.note),
            'root-note': key.note === rootNote
          }]"  
        @mousedown="onMouseDown(key)"
        @mouseenter="onMouseEnter(key)"
        @mouseup="onMouseUp" 
      >   
          <span v-if="notesDisplayed">{{ key.note }}</span>
          <span v-if="chordNotes.includes(key.note)" class="interval" :id="`interval-${chordNotes.indexOf(key.note) + 1}`">
            {{ chordNotes.indexOf(key.note) + 1 }}
          </span>
          

      </div>

    </div>

    <div class="chord-played" v-if="rootNote && chordType">
      <label for="chord-notes">{{ rootNote }}{{ chordType }}</label>
      <p v-for="(note, index) in chordNotes" :key="index" class="chord-note ":id="`chord-note-${index + 1}`">
        <span>{{ note }}<br>{{ index + 1 }}</span>
      </p>
      <button @click="playChord(chordNotes)" id="play-button">Play<Icon name="line-md:play-filled" id="play-icon" /></button>
    </div>

    <div class="settings-panel" v-if="settingsOpened">

      <header>
        <h3>Settings</h3>
        <Icon name="qlementine-icons:close-16" id="settings-close" @click="toggleSettings()" />
      </header>

      <div id="settings-body">
        <ul>
          <li>
            <p>Display Key Notes: </p>
            <input type="checkbox" v-model="notesDisplayed"/>
          </li>
          <li>
            <p>Arpeggiate Chord: </p>
            <input type="checkbox" v-model="arpeggiated">
          </li>
          <li>
            <p>Arpeggio Delay: </p>
            <input type="number" v-model="arpeggioDelay"/>
            </li>
        </ul>
      </div>

    </div>
  </div>

</template>

<script>
import { Howl } from 'howler';

export default {
  data() { 
    return {
      pianoKeys: this.generateKeys(),
      numberOfKeys: 24,
      rootNotes: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
      rootNote: '',
      chordTypes: [
        { label: 'Major', value: 'maj' },
        { label: 'Major 6th', value: 'maj6' },
        { label: 'Major 6/9', value: '6/9' },
        { label: 'Major 7th', value: 'maj7' },
        { label: 'Major 9th', value: 'maj9' },
        { label: 'Major 11th', value: 'maj11' },
        { label: 'Major 13th', value: 'maj13'},
        { label: 'Minor', value: 'm' },
        { label: 'Minor 7th', value: 'm7' },
        { label: 'Dominant 7th', value: '7' },
        { label: 'Diminished', value: '°' },
        { label: 'Augmented', value: '+' },
      ],
      chordType: '',
      chordNotes: [],
      activeChordNotes: [],
      chordIntervals: {
        'maj': [0, 4, 7],
        'maj6': [0, 4, 7, 9],
        '6/9': [0, 4, 7, 9, 14],
        'maj7': [0, 4, 7, 11],
        'maj9': [0, 4, 7, 11, 14],
        'maj11': [0, 4, 7, 11, 14, 17],
        'maj13': [0, 4, 7, 11, 14, 17, 21],
        'm': [0, 3, 7],
        '+': [0, 4, 8],
        '°': [0, 3, 6],
        '7': [0, 4, 7, 10],
        'm7': [0, 3, 7, 10],
        
      },
      soundsCache: {},
      isMouseDown: false,
      settingsOpened: false,
      notesDisplayed: false,
      arpeggiated: false,
      arpeggioDelay: 70, 
    }
  },
  computed: {
    keysDisplayed() { 
      return this.pianoKeys.slice(0, this.numberOfKeys);
    }
  },
  watch: {
    rootNote(newVal) { 
      console.log(`Root note changed to ${newVal}`);
      this.updateChord();
    },
    chordType(newVal) { 
      console.log(`Chord type changed to ${newVal}`);
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
    updateChord() {
      if (!this.rootNote || !this.chordType) return;

      const intervals = this.chordIntervals[this.chordType] || [];
      const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      const rootIndex = notes.indexOf(this.rootNote);

      this.chordNotes = intervals.map((interval) => {
        return notes[(rootIndex + interval) % 12];
      });

      this.chordNotes = Array.from(new Set(this.chordNotes));
      console.log(`Chord changed to ${this.rootNote}${this.chordType}`);
    },
    assignChordOctaves(rootNote, chordNotes, baseOctave = 3) {
      const noteOrder = this.rootNotes;
      let currentOctave = baseOctave;
      let lastNoteIndex = noteOrder.indexOf(rootNote);
      let chordWithOctaves = [];

      chordNotes.forEach((note) => {
        let noteIndex = noteOrder.indexOf(note);

        if (noteIndex <= lastNoteIndex) {
          currentOctave++;
        }

        chordWithOctaves.push(`${note}${currentOctave}`);
        lastNoteIndex = noteIndex;
      });

      return chordWithOctaves
    },
    onMouseDown(key) {
      this.isMouseDown = true;
      console.log(this.isMouseDown)
      this.playKey(key.note, key.octave);
    },
    onMouseEnter(key) {
      if (this.isMouseDown) {
        this.playKey(key.note, key.octave);
      }
    },
    onMouseUp() {
      console.log(this.isMouseDown)
      this.isMouseDown = false;
    },
    playKey(note, octave) {
      const encodedNote = encodeURIComponent(note);
      const sound = new Howl({
        src: [`/sounds/keyboard_samples/${encodedNote}${octave}.mp3`]
      });
      console.log(`${note}${octave} note played.`)
      sound.play();

      setTimeout(() => {
        sound.stop();
      }, 7000);
    },
    playChord(notes) {
      if (!this.rootNote || !this.chordType) return;

      const chordNotesWithOctaves = this.assignChordOctaves(this.rootNote, notes);

      const playingSounds = chordNotesWithOctaves.map((fullNote) => {
        if (!this.soundsCache[fullNote]) {
          this.soundsCache[fullNote] = new Howl({
            src: [`/sounds/keyboard_samples/${encodeURIComponent(fullNote)}.mp3`],
            preload: true
          });
        }
        return { sound: this.soundsCache[fullNote] };
      });

      if (this.activeChordNotes.length) {
        this.activeChordNotes.forEach(({ sound }) => sound.stop());
      }

      const delay = this.arpeggiated ? this.arpeggioDelay : 20;

      playingSounds.forEach(({ sound }, index) => {
        setTimeout(() => {
          sound.seek(0);
          sound.play();
        }, index * delay);
      });

      this.activeChordNotes = playingSounds;

    },
    toggleSettings() {
      this.settingsOpened = !this.settingsOpened;
    },
    displayNotes() { 
      this.notesDisplayed = !this.notesDisplayed;
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
  width: fit-content;
  position: relative;
}
.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 57em;
  position: relative;
  padding-left: 0.7em;
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
#settings-button {
  display: inline-block;
  width: 2em;
  height: 2em;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23fff' d='M16 15c1.306 0 2.418.835 2.83 2H20a1 1 0 1 1 0 2h-1.17a3.001 3.001 0 0 1-5.66 0H4a1 1 0 1 1 0-2h9.17A3 3 0 0 1 16 15m0 2a1 1 0 1 0 0 2a1 1 0 0 0 0-2M8 9a3 3 0 0 1 2.762 1.828l.067.172H20a1 1 0 0 1 .117 1.993L20 13h-9.17a3.001 3.001 0 0 1-5.592.172L5.17 13H4a1 1 0 0 1-.117-1.993L4 11h1.17A3 3 0 0 1 8 9m0 2a1 1 0 1 0 0 2a1 1 0 0 0 0-2m8-8c1.306 0 2.418.835 2.83 2H20a1 1 0 1 1 0 2h-1.17a3.001 3.001 0 0 1-5.66 0H4a1 1 0 0 1 0-2h9.17A3 3 0 0 1 16 3m0 2a1 1 0 1 0 0 2a1 1 0 0 0 0-2' stroke-width='1' stroke='%23000'/%3E%3C/g%3E%3C/svg%3E");
}
#settings-button:hover {
  cursor: pointer;
}
.settings-panel {
  width: 20em;
  height: 20em;
  border: 1px solid black;
  background-color: #f2f2f2;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  border-radius: 10px;
  
}
.settings-panel header {
  height: 1.5em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1em 0.5em;
  background-color: #cecece;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  font-size: 1.2em;
}
.settings-panel ul {
  font-size: 1.2em;
}
.settings-panel input[type="number"] {
  border: 1px solid black;
  border-radius: 4px;
  font-size: 1;
  width: 4.5em;
  padding: 0.1em;
}
#settings-body {
  padding: 0.5em 0.8em;
}
#settings-close:hover {
  cursor: pointer;
}
#settings-body li {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5em;
  margin: 0.5em;
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
  gap: 0.1em;
}
.key:hover {
  cursor: pointer;
  filter: brightness(95%);
}
.white {
  width: 4em;
  background-color: white;
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
.interval {
  width: 100%;
  height: 1.2em;
  display: flex;
  align-items: center ;
  justify-content: center;
  border-top: 2px solid black;
  color: black;
  font-weight: 500;
  color: black;
  font-size: 1.1em;
}
.chord-note {
  color: black(255, 255, 255);
}
.chord-note span {
  position: relative;
  top: 0.8em;
}
.note-name {
  font-size: 0.8em;
  color: white;
  border: 1px solid rgb(181, 101, 101);
  width: 1em;
  height: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1em;
  background-color: black;

}
.black .note-name {
  background-color: white;
  border-radius: 50px;
  color: black;
  position: relative;
  bottom: 0.2em;
}
.white .note-name {
  border-radius: 50px;  
}
#interval-1,
#chord-note-1 {
  background-color: #bb4343;
}
#interval-2,
#chord-note-2 {
  background-color: #c75d11;
}
#interval-3,
#chord-note-3 {
  background-color: #bea815;
}
#interval-4,
#chord-note-4 {
  background-color: #54a034;
}
#interval-5,
#chord-note-5 {
  background-color: #259f8e;
  color: rgb(0, 0, 0);
}
#interval-6,
#chord-note-6 {
  background-color: #4960c4;
  color: black;
}
#interval-7,
#chord-note-7 {
  background-color: #ca71b9;
  color: black
}
.chord-played {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1em;
  font-size: 1.2em;
  font-weight: 600;
  position: relative;
  padding-right: 3em;
}
.chord-note {
  width: 2em;
  height: 1.2em;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  font-weight: 400;
}
 #play-button {
  font-family: inherit;
  width: 4rem;
  height: 1.6rem;
  border: 1px solid black;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.5em;
  font-weight: 300;
  box-shadow: -0.7px 0.7px 0.7px rgba(0,0,0,0.5);
  padding: 0 0.8em;
}
#play-button:hover {
  cursor: pointer;
  filter: brightness(120%);
}
#play-button:active {
  filter: brightness(100%);
  transform: translate(-0.7px, 0.7px);
  box-shadow: inset -0.7px 0.7px 0.7px rgba(0,0,0,0.5);
}
label[for="arpeggiate-notes"] {
  font-weight: 300;
}
#play-icon {
  height: 3em;
  width: 3em;
  position: relative;
  top: 0.1em;
}

</style>