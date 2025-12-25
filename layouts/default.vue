<template>
  <Header class="header" />
  <slot />
</template>

<script setup>
import Header from '@/components/layout/Header.vue'
</script>

<style>
  .header {
    width: 100vw;
  }
</style>