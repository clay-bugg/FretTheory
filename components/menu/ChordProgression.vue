<template>
  <div class="chord-progression">
    <div class="settings-panel">
      <div class="setting-group" id="total-bars">
        <label class="setting-label">Total Bars</label>
        <select v-model.number="totalBars" class="setting-select">
          <option :value="2">2</option>
          <option :value="4">4</option>
          <option :value="8">8</option>
          <option :value="12">12</option>
          <option :value="16">16</option>
        </select>
      </div>

      <div class="setting-group">
        <span class="tempo-label">BPM</span>
        <div class="tempo-controls">
          <button class="tempo-adjust" @click="adjustTempo(-5)">−</button>

          <div class="tempo-display">
            <input
              type="number"
              v-model.number="tempo"
              min="40"
              max="240"
              class="tempo-input"
            />
          </div>

          <button class="tempo-adjust" @click="adjustTempo(5)">+</button>
          <button
            class="transport-btn tap-btn"
            :class="{ tapped: showTapFeedback }"
            @click="handleTapTempo"
            title="Tap Tempo"
          >
            TAP
            <span v-if="tapCount > 0" class="tap-badge">{{ tapCount }}</span>
          </button>
          <button
            class="transport-btn metronome-btn"
            :class="{ active: metronomeRunning }"
            @click="toggleMetronome"
            title="Play Metronome"
          >
            <Icon
              v-if="!metronomeRunning"
              name="fa6-solid:play"
              class="metronome-icon"
            />
            <Icon v-else name="fa6-solid:stop" class="metronome-icon" />
          </button>
        </div>
      </div>

      <div class="time-signature-control">
        <select v-model="timeSignature" class="time-select">
          <option value="4/4">4/4</option>
          <option value="3/4">3/4</option>
          <option value="6/8">6/8</option>
          <option value="2/4">2/4</option>
          <option value="5/4">5/4</option>
          <option value="7/8">7/8</option>
        </select>
      </div>

      <div class="key-selector">
        <label class="mini-label">Key</label>
        <select v-model="progressionKey" class="key-select">
          <option v-for="note in notes" :key="note" :value="note">
            {{ note }}
          </option>
        </select>
      </div>
    </div>

    <div class="timeline-container" :class="{ 'multi-row': totalBars > 4 }">
      <template v-if="totalBars > 4">
        <div
          v-for="rowIndex in Math.ceil(totalBars / 4)"
          :key="'row-' + rowIndex"
          class="timeline-row"
        >
          <!-- Bar markers for this row -->
          <div class="bar-markers">
            <div
              v-for="bar in getBarsForRow(rowIndex)"
              :key="'marker-' + bar"
              class="bar-marker"
              :style="{ width: `${100 / Math.min(4, totalBars)}%` }"
            >
              <span class="bar-number">{{ bar }}</span>
            </div>
          </div>

          <!-- Beat grid track for this row -->
          <div
            class="timeline-track"
            :style="{
              gridTemplateColumns: `repeat(${getBeatsForRow(rowIndex).length}, 1fr)`,
            }"
          >
            <div
              v-for="beat in getBeatsForRow(rowIndex)"
              :key="'beat-' + beat"
              class="beat-cell"
              :class="{
                'bar-start': (beat - 1) % beatsPerBar === 0,
                'drag-over': dragOverBeat === beat,
                'has-chord': getBeatChord(beat),
                'chord-start': isChordStart(beat),
                playing: isPlaying && currentBeatIndex === beat,
              }"
              @dragover.prevent="handleBeatDragOver($event, beat)"
              @dragleave="handleBeatDragLeave"
              @drop.prevent="handleBeatDrop($event, beat)"
              @click="handleBeatClick($event, beat)"
            >
              <!-- Empty slot indicator -->
              <span v-if="!getBeatChord(beat)" class="add-indicator">+</span>

              <template v-if="isChordStart(beat)">
                <div
                  class="chord-block"
                  :class="[`degree-${getScaleDegree(getBeatChord(beat).root)}`]"
                  :style="{
                    width: getChordBlockWidth(beat, rowIndex),
                  }"
                >
                  <span class="chord-name">
                    {{ getBeatChord(beat).root
                    }}{{ formatType(getBeatChord(beat).type) }}
                  </span>
                  <button
                    class="remove-chord-btn"
                    @click.stop="removeChordAtBeat(beat)"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <!-- Bar markers -->
        <div class="bar-markers">
          <div
            v-for="bar in totalBars"
            :key="'marker-' + bar"
            class="bar-marker"
            :style="{ width: `${(beatsPerBar / totalBeats) * 100}%` }"
          >
            <span class="bar-number">{{ bar }}</span>
          </div>
        </div>

        <!-- Beat grid track -->
        <div
          class="timeline-track"
          :style="{ gridTemplateColumns: `repeat(${totalBeats}, 1fr)` }"
        >
          <div
            v-for="beat in totalBeats"
            :key="'beat-' + beat"
            class="beat-cell"
            :class="{
              'bar-start': (beat - 1) % beatsPerBar === 0,
              'drag-over': dragOverBeat === beat,
              'has-chord': getBeatChord(beat),
              'chord-start': isChordStart(beat),
              playing: isPlaying && currentBeatIndex === beat,
            }"
            @dragover.prevent="handleBeatDragOver($event, beat)"
            @dragleave="handleBeatDragLeave"
            @drop.prevent="handleBeatDrop($event, beat)"
            @click="handleBeatClick($event, beat)"
          >
            <!-- Empty slot indicator -->
            <span v-if="!getBeatChord(beat)" class="add-indicator">+</span>

            <template v-if="isChordStart(beat)">
              <div
                class="chord-block"
                :class="[`degree-${getScaleDegree(getBeatChord(beat).root)}`]"
                :style="{
                  width: `calc(${getBeatChord(beat).duration * 100}% + ${
                    (getBeatChord(beat).duration - 1) * 2
                  }px)`,
                }"
              >
                <span class="chord-name">
                  {{ getBeatChord(beat).root
                  }}{{ formatType(getBeatChord(beat).type) }}
                </span>
                <button
                  class="remove-chord-btn"
                  @click.stop="removeChordAtBeat(beat)"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            </template>
          </div>
        </div>
      </template>

      <!-- Playback progress -->
      <div
        v-if="isPlaying"
        class="playback-indicator"
        :class="{ 'multi-row': totalBars > 8 }"
      >
        <div class="playback-head" :style="getPlaybackHeadStyle()"></div>
      </div>
    </div>

    <div class="playback-controls">
      <button
        class="transport-btn play-btn"
        :class="{ playing: isPlaying }"
        @click="togglePlay"
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
        @click="stopPlayback"
        :disabled="!isPlaying && !hasChords"
        title="Stop"
      >
        <Icon name="fa6-solid:stop" class="playback-icon" />
      </button>
      <button
        class="transport-btn clear-btn"
        @click="clearProgression"
        :disabled="!hasChords"
        title="Clear All"
      >
        <Icon name="fa6-solid:ban" class="playback-icon" />
      </button>
    </div>

    <MenuChordCreatorPopover
      :visible="popoverVisible"
      :beat="popoverBeat"
      :x="popoverX"
      :y="popoverY"
      :existing-chord="popoverExistingChord"
      @confirm="handlePopoverConfirm"
      @close="closePopover"
      @preview="handleChordPreview"
    />
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

