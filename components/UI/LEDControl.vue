<template>
  <div class="LED-switch">
    <button class="LED-switch-button" @click="changeLED(props.label)">
      {{ props.label }}
    </button>
    <div class="LED-container">
      <span
        v-for="index in props.ledAmount"
        :key="index"
        class="LED"
        :class="{ active: index === activeIndex + 1 }"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { useKeyboardStore } from "~/stores/keyboardStore";

const store = useKeyboardStore();
const { currentPitch, notesDisplayed } = storeToRefs(store);

const props = defineProps({
  ledAmount: {
    type: Number,
    default: 3,
  },
  label: {
    type: String,
    default: "label",
  },
});

// Compute activeIndex based on which control this is
const activeIndex = computed(() => {
  if (props.label === "PITCH") {
    return currentPitch.value;
  } else if (props.label === "LABELS") {

    const labelMap = { all: 0, chord: 1, none: 2 };
    return labelMap[notesDisplayed.value] ?? 0;

  }
  return 0;
});

const changeLED = (label) => {
  const nextIndex = (activeIndex.value + 1) % props.ledAmount;

  if (label === "LABELS") {
    store.changeLabels(nextIndex);
  }

  if (label === "PITCH") {
    currentPitch.value = nextIndex;
  }
};
</script>

<style scoped lang="scss">
@use "~/assets/scss/main";

.LED-switch {
  display: flex;
  align-items: center;
  gap: 1em;

  .LED-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8em;
  }

  .LED-switch-button {
    border: 2px solid black;
    border-radius: 6px;
    padding: 6px;
    background: #242424;
    color: white;
    font-family: "Lexend", sans-serif;
    font-size: 1rem;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px black;

    &:hover {
      filter: brightness(1.06);
    }

    &:active {
      box-shadow: none;
      filter: brightness(1);
      transform: translateY(1px);
    }
  }

  .LED {
    width: 1em;
    height: 1em;
    border-radius: 2px;
    background: linear-gradient(
      to top right,
      #4a4a4a,
      #494949,
      #343434,
    );
    transition: all 0.2s ease;
    box-shadow: inset -2px 2px 2px rgba(0,0,0,0.7);

    &.active {
      filter: brightness(1.1);
      box-shadow: inset -3px 3px 3px rgba(0, 0, 0, 0.426),
        0 0 4px #21C400;
      background: linear-gradient(
        to top right,
        #21C400,
        #168400,
        #147700,
      );
    }
  }
}
</style>
