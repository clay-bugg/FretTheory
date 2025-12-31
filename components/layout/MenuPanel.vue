<template>
  <div class="menu-wrapper">

    <div class="menu-panel" :class="{ open: menuOpen }">

      <div class="menu-content">
        <InstrumentsScaleType />
        <RootNoteButtons />
      </div>
    </div>
    <button class="handle-bar" @click="toggleMenu">
      <svg
        class="handle-icon"
        :class="{ open: menuOpen }"
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="16"
        viewBox="0 0 40 16"
      >
        <!-- Grip lines -->
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
  </div>
</template>

<script setup>
const { menuOpen } = storeToRefs(useControlStore());
const hovered = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
</script>

<style lang="scss" scoped>
@use "~/assets/scss/main.scss" as *;

.menu-wrapper {
  width: 1024px;
  max-width: 76em;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-panel {
  width: 100%;
  max-height: 0;
  overflow: hidden;
  background-color: $bg-header;
  border-left: 1px solid $border-dark;
  border-right: 1px solid $border-dark;
  transition: max-height 1s ease-in-out;
}

.menu-panel.open {
  max-height: 400px;
  border-bottom: 1px solid $border-dark;
  transition: max-height 1s ease-in-out;
}

.menu-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;  
  padding: 1.5em;
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s;
}

.menu-panel.open .menu-content {
  opacity: 1;
  transform: translateY(0);
}

.handle-bar {
  width: 80px;
  height: 24px;
  border: none;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  background-color: $bg-header;
  border: 1px solid $border-dark;
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
