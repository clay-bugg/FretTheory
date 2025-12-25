<template>
  <div class="controls">
    <OctaveRangeControl
      :starting-octave="startingOctave"
      :octave-amount="octaveAmount"
      @update:starting-octave="$emit('update:startingOctave', $event)"
    />

    <OctaveAmountControl
      :model-value="octaveAmount"
      @update:model-value="$emit('update:octaveAmount', $event)"
    />

    <NoteLabelControl
      :model-value="notesDisplayed"
      @update:model-value="$emit('update:notesDisplayed', $event)"
    />

    <ChordSelectorControl
      :root-note="rootNote"
      :chord-type="chordType"
      :notes="notes"
      :chord-types="chordTypes"
      @update:root-note="$emit('update:rootNote', $event)"
      @update:chord-type="$emit('update:chordType', $event)"
    />

    <ToneSelectorControl
      :model-value="currentTone"
      @update:model-value="$emit('update:currentTone', $event)"
    />
  </div>
</template>

<script setup>
import OctaveRangeControl from "./OctaveRangeControl.vue";
import OctaveAmountControl from "./OctaveAmountControl.vue";
import NoteLabelControl from "./NoteLabelControl.vue";
import ChordSelectorControl from "./ChordSelectorControl.vue";
import ToneSelectorControl from "./ToneSelectorControl.vue";

defineProps({
  startingOctave: { type: Number, required: true },
  octaveAmount: { type: String, required: true },
  notesDisplayed: { type: String, required: true },
  rootNote: { type: String, required: true },
  chordType: { type: String, required: true },
  notes: { type: Array, required: true },
  chordTypes: { type: Array, required: true },
  currentTone: { type: String, required: true },
});

defineEmits([
  "update:startingOctave",
  "update:octaveAmount",
  "update:notesDisplayed",
  "update:rootNote",
  "update:chordType",
  "update:currentTone",
]);
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
