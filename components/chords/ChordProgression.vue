<template>
  <div class="chord-progression">
    <div class="progression-header">
      <h3 class="progression-title">Chord Progression</h3>
      <div class="progression-controls">
        <button
          class="control-btn play-btn"
          :class="{ playing: isPlaying }"
          @click="togglePlay"
          :disabled="progression.length === 0"
        >
          <span v-if="!isPlaying">▶</span>
          <span v-else>⏸</span>
        </button>
        <button
          class="control-btn clear-btn"
          @click="clearProgression"
          :disabled="progression.length === 0"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Tempo & Time Controls -->
    <div class="tempo-controls">
      <div class="tempo-group">
        <label class="control-label">BPM</label>
        <div class="tempo-input-group">
          <button class="tempo-btn" @click="adjustTempo(-5)">-</button>
          <input
            type="number"
            v-model.number="tempo"
            min="40"
            max="240"
            class="tempo-input"
          />
          <button class="tempo-btn" @click="adjustTempo(5)">+</button>
        </div>
      </div>

      <!-- Tap Tempo -->
      <div class="tap-tempo-group">
        <button
          class="tap-tempo-btn"
          :class="{ tapped: showTapFeedback }"
          @click="handleTapTempo"
        >
          TAP
        </button>
        <span v-if="tapCount > 0" class="tap-count">{{ tapCount }}</span>
      </div>

      <div class="time-sig-group">
        <label class="control-label">Time</label>
        <select v-model="timeSignature" class="time-select">
          <option value="4/4">4/4</option>
          <option value="3/4">3/4</option>
          <option value="6/8">6/8</option>
          <option value="2/4">2/4</option>
          <option value="5/4">5/4</option>
          <option value="7/8">7/8</option>
        </select>
      </div>

      <div class="bars-group">
        <label class="control-label">Bars</label>
        <select v-model.number="barsPerChord" class="bars-select">
          <option :value="1">1</option>
          <option :value="2">2</option>
          <option :value="4">4</option>
          <option :value="8">8</option>
        </select>
      </div>

      <div class="duration-display">
        <span class="duration-value">{{ chordDurationDisplay }}</span>
        <span class="duration-label">per chord</span>
      </div>
    </div>

    <!-- Drop Zone for Progression -->
    <div
      class="progression-timeline"
      :class="{ 'drag-over': isDragOver, empty: progression.length === 0 }"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <div v-if="progression.length === 0" class="empty-message">
        Drag chords here to build a progression
      </div>

      <TransitionGroup name="chord-list" tag="div" class="chord-slots">
        <div
          v-for="(chord, index) in progression"
          :key="chord.id"
          class="chord-slot"
          :class="{
            active: currentChordIndex === index && isPlaying,
            dragging: draggedIndex === index,
            editing: editingIndex === index,
          }"
          draggable="true"
          @dragstart="handleSlotDragStart($event, index)"
          @dragend="handleSlotDragEnd"
          @dragover.prevent="handleSlotDragOver($event, index)"
          @drop.prevent="handleSlotDrop($event, index)"
        >
          <!-- Edit Mode -->
          <div v-if="editingIndex === index" class="chord-edit">
            <select v-model="chord.root" class="edit-select root-select">
              <option v-for="note in notes" :key="note" :value="note">
                {{ note }}
              </option>
            </select>
            <select v-model="chord.type" class="edit-select type-select">
              <option
                v-for="chordDef in chordTypes"
                :key="chordDef.label"
                :value="chordDef.label"
              >
                {{ formatType(chordDef.label) || chordDef.label }}
              </option>
            </select>
            <button class="edit-done-btn" @click="finishEditing">✓</button>
          </div>

          <!-- Display Mode -->
          <div v-else class="chord-content" @dblclick="startEditing(index)">
            <span class="chord-root">{{ chord.root }}</span>
            <span class="chord-type">{{ formatType(chord.type) }}</span>
          </div>

          <button class="remove-btn" @click="removeChord(index)">×</button>
        </div>
      </TransitionGroup>
    </div>

    <!-- Edit hint -->
    <div
      v-if="progression.length > 0 && editingIndex === null"
      class="edit-hint"
    >
      Double-click a chord to edit
    </div>

    <!-- Playback indicator -->
    <div v-if="isPlaying" class="playback-bar">
      <div
        class="playback-progress"
        :style="{
          width: `${((currentChordIndex + 1) / progression.length) * 100}%`,
        }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { useToneAudio } from "~/composables/useToneAudio";
