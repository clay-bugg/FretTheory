<template>
  <div class="instrument">
    <button class="change-instrument" @click="changeInstrument('prev')">
      <Icon name="eva:arrow-left-fill" class="prev icon" />
    </button>
    <InstrumentsKeyboard v-if="selectedInstrument === 'Keyboard'" />
    <InstrumentsGuitar v-else-if="selectedInstrument === 'Guitar'" />
    <button class="change-instrument" @click="changeInstrument('next')">
      <Icon name="eva:arrow-right-fill" class="next icon" />
    </button>
  </div>
</template>

<script setup>
const { selectedInstrument } = storeToRefs(useControlStore());

const instruments = ref(["Keyboard", "Guitar", "Drums"]);

function changeInstrument(direction) {
  const index = instruments.value.indexOf(selectedInstrument.value);
  if (direction === "next") {
    selectedInstrument.value =
      instruments.value[(index + 1) % instruments.value.length];
  } else {
    selectedInstrument.value =
      instruments.value[
        (index - 1 + instruments.value.length) % instruments.value.length
      ];
  }
}
</script>

<style lang="scss" scoped>
@use "~/assets/scss/main.scss" as *;

.instrument {
  width: 76em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 3em;
}

.change-instrument {
  background-color: $btn-bg-neutral;
  color: black;
  border: 2px solid $border-black;
  border-radius: 50%;
  width: 3em;
  height: 3em;
  flex-shrink: 0;
  z-index: 2;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 2px 1px $shadow-dark;
    filter: brightness(1.07);
  }

  &:active {
    transform: translateY(2px);
    box-shadow: none;
    filter: brightness(1);
  }

  .icon {
    font-size: 1.5em;
  }
}
</style>
