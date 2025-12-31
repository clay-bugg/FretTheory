<template>
  <div class="scale-type">
    {{ currentScale }}
    {{ currentScaleInfo }}
  </div>
</template>

<script setup>

const { currentScale, currentScaleInfo } = storeToRefs(useControlStore())

</script>

<style scoped lang="scss">

.scale-type {
 display: flex;
 flex-direction: column;
 align-items: center;
 justify-content: center;
 width: 200px;
 height: 160px;
 border: 1px solid black;
 border-radius: 10px;
}

</style>