import { chordLibrary } from "~/composables/chords";

const { playChord, stopAllNotes } = useToneAudio();
const keyboardStore = useKeyboardStore();
const {
  rootNote: storeRootNote,
  chordType: storeChordType,
  chordNotes,
  notes,
} = storeToRefs(keyboardStore);

// Get chord types from library
const chordTypes = computed(() => chordLibrary.value);

// Progression state
const progression = ref([]);
const isDragOver = ref(false);
const draggedIndex = ref(null);
const isPlaying = ref(false);
const currentChordIndex = ref(-1);
const editingIndex = ref(null);
let playbackInterval = null;
let chordIdCounter = 0;

// Tempo & timing controls
const tempo = ref(120); // BPM
const timeSignature = ref("4/4");
const barsPerChord = ref(1);

// Tap tempo state
const tapTimes = ref([]);
const tapCount = ref(0);
const showTapFeedback = ref(false);
let tapResetTimeout = null;

// Calculate beats per bar from time signature
const beatsPerBar = computed(() => {
  const [beats] = timeSignature.value.split("/").map(Number);
  return beats;
});

// Calculate chord duration in milliseconds
const chordDuration = computed(() => {
  const msPerBeat = (60 / tempo.value) * 1000;
  return msPerBeat * beatsPerBar.value * barsPerChord.value;
});

// Display-friendly duration
const chordDurationDisplay = computed(() => {
  const seconds = chordDuration.value / 1000;
  if (seconds < 1) {
    return `${Math.round(chordDuration.value)}ms`;
  }
  return `${seconds.toFixed(1)}s`;
});

// Adjust tempo with bounds
function adjustTempo(delta) {
  const newTempo = tempo.value + delta;
  if (newTempo >= 40 && newTempo <= 240) {
    tempo.value = newTempo;
  }
}

// Tap tempo handler
function handleTapTempo() {
  const now = Date.now();

  // Visual feedback
  showTapFeedback.value = true;
  setTimeout(() => {
    showTapFeedback.value = false;
  }, 100);

  // Reset if more than 2 seconds since last tap
  if (
    tapTimes.value.length > 0 &&
    now - tapTimes.value[tapTimes.value.length - 1] > 2000
  ) {
    tapTimes.value = [];
    tapCount.value = 0;
  }

  tapTimes.value.push(now);
  tapCount.value = tapTimes.value.length;

  // Keep only last 8 taps
  if (tapTimes.value.length > 8) {
    tapTimes.value.shift();
  }

  // Calculate BPM from at least 2 taps
  if (tapTimes.value.length >= 2) {
    const intervals = [];
    for (let i = 1; i < tapTimes.value.length; i++) {
      intervals.push(tapTimes.value[i] - tapTimes.value[i - 1]);
    }
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const calculatedBPM = Math.round(60000 / avgInterval);

    // Clamp to valid range
    tempo.value = Math.max(40, Math.min(240, calculatedBPM));
  }

  // Reset tap count after 3 seconds of no activity
  clearTimeout(tapResetTimeout);
  tapResetTimeout = setTimeout(() => {
    tapTimes.value = [];
    tapCount.value = 0;
  }, 3000);
}

// Chord editing
function startEditing(index) {
  editingIndex.value = index;
}

function finishEditing() {
  editingIndex.value = null;
}

// Handle external chord drop (from ChordGrid)
function handleDragOver(e) {
  isDragOver.value = true;
}

function handleDragLeave() {
  isDragOver.value = false;
}

function handleDrop(e) {
  isDragOver.value = false;

  const data = e.dataTransfer.getData("application/json");
  if (data) {
    try {
      const chord = JSON.parse(data);
      addChord(chord.root, chord.type);
    } catch (err) {
      console.error("Failed to parse dropped chord data", err);
    }
  }
}

// Add chord to progression
function addChord(root, type) {
  progression.value.push({
    id: `chord-${++chordIdCounter}`,
    root,
    type,
  });
}

// Remove chord from progression
function removeChord(index) {
  if (editingIndex.value === index) {
    editingIndex.value = null;
  }
  progression.value.splice(index, 1);
  if (progression.value.length === 0) {
    stopPlayback();
  }
}

// Clear all chords
function clearProgression() {
  stopPlayback();
  editingIndex.value = null;
  progression.value = [];
}

// Internal drag/drop for reordering
function handleSlotDragStart(e, index) {
  if (editingIndex.value !== null) return; // Don't drag while editing
  draggedIndex.value = index;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", index.toString());
}

