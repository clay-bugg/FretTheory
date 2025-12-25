<template>
  <div class="controls">
    <OctaveRangeControl />
    <OctaveAmountControl />
    <NoteLabelControl />
    <ChordSelectorControl />
    <ToneSelectorControl />
  </div>
</template>

<script setup>
import OctaveRangeControl from './OctaveRangeControl.vue'
import OctaveAmountControl from './OctaveAmountControl.vue'
import NoteLabelControl from './NoteLabelControl.vue'
import ChordSelectorControl from './ChordSelectorControl.vue'
import ToneSelectorControl from './ToneSelectorControl.vue'
</script>

<style scoped>
.controls {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  height: 6em;
  position: relative;
  z-index: 3;
  color: rgb(215, 215, 215);
  padding: 0 1em 1em;
  gap: 3em;
  margin-bottom: 0.5em;
}
</style>
