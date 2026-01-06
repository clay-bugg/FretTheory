<template>

  <div class="root-note-selectors">
    <div
      v-for="note in notes"
      :key="note"
      @click="changeRootNote(note)"
      class="root-note-selector"
    >
      <button class="flat accidental" @click="changeRootNote(note + '♭')">
        <p>♭</p>
      </button>

      <p class="root-note">{{ note }}</p>

      <button class="sharp accidental" @click="changeRootNote(note + '#')">
        <p>♯</p>
      </button>
      
    </div>
  </div>
</template>

<script setup>
const { changeRootNote } = useKeyboardStore();

const notes = ["C", "D", "E", "F", "G", "A", "B"];
</script>

<style scoped lang="scss">
.root-note-selectors {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.2em;
  width: 30px;
  .root-note-selector {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5em;
    width: fit-content;
    button {
      background: none;
      border: none;
      font-size: 1.2rem;
      &:hover {
        cursor: pointer;
        transform: scale(1.1);
        color: #ffffff;
      }
    }
  }

  .root-note {
    font-size: 1.2rem;
    cursor: pointer;

    &:hover {
      cursor: pointer;
      color: #ffffff;
    }
  }

  .accidental {
    color: white;
    &:hover {
      cursor: pointer;
      color: #ffffff;
    }
  }
}
</style>
