<template>
  <div class="notes-labels control">
    <p class="control-label">Note Labels</p>
    <div class="notes-labels-checkboxes">
      <div class="notes-labels-checkbox">
        <input
          :checked="store.notesDisplayed === 'all'"
          :class="[
            'all-notes-checkbox',
            { active: store.notesDisplayed === 'all' },
          ]"
          type="radio"
          value="all"
          @change="store.notesDisplayed = 'all'"
        />
        <p class="notes-checkbox">All</p>
      </div>

      <div class="notes-labels-checkbox">
        <input
          :checked="store.notesDisplayed === 'chord'"
          :class="[
            'chord-notes-checkbox',
            { active: store.notesDisplayed === 'chord' },
          ]"
          type="radio"
          value="chord"
          @change="store.notesDisplayed = 'chord'"
        />
        <p class="notes-checkbox">Chord</p>
      </div>

      <div class="notes-labels-checkbox">
        <input
          :checked="store.notesDisplayed === 'none'"
          :class="[
            'no-notes-checkbox',
            { active: store.notesDisplayed === 'none' },
          ]"
          type="radio"
          value="none"
          @change="store.notesDisplayed = 'none'"
        />
        <p class="notes-checkbox">None</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useKeyboardStore } from "~/stores/keyboardStore";

const store = useKeyboardStore();
</script>

<style scoped>
.notes-labels-checkboxes {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5em;
}
.notes-labels-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.4em;
  width: 2.5em;
  position: relative;
  top: 0.4em;
}
.notes-labels-checkboxes input {
  width: 25px;
  height: 25px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: 2px solid black;
  background-color: rgb(152, 12, 12);
  border-radius: 5px;
}
.notes-labels-checkboxes input.active {
  background-color: rgb(133, 206, 23);
}
.notes-labels-checkboxes input:hover {
  cursor: pointer;
}
.notes-checkbox {
  font-size: 0.8em;
}
.control {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  gap: 0.5em;
  padding: 0.5em 0;
}
.control-label {
  font-size: 1rem;
  text-align: center;
  text-wrap: nowrap;
}
</style>
