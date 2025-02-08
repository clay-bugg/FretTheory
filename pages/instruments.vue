<template>
  <div id="page">
    <Header 
      :buttons="[
        { url: '/instruments', label: 'Instruments' },
        { url: '/tools', label: 'Tools' }
      ]"
    />
    <h1>Interactive Keyboard</h1>
    <div class="instrument-selector-box">
      <input type="radio" class="instrument-selector" id="keyboard-option" name="keyboard" value="keyboard" checked />
      <input type="radio" class="instrument-selector" id="guitar-option" name="guitar" value="guitar" checked />
    </div>
    <Keyboard />
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

.instrument-selector-box {
  width: fit-content;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2em;
}

.instrument-selector {
  width: 4em;
  appearance: none;
  border: 1px solid black;
  height: 2em;
  background-color: white;
  border-radius: 5px;
}

.instrument-selector:hover {
  cursor: pointer;
  filter: brightness(90%);
  
}

.instrument-selector:active {
  filter:brightness(100%);
  
}

</style>