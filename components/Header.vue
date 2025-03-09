<template>
  <header>
    <nav>
      <ul>
        <li><NuxtLink to="/instruments"><button :class="{ active: route.path === '/instruments' }">Instruments</button></NuxtLink></li>
        <li><NuxtLink to="/tools"><button :class="{ active: route.path === '/tools' }">Tools</button></NuxtLink></li>
      </ul>
    </nav>
    <NuxtLink to="/"><div class="heading"></div></NuxtLink>
    <nav>
      <ul>
        <li><NuxtLink to="/practice"><button :class="{ active: route.path === '/practice' }">Practice</button></NuxtLink></li>
        <li><NuxtLink to="/theory"><button :class="{ active: route.path === '/theory' }">Theory</button></NuxtLink></li>
      </ul> 
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue';
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
}

header::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  background-color: rgb(0,0,0);
  height: 10px;
  z-index: 0;
}

.heading {
  width: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('/images/Header.png');
  background-position: center;
  background-size: cover;
  height:100px;
  position: relative;
  z-index: 1;
}
.heading:hover {
  cursor: pointer;
}


h1 {
  font-size: 3rem;
  color: black;
  margin: 0;
}

nav ul {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: fit-content;
  list-style: none
}
</style>