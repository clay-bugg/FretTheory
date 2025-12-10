import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePianoStore = defineStore('piano', () => {
    const notes = ref(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])
    const rotNote = ref('C')
    const chordType = ref('major')

    return {
      notes,
      rotNote,
      chordType,
    };
});