<template>
  <Header class="header" />
  <slot />
</template>

<script setup>
import Header from '@/components/Header.vue'
</script>

<style>
  .header {
    width: 100%;
  }
</style>