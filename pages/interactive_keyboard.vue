<template>
  <div id="page">
    <Header :buttonLabels="['Login', 'Sign Up']" title="Music Theory" />
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
  justify-content: flex-start;
  height: 100vh;
  gap: 2em;
}

h1 {
  margin: 0;
  padding: 0;
}

#container {
  display: block;
</style>