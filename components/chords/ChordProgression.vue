<template>
  <div class="chord-progression">
    <div class="progression-header">
      <h3 class="progression-title">Chord Progression</h3>
      <div class="key-selector">
        <label class="control-label">Key</label>
        <select v-model="progressionKey" class="key-select">
          <option v-for="note in notes" :key="note" :value="note">
            {{ note }}
          </option>
        </select>
      </div>
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

      <!-- Arpeggiator Controls -->
      <div class="arpeggiator-group">
        <div class="arp-toggle-wrapper">
          <button
            class="arp-toggle-btn"
            :class="{ active: arpeggiatorEnabled }"
            @click="arpeggiatorEnabled = !arpeggiatorEnabled"
          >
            ARP
          </button>
        </div>
        <div v-if="arpeggiatorEnabled" class="arp-options">
          <div class="arp-pattern-group">
            <label class="control-label">Pattern</label>
            <select v-model="arpPattern" class="arp-select">
              <option value="up">Up ↑</option>
              <option value="down">Down ↓</option>
              <option value="upDown">Up-Down ↕</option>
              <option value="downUp">Down-Up ↕</option>
              <option value="random">Random ⚡</option>
            </select>
          </div>
          <div class="arp-rate-group">
            <label class="control-label">Rate</label>
            <div class="arp-rate-control">
              <input
                type="range"
                v-model.number="arpNoteRate"
                min="1"
                max="8"
                step="1"
                class="arp-rate-slider"
              />
              <span class="arp-rate-value">1/{{ arpNoteRate }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Metronome Controls -->
      <div class="metronome-group">
        <div class="metronome-toggle-wrapper">
          <button
            class="metronome-toggle-btn"
            :class="{ active: metronomeEnabled }"
            @click="metronomeEnabled = !metronomeEnabled"
            title="Toggle Metronome"
          >
            <span class="metronome-icon">🔔</span>
          </button>
        </div>
        <div v-if="metronomeEnabled" class="metronome-options">
          <div class="beat-style-group">
            <label class="control-label">Style</label>
            <select v-model="beatStyle" class="beat-style-select">
              <option value="straight">Straight</option>
              <option value="swing">Swing</option>
              <option value="shuffle">Shuffle</option>
              <option value="reggae">Reggae</option>
              <option value="bossa">Bossa Nova</option>
            </select>
          </div>
          <div class="metronome-volume-group">
            <label class="control-label">Vol</label>
            <div class="metronome-volume-control">
              <input
                type="range"
                v-model.number="metronomeVolume"
                min="0"
                max="100"
                step="5"
                class="metronome-volume-slider"
              />
              <span class="metronome-volume-value">{{ metronomeVolume }}%</span>
            </div>
          </div>
        </div>
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
          :class="[
            `degree-${getScaleDegree(chord.root)}`,
            {
              active: currentChordIndex === index && isPlaying,
              dragging: draggedIndex === index,
              editing: editingIndex === index,
            },
          ]"
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

const { playChord, arpeggiate, stopAllNotes, playMetronomeClick } =
  useToneAudio();
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

// Progression key for scale degree coloring
const progressionKey = ref("C");

// Calculate scale degree (1-7) based on progression key
function getScaleDegree(chordRoot) {
  const noteOrder = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const keyIndex = noteOrder.indexOf(progressionKey.value);
  const chordIndex = noteOrder.indexOf(chordRoot);
  if (keyIndex === -1 || chordIndex === -1) return 1;

  // Major scale intervals: 0, 2, 4, 5, 7, 9, 11 (semitones)
  const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11];
  const interval = (chordIndex - keyIndex + 12) % 12;

  // Find closest scale degree
  for (let i = 0; i < majorScaleIntervals.length; i++) {
    if (majorScaleIntervals[i] === interval) {
      return i + 1; // 1-indexed scale degree
    }
  }
  // If not exact match, find closest
  let closest = 1;
  let minDiff = 12;
  for (let i = 0; i < majorScaleIntervals.length; i++) {
    const diff = Math.abs(majorScaleIntervals[i] - interval);
    if (diff < minDiff) {
      minDiff = diff;
      closest = i + 1;
    }
  }
  return closest;
}

// Tempo & timing controls
const tempo = ref(120); // BPM
const timeSignature = ref("4/4");
const barsPerChord = ref(1);

