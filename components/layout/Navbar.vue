<template>
  <nav>
    <NuxtLink
      v-for="button in navButtons"
      :key="button.label"
      :to="button.link"
      class="button"
      :class="{ selected: buttonSelected === button.label }"
      @click="selectButton(button.label)"
    >
      {{ button.label }}
    </NuxtLink>
  </nav>
</template>

<script setup>

const navButtons = ref([
  { label: "Instruments", link: "/instruments" },
  { label: "Theory", link: "/theory" },
  { label: "Tools", link: "/tools" },
])

const buttonSelected = ref("Instruments")

function selectButton(value) {
  buttonSelected.value = value;
}
</script>

<style scoped>
nav {
  display: flex;
  height: 100%;
  justify-content: center;
  width: fit-content;
  align-items: flex-end;
  gap: 20px;
  .button {
    text-decoration: none;
    color: #ebebeb;
    font-size: 1.4rem;
    font-weight: 400;
    &:hover {
      cursor: pointer;
      color: #ffffff;
      text-shadow: 0 0 1px #ffffff;
    }
    &.selected {
      font-weight: 600;
    }
  }
}
</style>
