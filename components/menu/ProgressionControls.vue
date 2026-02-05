<template>
  <div class="settings-toolbar">
    <div class="control-group">
      <div class="control-item">
        <label class="control-label">Key</label>
        <select v-model="progressionKey" class="styled-select key-select">
          <option v-for="note in notes" :key="note" :value="note">
            {{ note }}
          </option>
        </select>
      </div>
    </div>

    <div class="control-group">
      <div class="control-item">
        <label class="control-label">Bars</label>
        <select v-model.number="totalBars" class="styled-select bars-select">
          <option :value="2">2</option>
          <option :value="4">4</option>
          <option :value="8">8</option>
          <option :value="12">12</option>
          <option :value="16">16</option>
        </select>
      </div>

      <div class="control-item">
        <label class="control-label">Time</label>
        <select v-model="timeSignature" class="styled-select time-select">
          <option value="4/4">4/4</option>
          <option value="3/4">3/4</option>
          <option value="6/8">6/8</option>
          <option value="2/4">2/4</option>
          <option value="5/4">5/4</option>
          <option value="7/8">7/8</option>
        </select>
      </div>
    </div>

    <div class="control-group tempo-group">
      <div class="tempo-display">
        <label class="control-label">BPM</label>
        <div class="tempo-input-wrapper">
          <button class="tempo-adjust-btn" @click="adjustTempo(-5)">−</button>
          <input
            type="number"
            v-model.number="tempo"
            min="40"
            max="240"
            class="tempo-input"
          />
          <button class="tempo-adjust-btn" @click="adjustTempo(5)">+</button>
        </div>
      </div>

      <div class="tempo-actions">
        <div class="control-item">
          <label class="control-label">Tap</label>
          <button
            class="action-btn tap-btn"
            :class="{ tapped: showTapFeedback }"
            @click="handleTapTempo"
            title="Tap Tempo"
          >
            TAP
            <span v-if="tapCount > 0" class="tap-badge">{{ tapCount }}</span>
          </button>
        </div>

        <div class="control-item">
          <label class="control-label">Click</label>
          <button
            class="action-btn metronome-btn"
            :class="{ active: metronomeEnabled }"
            @click="metronomeEnabled = !metronomeEnabled"
            title="Metronome"
          >
            <Icon name="mdi:metronome" class="btn-icon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  totalBars: Number,
  tempo: Number,
  timeSignature: String,
  progressionKey: String,
  notes: Array,
  tapCount: Number,
  showTapFeedback: Boolean,
  metronomeEnabled: Boolean,
});

const emit = defineEmits([
  "update:totalBars",
  "update:tempo",
  "update:timeSignature",
  "update:progressionKey",
  "update:metronomeEnabled",
  "adjustTempo",
  "tapTempo",
]);

// Computed properties for v-model binding
const totalBars = computed({
  get: () => props.totalBars,
  set: (val) => emit("update:totalBars", val),
});

const tempo = computed({
  get: () => props.tempo,
  set: (val) => emit("update:tempo", val),
});

const timeSignature = computed({
  get: () => props.timeSignature,
  set: (val) => emit("update:timeSignature", val),
});

const progressionKey = computed({
  get: () => props.progressionKey,
  set: (val) => emit("update:progressionKey", val),
});

const metronomeEnabled = computed({
  get: () => props.metronomeEnabled,
  set: (val) => emit("update:metronomeEnabled", val),
});

function adjustTempo(delta) {
  emit("adjustTempo", delta);
}

function handleTapTempo() {
  emit("tapTempo");
}
</script>

<style scoped lang="scss">
.settings-toolbar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4em;
  padding: 0.5em 1em;
  background: rgba(20, 20, 20, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  color: black;

  select,
  button {
    color: white;
  }
}

.control-group {
  display: flex;
  align-items: center;
  gap: 1em;
}

.control-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.control-label {
  font-size: 0.65rem;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.styled-select {
  height: 28px;
  padding: 0 0.5em;
  border: 1px solid #3a3a3a;
  border-radius: 6px;
  background: linear-gradient(180deg, #252525 0%, #1a1a1a 100%);
  color: black;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  min-width: 60px;
  text-align: center;

  &:hover {
    border-color: black;
    background: linear-gradient(180deg, #2d2d2d 0%, #222 100%);
    color: #fff;
  }

  &:focus {
    outline: none;
    border-color: black;
    box-shadow: 0 0 0 2px black;
  }
}

.key-select {
  color: rgb(255, 255, 255);
  font-weight: 700;
  min-width: 50px;

  &:focus {
    border-color: black;
    box-shadow: 0 0 0 2px black;
  }
}

.tempo-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.tempo-input-wrapper {
  display: flex;
  align-items: center;
  gap: 2px;
  background: #151515;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 1px;
}

.tempo-adjust-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #666;
  font-size: 1.1rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.1s;

  &:hover {
    background: #252525;
    color: black;
  }

  &:active {
    background: #333;
  }
}

.tempo-input {
  width: 40px;
  height: 24px;
  background: transparent;
  border: none;
  color: #fbbf24;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  text-align: center;
  padding: 0;

  &:focus {
    outline: none;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  appearance: textfield;
  -moz-appearance: textfield;
}

.tempo-actions {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.action-btn {
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #3a3a3a;
  border-radius: 6px;
  background: linear-gradient(180deg, #252525 0%, #1a1a1a 100%);
  color: black;
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  min-width: 32px;

  &:hover {
    background: linear-gradient(180deg, #2d2d2d 0%, #222 100%);
    border-color: black;
    color: black;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.96);
  }
}

.tap-btn {
  padding: 0 0.6em;
  font-size: 0.7rem;
  letter-spacing: 0.05em;
  position: relative;

  &.tapped {
    background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
    border-color: #f59e0b;
    color: #000;
  }
}

.tap-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #dc2626;
  color: black;
  font-size: 0.55rem;
  height: 14px;
  min-width: 14px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.metronome-btn {
  width: 32px;

  .btn-icon {
    font-size: 1.1rem;
  }

  &.active {
    border-color: black;
    color: black;
    box-shadow: 0 0 8px rgba(34, 211, 238, 0.3);
  }
}
</style>