// Popover state for chord creation
const popoverVisible = ref(false);
const popoverBeat = ref(1);
const popoverX = ref(0);
const popoverY = ref(0);
const popoverExistingChord = ref(null);

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

// Beat grid state
const totalBars = ref(4);
const dropDuration = ref(4); // How many beats a dropped chord will span
const beatChords = ref({}); // Map of beat number -> chord object
const dragOverBeat = ref(null);
const currentBeatIndex = ref(0);

// Compute total beats based on bars and time signature
const totalBeats = computed(() => {
  return totalBars.value * beatsPerBar.value;
});

// Get chord at a specific beat (could be the start beat or a continuation)
function getBeatChord(beat) {
  // Check if this beat has a chord starting here
  if (beatChords.value[beat]) {
    return beatChords.value[beat];
  }
  // Check if a previous chord extends into this beat
  for (let b = beat - 1; b >= 1; b--) {
    const chord = beatChords.value[b];
    if (chord && b + chord.duration > beat) {
      return chord;
    }
  }
  return null;
}

// Check if this beat is the start of a chord
function isChordStart(beat) {
  return !!beatChords.value[beat];
}

// Multi-row helper: Get bars for a specific row (4 bars per row)
function getBarsForRow(rowIndex) {
  const startBar = (rowIndex - 1) * 4 + 1;
  const endBar = Math.min(rowIndex * 4, totalBars.value);
  const bars = [];
  for (let bar = startBar; bar <= endBar; bar++) {
    bars.push(bar);
  }
  return bars;
}

