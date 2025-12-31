import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useControlStore = defineStore('control', () => {
  const selectedInstrument = ref('Keyboard')
  const currentScale = ref('Major Scale')

  return {
    selectedInstrument,
  };
});