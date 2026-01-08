<template>
  <div class="root-notes">
    <button
      v-for="note in notes"
      :key="note"
      @click="changeRootNote(note)"
      class="root-note"
      :class="{
        active: rootNote === note,
        accidental: note.includes('#'),
      }"
    >
      <span class="note-label">{{ formatNote(note) }}</span>
    </button>
  </div>
</template>

<script setup>
const { notes, rootNote } = storeToRefs(useKeyboardStore());

// Map sharp notes to their flat enharmonic equivalents
const sharpToFlatMap = {
  "C#": "D♭",
  "D#": "E♭",
  "F#": "G♭",
  "G#": "A♭",
  "A#": "B♭",
};

// Format note to show both sharp and flat (e.g., "D#/E♭")
function formatNote(note) {
  if (sharpToFlatMap[note]) {
    return `${note}/${sharpToFlatMap[note]}`;
  }
  return note;
}

function changeRootNote(note) {
  rootNote.value = note;
}
</script>

<style scoped lang="scss">
.root-notes {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 0.4em;
  width: 100%;
  padding: 0.5em;
}

.root-note {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 44px;
  height: 36px;
  padding: 0.4em 0.6em;
  border: none;
  border-radius: 8px;
  background: #242424;
  color: #c0c0c0;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  .note-label {
    text-align: center;
    line-height: 1.2;
    white-space: nowrap;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 0 0 #000000;
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
    filter: brightness(0.95);
    color: #dadada;
  }

  &.active {
    background: #ffc552;
    color: #000000;
    box-shadow: 0 2px 0 0 #000000;

    &:hover {
      filter: brightness(1.1);
    }

    &:active {
      filter: brightness(0.95);
    }
  }

  &.accidental {
    min-width: 52px;
    font-size: 0.8rem;
    font-weight: 700;
    background: #171717;

    &.active {
      background: #ffc552;
      color: #000000;
    }
  }
}
</style>