// Tap tempo state
const tapTimes = ref([]);
const tapCount = ref(0);
const showTapFeedback = ref(false);
let tapResetTimeout = null;

// Arpeggiator state
const arpeggiatorEnabled = ref(false);
const arpPattern = ref("up"); // up, down, upDown, downUp, random
const arpNoteRate = ref(4); // Note subdivision: 1 = whole, 2 = half, 4 = quarter, 8 = eighth

// Calculate arpeggio note delay in ms based on tempo and rate
const arpNoteDelay = computed(() => {
  const msPerBeat = (60 / tempo.value) * 1000;
  // Divide beat duration by rate to get time per note
  return msPerBeat / (arpNoteRate.value / 4); // normalized to quarter notes
});

// Metronome state
const metronomeEnabled = ref(false);
const metronomeVolume = ref(70); // 0-100
const beatStyle = ref("straight"); // straight, swing, shuffle, reggae, bossa
let metronomeInterval = null;
let metronomeTimeouts = []; // For complex patterns with multiple sounds per beat
let currentBeat = 0;

// Beat style patterns define timing and accent for each subdivision
// Timing is relative offset (0-1) within a beat, accent is volume multiplier
const beatPatterns = {
  straight: {
    // Simple on-beat clicks, accent on beat 1
    subdivisions: 1,
    getPattern: (beat, beatsPerBar) => [
      {
        offset: 0,
        isAccent: beat === 0,
        muted: false,
      },
    ],
  },
  swing: {
    // Triplet feel - main beat + delayed offbeat
    subdivisions: 2,
    swingAmount: 0.66, // Offbeat delayed to 2/3 of the beat
    getPattern: (beat, beatsPerBar) => [
      {
        offset: 0,
        isAccent: beat === 0,
        muted: false,
      },
      {
        offset: 0.66, // Swung offbeat
        isAccent: false,
        muted: false,
        softer: true,
      },
    ],
  },
  shuffle: {
    // Heavier swing with emphasis
    subdivisions: 2,
    getPattern: (beat, beatsPerBar) => [
      {
        offset: 0,
        isAccent: beat === 0 || beat === 2,
        muted: false,
      },
      {
        offset: 0.66,
        isAccent: false,
        muted: false,
        softer: true,
      },
    ],
  },
  reggae: {
    // One-drop: emphasis on beats 2 and 4, beat 1 is quiet
    subdivisions: 1,
    getPattern: (beat, beatsPerBar) => [
      {
        offset: 0,
        isAccent: beat === 1 || beat === 3, // Accent on 2 and 4
        muted: beat === 0, // Beat 1 is very quiet (one-drop)
        softer: beat === 2,
      },
    ],
  },
  bossa: {
    // Bossa nova pattern: syncopated feel
    subdivisions: 2,
    getPattern: (beat, beatsPerBar) => {
      // Pattern: 1-and, 2, and-of-3, 4
      if (beat === 0) {
        return [
          { offset: 0, isAccent: true, muted: false },
          { offset: 0.5, isAccent: false, muted: false, softer: true },
        ];
      } else if (beat === 1) {
        return [{ offset: 0, isAccent: false, muted: false }];
      } else if (beat === 2) {
        return [{ offset: 0.5, isAccent: false, muted: false, softer: true }];
      } else {
        return [{ offset: 0, isAccent: false, muted: false }];
      }
    },
  },
};

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

  // Start metronome if enabled
  if (metronomeEnabled.value) {
    startMetronome();
  }
}

function stopPlayback() {
  isPlaying.value = false;
  currentChordIndex.value = -1;
  if (playbackInterval) {
    clearInterval(playbackInterval);
    playbackInterval = null;
  }
  stopMetronome();
  if (stopAllNotes) stopAllNotes();
}

// Metronome functions
function startMetronome() {
  stopMetronome(); // Clear any existing

  const msPerBeat = (60 / tempo.value) * 1000;
  currentBeat = 0;

  // Play first beat pattern immediately
  playBeatPattern(0, msPerBeat);
  currentBeat = 1;

  // Set up interval for subsequent beats
  metronomeInterval = setInterval(() => {
    const beatInBar = currentBeat % beatsPerBar.value;
    playBeatPattern(beatInBar, msPerBeat);
    currentBeat++;
  }, msPerBeat);
}

