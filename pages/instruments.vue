<template>
  <div id="page">
    <Header 
      :buttons="[
        { url: '/instruments', label: 'Instruments' },
        { url: '/tools', label: 'Tools' }
      ]"
    />
    <h1>Interactive Keyboard</h1>
    <Keyboard />
    <Guitar />
  </div>
</template>

<script>
export default {
  data() { 
    return {

      }

  }
}
</script>

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
  background-color: #487dac
}
h1 {
  margin: 0;
  padding: 0;
  font-weight: 600;
  font-size: 3em;
}

</style>