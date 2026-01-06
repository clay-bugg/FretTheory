<template>
  <div class="scale-type">
    <p class="current-scale">{{ currentScale }}</p>
    <br />
    <p class="scale-info">{{ currentScaleInfo }}</p>
  </div>
</template>

<script setup>
const { currentScale, currentScaleInfo } = storeToRefs(useControlStore());
</script>

<style scoped lang="scss">
.scale-type {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  width: 300px;
  text-align: center;

  .current-scale {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.4rem;
    font-weight: bold;
  }
}
</style>
