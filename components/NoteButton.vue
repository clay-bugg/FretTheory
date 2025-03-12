<template>
  <label></label>
  <button :class="{ on: isOn }"  @click="toggleButton">
    <div class="inner-button">

    </div>
  </button>
</template>

<script setup>
import { defineProps } from 'vue';

const isOn = false;

function toggleButton() { 
  props.isOn = !props.isOn;
}
</script>

<style scoped>
button {
  width: 50px;
  height: 50px;
  background-color: rgb(255, 0, 0);
  border-radius: 50px;
  border: 5px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  appearance: none;
  padding: 0;
  }
button:hover {
  cursor: pointer;
  transform: scale(1.04) 
}
button:active {
  transform: scale(1)
}
.button-inner {
  height: 30px;
  width: 30px;
  background-color: grey;
}
.on {
    
}
</style>