function handleSlotDragEnd() {
  draggedIndex.value = null;
}

function handleSlotDragOver(e, index) {
  if (draggedIndex.value !== null && draggedIndex.value !== index) {
    e.dataTransfer.dropEffect = "move";
  }
}

function handleSlotDrop(e, targetIndex) {
  const sourceIndex = draggedIndex.value;
  if (sourceIndex !== null && sourceIndex !== targetIndex) {
    const [movedChord] = progression.value.splice(sourceIndex, 1);
    progression.value.splice(targetIndex, 0, movedChord);
  }
  draggedIndex.value = null;
}

// Format chord type for display
function formatType(type) {
  const shortLabels = {
    Major: "",
    Minor: "m",
    "Dominant 7": "7",
    "Major 7": "maj7",
    "Minor 7": "m7",
    Diminished: "dim",
    "Diminished 7": "°7",
    Augmented: "aug",
    "Suspended 2": "sus2",
    "Suspended 4": "sus4",
  };
  return shortLabels[type] !== undefined ? shortLabels[type] : type;
}

// Playback controls
function togglePlay() {
  if (isPlaying.value) {
    stopPlayback();
  } else {
    startPlayback();
  }
}

function startPlayback() {
  if (progression.value.length === 0) return;

  // Close any editing
  editingIndex.value = null;

  isPlaying.value = true;
  currentChordIndex.value = 0;
  playCurrentChord();

  // Use computed chord duration
  playbackInterval = setInterval(() => {
    currentChordIndex.value++;
    if (currentChordIndex.value >= progression.value.length) {
      currentChordIndex.value = 0; // Loop
    }
    playCurrentChord();
  }, chordDuration.value);
}

function stopPlayback() {
  isPlaying.value = false;
  currentChordIndex.value = -1;
  if (playbackInterval) {
    clearInterval(playbackInterval);
    playbackInterval = null;
  }
  if (stopAllNotes) stopAllNotes();
}

function playCurrentChord() {
  const chord = progression.value[currentChordIndex.value];
  if (!chord) return;

  // Update store to trigger chord calculation
  storeRootNote.value = chord.root;
  storeChordType.value = chord.type;

  // Wait for store to update chord notes, then play
  nextTick(() => {
    if (playChord) playChord("play");
    // Stop slightly before next chord
    const stopDelay = Math.max(
      chordDuration.value - 100,
      chordDuration.value * 0.9
    );
    setTimeout(() => {
      if (playChord) playChord("stop");
    }, stopDelay);
  });
}

// Watch for tempo/timing changes during playback - restart if playing
watch([tempo, timeSignature, barsPerChord], () => {
  if (isPlaying.value) {
    stopPlayback();
    startPlayback();
  }
});

// Cleanup on unmount
onUnmounted(() => {
  stopPlayback();
  clearTimeout(tapResetTimeout);
});
</script>

<style scoped lang="scss">
.chord-progression {
  width: 100%;
  padding: 1em;
  background: linear-gradient(180deg, #1a1a1a 0%, #121212 100%);
  border-radius: 12px;
  border: 2px solid #2a2a2a;
  margin-top: 1em;
}

.progression-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8em;
}

.progression-title {
  font-size: 1rem;
  font-weight: 600;
  color: #888;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.progression-controls {
  display: flex;
  gap: 0.5em;
}

.control-btn {
  padding: 0.4em 0.8em;
  border: 2px solid #333;
  border-radius: 6px;
  background: #252525;
  color: #ccc;
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #333;
    border-color: #444;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.play-btn {
  min-width: 40px;

  &.playing {
    background: #b81f1f;
    border-color: #b81f1f;
    color: white;
  }
}

// Tempo controls
.tempo-controls {
  display: flex;
  align-items: center;
  gap: 1.5em;
  padding: 0.8em;
  margin-bottom: 0.8em;
  background: #0f0f0f;
  border-radius: 8px;
  border: 1px solid #2a2a2a;
  flex-wrap: wrap;
}

.control-label {
  display: block;
  font-size: 0.7rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.3em;
}

.tempo-group {
  display: flex;
  flex-direction: column;
}

.tempo-input-group {
  display: flex;
  align-items: center;
  gap: 0.2em;
}

.tempo-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid #333;
  border-radius: 4px;
  background: #1a1a1a;
  color: #aaa;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #252525;
    color: #fff;
  }

  &:active {
    transform: scale(0.95);
  }
}

