<template>
  <div class="LED-switch">
    <div class="control-box">
      <span class="control-label">{{ props.label }}</span>
      <div class="arrow-buttons">
        <button class="arrow-btn" @click="decrementLED" aria-label="Previous">
          <span class="arrow-icon">◀</span>
        </button>
        <button class="arrow-btn" @click="incrementLED" aria-label="Next">
          <span class="arrow-icon">▶</span>
        </button>
      </div>
    </div>
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

const updateLED = (newIndex) => {
  if (props.label === "LABELS") {
    store.changeLabels(newIndex);
  }

  if (props.label === "PITCH") {
    currentPitch.value = newIndex;
  }
};

const incrementLED = () => {
  const nextIndex = (activeIndex.value + 1) % props.ledAmount;
  updateLED(nextIndex);
};

const decrementLED = () => {
  const nextIndex = (activeIndex.value - 1 + props.ledAmount) % props.ledAmount;
  updateLED(nextIndex);
};
</script>

<style scoped lang="scss">
@use "~/assets/scss/main";

.LED-switch {
  display: flex;
  align-items: center;
  gap: 1.5em;

  .control-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 12px;

    .control-label {
      color: #e0e0e0;
      font-family: "Lexend", sans-serif;
      font-size: 1.1rem;
      font-weight: 500;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }

    .arrow-buttons {
      display: flex;
      gap: 4px;

      .arrow-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 26px;
        background: linear-gradient(to bottom, #3a3a3a, #2a2a2a);
        border: 1px solid #1a1a1a;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.15s ease;
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          0 1px 2px rgba(0, 0, 0, 0.4);

        .arrow-icon {
          color: #888;
          font-size: 0.65rem;
          line-height: 1;
        }

        &:hover {
          background: linear-gradient(to bottom, #454545, #353535);
          .arrow-icon {
            color: #aaa;
          }
        }

        &:active {
          background: linear-gradient(to bottom, #252525, #2a2a2a);
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.4);
          transform: translateY(1px);
        }
      }
    }
  }

  .LED-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .LED {
    width: 22px;
    height: 22px;
    border-radius: 3px;
    background: linear-gradient(135deg, #4a4a4a 0%, #3a3a3a 50%, #2a2a2a 100%);
    transition: all 0.15s ease;
    border: 1px solid #1a1a1a;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.08),
      inset 0 -2px 4px rgba(0, 0, 0, 0.3),
      0 1px 2px rgba(0, 0, 0, 0.4);

    &.active {
      background: linear-gradient(
        135deg,
        #4ade2a 0%,
        #22c400 40%,
        #189000 100%
      );
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.3),
        inset 0 -2px 4px rgba(0, 0, 0, 0.2),
        0 0 8px rgba(34, 196, 0, 0.6),
        0 0 16px rgba(34, 196, 0, 0.3);
    }
  }
}
</style>
