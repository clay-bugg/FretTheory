<template>
  <Teleport to="body">
    <div v-if="visible" class="popover-overlay" @click.self="close">
      <div
        class="chord-creator-popover"
        :style="popoverStyle"
        @click.stop
        ref="popoverRef"
      >
        <!-- Header -->
        <div
          class="popover-header"
          @mousedown="startDrag"
          :class="{ dragging: isDragging }"
        >
          <span class="drag-handle">⋮⋮</span>
          <span class="popover-title">Add Chord</span>
          <button class="close-btn" @click.stop="close">×</button>
        </div>

        <!-- Root Note Selector -->
        <div class="section">
          <label class="section-label">Root Note</label>
          <div class="note-grid">
            <button
              v-for="note in notes"
              :key="note"
              class="note-btn"
              :class="{ active: selectedRoot === note }"
              @click="selectRoot(note)"
              @mouseenter="previewRoot(note)"
            >
              {{ note }}
            </button>
          </div>
        </div>

        <!-- Chord Type Selector -->
        <div class="section">
          <label class="section-label">Chord Type</label>

          <!-- Category Tabs -->
          <div class="type-tabs">
            <button
              v-for="cat in categories"
              :key="cat.id"
              class="tab-btn"
              :class="{ active: activeCategory === cat.id }"
              @click="activeCategory = cat.id"
            >
              {{ cat.label }}
            </button>
          </div>

          <!-- Chord Type Buttons -->
          <div class="type-grid">
            <button
              v-for="chord in filteredChords"
              :key="chord.label"
              class="type-btn"
              :class="{ active: selectedType === chord.label }"
              :style="{ borderColor: getChordType(chord.types) }"
              @click="selectType(chord)"
              @mouseenter="previewChord(chord)"
            >
              {{ formatLabel(chord.label) }}
            </button>
          </div>
        </div>

        <!-- Duration Selector -->
        <div class="section">
          <label class="section-label">Duration</label>
          <div class="duration-grid">
            <button
              v-for="dur in durations"
              :key="dur"
              class="duration-btn"
              :class="{ active: selectedDuration === dur }"
              @click="selectedDuration = dur"
            >
              {{ dur }} {{ dur === 1 ? "beat" : "beats" }}
            </button>
          </div>
        </div>

        <!-- Confirm Button -->
        <button class="confirm-btn" :disabled="!canConfirm" @click="confirm">
          <span v-if="selectedRoot && selectedType">
            Add {{ selectedRoot }}{{ formatLabel(selectedType) }}
          </span>
          <span v-else>Select chord to add</span>
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { chordLibrary } from "~/composables/chords";

const STORAGE_KEY = "chordCreatorPopoverPosition";

const props = defineProps({
  visible: { type: Boolean, default: false },
  beat: { type: Number, default: 1 },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  existingChord: { type: Object, default: null },
});

const emit = defineEmits(["confirm", "close", "preview"]);

const keyboardStore = useKeyboardStore();
const {
  notes,
  rootNote: storeRootNote,
  chordType: storeChordType,
  chordNotes,
} = storeToRefs(keyboardStore);

// Refs
const popoverRef = ref(null);

// State
const selectedRoot = ref(null);
const selectedType = ref(null);
const selectedDuration = ref(4);
const activeCategory = ref("triads");

// Drag state
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const savedPosition = ref(null);
const currentPosition = ref({ x: 0, y: 0 });

// Categories for chord types
const categories = [
  { id: "triads", label: "Triads" },
  { id: "seventh", label: "7ths" },
  { id: "extended", label: "Extended" },
  { id: "altered", label: "Altered" },
];

// Duration options
const durations = [1, 2, 4, 8];

// Chord type mappings to categories
const chordCategories = {
  triads: [
    "Major",
    "Minor",
    "Diminished",
    "Augmented",
    "Suspended 2",
    "Suspended 4",
    "5",
  ],
  seventh: [
    "Dominant 7",
    "Major 7",
    "Minor 7",
    "Diminished 7",
    "Minor Major 7",
    "7 Suspended 4",
  ],
  extended: [
    "Major 6",
    "Minor 6",
    "Dominant 9",
    "Major 9",
    "Minor 9",
    "Dominant 11",
    "Major 11",
    "Dominant 13",
    "Major 6/9",
    "Minor 6/9",
    "Minor Major 9",
  ],
  altered: [
    "7b5",
    "7b9",
    "7#9 (Hendrix)",
    "7#5",
    "9#5",
    "7b9#5",
    "7b13",
    "Minor 7b5",
    "Minor 7b9",
    "Minor Augmented",
    "7#11",
  ],
};

