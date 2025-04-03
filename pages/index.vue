<template>
  <div id="page">
    <main>
      <img src="/images/logo.png" />
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
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const navButtons = ref([
  { label: "Instruments", link: "/instruments" },
  { label: "Tools", link: "/tools" },
  { label: "Theory", link: "/theory" },
  { label: "Practice", link: "/practice" },
]);

</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

#page {
  font-family: "Kanit", sans-serif;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
}

main {
  width: fit-content;
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-shadow: -3px 3px 6px rgba(0, 0, 0, 0.5);
  border-top: 1px solid rgba(0, 0, 0, 0.4);
  border-right: 1px solid rgba(0, 0, 0, 0.4);
  padding: 2em;
  border-radius: 20px;
}

main img {
  width: auto;
  height: 100px;
}

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
