<template>
  <header>
    <div id="left-header-line"></div>
    <div id="right-header-line"></div>
    <nav>
      <ul>
        <li><NuxtLink to="/instruments" class="button" :class="{ active: route.path === '/instruments' }"><p>Instruments</p></NuxtLink></li>
        <li><NuxtLink to="/tools" class="button" :class="{ active: route.path === '/tools' }"> <p>Tools</p></NuxtLink></li>
        <li><NuxtLink to="/" class="logo"><img src="/images/logo.png"></NuxtLink></li> 
        <li><NuxtLink to="/practice" class="button" :class="{ active: route.path === '/practice' }" ><p>Practice</p></NuxtLink></li>
        <li><NuxtLink to="/theory" class="button" :class="{ active: route.path === '/theory' }"><p>Theory</p></NuxtLink></li>
      </ul> 
    </nav>
  </header>
</template>

<script setup>
import { useRoute } from '#imports';

const route = useRoute();
</script>

<style scoped>
header {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-bottom: 1px solid black;
  position: relative;
  z-index: 1;
  font-family: 'Orbitron';
  font-size: 1rem;
  box-shadow: 0 4px 15px black;
  background-color: rgb(245, 245, 245);
  min-width: fit-content;
}
.heading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  position: relative;
  z-index: 1;
  height: auto;
}
.heading:hover {
  cursor: pointer;
}
header img {
  width: auto;
  height: 5em;;
  z-index: 2;
}
.logo {
  z-index: 2;
}
h1 {
  font-size: 3rem;
  color: black;
  margin: 0;
}
nav {
  display: flex;
  justify-content: center;
  width: 100%;;
  align-items: center;
}
nav ul {
  display: flex;
  align-items: center;
  list-style: none;
  width: 100%;
  justify-content: space-evenly;
  padding: 0;
}
.button {
  appearance: none;
  border: 4px solid black;
  background: url('public/images/backgrounds/nav-button-texture.png');
  border-radius: 10px;
  color: white;
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Orbitron';
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

nav {
  z-index: 2;
}
</style>