function getChordType(types) {
  const colorMap = {
    major: "yellow",
    augmented: "orange",
    minor: "blue",
    diminished: "darkblue",
    suspended: "purple",
    dominant: "pink",
    altered: "green",
  };

  const foundType = types.find((type) => colorMap[type]);

  return foundType ? colorMap[foundType] : "grey";
}

// Filtered chords by category
const filteredChords = computed(() => {
  const categoryLabels = chordCategories[activeCategory.value] || [];
  return chordLibrary.value.filter((c) => categoryLabels.includes(c.label));
});

// Can confirm?
const canConfirm = computed(() => selectedRoot.value && selectedType.value);

// Position the popover - use saved position if available
const popoverStyle = computed(() => {
  const pos = savedPosition.value || {
    x: Math.min(props.x, window.innerWidth - 350),
    y: Math.min(props.y, window.innerHeight - 500),
  };
  return {
    left: `${pos.x}px`,
    top: `${pos.y}px`,
  };
});

// Load saved position from localStorage
function loadSavedPosition() {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const pos = JSON.parse(saved);
      // Validate position is still within viewport
      if (
        pos.x >= 0 &&
        pos.x < window.innerWidth - 100 &&
        pos.y >= 0 &&
        pos.y < window.innerHeight - 100
      ) {
        return pos;
      }
    }
  } catch (e) {
    console.warn("Failed to load popover position:", e);
  }
  return null;
}

// Save position to localStorage
function savePosition(x, y) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ x, y }));
  } catch (e) {
    console.warn("Failed to save popover position:", e);
  }
}

// Start dragging
function startDrag(e) {
  // Don't start drag if clicking close button
  if (e.target.classList.contains("close-btn")) return;

  isDragging.value = true;
  const rect = popoverRef.value.getBoundingClientRect();
  dragOffset.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };

  // Add global listeners
  window.addEventListener("mousemove", onDrag);
  window.addEventListener("mouseup", stopDrag);
}

// Handle dragging
function onDrag(e) {
  if (!isDragging.value) return;

  const newX = Math.max(
    0,
    Math.min(e.clientX - dragOffset.value.x, window.innerWidth - 350),
  );
  const newY = Math.max(
    0,
    Math.min(e.clientY - dragOffset.value.y, window.innerHeight - 100),
  );

  savedPosition.value = { x: newX, y: newY };
}

// Stop dragging
function stopDrag() {
  if (isDragging.value && savedPosition.value) {
    savePosition(savedPosition.value.x, savedPosition.value.y);
  }
  isDragging.value = false;
  window.removeEventListener("mousemove", onDrag);
  window.removeEventListener("mouseup", stopDrag);
}

// Format chord label for display
function formatLabel(label) {
  const shortLabels = {
    Major: "",
    Minor: "m",
    "Dominant 7": "7",
    "Dominant 9": "9",
    "Dominant 11": "11",
    "Dominant 13": "13",
    "Major 7": "maj7",
    "Major 9": "maj9",
    "Major 11": "maj11",
    "Major 6": "6",
    "Minor 7": "m7",
    "Minor 9": "m9",
    "Minor 6": "m6",
    "Minor Major 7": "mMaj7",
    "Minor Major 9": "mMaj9",
    "Suspended 2": "sus2",
    "Suspended 4": "sus4",
    "7 Suspended 4": "7sus4",
    "7#9 (Hendrix)": "7#9",
    Augmented: "aug",
    Diminished: "dim",
    "Diminished 7": "°7",
    5: "5",
    "Major 6/9": "6/9",
    "Minor 6/9": "m6/9",
    "Minor 7b5": "m7b5",
    "Minor 7b9": "m7b9",
    "Minor Augmented": "m(#5)",
  };
  return shortLabels[label] !== undefined ? shortLabels[label] : label;
}

// Select root note
function selectRoot(note) {
  selectedRoot.value = note;
  updatePreview();
}

// Preview on hover
function previewRoot(note) {
  if (selectedType.value) {
    storeRootNote.value = note;
    storeChordType.value = selectedType.value;
    emit("preview");
  }
}

// Select chord type
function selectType(chord) {
  selectedType.value = chord.label;
  updatePreview();
}

// Preview chord on hover
function previewChord(chord) {
  if (selectedRoot.value) {
    storeRootNote.value = selectedRoot.value;
    storeChordType.value = chord.label;
    emit("preview");
  }
}

// Update store for live preview
function updatePreview() {
  if (selectedRoot.value && selectedType.value) {
    storeRootNote.value = selectedRoot.value;
    storeChordType.value = selectedType.value;
    emit("preview");
  }
}

// Confirm selection
function confirm() {
  if (!canConfirm.value) return;
  emit("confirm", {
    root: selectedRoot.value,
    type: selectedType.value,
    duration: selectedDuration.value,
    beat: props.beat,
  });
  close();
}

