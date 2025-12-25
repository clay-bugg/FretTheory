<template>
  <div class="chord-display-wrapper">
    <p class="chord-played-label">Chord Played</p>

    <div class="chord-played">
      <p class="chord-notes-label">{{ rootNote }}{{ chordType }} |</p>

      <p
        v-for="(note, index) in chordNotes"
        :key="index"
        class="chord-note"
        :id="`chord-note-${index + 1}`"
      >
        {{ note }}
      </p>

      <div class="play-button">
        <Icon
          name="line-md:play-filled"
          class="play-icon"
          @mousedown="$emit('play')"
          @mouseup="$emit('stop')"
        />
        <p class="play-button-label">(space)</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  rootNote: { type: String, required: true },
  chordType: { type: String, required: true },
  chordNotes: { type: Array, required: true },
});

defineEmits(["play", "stop"]);
</script>

<style scoped>
.chord-played-label {
  font-size: 1.5rem;
  margin-top: 2em;
}
.chord-played {
  display: flex;
  align-items: center;
  width: fit-content;
  justify-content: space-between;
  font-size: 1.2em;
  font-weight: 800;
  font-family: "Ubuntu";
  gap: 1em;
}
.chord-notes-label {
  display: flex;
  align-items: center;
  width: fit-content;
}
.play-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: fit-content;
  position: relative;
  top: 0.4em;
}
.play-button-label {
  font-size: 0.8rem;
}
.play-icon {
  font-family: inherit;
  width: 40px;
  height: 40px;
  font-weight: 500;
  font-size: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
}
.play-icon:hover {
  cursor: pointer;
  transform: scale(1.07);
}
.play-icon:active {
  transform: scale(1);
}
.chord-display-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
