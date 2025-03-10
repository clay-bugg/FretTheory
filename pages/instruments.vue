<template>
  <div class="instruments">

    <div class="instrument-container">

      <div class="instrument-selector">
        <Selector :options="['Keyboard', 'Guitar']"/>
      </div>

      <Keyboard />

    </div>
  </div>
  
</template>

<script setup>
import { ref } from 'vue';

</script>

<style scoped>
.instruments {
  width: 100%;
  height: 100vh;

}
.instrument-container {
  width: 70em;
  height: 25em;
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
  background-color: grey;
}
</style>