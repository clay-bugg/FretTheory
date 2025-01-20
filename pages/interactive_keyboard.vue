<template>
  <div id="page">
    <h1>Interactive Keyboard</h1>
    <Keyboard />

  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#page {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  gap: 2em;
}

h1 {
  font-size: 2.5em;
}
</style>