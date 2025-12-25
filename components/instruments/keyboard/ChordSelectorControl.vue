<template>
  <div class="chord-selector-box control">
    <p class="control-label">Chord</p>
    <div class="chord-selector-inputs">
      <select
        class="root-note-selector"
        :value="rootNote"
        @change="$emit('update:rootNote', $event.target.value)"
      >
        <option v-for="note in notes" :key="note" :value="note">
          {{ note }}
        </option>
      </select>

      <select
        class="chord-type-selector"
        :value="chordType"
        @change="$emit('update:chordType', $event.target.value)"
      >
        <option
          v-for="type in chordTypes"
          :key="type.value"
          :value="type.value"
        >
          {{ type.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
defineProps({
  rootNote: {
    type: String,
    required: true,
  },
  chordType: {
    type: String,
    required: true,
  },
  notes: {
    type: Array,
    required: true,
  },
  chordTypes: {
    type: Array,
    required: true,
  },
});

defineEmits(["update:rootNote", "update:chordType"]);
</script>

<style scoped>
.chord-selector-box select {
  font-size: 1em;
  font-family: inherit;
  border: 2px solid black;
  border-radius: 0.3em;
  text-align: center;
  font-weight: 500;
  padding: 0.1em;
}
.chord-selector-inputs {
  display: flex;
  align-items: center;
  justify-content: center;
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
