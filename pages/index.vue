<template>
  <div class="page">
    <NuxtLink to="instruments" class="link">Instruments</NuxtLink>
    <NuxtLink to="theory" class="link">Theory</NuxtLink>
    <NuxtLink to="tools" class="link">Tools</NuxtLink>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "no-layout",
});
</script>

<style scoped lang="scss">
.link {
  color: white;
  text-decoration: none;
}
</style>