// Multi-row helper: Get beats for a specific row
function getBeatsForRow(rowIndex) {
  const barsInRow = getBarsForRow(rowIndex);
  const startBeat = (barsInRow[0] - 1) * beatsPerBar.value + 1;
  const endBeat = barsInRow[barsInRow.length - 1] * beatsPerBar.value;
  const beats = [];
  for (let beat = startBeat; beat <= endBeat; beat++) {
    beats.push(beat);
  }
  return beats;
}

// Multi-row helper: Calculate chord block width, clipping at row boundaries
function getChordBlockWidth(beat, rowIndex) {
  const chord = beatChords.value[beat];
  if (!chord) return "100%";

  // Calculate the end beat of this row
  const rowBeats = getBeatsForRow(rowIndex);
  const rowEndBeat = rowBeats[rowBeats.length - 1];

  // Clip the chord duration to not extend past the current row
  const effectiveDuration = Math.min(chord.duration, rowEndBeat - beat + 1);

  return `calc(${effectiveDuration * 100}% + ${(effectiveDuration - 1) * 2}px)`;
}

// Multi-row helper: Get playback head style (position within row)
function getPlaybackHeadStyle() {
  if (totalBars.value <= 4) {
    // Single row - original logic
    return {
      left: `${((currentBeatIndex.value - 0.5) / totalBeats.value) * 100}%`,
    };
  }

  // Multi-row: determine which row and position within that row
  const beatsPerRow = 4 * beatsPerBar.value;
  const currentRow = Math.ceil(currentBeatIndex.value / beatsPerRow);
  const beatWithinRow = ((currentBeatIndex.value - 1) % beatsPerRow) + 1;

  // Position within the row
  const leftPercent = ((beatWithinRow - 0.5) / beatsPerRow) * 100;

  // Calculate vertical position based on row (approximate row height)
  // Each row is roughly the same height
  const rowHeight = 100 / Math.ceil(totalBars.value / 4);
  const topPercent = (currentRow - 1) * rowHeight;

  return {
    left: `${leftPercent}%`,
    top: `${topPercent}%`,
    height: `${rowHeight}%`,
  };
}

// Handle drag over a beat cell
function handleBeatDragOver(e, beat) {
  dragOverBeat.value = beat;
}

function handleBeatDragLeave() {
  dragOverBeat.value = null;
}

// Handle drop on a beat cell
function handleBeatDrop(e, beat) {
  dragOverBeat.value = null;

  const data = e.dataTransfer.getData("application/json");
  if (data) {
    try {
      const chordData = JSON.parse(data);
      addChordAtBeat(beat, chordData.root, chordData.type, dropDuration.value);
    } catch (err) {
      console.error("Failed to parse dropped chord data", err);
    }
  }
}

// Add chord at a specific beat
function addChordAtBeat(beat, root, type, duration) {
  // Remove any overlapping chords
  for (let b = beat; b < beat + duration && b <= totalBeats.value; b++) {
    if (beatChords.value[b]) {
      delete beatChords.value[b];
    }
  }
  // Also remove chords that would extend into this new chord
  for (let b = 1; b < beat; b++) {
    const chord = beatChords.value[b];
    if (chord && b + chord.duration > beat) {
      chord.duration = beat - b; // Truncate the overlapping chord
    }
  }

  beatChords.value[beat] = {
    id: `chord-${++chordIdCounter}`,
    root,
    type,
    duration: Math.min(duration, totalBeats.value - beat + 1),
  };
}

// Remove chord at a specific beat
function removeChordAtBeat(beat) {
  delete beatChords.value[beat];
}

// Handle clicking on a beat - open popover
function handleBeatClick(event, beat) {
  // If there's an existing chord, we're editing it
  const existingChord = beatChords.value[beat];

  // Get position for popover (near the clicked element)
  const rect = event.target.getBoundingClientRect();
  popoverX.value = rect.left + rect.width / 2;
  popoverY.value = rect.bottom + 10;

  popoverBeat.value = beat;
  popoverExistingChord.value = existingChord || null;
  popoverVisible.value = true;
}

// Handle popover confirm - add chord to beat
function handlePopoverConfirm(data) {
  addChordAtBeat(data.beat, data.root, data.type, data.duration);
  closePopover();
}

// Close the popover
function closePopover() {
  popoverVisible.value = false;
  popoverExistingChord.value = null;
}

// Handle chord preview - nothing special needed, store updates trigger piano highlight
function handleChordPreview() {
  // The ChordCreatorPopover already updates the store
  // The piano keyboard will highlight based on store state
}

