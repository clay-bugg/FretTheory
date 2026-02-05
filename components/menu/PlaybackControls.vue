<template>
  <div class="playback-controls">
    <div class="control-title"></div>
    <button
      class="transport-btn play-btn"
      :class="{ playing: isPlaying }"
      @click="$emit('togglePlay')"
      :disabled="!hasChords"
      :title="isPlaying ? 'Pause' : 'Play'"
    >
      <span v-if="!isPlaying"
        ><Icon name="fa6-solid:play" class="playback-icon"
      /></span>
      <span v-else>⏸</span>
    </button>

    <button
      class="transport-btn stop-btn"
      @click="$emit('stopPlayback')"
      :disabled="!isPlaying && !hasChords"
      title="Stop"
    >
      <Icon name="fa6-solid:stop" class="playback-icon" />
    </button>

    <button
      class="transport-btn clear-btn"
      @click="$emit('clearProgression')"
      :disabled="!hasChords"
      title="Clear All"
    >
      <Icon name="fa6-solid:ban" class="playback-icon" />
    </button>

    <button
      class="transport-btn undo-btn"
      @click="$emit('undo')"
      :disabled="!canUndo"
      title="Undo (Ctrl+Z)"
    >
      <Icon name="fa6-solid:rotate-left" class="playback-icon" />
    </button>
  </div>
</template>

<script setup>
defineProps({
  isPlaying: {
    type: Boolean,
    required: true,
  },
  hasChords: {
    type: Boolean,
    required: true,
  },
  canUndo: {
    type: Boolean,
    required: true,
  },
});

defineEmits(["togglePlay", "stopPlayback", "clearProgression", "undo"]);
</script>

<style scoped lang="scss">
.playback-controls {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
}

// Primary transport buttons (play, stop, etc)
.transport-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  background: linear-gradient(180deg, #252525 0%, #1a1a1a 100%);
  color: #999;
  font-family: inherit;
  padding: 0;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: linear-gradient(180deg, #2d2d2d 0%, #222 100%);
    border-color: #555;
    color: #fff;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  .playback-icon {
    width: 14px;
    height: 14px;
  }
}

.play-btn {
  &:hover:not(:disabled) {
    color: #4ade80;
    border-color: #4ade80;
    box-shadow: 0 0 12px rgba(74, 222, 128, 0.2);
  }

  &.playing {
    color: #4ade80;
    border-color: #4ade80;
    background: linear-gradient(180deg, #1a3a25 0%, #0f2a1a 100%);
  }
}

.stop-btn {
  &:hover:not(:disabled) {
    color: #f87171;
    border-color: #f87171;
    box-shadow: 0 0 12px rgba(248, 113, 113, 0.2);
  }
}

.clear-btn {
  &:hover:not(:disabled) {
    color: #fbbf24;
    border-color: #fbbf24;
    box-shadow: 0 0 12px rgba(251, 191, 36, 0.2);
  }
}

.undo-btn {
  &:hover:not(:disabled) {
    color: #60a5fa;
    border-color: #60a5fa;
    box-shadow: 0 0 12px rgba(96, 165, 250, 0.2);
  }
}
</style>
