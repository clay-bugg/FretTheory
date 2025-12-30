<template>
  <div class="LED-switch">
    <button class="LED-switch-button" @click="changeLED(props.label)">
      {{ props.label }}
    </button>
    <div class="LED-container">
    <span
      v-for="(LED, index) in props.ledAmount"
      :key="index"
      class="LED"
      :class="{ active: index === activeIndex }"
    ></span>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useKeyboardStore } from "~/stores/keyboardStore";

const { changeLabels, changePitch } = useKeyboardStore();
const { activeLEDIndex } = storeToRefs(useKeyboardStore());

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

const activeIndex = ref(0);

const changeLED = (label) => {
  activeIndex.value = (activeIndex.value + 1) % props.ledAmount;

  if (label === "LABELS") {
    const index = activeIndex.value;
    changeLabels(index);
  }

  if (label === "PITCH") {
    const index = activeIndex.value;
    changePitch(index);
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
    font-family: 'Lexend', sans-serif;
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
