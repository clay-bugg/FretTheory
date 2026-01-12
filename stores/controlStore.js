import { defineStore } from "pinia";
import { ref } from "vue";

export const useControlStore = defineStore("control", () => {
  const selectedInstrument = ref("Keyboard");
  const currentScale = ref("Major Scale (Ionian)");
  const currentScaleInfo = ref(
    'The standard "happy" and stable sound of Western music. Defined by the Major 7th, which pulls strongly back to home.'
  );
  const menuOpen = ref(false);
  const keyboardType = ref("player");

  return {
    selectedInstrument,
    currentScale,
    menuOpen,
    currentScaleInfo,
    keyboardType,
  };
});
