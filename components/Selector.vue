<template>
  <select v-model="selectedOption" @change="emit('update:selectecdOption', selectedOption)">-
    <option v-for="option in options" :key="option">{{ option }}</option>
  </select>
</template>

<script setup>
const props = defineProps({
  options: {
    type: Array,
    default: () => ['Selector'] 
  }
})

const emit = defineEmits(['update:selectecdOption'])

const selectedOption = ref(props.options[0])
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