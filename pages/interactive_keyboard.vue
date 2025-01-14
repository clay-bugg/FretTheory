<template>
  <div id="page">
    <h1>Interactive Keyboard</h1>
    <Keyboard />
    <NuxtLink to="/">
      <Button>Back to Home</Button>
    </NuxtLink>
  </div>
</template>

<style scoped>
#page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 100vh;
}

h1 {
  margin: 0;
  padding: 0;
}
</style>