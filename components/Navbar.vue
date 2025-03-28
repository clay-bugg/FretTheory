<template>
  <nav>
    <ul>
      <li v-for="item in listItems" :key="item">
         <NuxtLink :to="item.link" class="button" :class="{ active: currentRoute.path === item.link }"><p>{{ item.name }}</p></NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from '#vue-router'

const route = useRoute();
const currentRoute = route;
const listItems = ref([
  { name: 'Instruments', link: '/instruments'},
  { name: 'Tools', link: '/tools'},
  { name: 'Practice', link: '/practice'},
  { name: 'Theory', link: '/theory'},
])
</script> 

<style scoped>
ul {
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  gap: 2.5em;
  width: 100%;
  position: relative;
  right: 2.4em;
}
.button {
  border: 1px solid black;
  padding: 0.3em 1em;
  font-size: 1.6em;
  border-radius: 15px;
  width: 4.5em;
  height: 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('images/textures/nav-button-texture.png');
  color: white;
  text-decoration: none;
}
.button:hover {
  cursor: pointer;
  background-color: rgb(245, 245, 245);
}
.button:active {
  background-color: rgb(226, 226, 226);
}
.button:visited {
  color: white;
}
</style>