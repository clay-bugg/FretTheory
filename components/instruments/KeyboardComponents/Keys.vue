<template>
  <div class="keys" :style="keyStyles">
    <div
      v-for="(key, index) in pianoKeys"
      :key="`${key.note}${key.octave}`"
      :style="{ fontSize: keyFontSize }"
      :id="`interval-${store.chordNotes.indexOf(key.note) + 1}`"
      :class="[
        'key',
        {
          black: key.sharp,
          white: !key.sharp,
          'highlighted-note': store.chordNotes.includes(key.note),
          interval: store.chordNotes.includes(key.note),
          'root-note': key.note === store.rootNote,
        },
      ]"
      @mousedown="$emit('playKey', key.note, key.octave)"
      @mouseup="$emit('stopKey', key.note, key.octave)"
      @mouseleave="$emit('stopKey', key.note, key.octave)"
    >
      <span v-if="store.notesDisplayed === 'all'">{{ key.note }}</span>
      <span
        v-if="
          store.notesDisplayed === 'chord' &&
          store.chordNotes.includes(key.note)
        "
      >
        {{ key.note }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useKeyboardStore } from "~/stores/keyboardStore";

const store = useKeyboardStore();

// Default octave amount (since it was removed from store)
const octaveAmount = ref(2);

defineEmits(["playKey", "stopKey"]);

const pianoKeys = computed(() => {
  const octavesArray = Array.from(
    { length: octaveAmount.value },
    (_, i) => store.currentPitch + i
  );

  const keys = [];
  for (const octave of octavesArray) {
    store.notes.forEach((note) => {
      keys.push({
        note,
        octave,
        sharp: note.includes("#"),
      });
    });
  }

  return keys;
});

const whiteKeyCount = computed(
  () => pianoKeys.value.filter((k) => !k.sharp).length
);

const keysHeight = computed(() => {
  if (octaveAmount.value === 1) return "350px";
  if (octaveAmount.value === 2) return "260px";
  if (octaveAmount.value === 3) return "180px";
  return "260px";
});

const keyStyles = computed(() => ({
  "--white-key-count": whiteKeyCount.value,
  height: keysHeight.value,
}));

const keyFontSize = computed(() => {
  if (octaveAmount.value === 1) return "1.6rem";
  if (octaveAmount.value === 2) return "1rem";
  if (octaveAmount.value === 3) return "0.8rem";
  return "1rem";
});
</script>

<style scoped>
.keys {
  width: 100%;
  display: flex;
  overflow: hidden;
  margin-bottom: 1em;
  z-index: 0;
  border-top: 10px solid black;
  border-left: 2px solid black;
  border-right: 2px solid black;
  position: relative;
}
.key {
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 0.2em;
  font-weight: 600;
  font-family: "Ubuntu";
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  font-size: 0.9rem;
}
.key:hover {
  cursor: pointer;
}
.white {
  background-color: rgb(255, 255, 255);
  color: black;
  flex: 1;
  height: 100%;
  position: relative;
  z-index: 1;
}
.white:hover {
  background-color: rgb(240, 240, 240);
}
.black {
  width: calc(100% / var(--white-key-count) * 0.6);
  height: 60%;
  position: relative;
  background-color: rgb(0, 0, 0);
  border: 2px solid black;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  color: #fff;
  z-index: 2;
  overflow: hidden;
  border-top: 1px solid black;
  margin-left: calc(100% / var(--white-key-count) * -0.6);
  left: calc(100% / var(--white-key-count) * 0.3);
  padding-bottom: 0.4em;
  box-shadow: -2px 0 1px rgba(0, 0, 0, 0.5);
}
.black:hover {
  background-color: rgb(20, 20, 20);
}
.white.interval {
  background-color: rgb(126, 145, 215);
}
.black.interval {
  background-color: rgb(126, 145, 215);
  color: black;
}
.root-note {
  background-color: rgb(57, 82, 175) !important;
  color: white;
}
</style>
