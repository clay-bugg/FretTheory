<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="menu-container" :class="{ 'is-open': isOpen }">
    <aside class="sidebar">
      <nav>
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
    </aside>

    <button class="handlebar" @click="toggleMenu" aria-label="Toggle Menu">
      <span class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.menu-container {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 50;
  
  // State: Open
  &.is-open {
    .sidebar {
      transform: translateX(0);
    }
    .handlebar {
      left: 250px; // Width of sidebar
      background: rgba(255, 255, 255, 0.9); // Less transparent when open
      
      .icon {
        transform: rotate(180deg); // Flip chevron
      }
    }
  }
}

.sidebar {
  position: absolute;
  left: 0;
  top: 0;
  width: 250px;
  height: 100%;
  background: #1a1a1a;
  color: white;
  transform: translateX(-100%); // Hidden by default
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  padding: 2rem;
}

.handlebar {
  position: absolute;
  top: 50%; // Center vertically
  left: 0;
  transform: translateY(-50%);
  
  // Shape & Size
  width: 40px;
  height: 80px;
  border-radius: 0 12px 12px 0; // Rounded only on the right
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-left: none;
  
  // Glassmorphism Look
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
  
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    width: 48px; // Slight expansion on hover
  }

  .icon {
    color: white;
    transition: transform 0.3s ease;
  }
}
</style>