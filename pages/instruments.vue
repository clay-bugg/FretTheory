<template>
  <div id="page">
    <Header 
      heading="Music" 
      subheading="Interactive Instruments" 
      hcolor="white" 
      shcolor="white"
      id="header"
      :buttons="[
        { url: '/instruments', label: 'Instruments' },
        { url: '/tools', label: 'Tools' }
      ]"
    />
    <Sound />

    <div class="selected-instrument">
      <div class="instrument-button-box">
        <label 
          v-for="(instrument, key) in instruments" 
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
          <img :src="instrument.image" :alt="key" class="instrument-image" />
        </label>
      </div>

      <Keyboard v-if="selectedInstrument === 'keyboard'" />
      <Guitar v-if="selectedInstrument === 'guitar'"/>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Instruments data
const instruments = ref({
  keyboard: { image: '/images/buttons/KeyboardButton.png' },
  guitar: { image: '/images/buttons/GuitarButton.png' }
});

// Selected instrument state
const selectedInstrument = ref(null);

// Function to set the initial instrument
const setInstrument = () => {
  for (const key in instruments.value) {
    if (instruments.value[key].checked) {
      selectedInstrument.value = key;
      break;
    }
  }
};

// Set instrument on component mount
onMounted(setInstrument);
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
  justify-content: center;
  height: 100vh;
  gap: 0.5em;
  background-image: url('/images/backgrounds/y-so-serious.png');
  background-size: center;
  color: white;
}
#page::before {
  content: '';
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  opacity: 0.1;
  position: absolute;
}

#header {
  position: absolute;
  top: 0;
  border-bottom: 2px solid white;
  font-size: 2rem;
}

h1 {
  margin: 0;
  padding: 0;
  font-weight: 600;
  font-size: 3em;
}

.selected-instrument {
  position: relative;
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5em;
}

.instrument-button-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5em;
  border-radius: 15px;
  background-color: rgba(178, 178, 178, 0.1);
  padding: 0.5em 0.6em;
  border: 0.5px solid rgba(255, 255, 255, 0.529);
  backdrop-filter: blur(1.5px);
}

.instrument-button-box input {
  appearance: none;
}

.instrument-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.instrument-button {
  width: 6em;
  height: 3em;
  background-color: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.instrument-button:hover {
  filter: brightness(90%);
}

.instrument-button:active {
  filter: brightness(100%);
}

input[type="radio"]:checked + img {
  border-radius: 5px;
  background-color: rgba(52, 152, 219, 0.2);
}

#keyboard-button::before,
#guitar-button::before {
  position: absolute;
  bottom: 3.6em;
  width: 100%;
  text-align: center;
  font-weight: 600;
  text-decoration: underline;
}

#keyboard-button::before {
  content: "Keyboard";
}

#guitar-button::before {
  content: "Guitar";
}
</style>