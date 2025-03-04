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


    <div class="instrument-button-box">
      <div v-for="button in instrumentButtons"
        :key="button.label"
        class="instrument-button" 
        :id="`${button.label.toLowerCase()}-button`"
        :style="{ backgroundImage: `url(${button.image})` }"
        @click="selectInstrumnent(button.label.toLowerCase())">
          {{ button.label }} 
      </div>
    </div>

    <div class="instrument">
      <Keyboard v-if="selectedInstrument === 'keyboard'"/>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const instrumentButtons = ref([
   { label: 'Keyboard', image: '/images/buttons/Keyboard_button.png' },
   { label: 'Guitar', image: '/images/buttons/Guitar_Button.png' }
]);

const selectedInstrument = ref('keyboard')

function selectInstrumnent(instrument) { 
  selectedInstrument.value = instrument;
}

</script>

<style scoped>
#page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  width: 100vw;
  background-image: url('/images/backgrounds/y-so-serious.png');
  background-position: center;
  color: white;
  position: relative;
  padding-top: 15em;
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

.instrument {
  display: flex;
  align-items: center;
  width: fit-content;
  position: relative;
}

.instrument-button-box {
  display: flex;
  align-items: center;
  width: fit-content;
  background-color: rgb(0, 0, 0);
  gap: 0.5em;
}
.instrument-button {
  cursor: pointer;
  height: 76px;
  width: 157px;
  border-radius: 10px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  color: black;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-end;
  font-size: 1.5em;
}

.instrument-button:hover {
  filter: brightness(90%);
  cursor: pointer;
}

.instrument-button:active {
  filter: brightness(100%);
}





</style>