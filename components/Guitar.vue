<template>
  <div id="page">
    <h3>{{ header }}</h3>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const header = ref('guitar');
</script>

<style scoped>
#page {
  width: fit-content;
  height: fit-content;
  font-size: 2em;
}
</style>