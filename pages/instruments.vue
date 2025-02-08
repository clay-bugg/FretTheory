<template>
  <div id="page">
    <Header 
      :buttons="[
        { url: '/instruments', label: 'Instruments' },
        { url: '/tools', label: 'Tools' }
      ]"
    />
    <h1>Interactive Keyboard</h1>
    <label for="instrument-selector-box" id="instrument-selector-box-label">Instrument</label>
    <div id="instrument-selector-box">
      <input
      v-for="(instrument, key) in instruments"
        :key="key"
        class="instrument-selector"
        :id="key"
        type="radio" 
        :value="key"
        name="instrument"
        v-model="selectedInstrument"
      />
    </div>
    <Keyboard v-if="selectedInstrument === 'keyboard'" />
    <Guitar v-if="selectedInstrument === 'guitar'"/>
  </div>
</template>

<script>
export default {
  data() { 
    return {
      instruments: {
        keyboard: { checked: false },
        guitar: { checked: false }
      },
      selectedInstrument: ''
    }
  },
  mounted() { 
    this.setInstrument()
  },
  methods: {
    setInstrument() { 
      for (const key in this.instruments) { 
        if (this.instruments[key].checked) { 
          this.selectedInstrument = key;
          break;
        }
      }
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
  gap: 1em;
  background-color: #487dac
}
h1 {
  margin: 0;
  padding: 0;
  font-weight: 600;
  font-size: 3em;
}

#instrument-selector-box {
  width: fit-content;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2em;
}

.instrument-selector {
  width: 4em;
  
  border: 1px solid black;
  height: 2em;
  background-color: white;
  border-radius: 5px;
  position: relative;
}

.instrument-selector::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border: 1px solid red;
  display: flex;
  align-items: center;
  justify-content: center;

  
}

.instrument-selector:hover {
  cursor: pointer;
  filter: brightness(90%);
  
}

.instrument-selector:active {
  filter:brightness(100%);
  
}

</style>