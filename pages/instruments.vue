<template>
  <div id="page">
    <Header title="Instruments"
      :buttons="[
        { url: '/instruments', label: 'Instruments' },
        { url: '/tools', label: 'Tools' }
      ]"
    />

    <h1>Interactive Charts</h1>

    
      <div id="instrument-button-box">
        <label v-for="(instrument, key) in instruments"
        :key="key"
        class="instrument-button"
        :id="`${key}-button`"
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
</template>

<script>
export default {
  data() { 
    return {
      instruments: {
        keyboard: { image: '/images/buttons/KeyboardButton.png' },
        guitar: { image: '/images/buttons/GuitarButton.png' }
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
#instrument-button-box {
  width: fit-content;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
  border: 1px solid black;
  padding: 0.8em;
  padding-top: 1.5em;
  border-radius: 15px;
  background-color: rgba(0,0,0,0.1);
}
#instrument-button-box input {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}
#instrument-button-box img {
  width: 100%;
  height: 100%;
}
.instrument-button {
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
  
}
.instrument-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.instrument-button:hover {
  filter: brightness(90%);
}
.instrument-button:active {
  filter: brightness(100%);
}
input[type="radio"]:checked + img {
  border: 2px solid #3498db;
  border-radius: 5px;
  background-color: rgba(52, 152, 219, 0.2);
}
#keyboard-button::before {
  content: "Keyboard";
  position: absolute;
  bottom: 3em;
  width: 100%;
  text-align: center;
  font-family: inherit;
  font-weight: 600;
  text-decoration: underline;
}
#guitar-button::before {
  content: "Guitar";
  position: absolute;
  bottom: 3em;
  width: 100%;
  text-align: center;
  font-family: inherit;
  font-weight: 600;
  text-decoration: underline;
}








</style>