function playBeatPattern(beatInBar, msPerBeat) {
  const pattern = beatPatterns[beatStyle.value] || beatPatterns.straight;
  const clicks = pattern.getPattern(beatInBar, beatsPerBar.value);

  clicks.forEach((click) => {
    const delay = click.offset * msPerBeat;

    if (delay === 0) {
      // Play immediately
      playClick(click);
    } else {
      // Schedule for later in the beat
      const timeout = setTimeout(() => {
        playClick(click);
      }, delay);
      metronomeTimeouts.push(timeout);
    }
  });
}

function playClick(click) {
  if (click.muted) {
    // Very quiet click for muted beats (like reggae beat 1)
    playMetronomeClick(false, metronomeVolume.value * 0.2);
  } else if (click.softer) {
    // Softer click for offbeats
    playMetronomeClick(false, metronomeVolume.value * 0.6);
  } else {
    // Normal or accent click
    playMetronomeClick(click.isAccent, metronomeVolume.value);
  }
}

function stopMetronome() {
  if (metronomeInterval) {
    clearInterval(metronomeInterval);
    metronomeInterval = null;
  }
  // Clear any pending timeouts
  metronomeTimeouts.forEach((t) => clearTimeout(t));
  metronomeTimeouts = [];
  currentBeat = 0;
}

function playCurrentChord() {
  const chord = progression.value[currentChordIndex.value];
  if (!chord) return;

  // Update store to trigger chord calculation
  storeRootNote.value = chord.root;
  storeChordType.value = chord.type;

  // Wait for store to update chord notes, then play
  nextTick(() => {
    if (arpeggiatorEnabled.value) {
      // Use arpeggiator
      arpeggiate("play", {
        pattern: arpPattern.value,
        noteDelay: arpNoteDelay.value,
        noteDuration: arpNoteDelay.value * 0.9, // Slight overlap prevention
      });
    } else {
      // Play chord normally
      if (playChord) playChord("play");
    }

    // Stop slightly before next chord
    const stopDelay = Math.max(
      chordDuration.value - 100,
      chordDuration.value * 0.9
    );
    setTimeout(() => {
      if (arpeggiatorEnabled.value) {
        arpeggiate("stop");
      } else {
        if (playChord) playChord("stop");
      }
    }, stopDelay);
  });
}

// Watch for tempo/timing/arpeggiator changes during playback - restart if playing
watch(
  [
    tempo,
    timeSignature,
    barsPerChord,
    arpeggiatorEnabled,
    arpPattern,
    arpNoteRate,
  ],
  () => {
    if (isPlaying.value) {
      stopPlayback();
      startPlayback();
    }
  }
);

// Watch for metronome toggle or style change during playback
watch([metronomeEnabled, beatStyle], ([enabled]) => {
  if (isPlaying.value) {
    if (enabled) {
      startMetronome(); // Restart with new style
    } else {
      stopMetronome();
    }
  }
});

