<template>
  <select :value="selectedOption" @change="emit('update:selectedOption', $event.target.value)">
    <option v-for="option in options" :key="option">{{ option }}</option>
  </select>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    default: () => ['Selector']
  
  },
  selectedOption: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:selectedOption']);

</script>

<style scoped>
select {
  margin-right: 3em;
  font-size: 1.1rem;
  font-family: 'Orbitron';
  border-radius: 5px;
  padding: 0.1em;
}
</style>