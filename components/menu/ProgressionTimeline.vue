<template>
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
                @mouseenter="handleChordHover(getBeatChord(beat))"
                @mouseleave="handleChordLeave"
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
              @mouseenter="handleChordHover(getBeatChord(beat))"
              @mouseleave="handleChordLeave"
            >
              <span class="chord-name">
                {{ getBeatChord(beat).root
                }}<span class="chord-type">{{
                  formatType(getBeatChord(beat).type)
                }}</span>
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
</template>

<script setup>
import { chordLibrary } from "~/composables/chords";
import { useKeyboardStore } from "~/stores/keyboardStore";

const keyboardStore = useKeyboardStore();

const props = defineProps({
  totalBars: { type: Number, required: true },
  beatsPerBar: { type: Number, required: true },
  beatChords: { type: Object, required: true },
  isPlaying: { type: Boolean, default: false },
  currentBeatIndex: { type: Number, default: 0 },
  progressionKey: { type: String, default: "C" },
  dragOverBeat: { type: Number, default: null },
});

const emit = defineEmits([
  "beatClick",
  "beatDrop",
  "beatDragOver",
  "beatDragLeave",
  "removeChord",
]);

// Helper computations
const totalBeats = computed(() => props.totalBars * props.beatsPerBar);

function getBeatChord(beat) {
  // Check if this beat has a chord starting here
  if (props.beatChords[beat]) {
    return props.beatChords[beat];
  }
  // Check if a previous chord extends into this beat
  for (let b = beat - 1; b >= 1; b--) {
    const chord = props.beatChords[b];
    if (chord && b + chord.duration > beat) {
      return chord;
    }
  }
  return null;
}

function isChordStart(beat) {
  return !!props.beatChords[beat];
}

function formatType(type) {
  const chord = chordLibrary.value.find((c) => c.label === type);
  return chord ? chord.abbr : type;
}

// Multi-row helpers
function getBarsForRow(rowIndex) {
  const startBar = (rowIndex - 1) * 4 + 1;
  const endBar = Math.min(rowIndex * 4, props.totalBars);
  const bars = [];
  for (let bar = startBar; bar <= endBar; bar++) {
    bars.push(bar);
  }
  return bars;
}

function getBeatsForRow(rowIndex) {
  const barsInRow = getBarsForRow(rowIndex);
  const startBeat = (barsInRow[0] - 1) * props.beatsPerBar + 1;
  const endBeat = barsInRow[barsInRow.length - 1] * props.beatsPerBar;
  const beats = [];
  for (let beat = startBeat; beat <= endBeat; beat++) {
    beats.push(beat);
  }
  return beats;
}

function getChordBlockWidth(beat, rowIndex) {
  const chord = props.beatChords[beat];
  if (!chord) return "100%";

  const rowBeats = getBeatsForRow(rowIndex);
  const rowEndBeat = rowBeats[rowBeats.length - 1];
  const effectiveDuration = Math.min(chord.duration, rowEndBeat - beat + 1);

  return `calc(${effectiveDuration * 100}% + ${(effectiveDuration - 1) * 2}px)`;
}

function getPlaybackHeadStyle() {
  if (props.totalBars <= 4) {
    return {
      left: `${((props.currentBeatIndex - 0.5) / totalBeats.value) * 100}%`,
    };
  }

  const beatsPerRow = 4 * props.beatsPerBar;
  const currentRow = Math.ceil(props.currentBeatIndex / beatsPerRow);
  const beatWithinRow = ((props.currentBeatIndex - 1) % beatsPerRow) + 1;
  const leftPercent = ((beatWithinRow - 0.5) / beatsPerRow) * 100;
  const rowHeight = 100 / Math.ceil(props.totalBars / 4);
  const topPercent = (currentRow - 1) * rowHeight;

  return {
    left: `${leftPercent}%`,
    top: `${topPercent}%`,
    height: `${rowHeight}%`,
  };
}

// Event Handlers
function handleBeatDragOver(e, beat) {
  emit("beatDragOver", { event: e, beat });
}

function handleBeatDragLeave(e) {
  emit("beatDragLeave", e);
}

function handleBeatDrop(e, beat) {
  emit("beatDrop", { event: e, beat });
}

function handleBeatClick(e, beat) {
  emit("beatClick", { event: e, beat });
}

function removeChordAtBeat(beat) {
  keyboardStore.clearPreviewChord();
  emit("removeChord", beat);
}

// Scale Degree Coloring Logic
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
  const keyIndex = noteOrder.indexOf(props.progressionKey);
  const chordIndex = noteOrder.indexOf(chordRoot);
  if (keyIndex === -1 || chordIndex === -1) return 1;

  const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11];
  const interval = (chordIndex - keyIndex + 12) % 12;

  for (let i = 0; i < majorScaleIntervals.length; i++) {
    if (majorScaleIntervals[i] === interval) return i + 1;
  }

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

// Hover Preview
function handleChordHover(chord) {
  if (chord) {
    keyboardStore.setPreviewChord(chord.root, chord.type);
  }
}

function handleChordLeave() {
  keyboardStore.clearPreviewChord();
}
</script>

<style scoped lang="scss">
.interval-1 {
  background: linear-gradient(180deg, #ab2828 0%, #8a2020 100%);
}
.interval-2 {
  background: linear-gradient(180deg, #f58637 0%, #d46a25 100%);
}
.interval-3 {
  background: linear-gradient(180deg, #f9d423 0%, #c9bc30 100%);
}
.interval-4 {
  background: linear-gradient(180deg, #00d4aa 0%, #00a888 100%);
}
.interval-5 {
  background: linear-gradient(180deg, #00a8ff 0%, #0088cc 100%);
}
.interval-6 {
  background: linear-gradient(180deg, #526eff 0%, #3a53d4 100%);
}
.interval-7 {
  background: linear-gradient(180deg, #a855f7 0%, #8642d4 100%);
}

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
</style>