// Check if progression has any chords
const hasChords = computed(() => {
  return Object.keys(beatChords.value).length > 0;
});

// Tempo & timing controls
const tempo = ref(120); // BPM
const timeSignature = ref("4/4");
const barsPerChord = ref(1); // For old playback system compatibility

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
const metronomeRunning = ref(false);
const metronomeVolume = ref(70); // 0-100
const beatStyle = ref("straight"); // straight, swing, shuffle, reggae, bossa
let metronomeInterval = null;
let metronomeTimeouts = []; // For complex patterns with multiple sounds per beat
let currentMetronomeBeat = 0;

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

// Metronome controls
function toggleMetronome() {
  if (metronomeRunning.value) {
    stopMetronome();
  } else {
    startMetronome();
  }
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
  beatChords.value = {}; // Clear beat grid chords
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
  if (!hasChords.value) return;

  // Close any editing
  editingIndex.value = null;

  isPlaying.value = true;
  currentBeatIndex.value = 1; // Start at beat 1

  // Play first beat immediately
  playBeatChord(1);

  // Calculate ms per beat
  const msPerBeat = (60 / tempo.value) * 1000;

  // Set up interval for beat-by-beat playback
  playbackInterval = setInterval(() => {
    currentBeatIndex.value++;
    if (currentBeatIndex.value > totalBeats.value) {
      currentBeatIndex.value = 1; // Loop back to start
    }
    playBeatChord(currentBeatIndex.value);
  }, msPerBeat);

  // Start metronome if enabled
  if (metronomeEnabled.value) {
    startMetronome();
  }
}

function stopPlayback() {
  isPlaying.value = false;
  currentBeatIndex.value = 0;
  currentChordIndex.value = -1;
  if (playbackInterval) {
    clearInterval(playbackInterval);
    playbackInterval = null;
  }
  stopMetronome();
  if (stopAllNotes) stopAllNotes();
}

// Play chord at a specific beat (only if it's a chord start)
function playBeatChord(beat) {
  const chord = beatChords.value[beat];
  if (!chord) return; // No chord starts at this beat

  // Update store to trigger chord calculation
  storeRootNote.value = chord.root;
  storeChordType.value = chord.type;

  // Wait for store to update chord notes, then play
  nextTick(() => {
    // Stop any previous chord first
    if (playChord) playChord("stop");
    if (arpeggiate) arpeggiate("stop");

    if (arpeggiatorEnabled.value) {
      // Use arpeggiator
      arpeggiate("play", {
        pattern: arpPattern.value,
        noteDelay: arpNoteDelay.value,
        noteDuration: arpNoteDelay.value * 0.9,
      });
    } else {
      // Play chord normally
      if (playChord) playChord("play");
    }

    // Calculate when to stop this chord (based on its duration)
    const msPerBeat = (60 / tempo.value) * 1000;
    const chordDurationMs = chord.duration * msPerBeat;
    const stopDelay = Math.max(chordDurationMs - 50, chordDurationMs * 0.95);

    setTimeout(() => {
      // Only stop if we're still on this chord
      if (arpeggiatorEnabled.value) {
        arpeggiate("stop");
      } else {
        if (playChord) playChord("stop");
      }
    }, stopDelay);
  });
}

