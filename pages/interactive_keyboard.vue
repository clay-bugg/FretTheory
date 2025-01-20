<template>
  <div id="page">
    <Header :buttonLabels="['Login', 'Sign Up']" title="Music Theory" />
    <h1>Interactive Keyboard</h1>
    <Keyboard />

  </div>
</template>

<style scoped>
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
  margin-top: 2em;
  padding: 0;
  font-size: 2em;
}

#container {
  display: block;
}
</style>