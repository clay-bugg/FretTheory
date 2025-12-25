<template>
  <div class="starting-octave control">
    <p class="control-label">Octave Range</p>
    <div class="starting-octave-selector">
      <button class="starting-octave-button" @click="changeOctave('-')">
        -
      </button>
      <p v-if="octaveAmount === '1'">{{ startingOctave }}</p>
      <p v-else-if="octaveAmount === '2'">
        {{ startingOctave }}-{{ startingOctave + 1 }}
      </p>
      <p v-else-if="octaveAmount === '3'">
        {{ startingOctave }}-{{ startingOctave + 2 }}
      </p>
      <button class="starting-octave-button" @click="changeOctave('+')">
        +
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  startingOctave: {
    type: Number,
    required: true,
  },
  octaveAmount: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:startingOctave"]);

function changeOctave(op) {
  if (op === "+") {
    if (props.startingOctave < 6) {
      emit("update:startingOctave", props.startingOctave + 1);
    }
  } else if (op === "-") {
    if (props.startingOctave > 1) {
      emit("update:startingOctave", props.startingOctave - 1);
    }
  }
}
</script>

<style scoped>
.starting-octave-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: fit-content;
  gap: 0.4em;
  font-size: 1.2rem;
  font-weight: 700;
}
.starting-octave-button {
  width: 25px;
  height: 25px;
}
.control {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  gap: 0.5em;
  padding: 0.5em 0;
}
.control-label {
  font-size: 1rem;
  text-align: center;
  text-wrap: nowrap;
}
</style>
