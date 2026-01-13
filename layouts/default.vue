<template>
  <Header class="header" />
  <slot />
  <MusicInstructor />
</template>

<script setup>
import Header from "@/components/layout/Header.vue";
import MusicInstructor from "@/components/chat/MusicInstructor.vue";
</script>

<style>
.header {
  width: 100vw;
}
</style>
