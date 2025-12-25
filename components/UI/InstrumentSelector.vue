<template>

      <select v-model="selectedInstrument">
        <option v-for="instrument in instrumentOptions" :value="instrument.label">
          {{ instrument.label }}
        </option>
      </select>

</template>

<script setup>

const { selectedInstrument } = storeToRefs(useConstrolStore())

const instrumentOptions = ref([
  { label: "Keyboard", image: "public/images/backgrounds/nav-button-texture.png"},
  { label: "Guitar", image: "public/images/backgrounds/nav-button-texture.png"},
])
</script>

<style lang="scss" scoped>
.instrument-selector {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0.4em;
}
select {
  font-size: 1.2em;
  border: 2px solid black;
  border-radius: 0.3em;
  padding: 0 0.2em;
  margin-bottom: 2em;
  width: fit-content;
  width: 100px;
}
</style>