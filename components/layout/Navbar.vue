<template>
  <nav>
    <!-- Instruments with dropdown -->
    <div
      class="nav-item has-dropdown"
      @mouseenter="showDropdown = true"
      @mouseleave="showDropdown = false"
    >
      <NuxtLink
        to="/instruments"
        class="button"
        :class="{ selected: buttonSelected === 'Instruments' }"
        @click="selectButton('Instruments')"
      >
        Instruments
        <Icon
          name="mdi:chevron-down"
          class="dropdown-arrow"
          :class="{ rotated: showDropdown }"
        />
      </NuxtLink>

      <!-- Dropdown menu -->
      <div class="dropdown-menu" v-show="showDropdown">
        <p
          v-for="instrument in instruments"
          :key="instrument.name"
          class="dropdown-item"
          :class="{ active: selectedInstrument === instrument.name }"
          @click="selectInstrument(instrument.name)"
        >
          <Icon :name="instrument.icon" class="dropdown-icon" />
          {{ instrument.name }}
        </p>
      </div>
    </div>

    <!-- Other nav items -->
    <NuxtLink
      v-for="button in otherNavButtons"
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
const route = useRoute();
const buttonSelected = computed(() => {
  if (route.path.startsWith("/instruments")) return "Instruments";
  const match = otherNavButtons.value.find((b) =>
    route.path.startsWith(b.link),
  );
  return match ? match.label : "";
});

const showDropdown = ref(false);

// Instruments for dropdown
const instruments = ref([
  { name: "Piano", link: "/instruments/piano", icon: "mdi:piano" },
  { name: "Guitar", link: "/instruments/guitar", icon: "mdi:guitar-acoustic" },
  { name: "Drums", link: "/instruments/drums", icon: "mdi:drum" },
]);

// Other nav buttons (without Instruments)
const otherNavButtons = ref([
  { label: "Theory", link: "/theory" },
  { label: "Tools", link: "/tools" },
]);

const { selectedInstrument } = storeToRefs(useControlStore());

function selectButton(value) {
  selectedInstrument.value = value;
}

function selectInstrument(instrumentName) {
  selectedInstrument.value = instrumentName;
  showDropdown.value = false;
  navigateTo("/instruments");
}
</script>

<style scoped lang="scss">
@use "~/assets/scss/main.scss" as *;

nav {
  display: flex;
  height: 100%;
  justify-content: center;
  width: fit-content;
  align-items: flex-end;
  gap: 20px;
}

.button {
  text-decoration: none;
  color: #cbcbcb;
  font-size: 1.4rem;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 0.25em;
  transition: color 0.15s ease;

  &:hover {
    cursor: pointer;
    color: rgb(255, 255, 255);
    text-shadow: 0 0 1px black;
  }

  &.selected {
    font-weight: 600;
  }
}

// Dropdown container
.nav-item {
  position: relative;

  &.has-dropdown .button {
    cursor: pointer;
  }

  // Invisible bridge to prevent menu from closing when crossing the gap
  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    height: 15px; // Covers the 8px gap + buffer
    background: transparent;
  }
}

.dropdown-arrow {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;

  &.rotated {
    transform: rotate(180deg);
  }
}

// Dropdown menu
.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  min-width: 160px;
  padding: 0.5em 0;
  background: linear-gradient(180deg, #1f1f1f 0%, #141414 100%);
  border: 1px solid #333;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 1000;

  // Arrow pointer
  &::before {
    content: "";
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid #333;
  }

  &::after {
    content: "";
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid #1f1f1f;
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75em;
  padding: 0.6em 1em;
  color: #aaa;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.15s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
  }

  &.active {
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.1);
  }
}

.dropdown-icon {
  width: 18px;
  height: 18px;
  color: #666;
  transition: color 0.15s ease;

  .dropdown-item:hover & {
    color: #f59e0b;
  }
}
</style>
