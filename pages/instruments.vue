<template>
  <div class="page">
    <UIInstrumentSelector />
    <Keyboard v-if="selectedInstrument === 'Keyboard'" />
    <Guitar v-else-if="selectedInstrument === 'Guitar'" />
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import Keyboard from "~/components/instruments/Keyboard.vue";
import Guitar from "~/components/instruments/Guitar.vue";

const { selectedInstrument } = storeToRefs(useControlStore());
</script>

<style scoped lang="scss"></style>