// Legacy function for old progression system (keeping for compatibility)
function playCurrentChord() {
  const chord = progression.value[currentChordIndex.value];
  if (!chord) return;

  storeRootNote.value = chord.root;
  storeChordType.value = chord.type;

  nextTick(() => {
    if (arpeggiatorEnabled.value) {
      arpeggiate("play", {
        pattern: arpPattern.value,
        noteDelay: arpNoteDelay.value,
        noteDuration: arpNoteDelay.value * 0.9,
      });
    } else {
      if (playChord) playChord("play");
    }

    const stopDelay = Math.max(
      chordDuration.value - 100,
      chordDuration.value * 0.9,
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

// Metronome functions
function startMetronome() {
  stopMetronome(); // Clear any existing
  metronomeRunning.value = true;

  const msPerBeat = (60 / tempo.value) * 1000;
  let metronomeBeat = 0;

  // Play first beat pattern immediately
  playBeatPattern(0, msPerBeat);
  metronomeBeat = 1;

  // Set up interval for subsequent beats
  metronomeInterval = setInterval(() => {
    const beatInBar = metronomeBeat % beatsPerBar.value;
    playBeatPattern(beatInBar, msPerBeat);
    metronomeBeat++;
  }, msPerBeat);
}

function playBeatPattern(beatInBar, msPerBeat) {
  const pattern = beatPatterns[beatStyle.value] || beatPatterns.straight;
  const clicks = pattern.getPattern(beatInBar, beatsPerBar.value);

  clicks.forEach((click) => {
    const delay = click.offset * msPerBeat;

    if (delay === 0) {
      playClick(click);
    } else {
      const timeout = setTimeout(() => {
        playClick(click);
      }, delay);
      metronomeTimeouts.push(timeout);
    }
  });
}

function playClick(click) {
  if (click.muted) {
    playMetronomeClick(false, metronomeVolume.value * 0.2);
  } else if (click.softer) {
    playMetronomeClick(false, metronomeVolume.value * 0.6);
  } else {
    playMetronomeClick(click.isAccent, metronomeVolume.value);
  }
}

function stopMetronome() {
  metronomeRunning.value = false;
  if (metronomeInterval) {
    clearInterval(metronomeInterval);
    metronomeInterval = null;
  }
  metronomeTimeouts.forEach((t) => clearTimeout(t));
  metronomeTimeouts = [];
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
  },
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
// Main container
.chord-progression {
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 0.75em;
}

.tempo-controls {
  display: flex;
  align-items: center;
  justify-content: center;

  .tempo-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
  }
}

.playback-controls {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75em;
}

.transport-center,
.transport-right {
  display: flex;
  align-items: center;
  gap: 0.75em;
}

.transport-btn {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #444;
  border-radius: 6px;
  background: linear-gradient(180deg, #2a2a2a 0%, #1f1f1f 100%);
  color: #aaa;
  font-family: inherit;
  font-size: 1rem;
  padding: 0.2em;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: linear-gradient(180deg, #333 0%, #252525 100%);
    border-color: #555;
    color: #fff;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.96);
  }
}

.play-btn {
  &:hover:not(:disabled) {
    color: #49a943;
    border-color: #49a943;
  }
}

.stop-btn {
  &:hover:not(:disabled) {
    color: #f43f5e;
    border-color: #f43f5e;
  }
}

.clear-btn {
  color: #888;

  &:hover:not(:disabled) {
    color: #ce9c27;
    border-color: #ce9c27;
  }
}

// Tempo control
.tempo-control {
  display: flex;
  align-items: center;
}

.tempo-adjust {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid #444;
  border-radius: 6px;
  background: #252525;
  color: #aaa;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #333;
    color: #fff;
  }

  &:active {
    transform: scale(0.92);
  }
}

.tempo-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
}

.tempo-input {
  width: 56px;
  height: 28px;
  padding: 0;
  border: none;
  background: transparent;
  color: #00d4aa;
  font-family: inherit;
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
  -moz-appearance: textfield;
  appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    outline: none;
  }
}

.tempo-label {
  font-size: 0.6rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

// Tap tempo button
.tap-btn {
  position: relative;
  left: 0.8em;
  height: 30px;
  width: 35px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.05em;

  &.tapped {
    background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%) !important;
    border-color: #f59e0b !important;
    color: #000 !important;
  }
}

.tap-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: #f43f5e;
  border-radius: 9px;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
}

// Metronome button
.metronome-btn {
  position: relative;
  left: 0.8em;
  height: 30px;
  width: 35px;
  background: none;
  border: none;
  color: #fff;
  padding: 0.2em;

  .metronome-icon {
    width: 90%;
    height: 90%;

    &:hover {
      transform: scale(1.1);
    }

    &:active P {
      transform: scale(0.9);
    }
  }
}

@keyframes metronomePulse {
  0%,
  100% {
    box-shadow: 0 0 8px rgba(16, 185, 129, 0.3);
  }
  50% {
    box-shadow: 0 0 16px rgba(16, 185, 129, 0.6);
  }
}

// Time signature
.time-signature-control {
  display: flex;
  align-items: center;
}

.time-select {
  height: 36px;
  padding: 0 0.75em;
  border: 1px solid #444;
  border-radius: 6px;
  background: #1a1a1a;
  color: #ccc;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #00d4aa;
  }
}

// Key selector
.key-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2em;
}

.mini-label {
  font-size: 0.6rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.key-select {
  height: 36px;
  padding: 0 0.75em;
  border: 1px solid #555;
  border-radius: 6px;
  background: linear-gradient(180deg, #2a2a2a 0%, #1f1f1f 100%);
  color: #f59e0b;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #f59e0b;
    box-shadow: 0 0 10px rgba(245, 158, 11, 0.3);
  }
}

// ============================================
// SETTINGS PANEL - Bar options
// ============================================
.settings-panel {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5em;
  padding: 0.6em 1em;
  background: #0f0f0f;
  border-radius: 8px;
  border: 1px solid #252525;
}

.setting-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
}

