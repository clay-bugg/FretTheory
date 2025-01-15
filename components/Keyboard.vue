<template>
  <div id="component">

    <label for="keys-input">Keys</label>

    <input id="keys-input"
           v-model="keysAmount"
           type="range"
           step="1"
           min="7"
           max="21" />
    <span id="keys-display">{{ keysAmount }}</span>

    <div id="keyboard">
      <div v-for="(key, index) in keys"
           :key="index"
           class="key"
           @mousedown="playNote(noteNames[index])">
        {{ noteNames[index] }}
      </div>

    </div>
  </div>
</template>

<script>
import { Howl } from 'howler';

export default {
  data() {
    return {
      keysAmount: 7,
      noteNames: ['C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2', 'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4',],
    };
  },
  computed: {
    keys() {
      return this.keysArray(this.keysAmount);
    },
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
  border: 1px solid rgba(0, 0, 0, 0.111);
  display: flex;
  margin-bottom: 1em;
}

.key {
  width: 4em;
  border: 1px solid black;
  background-color: white;
}

.key:hover {
  cursor: pointer;
  filter: brightness(95%);
}
</style>