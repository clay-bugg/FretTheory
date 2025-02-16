<template>
  <div id="page">
    <Header title="Instruments"
      :buttons="[
        { url: '/instruments', label: 'Instruments' },
        { url: '/tools', label: 'Tools' }
      ]"
    />
    <h1>Interactive Charts</h1>

    <div id="instrument">
      <div id="instrument-selector-box">
        <label v-for="(instrument, key) in instruments"
        :key="key"
        class="instrument-selector"
      >
        <input 
          type="radio"
          :value="key"
          name="instrument"
          v-model="selectedInstrument"
        />

        <img :src="instrument.image" :alt="key" class="instrument.image" />
        </label>
      </div>
      <Keyboard v-if="selectedInstrument === 'keyboard'" />
      <Guitar v-if="selectedInstrument === 'guitar'"/>
    </div>

  </div>
</template>

<script>
export default {
  data() { 
    return {
      instruments: {
        keyboard: { image: '/images/KeyboardButton.png' },
        guitar: { image: '/images/GuitarButton.png' }
      },
      selectedInstrument: null
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
  gap: 0.5em;
  background-color: #487dac
}
h1 {
  margin: 0;
  padding: 0;
  font-weight: 600;
  font-size: 3em;
}

#instrument {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: fit-content;
  gap: 3em;
  position: relative;
  right: 6em;
}

#instrument-selector-box {
  width: fit-content;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
}


#instrument-selector-box input {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

#instrument-selector-box img {
  width: 100%;
  height: 100%;
}





.instrument-selector {
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  width: 6em;
  height: 3em;
  border: 1px solid black;
  background-color: white;
  border-radius: 6px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
}

.instrument-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.instrument-selector:hover {
  filter: brightness(90%);
}

.instrument-selector:active {
  filter: brightness(100%);
}

input[type="radio"]:checked + img {
  border: 2px solid #3498db;
  border-radius: 5px;
  background-color: rgba(52, 152, 219, 0.2);
}








</style>