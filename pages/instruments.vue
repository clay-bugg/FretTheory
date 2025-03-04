<template>
  <div id="page">
    <Header 
      heading="Music" 
      subheading="Interactive Instruments" 
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
        @click="selectInstrument(button.label.toLowerCase())">
          {{ button.label }} 
      </div>
    </div>

    
      <Keyboard v-if="selectedInstrument === 'keyboard'" />
      <Guitar v-else-if="selectedInstrument === 'guitar'" />
    
    
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const instrumentButtons = ref([
   { label: 'Keyboard', image: '/images/buttons/Keyboard_button.png' },
   { label: 'Guitar', image: '/images/buttons/Guitar_Button.png' }
]);

const selectedInstrument = ref('keyboard')

function selectInstrument(instrument) { 
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
}

#header {
  top: 0;
  border-bottom: 2px solid black;
  font-size: 2rem;
}


.instrument {
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
  justify-content: center;
}

.instrument-button-box {
  display: flex;
  align-items: center;
  width: fit-content;
  gap: 0.5em;
}
.instrument-button {
  cursor: pointer;
  height: 76px;
  width: 154px;
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
  border: 1px solid black;
}

.instrument-button:hover {
  filter: brightness(90%);
  cursor: pointer;
}

.instrument-button:active {
  filter: brightness(100%);
}





</style>