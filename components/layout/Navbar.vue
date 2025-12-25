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
const navButtons = ref([
  { label: "Instruments", link: "/instruments" },
  { label: "Tools", link: "/tools" },
  { label: "Theory", link: "/theory" },
  { label: "Practice", link: "/practice" },
])
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border: none;
  background: none;
  width: 100%;
  gap: 1em;
}
.button {
  appearance: none;
  border: 4px solid black;
  background: url("public/images/backgrounds/nav-button-texture.png");
  border-radius: 10px;
  color: white;
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Orbitron";
  text-decoration: none;
  font-weight: 280;
  height: 1.3em;
  width: 8em;
  padding: 1em;
}
.button:focus {
  appearance: none;
}
.button:hover {
  cursor: pointer;
  transform: scale(1.01);
  text-shadow: 0 0 1px rgb(233, 233, 233);
  text-decoration: none;
}
.button:active {
  transform: scale(1);
  text-shadow: 0 0 1px rgb(233, 233, 233);
}
</style>
