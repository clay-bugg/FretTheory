<template>
  <div class="chord-progression">
    <MenuProgressionControls
      v-model:totalBars="totalBars"
      v-model:tempo="tempo"
      v-model:timeSignature="timeSignature"
      v-model:progressionKey="progressionKey"
      v-model:metronomeEnabled="metronomeEnabled"
      :notes="notes"
      :tapCount="tapCount"
      :showTapFeedback="showTapFeedback"
      @adjustTempo="adjustTempo"
      @tapTempo="handleTapTempo"
    />

    <MenuProgressionTimeline
      :totalBars="totalBars"
      :beatsPerBar="beatsPerBar"
      :beatChords="beatChords"
      :isPlaying="isPlaying"
      :currentBeatIndex="currentBeatIndex"
      :progressionKey="progressionKey"
      :dragOverBeat="dragOverBeat"
      @beatClick="handleBeatClickFromTimeline"
      @beatDrop="handleBeatDropFromTimeline"
      @beatDragOver="handleBeatDragOverFromTimeline"
      @beatDragLeave="handleBeatDragLeave"
      @removeChord="removeChordAtBeat"
    />

    <MenuPlaybackControls
      :isPlaying="isPlaying"
      :hasChords="hasChords"
      :canUndo="canUndo"
      @togglePlay="togglePlay"
      @stopPlayback="stopPlayback"
      @clearProgression="clearProgression"
      @undo="undo"
    />

    <MenuChordCreatorPopover
      :visible="popoverVisible"
      :beat="popoverBeat"
      :x="popoverX"
      :y="popoverY"
      :existing-chord="popoverExistingChord"
      :beats-per-bar="beatsPerBar"
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

const props = defineProps({
  externalPlay: {
    type: Function,
    default: null,
  },
});

// Get chord types from library
const chordTypes = computed(() => chordLibrary.value);

// Progression state
const isPlaying = ref(false);
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

// Event handlers for ProgressionTimeline events
function handleBeatDragOverFromTimeline({ event, beat }) {
  handleBeatDragOver(event, beat);
}

function handleBeatDropFromTimeline({ event, beat }) {
  handleBeatDrop(event, beat);
}

function handleBeatClickFromTimeline({ event, beat }) {
  handleBeatClick(event, beat);
}

// Beat grid state
const totalBars = ref(4);
const dropDuration = ref(4); // How many beats a dropped chord will span
const beatChords = ref({}); // Map of beat number -> chord object
const dragOverBeat = ref(null);
const currentBeatIndex = ref(0);

// Undo history stack
const undoStack = ref([]);
const MAX_UNDO_HISTORY = 50;

// Save current state to undo stack
function saveStateForUndo() {
  // Deep clone the current beatChords
  const snapshot = JSON.parse(JSON.stringify(beatChords.value));
  undoStack.value.push(snapshot);

  // Limit stack size
  if (undoStack.value.length > MAX_UNDO_HISTORY) {
    undoStack.value.shift();
  }
}

// Undo the last action
function undo() {
  if (undoStack.value.length === 0) return;

  const previousState = undoStack.value.pop();
  beatChords.value = previousState;
}

// Check if undo is available
const canUndo = computed(() => undoStack.value.length > 0);

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

// Helper functions (getBarsForRow, getBeatsForRow, etc.) moved to ProgressionTimeline.vue

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
  // Save state before modification
  saveStateForUndo();

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
  // Save state before modification
  saveStateForUndo();

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
// Now with time-signature-aware accents

// Helper function to determine accent pattern based on time signature
function getAccentPattern(beatsPerBar, timeSignature) {
  // Parse time signature to get the bottom number (beat unit)
  const [, beatUnit] = timeSignature.split("/").map(Number);

  // Compound meters (x/8 with beats divisible by 3) - accent in groups of 3
  if (beatUnit === 8 && beatsPerBar % 3 === 0) {
    // 6/8: accent 1 and 4 (two groups of 3)
    // 9/8: accent 1, 4, 7 (three groups of 3)
    // 12/8: accent 1, 4, 7, 10 (four groups of 3)
    const accents = [];
    for (let i = 0; i < beatsPerBar; i += 3) {
      accents.push(i);
    }
    return accents;
  }

  // Odd meters with common groupings
  if (beatsPerBar === 5) {
    // 5/4: commonly 3+2, accent on 1 and 4
    return [0, 3];
  }
  if (beatsPerBar === 7) {
    // 7/8 or 7/4: commonly 4+3 or 2+2+3, accent on 1 and 5
    return [0, 4];
  }

  // Standard meters: accent only on beat 1
  return [0];
}

