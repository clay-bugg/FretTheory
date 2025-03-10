<template>
  <Header class="header"/>
  <slot />
</template>

<script setup>
import { ref } from 'vue'
</script>

<style>
  .header {
    width: 100%;
  }
</style>