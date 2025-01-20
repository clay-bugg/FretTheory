<template>
  <div id="page">
    <h1>Interactive Keyboard</h1>
    <Keyboard />

  </div>
</template>

<style scoped>
#page {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  gap: 2em;
  background-image: url('public/images/background_images/notation.webp');
  background-size: auto;
}

h1 {
  margin: 0;
  margin-top: 2em;
  padding: 0;
  font-size: 2em;
}
</style>