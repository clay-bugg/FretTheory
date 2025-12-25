import { defineStore } from 'pinia';
import { ref } from 'vue';

export const instrumentStore = defineStore('instrument', () => {
    const notes = ref(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])
    const roteNote = ref('C')
    const chordType = ref('major')

    return {
      notes,
      roteNote,
      chordType,
    };
});