const beatPatterns = {
  straight: {
    // Simple on-beat clicks with time-signature-aware accents
    subdivisions: 1,
    getPattern: (beat, beatsPerBar) => {
      const accents = getAccentPattern(beatsPerBar, timeSignature.value);
      return [
        {
          offset: 0,
          isAccent: accents.includes(beat),
          muted: false,
        },
      ];
    },
  },
  swing: {
    // Triplet feel - main beat + delayed offbeat
    subdivisions: 2,
    swingAmount: 0.66, // Offbeat delayed to 2/3 of the beat
    getPattern: (beat, beatsPerBar) => {
      const accents = getAccentPattern(beatsPerBar, timeSignature.value);
      return [
        {
          offset: 0,
          isAccent: accents.includes(beat),
          muted: false,
        },
        {
          offset: 0.66, // Swung offbeat
          isAccent: false,
          muted: false,
          softer: true,
        },
      ];
    },
  },
  shuffle: {
    // Heavier swing with emphasis on strong beats
    subdivisions: 2,
    getPattern: (beat, beatsPerBar) => {
      const accents = getAccentPattern(beatsPerBar, timeSignature.value);
      return [
        {
          offset: 0,
          isAccent: accents.includes(beat),
          muted: false,
        },
        {
          offset: 0.66,
          isAccent: false,
          muted: false,
          softer: true,
        },
      ];
    },
  },
  reggae: {
    // One-drop: emphasis on offbeats, beat 1 is quiet
    subdivisions: 1,
    getPattern: (beat, beatsPerBar) => {
      // For 4/4: accent 2 and 4, mute 1
      // For other time sigs: accent all except beat 1
      const isOffbeat = beat !== 0;
      return [
        {
          offset: 0,
          isAccent: isOffbeat && (beat === 1 || beat === 3),
          muted: beat === 0,
          softer: isOffbeat && beat !== 1 && beat !== 3,
        },
      ];
    },
  },
  bossa: {
    // Bossa nova pattern: syncopated feel (works best in 4/4)
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

// Clear all chords
function clearProgression() {
  // Save state before clearing so user can undo
  if (Object.keys(beatChords.value).length > 0) {
    saveStateForUndo();
  }

  stopPlayback();
  beatChords.value = {}; // Clear beat grid chords
}

// Playback controls
function togglePlay() {
  if (isPlaying.value) {
    stopPlayback();
  } else {
    startPlayback();
  }
}

async function startPlayback() {
  if (!hasChords.value) return;

  // Ensure audio context is ready BEFORE playing first chord
  // This prevents the first chord from being cut off
  const Tone = await import("tone");
  if (Tone.context.state !== "running") {
    await Tone.start();
  }

  isPlaying.value = true;
  currentBeatIndex.value = 1; // Start at beat 1

  // Play first beat immediately (audio context is now ready)
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
    // DON'T stop previous chord - let the natural release envelope
    // create a smooth overlap between chords (like a real piano with sustain)
    // Only stop arpeggiator since it has ongoing scheduled notes
    if (arpeggiatorEnabled.value && arpeggiate) {
      arpeggiate("stop");
    }

    if (arpeggiatorEnabled.value) {
      // Use arpeggiator
      arpeggiate("play", {
        pattern: arpPattern.value,
        noteDelay: arpNoteDelay.value,
        noteDuration: arpNoteDelay.value * 0.9,
      });
    } else {
      // Play chord normally
      if (props.externalPlay) {
        // Use external instrument (e.g., guitar)
        props.externalPlay(chord);
      } else {
        // Use default synth
        if (playChord) playChord("play");
      }
    }

    // For non-arpeggio mode: let the chord ring naturally
    // The release envelope (0.8s) will fade it out smoothly
    // Only schedule a stop if chord duration is very long (prevents buildup)
    const msPerBeat = (60 / tempo.value) * 1000;
    const chordDurationMs = chord.duration * msPerBeat;

    // Only force-stop if chord is longer than 4 seconds to prevent note buildup
    if (chordDurationMs > 4000 && !arpeggiatorEnabled.value) {
      setTimeout(() => {
        if (playChord) playChord("stop");
      }, chordDurationMs - 100);
    }
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

// Keyboard shortcut for undo (Ctrl+Z)
function handleKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === "z") {
    e.preventDefault();
    undo();
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

// Cleanup on unmount
onUnmounted(() => {
  stopPlayback();
  stopMetronome();
  clearTimeout(tapResetTimeout);
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped lang="scss">
.chord-progression {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75em;
}

.tempo-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25em;
}

.playback-controls {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
}

.transport-center,
.transport-right {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.redo-btn {
  &:hover:not(:disabled) {
    color: #c084fc;
    border-color: #c084fc;
    box-shadow: 0 0 12px rgba(192, 132, 252, 0.2);
  }
}

.tempo-adjust {
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid #3a3a3a;
  border-radius: 6px;
  background: linear-gradient(180deg, #252525 0%, #1a1a1a 100%);
  color: #888;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: linear-gradient(180deg, #2d2d2d 0%, #222 100%);
    border-color: #555;
    color: #fff;
  }

  &:active {
    transform: scale(0.92);
  }
}

.tempo-display {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
}

.tempo-input {
  width: 50px;
  height: 28px;
  padding: 0 0.25em;
  border: 1px solid transparent;
  border-radius: 4px;
  background: transparent;
  color: #22d3ee;
  font-family: inherit;
  font-size: 1.1rem;
  font-weight: 700;
  text-align: center;
  -moz-appearance: textfield;
  appearance: textfield;
  transition: all 0.15s ease;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:hover {
    border-color: #3a3a3a;
    background: rgba(255, 255, 255, 0.03);
  }

  &:focus {
    outline: none;
    border-color: #22d3ee;
    background: rgba(34, 211, 238, 0.05);
  }
}

.tempo-label {
  font-size: 0.65rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-right: 0.25em;
}

// Tap tempo button
.tap-btn {
  position: relative;
  height: 28px;
  min-width: 40px;
  padding: 0 0.5em;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.05em;

  &.tapped {
    background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%) !important;
    border-color: #f59e0b !important;
    color: #000 !important;
  }
}

.tap-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: linear-gradient(180deg, #f43f5e 0%, #dc2626 100%);
  border-radius: 8px;
  color: #fff;
  font-size: 0.55rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

// Metronome button
.metronome-btn {
  position: relative;
  height: 36px;
  width: 36px;

  .metronome-icon {
    width: 18px;
    height: 18px;
    transition: transform 0.15s ease;
  }

  &:hover .metronome-icon {
    transform: scale(1.1);
  }

  &.active {
    color: #22d3ee;
    border-color: #22d3ee;
    background: linear-gradient(180deg, #0f3a3a 0%, #0a2a2a 100%);
    animation: metronomePulse 1s ease-in-out infinite;
  }
}

@keyframes metronomePulse {
  0%,
  100% {
    box-shadow: 0 0 8px rgba(34, 211, 238, 0.3);
  }
  50% {
    box-shadow: 0 0 16px rgba(34, 211, 238, 0.5);
  }
}

.time-select,
.key-select,
.setting-select {
  height: 32px;
  padding: 0 0.75em;
  border: 1px solid #3a3a3a;
  border-radius: 6px;
  background: linear-gradient(180deg, #252525 0%, #1a1a1a 100%);
  color: #ccc;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: #555;
    background: linear-gradient(180deg, #2d2d2d 0%, #222 100%);
  }

  &:focus {
    outline: none;
    border-color: #22d3ee;
    box-shadow: 0 0 10px rgba(34, 211, 238, 0.15);
  }
}

.key-select {
  color: #fbbf24;
  font-weight: 600;

  &:focus {
    border-color: #fbbf24;
    box-shadow: 0 0 10px rgba(251, 191, 36, 0.15);
  }
}

// Time signature control
.time-signature-control {
  display: flex;
  align-items: center;
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
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

// Settings panel styles moved to ProgressionControls.vue

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
    color: #de9902;
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
    background: linear-gradient(180deg, #ab2828 0%, #8a2020 100%);
    border-color: #ab2828;
    .chord-root,
    .chord-type {
      color: #fff;
    }
  }
  &.degree-2 {
    background: linear-gradient(180deg, #f58637 0%, #d4702c 100%);
    border-color: #f58637;
    .chord-root,
    .chord-type {
      color: #fff;
    }
  }
  &.degree-3 {
    background: linear-gradient(180deg, #e4d63b 0%, #c9bc30 100%);
    border-color: #e4d63b;
    .chord-root,
    .chord-type {
      color: #000;
    }
  }
  &.degree-4 {
    background: linear-gradient(180deg, #5dd0cc 0%, #4ab5b1 100%);
    border-color: #5dd0cc;
    .chord-root,
    .chord-type {
      color: #000;
    }
  }
  &.degree-5 {
    background: linear-gradient(180deg, #8a57c4 0%, #7246a6 100%);
    border-color: #8a57c4;
    .chord-root,
    .chord-type {
      color: #fff;
    }
  }
  &.degree-6 {
    background: linear-gradient(180deg, #d05aa1 0%, #b04a88 100%);
    border-color: #d05aa1;
    .chord-root,
    .chord-type {
      color: #fff;
    }
  }
  &.degree-7 {
    background: linear-gradient(180deg, #8a2020 0%, #6a1818 100%);
    border-color: #8a2020;
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

.progression-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1em;
  background: linear-gradient(180deg, #151515 0%, #0a0a0a 100%);
  border-top: 1px solid #252525;
}
</style>
