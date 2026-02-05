<template>
  <Header class="header" />
  <slot />
  <MusicInstructor />
  <RotateDevicePrompt />
</template>

<script setup>
import Header from "@/components/layout/Header.vue";
import MusicInstructor from "@/components/chat/MusicInstructor.vue";
import RotateDevicePrompt from "@/components/RotateDevicePrompt.vue";
</script>

<style>
.header {
  width: 100vw;
}
</style>