.setting-label {
  font-size: 0.7rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.setting-select {
  width: 100%;
  height: 28px;
  padding: 0 0.6em;
  border: 1px solid #333;
  border-radius: 4px;
  background: #1a1a1a;
  color: #ccc;
  font-family: inherit;
  font-size: 0.8rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #00d4aa;
  }
}

.info-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #00d4aa;
}

.info-label {
  font-size: 0.65rem;
  color: #666;
  text-transform: lowercase;
}

// ============================================
// TIMELINE - Continuous track
// ============================================
.timeline-container {
  position: relative;
  background: linear-gradient(180deg, #0a0a0a 0%, #0f0f0f 100%);
  border-radius: 12px;
  padding: 0.75em;
  border: 1px solid #252525;

  &.multi-row {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
}

// Timeline row for multi-row layout
.timeline-row {
  position: relative;
  padding-bottom: 0.5em;
  border-bottom: 1px solid #1a1a1a;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.bar-markers {
  display: flex;
  margin-bottom: 0.4em;
}

.bar-marker {
  display: flex;
  align-items: center;
  padding-left: 0.5em;
  border-left: 2px solid #333;

  &:first-child {
    border-left: 2px solid #555;
  }
}

.bar-number {
  font-size: 0.7rem;
  font-weight: 600;
  color: #555;
  letter-spacing: 0.05em;
}

.timeline-track {
  display: grid;
  gap: 2px;
  min-height: 36px;
}

.beat-grid {
  display: grid;
  gap: 2px;
  min-height: 30px;
}

.beat-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 30px;
  background: #151515;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: visible;

  &.bar-start {
    border-left: 2px solid #444;
  }

  &:hover:not(.chord-start) {
    background: #1f1f1f;
    border-color: #3a3a3a;
  }

  &.drag-over {
    background: rgba(0, 212, 170, 0.15);
    border-color: #00d4aa;
    box-shadow: inset 0 0 10px rgba(0, 212, 170, 0.2);
  }

  &.playing {
    background: rgba(0, 212, 170, 0.2);
    border-color: #00d4aa;
  }

  &.chord-start {
    z-index: 2;
  }
}

.chord-block {
  position: absolute;
  top: 2px;
  left: 2px;
  height: calc(100% - 4px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 0.2em 0.4em;
  z-index: 10;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.2s ease;
  cursor: grab;

  &:hover {
    filter: brightness(1.1);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
  }

  // Modern scale degree colors with better palette
  &.degree-1 {
    background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
    border-color: rgba(244, 63, 94, 0.5);
  }
  &.degree-2 {
    background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
    border-color: rgba(234, 179, 8, 0.5);
  }
  &.degree-3 {
    background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
    border-color: rgba(236, 72, 153, 0.5);
  }
  &.degree-4 {
    background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
    border-color: rgba(20, 184, 166, 0.5);
  }
  &.degree-5 {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    border-color: rgba(59, 130, 246, 0.5);
  }
  &.degree-6 {
    background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    border-color: rgba(249, 115, 22, 0.5);
  }
  &.degree-7 {
    background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
    border-color: rgba(168, 85, 247, 0.5);
  }
}

.chord-name {
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.remove-chord-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 0.75rem;
  line-height: 1;
  cursor: pointer;
  opacity: 0;
  transition: all 0.15s ease;

  .chord-block:hover & {
    opacity: 1;
  }

  &:hover {
    background: #f43f5e;
    transform: scale(1.1);
  }
}

// Playback indicator
.playback-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 20;
}

.playback-head {
  position: absolute;
  top: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(180deg, #00d4aa 0%, #00a88a 100%);
  box-shadow:
    0 0 12px rgba(0, 212, 170, 0.6),
    0 0 24px rgba(0, 212, 170, 0.3);
  border-radius: 2px;
  transition: left 0.05s linear;

  &::before {
    content: "";
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #00d4aa;
  }
}

// Add indicator for empty slots
.add-indicator {
  font-size: 1.5rem;
  color: #444;
  font-weight: 400;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;

  .beat-cell:hover & {
    color: #00d4aa;
    transform: scale(1.2);
  }
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
    background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
    border-color: #f59e0b;
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
  background: linear-gradient(90deg, #b81f1f, #d97706);
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