// Close popover
function close() {
  emit("close");
}

// Initialize with existing chord if editing
watch(
  () => props.visible,
  (isVisible) => {
    if (isVisible) {
      // Load saved position or use initial position
      const saved = loadSavedPosition();
      if (saved) {
        savedPosition.value = saved;
      } else {
        // Use the passed-in position if no saved position
        savedPosition.value = null;
      }

      if (props.existingChord) {
        selectedRoot.value = props.existingChord.root;
        selectedType.value = props.existingChord.type;
        selectedDuration.value = props.existingChord.duration || 4;
        // Find the right category
        for (const [cat, labels] of Object.entries(chordCategories)) {
          if (labels.includes(props.existingChord.type)) {
            activeCategory.value = cat;
            break;
          }
        }
      } else {
        // Default to store values or reset
        selectedRoot.value = storeRootNote.value || "C";
        selectedType.value = "Major";
        selectedDuration.value = 4;
        activeCategory.value = "triads";
      }
    }
  },
  { immediate: true },
);

// Close on Escape key
function handleKeydown(e) {
  if (e.key === "Escape") close();
  if (e.key === "Enter" && canConfirm.value) confirm();
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  // Clean up drag listeners just in case
  window.removeEventListener("mousemove", onDrag);
  window.removeEventListener("mouseup", stopDrag);
});
</script>

<style scoped lang="scss">
.popover-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chord-creator-popover {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  gap: 0.2em;
  width: 320px;
  padding: 0 1em 0.2em;
  max-height: 90vh;
  overflow-y: auto;
  background: linear-gradient(180deg, #1f1f1f 0%, #141414 100%);
  border: 1px solid #333;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
  z-index: 9;
  color: #878383;
}

.popover-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1em;
  padding: 0 0.25em 0.75em;
  border-bottom: 1px solid #333;
  cursor: grab;
  user-select: none;

  &.dragging {
    cursor: grabbing;
  }

  &:active {
    cursor: grabbing;
  }
}

.drag-handle {
  color: #555;
  font-size: 1.4rem;
  letter-spacing: -2px;
  transition: color 0.15s ease;

  .popover-header:hover & {
    color: #888;
  }
}

.popover-title {
  flex: 1;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: #333;
  color: #888;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #f43f5e;
    color: #fff;
  }
}

// Section styling
.section {
  width: 100%;
  margin-bottom: 0.75em;
}

.section-label {
  display: block;
  font-size: 0.7rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5em;
}

// Root Note Grid
.note-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.35em;
}

.note-btn {
  height: 36px;
  padding: 0;
  border: 1px solid #333;
  border-radius: 6px;
  background: #252525;
  color: #aaa;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #333;
    color: #fff;
    border-color: #444;
  }

  &.active {
    background: linear-gradient(180deg, #00d4aa 0%, #00a88a 100%);
    color: #000;
    border-color: #00d4aa;
    font-weight: 700;
  }
}

// Type Tabs
.type-tabs {
  display: flex;
  gap: 0.25em;
  margin-bottom: 0.5em;
}

.tab-btn {
  flex: 1;
  height: 30px;
  padding: 0 0.5em;
  border: 1px solid #333;
  border-radius: 6px;
  background: #1a1a1a;
  color: #777;
  font-family: inherit;
  font-size: 0.7rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #252525;
    color: #aaa;
  }

  &.active {
    background: #333;
    color: #fff;
    border-color: #444;
  }
}

// Chord Type Grid
.type-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.3em;
}

.type-btn {
  height: 34px;
  padding: 0 0.5em;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  background: #1f1f1f;
  color: #aaa;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background: #2a2a2a;
    color: #fff;
    border-color: #3a3a3a;
  }

  &.active {
    background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
    color: #000;
    border-color: #f59e0b;
    font-weight: 700;
  }
}

// Duration Grid
.duration-grid {
  display: flex;
  gap: 0.35em;
}

.duration-btn {
  flex: 1;
  height: 32px;
  padding: 0;
  border: 1px solid #333;
  border-radius: 6px;
  background: #1a1a1a;
  color: #888;
  font-family: inherit;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #252525;
    color: #aaa;
  }

  &.active {
    background: #333;
    color: #fff;
    border-color: #555;
  }
}

// Confirm Button
.confirm-btn {
  width: 100%;
  height: 44px;
  margin-top: 0.5em;
  padding: 0 1em;
  border: none;
  border-radius: 10px;
  background: linear-gradient(180deg, #00d4aa 0%, #00a88a 100%);
  color: #000;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    filter: brightness(1.1);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0, 212, 170, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
}
</style>
