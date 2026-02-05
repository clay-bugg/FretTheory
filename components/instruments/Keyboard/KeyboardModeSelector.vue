<template>
  <div class="chord-selector">
    <div class="dropdown">
      <div class="keyboard-type-buttons">
        <button
          v-for="button in buttons"
          :key="button.name"
          class="keyboard-type-button"
          :class="{ active: keyboardType === button.name }"
          @click="keyboardType = button.name"
        >
          <img
            :src="`/images/buttons/${button.name}.png`"
            :style="button.style"
          />
        </button>

        <div v-if="keyboardType === 'MIDI' && midi" class="midi-status">
          <template v-if="!midi.isSupported?.value">
            <span class="midi-error">⚠️ Not supported</span>
          </template>

          <template v-else-if="!midi.isConnected?.value">
            <button class="connect-btn" @click="midi.connect()">Connect</button>
            <span v-if="midi.error?.value" class="midi-error">{{
              midi.error.value
            }}</span>
          </template>

          <template v-else>
            <span class="midi-device">{{
              midi.currentDevice?.value?.name
            }}</span>
            <span class="midi-indicator">●</span>
          </template>
        </div>
      </div>
    </div>

    <div class="chord">
      <h3>{{ selectedChord }}</h3>
    </div>
  </div>

  <div class="chord-types"></div>
</template>

<script setup>
import { useKeyboardStore } from "~/stores/keyboardStore";

const store = useControlStore();
const keyboardStore = useKeyboardStore();

const { keyboardType } = storeToRefs(store);
const { rootNote, chordType } = storeToRefs(keyboardStore);

const selectedChord = computed(() => {
  if (!rootNote.value) return "Select a Chord";
  return `${rootNote.value} ${chordType.value}`;
});

defineProps({
  midi: {
    type: Object,
    default: null,
  },
});

const buttons = ref([
  {
    name: "player",
    style: { width: "30px", height: "26px" },
  },
  {
    name: "finder",
    style: { width: "100%", height: "auto" },
  },
  {
    name: "MIDI",
    style: { width: "100%", height: "auto" },
  },
]);
</script>

<style scoped lang="scss">
@use "~/assets/scss/main.scss" as *;

.dropdown {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: fit-content;
  gap: 0.3em;

  .keyboard-type-buttons {
    display: flex;
    width: fit-content;
    min-width: fit-content;
    align-items: center;
    justify-content: space-between;
    gap: 0.2em;

    .keyboard-type-button {
      min-width: 40px;
      min-height: 40px;
      width: 40px;
      height: 40px;
      background: #242424;
      border-radius: 4px;
      border: 3px solid black;
      padding: 0.5em 0;
      color: white;
      cursor: pointer;
      transition: all 0.1s ease;
      white-space: nowrap;
      text-wrap: nowrap;

      &:hover {
        background-color: #333333;
        filter: brightness(1.1);
      }
      &:active {
        transform: translateY(1px);
        filter: brightness(0.9);
      }
      &.active {
        background: #151515;
        color: #0e0e0e;
        font-weight: 700;
        border-color: #000000;

        &:hover {
          filter: brightness(1.05);
        }
      }
    }
  }
}

.midi-status {
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0 0.5em;
  font-family: "Lexend";
  font-size: 0.85rem;
}

.midi-error {
  color: #ff6b6b;
  white-space: nowrap;
}

.connect-btn {
  padding: 0.4em 0.8em;
  background: linear-gradient(180deg, #3a3a3a 0%, #252525 100%);
  border: 2px solid #444;
  border-radius: 6px;
  color: #fff;
  font-family: "Lexend";
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: linear-gradient(180deg, #4a4a4a 0%, #353535 100%);
    border-color: #555;
  }

  &:active {
    transform: translateY(1px);
  }
}

.midi-device {
  color: #aaa;
  white-space: nowrap;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.midi-indicator {
  color: #4ade80;
  font-size: 1rem;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
</style>
