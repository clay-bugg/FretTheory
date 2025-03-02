<template>
  <div 
    v-for="(card, index) in cards" 
    :key="index" 
    id="card-options"
  >
    <NuxtLink :to="card.to">
      <img 
        :src="card.src" 
        :alt="card.alt" 
      />
    </NuxtLink>
  </div>
</template>

<script setup>
defineProps({
  cards: {
    type: Array,
    required: true
  }
});
</script>

<style scoped>
img {
  width: 15em;
  height: 15em;
  min-width: 300px;
  min-height: 300px;
}

img:hover {
  cursor: pointer;
  transform: scale(1.010);
  transition: transform 0.1s ease-in-out;
}

img:active {
  transform: scale(1);
  transition: transform 0.1s ease-in-out;
}

p {
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  width: 100%;
  text-align: center;
  padding: 10px 0;
  position: relative;
  top: 16px;
}

#card-options {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1em;
  margin: 1em auto;
  width: fit-content;
}
</style>