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

// Format note to show just the note (sharps preferred based on image)
function formatNote(note) {
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
  flex: 1;
  min-width: 30px;
  height: 30px;
  padding: 0;
  border: 1px solid #000000;
  border-radius: 4px;
  background: #242424;
  color: #c0c0c0;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;

  .note-label {
    text-align: center;
    line-height: 1;
  }

  &:hover {
    background-color: #333333;
    filter: brightness(1.2);
  }

  &:active {
    transform: translateY(1px);
    filter: brightness(0.95);
  }

  &.active {
    background: #b81f1f;
    color: #000000;
    font-weight: 700;
    border-color: #b81f1f;

    &:hover {
      filter: brightness(1.05);
    }
  }

  &.accidental {
    background: #1f1f1f;

    &.active {
      background: #b81f1f;
      color: black;
    }
  }
}
</style>
