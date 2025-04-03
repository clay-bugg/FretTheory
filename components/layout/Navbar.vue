<template>
  <nav>
    <NuxtLink
      v-for="(button, index) in navButtons"
      :key="index"
      :to="button.link"
      class="button"
    >
      {{ button.label }}
  </NuxtLink>
  </nav>
</template>

<script setup>
import { ref } from 'vue';

const navButtons = ref([
  { label: "Instruments", link: "/instruments" },
  { label: "Tools", link: "/tools" },
  { label: "Theory", link: "/theory" },
  { label: "Practice", link: "/practice" },
]);
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 4em;
  border: none;
  background: none;
  width: 100%;
}
.button {
  color: black;
  border: none;
  background: none;
  font-size: 1.4em;
  text-shadow: 0 0 1px black;
  text-decoration: none;
}
.button:hover {
  cursor: pointer;
  transform: scale(1.02);
}
.button:active {
  transform: scale(1);
}
.button:visited {
  color: black;
}
</style>
