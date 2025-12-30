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
import { ref } from "vue";
import { storeToRefs } from "pinia";
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
    // Map notesDisplayed to index: 'all' = 0, 'chord' = 1, 'none' = 2
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
    background: #303030;
    color: #ebebeb;
    border: 2px solid black;
    padding: 6px;
    border-radius: 6px;
    font-size: 1rem;
    font-family: "Lexend", sans-serif;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
    transition: all 0.2s ease;
    &:hover {
      filter: brightness(1.06);
    }
    &:active {
      filter: brightness(1);
      transform: translateY(1px);
      box-shadow: none;
    }
  }

  .LED {
    width: 1em;
    height: 1em;
    border-radius: 2px;
    background: linear-gradient(
      to top right,
      #ffffff 5%,
      #bcbcbc 5%,
      #898989 60%
    );
    transition: all 0.2s ease;
    box-shadow: inset -3px 3px 6px rgba(47, 47, 47, 0.5);

    &.active {
      background: #21c400;
      box-shadow: inset -3px 3px 3px rgb(20, 122, 0, 0.5), 0 0 6px #21c400;
    }
  }
}
</style>
