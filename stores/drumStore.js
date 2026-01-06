import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useDrumStore = defineStore("drumStore", () => {
  const drums = ref([
    { id: "kick", name: "Kick", key: "1", color: "#FF6B6B" },
    { id: "snare", name: "Snare", key: "2", color: "#4ECDC4" },
    { id: "hihat-closed", name: "Hi-Hat", key: "3", color: "#FFE66D" },
    { id: "hihat-open", name: "Open HH", key: "4", color: "#FFE66D" },
    { id: "tom-high", name: "Hi Tom", key: "5", color: "#95E1D3" },
    { id: "tom-mid", name: "Mid Tom", key: "6", color: "#95E1D3" },
    { id: "tom-low", name: "Floor Tom", key: "7", color: "#95E1D3" },
    { id: "crash", name: "Crash", key: "8", color: "#DDA0DD" },
    { id: "ride", name: "Ride", key: "9", color: "#F38181" },
  ]);

  const activeDrums = ref(new Set());
  const volume = ref(75);
  const selectedKit = ref("acoustic");
  const kits = ref(["acoustic", "electronic", "808"]);
  const showRipple = ref(true);
  const showGlow = ref(true);

  const getDrumById = computed(() => (id) => {
    return drums.value.find((drum) => drum.id === id);
  });

  const getDrumByKey = computed(() => (key) => {
    return drums.value.find((drum) => drum.key === key);
  });

  const isPlaying = computed(() => (id) => {
    return activeDrums.value.has(id);
  });

  function setActive(drumId) {
    activeDrums.value.add(drumId);
  }

  function setInactive(drumId) {
    activeDrums.value.delete(drumId);
  }

  function setVolume(value) {
    volume.value = Math.max(0, Math.min(100, value));
  }

  function selectKit(kit) {
    if (kits.value.includes(kit)) {
      selectedKit.value = kit;
    }
  }

  function toggleRipple() {
    showRipple.value = !showRipple.value;
  }

  function toggleGlow() {
    showGlow.value = !showGlow.value;
  }

  return {
    drums,
    activeDrums,
    volume,
    selectedKit,
    kits,
    showRipple,
    showGlow,
    getDrumById,
    getDrumByKey,
    isPlaying,
    setActive,
    setInactive,
    setVolume,
    selectKit,
    toggleRipple,
    toggleGlow,
  };
});
