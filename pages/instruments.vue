<template>
  <div class="instruments">

    <div class="instrument-container">

      <div class="instrument-selector">
        <Selector v-model:selectedOption="selectedOption" :options="['Keyboard', 'Guitar']" />
      </div>

      <Keyboard v-if="selectedOption === 'Keyboard'" />
      <Guitar v-if="selectedOption === 'Guitar'" />
      <p v-else="Instrumnent"></p>

    </div>
  </div>
  
</template>

<script setup>
import { ref } from 'vue';

const selectedOption = ref('')
</script>

<style scoped>
.instruments {
  width: 100%;
  height: 100vh;

}
.instrument-container {
  width: 75em;
  height: 35em;
  margin: 0 auto;
  margin-top: 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.instrument-selector {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
}
</style>