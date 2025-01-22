<template>
      <header>
      <h1>music site</h1>
    </header>
</template>

<script>
  export default {
    name: 'Header'
  }
</script>

<style scoped>

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
  h1 {
    font-size: 3em;
    color: rgba(0, 0, 0, 0.347);
  }

  header {
    padding: 0 2em;
    display: flex;
    justify-content: start;
    align-items: flex-start;
    width: 100%;
  }
</style>