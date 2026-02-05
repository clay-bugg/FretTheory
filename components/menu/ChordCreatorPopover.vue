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
              @click="selectType(chord)"
              @mouseenter="previewChord(chord)"
            >
              {{ formatLabel(chord.label) }}
            </button>
          </div>
        </div>

        <!-- Duration Selector -->
        <div class="section">
          <label class="section-label">Beat Duration</label>
          <div class="duration-grid">
            <button
              v-for="dur in durations"
              :key="dur"
              class="duration-btn"
              :class="{ active: selectedDuration === dur }"
              @click="selectedDuration = dur"
            >
              {{ dur }}
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

        <!-- Resize Handle -->
        <div
          class="resize-handle"
          @mousedown.stop="startResize"
          title="Drag to resize"
        ></div>
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
  beatsPerBar: { type: Number, default: 4 },
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
const selectedDuration = ref(props.beatsPerBar);
const activeCategory = ref("triads");

// Drag state
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const savedPosition = ref(null);
const currentPosition = ref({ x: 0, y: 0 });

// Resize state
const isResizing = ref(false);
const popoverSize = ref({ width: 320, height: 500 });
const minSize = { width: 280, height: 400 };
const maxSize = { width: 600, height: 800 };

// Categories for chord types
const categories = [
  { id: "triads", label: "Triads" },
  { id: "seventh", label: "7ths" },
  { id: "extended", label: "Extended" },
  { id: "altered", label: "Altered" },
];

// Duration options
const durations = [1, 2, 3, 4, 5, 6, 7, 8];

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

// Position and size the popover - use saved position if available
const popoverStyle = computed(() => {
  const pos = savedPosition.value || {
    x: Math.min(props.x, window.innerWidth - 350),
    y: Math.min(props.y, window.innerHeight - 500),
  };
  return {
    left: `${pos.x}px`,
    top: `${pos.y}px`,
    width: `${popoverSize.value.width}px`,
    height: `${popoverSize.value.height}px`,
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

// Start resizing
function startResize(e) {
  isResizing.value = true;

  // Add global listeners
  window.addEventListener("mousemove", onResize);
  window.addEventListener("mouseup", stopResize);
}

// Handle resizing
function onResize(e) {
  if (!isResizing.value || !popoverRef.value) return;

  const rect = popoverRef.value.getBoundingClientRect();

  // Calculate new size based on mouse position
  const newWidth = Math.max(
    minSize.width,
    Math.min(maxSize.width, e.clientX - rect.left),
  );
  const newHeight = Math.max(
    minSize.height,
    Math.min(maxSize.height, e.clientY - rect.top),
  );

  popoverSize.value = { width: newWidth, height: newHeight };
}

// Stop resizing
let justResized = false;
function stopResize() {
  isResizing.value = false;
  justResized = true;
  // Prevent the click event on overlay from closing the popover
  setTimeout(() => {
    justResized = false;
  }, 100);
  window.removeEventListener("mousemove", onResize);
  window.removeEventListener("mouseup", stopResize);
}

// Format chord label for display
function formatLabel(label) {
  return label;
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
  // Don't close if we just finished resizing or are still resizing
  if (justResized || isResizing.value) return;
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
        selectedDuration.value = props.beatsPerBar;
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
  // Clean up resize listeners
  window.removeEventListener("mousemove", onResize);
  window.removeEventListener("mouseup", stopResize);
});
</script>

<style scoped lang="scss">

.popover-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;
}

.chord-creator-popover {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25em;
  min-width: 260px;
  padding: 1em;
  max-height: 85vh;
  overflow: hidden;
  background: linear-gradient(180deg, #1f1f1f 0%, #141414 100%);
  border: 1px solid #333;
  border-radius: 12px;
  z-index: 1001;
  color: #ccc;
}

.popover-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5em;
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
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 50%;
  background: #333;
  color: #888;
  font-size: 1rem;
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
  margin-bottom: 0.4em;
  flex-grow: 1;
}

.section-label {
  display: block;
  font-size: 0.6rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.3em;
}

// Root Note Grid
.note-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.2em;
  flex-grow: 2;
}

.note-btn {
  height: 28px;
  padding: 0;
  border: 1px solid #333;
  border-radius: 4px;
  background: #252525;
  color: #aaa;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #333;
    color: #fff;
    border-color: #444;
    transition: all 0.2s ease;
    box-shadow: 0 -2px 4px rgb(209, 143, 0, 0.2);
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  &.active {
    background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
    color: #000;
    font-weight: 700;
    box-shadow: none;
    transform: translate(0);
  }
}

// Type Tabs
.type-tabs {
  display: flex;
  gap: 0.2em;
  margin-bottom: 0.3em;
  flex-grow: 1;
}

.tab-btn {
  flex: 1;
  height: 24px;
  padding: 0 0.4em;
  border: 1px solid #333;
  border-radius: 4px;
  background: #1a1a1a;
  color: #777;
  font-family: inherit;
  font-size: 0.6rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #333;
    color: #fff;
    border-color: #444;
    transition: all 0.2s ease;
    box-shadow: 0 -2px 4px rgb(209, 143, 0, 0.2);
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  &.active {
    background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
    color: #000;
    font-weight: 700;
    box-shadow: none;
    transform: translate(0);
  }
}

// Chord Type Grid
.type-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.2em;
  flex-grow: 2;
}

.type-btn {
  height: 26px;
  padding: 0 0.3em;
  border: 1px solid #2a2a2a;
  border-radius: 4px;
  background: #1f1f1f;
  color: #aaa;
  font-family: inherit;
  font-size: 0.65rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background: #333;
    color: #fff;
    border-color: #444;
    transition: all 0.2s ease;
    box-shadow: 0 -2px 4px rgb(209, 143, 0, 0.2);
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  &.active {
    background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
    color: #000;
    font-weight: 700;
    box-shadow: none;
    transform: translate(0);
  }
}

// Duration Grid
.duration-grid {
  display: flex;
  gap: 0.2em;
  flex-grow: 1;
}

.duration-btn {
  flex: 1;
  height: 24px;
  padding: 0;
  border: 1px solid #333;
  border-radius: 4px;
  background: #1a1a1a;
  color: #888;
  font-family: inherit;
  font-size: 0.6rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #333;
    color: #fff;
    border-color: #444;
    transition: all 0.2s ease;
    box-shadow: 0 -2px 4px rgb(209, 143, 0, 0.2);
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  &.active {
    background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
    color: #000;
    font-weight: 700;
    box-shadow: none;
    transform: translate(0);
  }
}

// Confirm Button
.confirm-btn {
  width: 100%;
  min-height: 32px;
  margin-top: 0.3em;
  padding: 0 0.8em;
  border: none;
  border-radius: 6px;
  background: linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
  color: #000;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    filter: brightness(1.1);
    transform: translateY(-1px);
    box-shadow: 0 0 8px linear-gradient(180deg, #f59e0b 0%, #d97706 100%);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
}

// Resize handle
.resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  cursor: nwse-resize;
  background: linear-gradient(
    135deg,
    transparent 0%,
    transparent 50%,
    #444 50%,
    #444 60%,
    transparent 60%,
    transparent 70%,
    #444 70%,
    #444 80%,
    transparent 80%,
    transparent 90%,
    #444 90%,
    #444 100%
  );
  border-radius: 0 0 16px 0;
  opacity: 0.6;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 1;
  }
}
</style>
