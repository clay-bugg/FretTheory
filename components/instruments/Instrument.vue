<template>
  <div class="instruments">
    <div class="instrument">
      <button class="change-instrument" @click="changeInstrument('prev')">
        <Icon name="eva:arrow-left-fill" class="prev icon" />
      </button>
      <InstrumentsKeyboard v-if="selectedInstrument === 'Keyboard'" />
      <InstrumentsGuitar v-else-if="selectedInstrument === 'Guitar'" />
      <InstrumentsDrums v-else-if="selectedInstrument === 'Drums'" />
      <button class="change-instrument" @click="changeInstrument('next')">
        <Icon name="eva:arrow-right-fill" class="next icon" />
      </button>
    </div>
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

.instruments {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .instrument {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 1400px;
    gap: 2em;
  }
}

.change-instrument {
  background-color: #222222;
  color: #000000;
  border: 2px solid #000000;
  border-radius: 50%;
  width: 4em;
  height: 4em;
  flex-shrink: 0;
  z-index: 2;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

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

  .icon {
    font-size: 2.5em;
    color: #ababab;
  }
}
</style>