.tempo-input {
  width: 50px;
  height: 28px;
  padding: 0 0.3em;
  border: 1px solid #333;
  border-radius: 4px;
  background: #1a1a1a;
  color: #ffc552;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #ffc552;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
}

// Tap tempo
.tap-tempo-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.tap-tempo-btn {
  width: 50px;
  height: 36px;
  padding: 0;
  border: 2px solid #444;
  border-radius: 6px;
  background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
  color: #888;
  font-family: inherit;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.1s ease;

  &:hover {
    background: linear-gradient(180deg, #333 0%, #222 100%);
    color: #aaa;
  }

  &:active,
  &.tapped {
    transform: scale(0.95);
    background: linear-gradient(180deg, #ffc552 0%, #e0a830 100%);
    border-color: #ffc552;
    color: #000;
  }
}

.tap-count {
  position: absolute;
  top: -8px;
  right: -8px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: #b81f1f;
  border-radius: 9px;
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.time-sig-group,
.bars-group {
  display: flex;
  flex-direction: column;
}

.time-select,
.bars-select {
  height: 28px;
  padding: 0 0.5em;
  border: 1px solid #333;
  border-radius: 4px;
  background: #1a1a1a;
  color: #ccc;
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #ffc552;
  }
}

.duration-display {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: auto;
}

.duration-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffc552;
}

.duration-label {
  font-size: 0.65rem;
  color: #555;
  text-transform: uppercase;
}

.progression-timeline {
  min-height: 70px;
  padding: 0.8em;
  background: #0a0a0a;
  border-radius: 8px;
  border: 2px dashed #333;
  transition: all 0.2s ease;

  &.drag-over {
    border-color: #ffc552;
    background: rgba(255, 197, 82, 0.05);
  }

  &.empty {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.empty-message {
  color: #555;
  font-size: 0.9rem;
  font-style: italic;
}

.edit-hint {
  margin-top: 0.4em;
  font-size: 0.7rem;
  color: #444;
  text-align: center;
  font-style: italic;
}

.chord-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
}

.chord-slot {
  display: flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.5em 0.4em 0.5em 0.8em;
  background: linear-gradient(180deg, #2a2a2a 0%, #1f1f1f 100%);
  border: 2px solid #333;
  border-radius: 8px;
  cursor: grab;
  transition: all 0.15s ease;
  user-select: none;

  &:hover {
    border-color: #444;
    transform: translateY(-1px);
  }

  &:active {
    cursor: grabbing;
  }

  &.active {
    background: linear-gradient(180deg, #ffc552 0%, #e0a830 100%);
    border-color: #ffc552;

    .chord-root,
    .chord-type {
      color: #000;
    }
  }

  &.dragging {
    opacity: 0.5;
  }

  &.editing {
    cursor: default;
    border-color: #ffc552;
    background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
    padding: 0.3em;
  }
}

.chord-content {
  display: flex;
  align-items: baseline;
  gap: 0.1em;
  cursor: pointer;
}

.chord-edit {
  display: flex;
  align-items: center;
  gap: 0.3em;
}

.edit-select {
  height: 26px;
  padding: 0 0.3em;
  border: 1px solid #444;
  border-radius: 4px;
  background: #1a1a1a;
  color: #ffc552;
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #ffc552;
  }
}

.root-select {
  width: 45px;
}

.type-select {
  width: 70px;
}

.edit-done-btn {
  width: 24px;
  height: 24px;
  padding: 0;
  border: 1px solid #4ade80;
  border-radius: 4px;
  background: rgba(74, 222, 128, 0.2);
  color: #4ade80;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(74, 222, 128, 0.3);
  }
}

.chord-root {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffc552;
}

.chord-type {
  font-size: 0.85rem;
  font-weight: 500;
  color: #aaa;
}

.remove-btn {
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #666;
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 100, 100, 0.2);
    color: #ff6b6b;
  }
}

.playback-bar {
  height: 4px;
  margin-top: 0.8em;
  background: #1a1a1a;
  border-radius: 2px;
  overflow: hidden;
}

.playback-progress {
  height: 100%;
  background: linear-gradient(90deg, #b81f1f, #ffc552);
  transition: width 0.3s ease;
}

// Transition animations
.chord-list-move {
  transition: transform 0.3s ease;
}

.chord-list-enter-active,
.chord-list-leave-active {
  transition: all 0.3s ease;
}

.chord-list-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.chord-list-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
