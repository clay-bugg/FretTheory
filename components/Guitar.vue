<template>
  <div id="page">
    <h3>{{ header }}</h3>
  </div>
</template>

<script>
export default {
    data() {
      return {
        header: 'guitar',
      }
    }
  }
</script>

<style scoped>
  #page {
    width: fit-content;
    height: fit-content;
    font-size: 2em;
    }
</style>