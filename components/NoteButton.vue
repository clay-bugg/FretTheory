<template>
  <button class="['cirle', 'square'] "@click="buttonClick()"></button>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const emit = defineEmits(['customEvent']);

function buttonClick() { 
  emit('buttonClick');
  console.log('Button CLicked');
} 

</script>

<style scoped>
  .circle {
    width: 40px;
    height: 40px;
    background-color: grey;
    border: 4px solid black;
  }
  .square{
    width: 40px;
    height: 40px;
    background-color: grey;
    border: 4px solid black;
  }
  button:hover {
    cursor: pointer;
  }
  .square {
    border-radius: 5px;
  }
  .circle {
    border-radius: 50px;
  }
</style>