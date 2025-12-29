<template>
  <div class="LED-switch">
    <button class="LED-switch-button" @click="changeLED">
      {{ props.label }}
    </button>
    <span
      v-for="(LED, index) in props.ledAmount"
      :key="index"
      class="LED"
      :class="{ active: index === activeIndex }"
    ></span>
  </div>
</template>

<script setup>
import { ref } from "vue";

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

const changeLED = () => {
  activeIndex.value = (activeIndex.value + 1) % props.ledAmount;
};
</script>

<style scoped>
.LED-switch {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.LED {
  width: 1em;
  height: 1em;
  border-radius: 50%;
  background-color: #444;
  border: 1px solid #666;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

.LED.active {
  background-color: #00ff88;
  box-shadow: 0 0 8px #00ff88;
}
</style>
