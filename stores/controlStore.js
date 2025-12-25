import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useControlStore = defineStore('control', () => {
  const selectedInstrument = ref('Keyboard')

  return {
    selectedInstrument,
  };
});