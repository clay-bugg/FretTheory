<template>
  <div class="button">
    <div class="outer-button"> 
      <div class="inner-button">
        
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue';

const isOn = ref(false);

function toggleButton() { 
  isOn.value = !isOn.value;
}

</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
.button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  background-color: #000000;
  border-radius: 10px;
}
.inner-button {
  width: 30px;
  height: 30px;
  background-color: #5c5c5c;
  border-radius: 5px;
}
.outer-button {
  width: 20px;
  height: 20px;
  background-color: #ebebeb;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
}
</style>