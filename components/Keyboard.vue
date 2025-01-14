<template>
  <div id="keyboard">
    <div v-for="(key, index) in keys" :key="index" class="key" @mousedown="playNote"></div>
  </div>
</template>
<script>

import { Howl, Howler } from 'howler';

export default {
  data() {
    return {
      keys: ['C4','D4','E4','F4','G4','A4','B4'],
    }
  }
}



</script>

<style scoped>
#keyboard {
  width: fit-content;
  height: 16em;
  border: 1px solid rgba(0, 0, 0, 0.111);
  display: flex;
}

.key {
  width: 4em;
  border: 1px solid black;
  background-color: white;
}

.key:hover {
  cursor: pointer;
  filter: brightness(95%);
}

</style>