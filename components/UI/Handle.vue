<template>
  <div class="handle-container">
    <button class="handle-bar" @click="toggleMenu">
      <svg
        class="handle-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 10 10"
        :style="handleStyles"
      >
        <path
          @mouseenter="hovered = true"
          @mouseleave="hovered = false"
          d="M 1 1 H 9"
          stroke-width=".5"
          stroke-linecap="round"
          :stroke="hovered ? '#ffffff' : '#ebebeb'"
        />
        <path
          @mouseenter="hovered = true"
          @mouseleave="hovered = false"
          d="M 2 2.5 H 8"
          stroke-width=".4"
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

const handleStyles = ref({
  stroke: "red",
  backgroundColor: "#2d2d2d",
});

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};
</script>

<style lang="scss" scoped>
.handle-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.handle-bar {
  width: auto;
  height: auto;
  border: none;
  cursor: pointer;
  transition: all 0.5s ease;

  .handle-icon {
    width: 60px;
    height: 60px;
    display: block;
  }
}
svg {
  transition: all 0.2s ease;
  transform: translateY(-2px);
  &:hover {
    transform: translateY(0);
  }
}

.menu-panel {
  width: 100%;
  max-width: 76em;
  max-height: 0;
  overflow: hidden;
  border: 1px solid #ebebeb;
  transition: max-height 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.menu-content {
  padding: 0;
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.placeholder-text {
  color: rgba(200, 200, 200, 0.7);
  text-align: center;
  font-family: "Ubuntu", sans-serif;
}

.handle-container.open {
  .menu-panel {
    min-height: 500px;
    height: 500px;
    padding: 0;
  }

  .menu-content {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
