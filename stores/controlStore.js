import { defineStore } from "pinia";
import { ref } from "vue";

export const useControlStore = defineStore("control", () => {
  const selectedInstrument = ref("Keyboard");
  const currentScale = ref("Major Scale");
  const currentScaleInfo = ref("Major Scale (Ionian) The standard \"happy\" and stable sound of Western music. Defined by the Major 7th, which pulls strongly back to home.");
  const menuOpen = ref(false);

  return {
    selectedInstrument,
    currentScale,
    menuOpen,
    currentScaleInfo,
  };
});
