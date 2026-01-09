<template>
  <div class="menu-wrapper">
    <div class="menu-panel" :class="{ open: menuOpen }">
      <div class="menu-content">
        <div class="chord-info">
          <UIChordInfo />
        </div>
        <div class="chord-options">
          <UIRootNoteSelector />
          <UIChordGrid />
        </div>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 76em;
}

.menu-panel {
  width: 1024px;
  max-height: 0;
  overflow: hidden;
  background-color: #0f0f0f;
  border-left: 3px solid black;
  border-right: 3px solid black;
  transition: max-height 0.4s ease-in-out;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  color: #cfcfcf;
}

.menu-panel.open {
  max-height: 500px;
  border-bottom: 3px solid black;
  transition: max-height 0.4s ease-in-out;
}

.menu-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0.8em; // Reduced padding
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s;

  .chord-info {
    display: none;
  }

  .chord-options {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5em; // Reduced gap
    width: 100%;
  }
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