// Cleanup on unmount
onUnmounted(() => {
  stopPlayback();
  stopMetronome();
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
  appearance: textfield;
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

// Arpeggiator styles
.arpeggiator-group {
  display: flex;
  align-items: center;
  gap: 1em;
  padding-left: 1em;
  border-left: 1px solid #333;
  margin-left: 0.5em;
}

.arp-toggle-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.arp-toggle-btn {
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
  transition: all 0.15s ease;

  &:hover {
    background: linear-gradient(180deg, #333 0%, #222 100%);
    color: #aaa;
  }

  &.active {
    background: linear-gradient(180deg, #7c3aed 0%, #5b21b6 100%);
    border-color: #7c3aed;
    color: white;
    box-shadow: 0 0 12px rgba(124, 58, 237, 0.4);
  }
}

.arp-options {
  display: flex;
  align-items: center;
  gap: 1em;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.arp-pattern-group,
.arp-rate-group {
  display: flex;
  flex-direction: column;
}

.arp-select {
  height: 28px;
  padding: 0 0.5em;
  border: 1px solid #333;
  border-radius: 4px;
  background: #1a1a1a;
  color: #ccc;
  font-family: inherit;
  font-size: 0.8rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #7c3aed;
  }
}

.arp-rate-control {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.arp-rate-slider {
  width: 70px;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: #333;
  border-radius: 3px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: linear-gradient(180deg, #7c3aed 0%, #5b21b6 100%);
    cursor: pointer;
    border: 2px solid #fff;
    box-shadow: 0 0 6px rgba(124, 58, 237, 0.5);
  }

  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: linear-gradient(180deg, #7c3aed 0%, #5b21b6 100%);
    cursor: pointer;
    border: 2px solid #fff;
    box-shadow: 0 0 6px rgba(124, 58, 237, 0.5);
  }
}

.arp-rate-value {
  font-size: 0.8rem;
  font-weight: 600;
  color: #7c3aed;
  min-width: 30px;
}

// Metronome styles
.metronome-group {
  display: flex;
  align-items: center;
  gap: 0.8em;
  padding-left: 1em;
  border-left: 1px solid #333;
  margin-left: 0.5em;
}

.metronome-toggle-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metronome-toggle-btn {
  width: 44px;
  height: 36px;
  padding: 0;
  border: 2px solid #444;
  border-radius: 6px;
  background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
  color: #888;
  font-family: inherit;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: linear-gradient(180deg, #333 0%, #222 100%);
  }

  &.active {
    background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
    border-color: #f59e0b;
    box-shadow: 0 0 12px rgba(245, 158, 11, 0.4);

    .metronome-icon {
      animation: metronomePulse 0.5s ease-in-out infinite;
    }
  }
}

.metronome-icon {
  font-size: 1.1rem;
  line-height: 1;
}

@keyframes metronomePulse {
  0%,
  100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

.metronome-options {
  display: flex;
  align-items: center;
  gap: 0.8em;
  animation: fadeIn 0.2s ease;
}

.beat-style-group {
  display: flex;
  flex-direction: column;
}

.beat-style-select {
  height: 28px;
  padding: 0 0.5em;
  border: 1px solid #333;
  border-radius: 4px;
  background: #1a1a1a;
  color: #ccc;
  font-family: inherit;
  font-size: 0.8rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #f59e0b;
  }
}

.metronome-volume-group {
  display: flex;
  flex-direction: column;
}

.metronome-volume-control {
  display: flex;
  align-items: center;
  gap: 0.4em;
}

.metronome-volume-slider {
  width: 60px;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: #333;
  border-radius: 3px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
    cursor: pointer;
    border: 2px solid #fff;
    box-shadow: 0 0 6px rgba(245, 158, 11, 0.5);
  }

  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
    cursor: pointer;
    border: 2px solid #fff;
    box-shadow: 0 0 6px rgba(245, 158, 11, 0.5);
  }
}

.metronome-volume-value {
  font-size: 0.75rem;
  font-weight: 600;
  color: #f59e0b;
  min-width: 35px;
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

  // Scale degree colors (I through vii°)
  &.degree-1 {
    background: linear-gradient(180deg, #8b1a1a 0%, #6a1414 100%);
    border-color: #8b1a1a;
    .chord-root,
    .chord-type {
      color: #fff;
    }
  }
  &.degree-2 {
    background: linear-gradient(180deg, #a4a424 0%, #7d7d1c 100%);
    border-color: #a4a424;
    .chord-root,
    .chord-type {
      color: #fff;
    }
  }
  &.degree-3 {
    background: linear-gradient(180deg, #d44488 0%, #a33569 100%);
    border-color: #d44488;
    .chord-root,
    .chord-type {
      color: #fff;
    }
  }
  &.degree-4 {
    background: linear-gradient(180deg, #1a8b8b 0%, #146969 100%);
    border-color: #1a8b8b;
    .chord-root,
    .chord-type {
      color: #fff;
    }
  }
  &.degree-5 {
    background: linear-gradient(180deg, #3366aa 0%, #274f82 100%);
    border-color: #3366aa;
    .chord-root,
    .chord-type {
      color: #fff;
    }
  }
  &.degree-6 {
    background: linear-gradient(180deg, #dd8844 0%, #aa6633 100%);
    border-color: #dd8844;
    .chord-root,
    .chord-type {
      color: #fff;
    }
  }
  &.degree-7 {
    background: linear-gradient(180deg, #9944cc 0%, #73339a 100%);
    border-color: #9944cc;
    .chord-root,
    .chord-type {
      color: #fff;
    }
  }
}

// Key selector styles
.key-selector {
  display: flex;
  flex-direction: column;
  margin-right: auto;
  margin-left: 1em;
}

.key-select {
  height: 28px;
  padding: 0 0.5em;
  border: 1px solid #333;
  border-radius: 4px;
  background: #1a1a1a;
  color: #ffc552;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #ffc552;
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
