<template>
  <button class="handle-bar" @click="toggleMenu">
    <svg
      class="handle-icon"
      :class="{ open: menuOpen }"
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="16"
      viewBox="0 0 40 16"
    >
      <!--Grip lines-->
      <path
        d="M 10 6 H 30"
        stroke-width="2"
        stroke-linecap="round"
        :stroke="hovered ? '#ffffff' : '#ebebeb'"
      />
      <path
        d="M 14 10 H 26"
        stroke-width="1.5"
        stroke-linecap="round"
        :stroke="hovered ? '#ffffff' : '#ebebeb'"
      />
    </svg>
  </button>
</template>

<script setup>
const { menuOpen } = storeToRefs(useControlStore());
const hovered = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
</script>

<style lang="scss" scoped>
.handle-bar {
  width: 80px;
  height: 24px;
  border: none;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  background-color: black;
  border: 1px solid black;
  border-top: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: lighten(#1f1f1f, 5%);
  }

  &:active {
    transform: translateY(2px);
  }
}

.handle-icon {
  transition: transform 0.3s ease;
}
</style>
