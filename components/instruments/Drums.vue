<template>
  <div class="drums-container">
    <div class="drum-kit">
      <div class="cymbals-row">
        <div
          class="cymbal crash"
          :class="{ active: store.isPlaying('crash') }"
          @mousedown="handleDrumHit('crash')"
          @touchstart.prevent="handleDrumHit('crash')"
        >
          <div class="cymbal-surface">
            <div class="cymbal-rings"></div>
            <div class="cymbal-bell"></div>
          </div>
          <div class="cymbal-stand"></div>
          <span class="drum-label">Crash (8)</span>
        </div>

        <div
          class="hi-hat-container"
          :class="{
            active:
              store.isPlaying('hihat-closed') || store.isPlaying('hihat-open'),
          }"
        >
          <div
            class="cymbal hi-hat-top"
            @mousedown="handleDrumHit('hihat-closed')"
            @touchstart.prevent="handleDrumHit('hihat-closed')"
          >
            <div class="cymbal-surface small">
              <div class="cymbal-rings"></div>
              <div class="cymbal-bell"></div>
            </div>
          </div>
          <div
            class="cymbal hi-hat-bottom"
            @mousedown="handleDrumHit('hihat-open')"
            @touchstart.prevent="handleDrumHit('hihat-open')"
          >
            <div class="cymbal-surface small">
              <div class="cymbal-rings"></div>
            </div>
          </div>
          <div class="hi-hat-stand"></div>
          <span class="drum-label">Hi-Hat (3/4)</span>
        </div>

        <div
          class="cymbal ride"
          :class="{ active: store.isPlaying('ride') }"
          @mousedown="handleDrumHit('ride')"
          @touchstart.prevent="handleDrumHit('ride')"
        >
          <div class="cymbal-surface large">
            <div class="cymbal-rings"></div>
            <div class="cymbal-bell"></div>
          </div>
          <div class="cymbal-stand"></div>
          <span class="drum-label">Ride (9)</span>
        </div>
      </div>

      <!-- Toms Row -->
      <div class="toms-row">
        <div
          class="drum tom tom-high"
          :class="{ active: store.isPlaying('tom-high') }"
          @mousedown="handleDrumHit('tom-high')"
          @touchstart.prevent="handleDrumHit('tom-high')"
        >
          <div class="drum-body">
            <div class="drum-head">
              <div class="drum-head-inner"></div>
            </div>
            <div class="drum-shell"></div>
          </div>
          <span class="drum-label">Hi Tom (5)</span>
        </div>

        <div
          class="drum tom tom-mid"
          :class="{ active: store.isPlaying('tom-mid') }"
          @mousedown="handleDrumHit('tom-mid')"
          @touchstart.prevent="handleDrumHit('tom-mid')"
        >
          <div class="drum-body">
            <div class="drum-head">
              <div class="drum-head-inner"></div>
            </div>
            <div class="drum-shell"></div>
          </div>
          <span class="drum-label">Mid Tom (6)</span>
        </div>
      </div>

      <!-- Main Drums Row -->
      <div class="main-drums-row">
        <div
          class="drum snare"
          :class="{ active: store.isPlaying('snare') }"
          @mousedown="handleDrumHit('snare')"
          @touchstart.prevent="handleDrumHit('snare')"
        >
          <div class="drum-body snare-body">
            <div class="drum-head">
              <div class="drum-head-inner"></div>
              <div class="snare-wires"></div>
            </div>
            <div class="drum-shell snare-shell"></div>
          </div>
          <span class="drum-label">Snare (2)</span>
        </div>

        <div
          class="drum kick"
          :class="{ active: store.isPlaying('kick') }"
          @mousedown="handleDrumHit('kick')"
          @touchstart.prevent="handleDrumHit('kick')"
        >
          <div class="drum-body kick-body">
            <div class="kick-front">
              <div class="kick-logo">🥁</div>
            </div>
            <div class="kick-shell"></div>
            <div class="kick-beater"></div>
          </div>
          <span class="drum-label">Kick (1)</span>
        </div>

        <div
          class="drum tom tom-floor"
          :class="{ active: store.isPlaying('tom-low') }"
          @mousedown="handleDrumHit('tom-low')"
          @touchstart.prevent="handleDrumHit('tom-low')"
        >
          <div class="drum-body floor-tom-body">
            <div class="drum-head">
              <div class="drum-head-inner"></div>
            </div>
            <div class="drum-shell floor-shell"></div>
            <div class="floor-legs"></div>
          </div>
          <span class="drum-label">Floor Tom (7)</span>
        </div>
      </div>

      <!-- Visual feedback ripples -->
      <div class="ripple-container">
        <div
          v-for="ripple in activeRipples"
          :key="ripple.id"
          class="ripple"
          :style="{
            left: ripple.x + 'px',
            top: ripple.y + 'px',
            '--ripple-color': ripple.color,
          }"
        ></div>
      </div>
    </div>

    <!-- Keyboard hints -->
    <div class="keyboard-hints">
      <span class="hint-title">Keyboard Controls:</span>
      <div class="hints-grid">
        <span class="hint">1 - Kick</span>
        <span class="hint">2 - Snare</span>
        <span class="hint">3 - Hi-Hat (Closed)</span>
        <span class="hint">4 - Hi-Hat (Open)</span>
        <span class="hint">5 - Hi Tom</span>
        <span class="hint">6 - Mid Tom</span>
        <span class="hint">7 - Floor Tom</span>
        <span class="hint">8 - Crash</span>
        <span class="hint">9 - Ride</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDrumStore } from "~/stores/drumStore";
