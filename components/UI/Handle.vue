<template>
  <div class="handle-container" :class="{ 'is-open': isOpen }">
    <!-- Handle button with SVG grip lines -->
    <button class="handle-bar" @click="toggleMenu">
      <svg
        class="handle-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 10 10"
        style="background-color: #2D2D2D";
      >
        <path
          d="M 1 1 H 9"
          stroke-width=".5"
          stroke-linecap="round"
          stroke="#e0e0e0"
        />
        <path
          d="M 1 2.5 H 9"
          stroke-width=".3"
          stroke-linecap="round"
          stroke="#e0e0e0"
        />
      </svg>
    </button>

    <!-- Dropdown menu panel -->
    <div class="menu-panel">
      <div class="menu-content">
        <slot>
          <!-- Default content if no slot provided -->
          <p class="placeholder-text">Menu content goes here</p>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style lang="scss" scoped>
.handle-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  top: 10px;
}

.handle-bar {
  width: auto;
  height: auto;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;

  .handle-icon {
    width: 60px;
    height: 60px;
    display: block;
  }
}

.menu-panel {
  width: 100%;
  max-width: 76em;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.25, 0.8, 0.25, 1),
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

// Open state
.handle-container.is-open {

  .menu-panel {
    max-height: 500px;
    padding: 0;
  }

  .menu-content {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
