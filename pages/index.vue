<template>
  <div class="page">
    <main>
      <img src="/images/logo.png" />
      <Navbar />
    </main>
  </div>
</template>

<script setup>
import Navbar from '@/components/layout/Navbar.vue'

definePageMeta({
  layout: 'no-layout'
})

</script>

<style>
  
main {
  width: 50em;
  height: fit-content;
  display: flex;
  justify-content: center;
  gap: 1em;
  align-items: center;
  flex-direction: column;
  box-shadow: -3px 3px 6px rgba(0, 0, 0, 0.5);
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  border-right: 1px solid rgba(0, 0, 0, 0.2);
  padding: 2em;
  border-radius: 20px;
}

main img {
  width: 100%;
  height: auto;
}

</style>