import { useDrumAudio } from "~/composables/useDrumAudio";

const store = useDrumStore();
const { playDrum } = useDrumAudio();

// Keyboard mappings
const keyMap = {
  1: "kick",
  2: "snare",
  3: "hihat-closed",
  4: "hihat-open",
  5: "tom-high",
  6: "tom-mid",
  7: "tom-low",
  8: "crash",
  9: "ride",
};

// Visual ripple effects
const activeRipples = ref([]);
let rippleId = 0;

function createRipple(event, color) {
  const rect = event.target.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const ripple = {
    id: rippleId++,
    x,
    y,
    color,
  };

  activeRipples.value.push(ripple);

  setTimeout(() => {
    activeRipples.value = activeRipples.value.filter((r) => r.id !== ripple.id);
  }, 600);
}

function handleDrumHit(drumId, event) {
  playDrum(drumId);

  // Get drum color for ripple
  const drum = store.getDrumById(drumId);
  if (event && drum) {
    createRipple(event, drum.color);
  }
}

// Keyboard event handlers
function handleKeyDown(e) {
  const drumId = keyMap[e.key];
  if (drumId && !e.repeat) {
    handleDrumHit(drumId);
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style scoped lang="scss">
@use "~/assets/scss/main.scss" as *;

.drums-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2em;
  padding: 2em;
  width: 100%;
  min-width: 800px;
}

.drum-kit {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  padding: 3em 4em;
  background: linear-gradient(145deg, #1a1a2e, #16213e);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  border: 2px solid #0f0f23;
}

.cymbals-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  gap: 3em;
  margin-bottom: 1em;
}

.cymbal {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.1s ease;

  &:hover {
    transform: scale(1.02);
  }

  &:active,
  &.active {
    transform: scale(0.98) rotate(-2deg);
  }
}

.cymbal-surface {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    #ffd700 0%,
    #daa520 25%,
    #b8860b 50%,
    #cd853f 75%,
    #daa520 100%
  );
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4),
    inset 0 2px 10px rgba(255, 255, 255, 0.3),
    inset 0 -2px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.1s ease;

  &.small {
    width: 80px;
    height: 80px;
  }

  &.large {
    width: 140px;
    height: 140px;
  }

  .active & {
    filter: brightness(1.3);
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.6), 0 4px 15px rgba(0, 0, 0, 0.4);
  }
}

.cymbal-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.2);

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.15);
  }

  &::before {
    width: 60%;
    height: 60%;
  }

  &::after {
    width: 40%;
    height: 40%;
  }
}

.cymbal-bell {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fff8dc, #daa520);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3),
    inset 0 1px 3px rgba(255, 255, 255, 0.5);
}

.cymbal-stand,
.hi-hat-stand {
  width: 8px;
  height: 80px;
  background: linear-gradient(90deg, #404040, #606060, #404040);
  border-radius: 4px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
}

.hi-hat-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.hi-hat-top,
.hi-hat-bottom {
  cursor: pointer;
  transition: transform 0.1s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
}

.toms-row {
  display: flex;
  justify-content: center;
  gap: 2em;
  margin-bottom: -1em;
}

.drum {
  position: relative;
  cursor: pointer;
  transition: transform 0.1s ease;

  &:hover {
    transform: scale(1.02);
  }

  &:active,
  &.active {
    transform: scale(0.97);
  }
}

.drum-body {
  position: relative;
}

.drum-head {
  position: relative;
  border-radius: 50%;
  background: linear-gradient(145deg, #f5f5f5 0%, #e8e8e8 50%, #d0d0d0 100%);
  box-shadow: inset 0 5px 15px rgba(0, 0, 0, 0.1), 0 3px 10px rgba(0, 0, 0, 0.3);
  z-index: 2;

  .active & {
    background: linear-gradient(145deg, #fff 0%, #f0f0f0 50%, #e0e0e0 100%);
    box-shadow: inset 0 5px 15px rgba(0, 0, 0, 0.05),
      0 0 20px rgba(255, 255, 255, 0.3), 0 3px 10px rgba(0, 0, 0, 0.3);
  }
}

.drum-head-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40%;
  height: 40%;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.1);
}

.drum-shell {
  position: absolute;
  left: 5%;
  width: 90%;
  border-radius: 0 0 10px 10px;
  z-index: 1;
}

.tom {
  .drum-head {
    width: 100px;
    height: 50px;
    border-radius: 50%;
  }

  .drum-shell {
    top: 35px;
    height: 60px;
    background: linear-gradient(180deg, #4ecdc4 0%, #3db8b0 50%, #2a9d96 100%);
    box-shadow: inset -3px 0 10px rgba(0, 0, 0, 0.2),
      inset 3px 0 10px rgba(255, 255, 255, 0.1);
  }

  &.active .drum-shell {
    filter: brightness(1.2);
    box-shadow: 0 0 20px rgba(78, 205, 196, 0.5),
      inset -3px 0 10px rgba(0, 0, 0, 0.2);
  }
}

.tom-high .drum-shell {
  background: linear-gradient(180deg, #95e1d3, #7bc9bc, #62b1a5);
}

.tom-mid .drum-shell {
  background: linear-gradient(180deg, #4ecdc4, #3db8b0, #2a9d96);
}

.tom-floor {
  .drum-head {
    width: 130px;
    height: 65px;
  }

  .drum-shell {
    top: 45px;
    height: 100px;
  }

  .floor-shell {
    background: linear-gradient(180deg, #26a69a, #1e8a80, #167b72);
  }

  .floor-legs {
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 25px;
    display: flex;
    justify-content: space-between;

    &::before,
    &::after {
      content: "";
      width: 6px;
      height: 25px;
      background: linear-gradient(90deg, #404040, #606060, #404040);
      border-radius: 0 0 3px 3px;
    }
  }
}

.snare {
  .snare-body {
    .drum-head {
      width: 120px;
      height: 50px;
    }
  }

  .snare-shell {
    top: 35px;
    height: 35px;
    background: linear-gradient(180deg, #b0b0b0 0%, #909090 50%, #707070 100%);
    box-shadow: inset -3px 0 10px rgba(0, 0, 0, 0.3),
      0 5px 15px rgba(0, 0, 0, 0.3);
  }

  .snare-wires {
    position: absolute;
    bottom: -5px;
    left: 10%;
    width: 80%;
    height: 8px;
    display: flex;
    justify-content: space-between;

    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background: repeating-linear-gradient(
        90deg,
        #c0c0c0 0px,
        #c0c0c0 2px,
        transparent 2px,
        transparent 5px
      );
    }
  }

  &.active .snare-shell {
    filter: brightness(1.1);
    box-shadow: 0 0 25px rgba(176, 176, 176, 0.5),
      inset -3px 0 10px rgba(0, 0, 0, 0.3);
  }
}

.main-drums-row {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 3em;
}

.kick {
  .kick-body {
    position: relative;
    width: 180px;
    height: 180px;
  }

  .kick-front {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(145deg, #2d2d2d 0%, #1a1a1a 50%, #0d0d0d 100%);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5),
      inset 0 5px 20px rgba(255, 255, 255, 0.05),
      inset 0 -5px 20px rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;

    &::before {
      content: "";
      position: absolute;
      width: 85%;
      height: 85%;
      border-radius: 50%;
      border: 3px solid rgba(255, 255, 255, 0.1);
    }
  }

  .kick-logo {
    font-size: 4em;
    filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.5));
  }

  .kick-shell {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(90deg, #1a1a1a 0%, #2d2d2d 10%, #1a1a1a 100%);
    z-index: 1;
  }

  .kick-beater {
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 40px;
    background: linear-gradient(90deg, #404040, #606060, #404040);
    border-radius: 5px;
    z-index: 3;

    &::before {
      content: "";
      position: absolute;
      bottom: 5px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: linear-gradient(145deg, #505050, #303030);
    }
  }

  &.active {
    .kick-front {
      filter: brightness(1.2);
      box-shadow: 0 0 40px rgba(255, 107, 107, 0.3),
        0 10px 30px rgba(0, 0, 0, 0.5);
    }
  }
}

.drum-label {
  position: absolute;
  bottom: -28px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75em;
  color: #808080;
  white-space: nowrap;
  font-family: "Lexend", sans-serif;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.ripple-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.ripple {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--ripple-color, rgba(255, 255, 255, 0.5));
  transform: translate(-50%, -50%);
  animation: rippleEffect 0.6s ease-out forwards;
}

@keyframes rippleEffect {
  0% {
    width: 10px;
    height: 10px;
    opacity: 0.8;
  }
  100% {
    width: 200px;
    height: 200px;
    opacity: 0;
  }
}

// Keyboard hints
.keyboard-hints {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  padding: 1.5em 2em;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.hint-title {
  font-size: 0.9em;
  color: #808080;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hints-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5em 2em;
}

.hint {
  font-size: 0.8em;
  color: #a0a0a0;
  padding: 0.3em 0.8em;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  font-family: "Lexend", sans-serif;
}
</style>
