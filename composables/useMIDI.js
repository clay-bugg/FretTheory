import { ref, onMounted, onUnmounted } from "vue";

// MIDI note number to note name/octave conversion
const NOTE_NAMES = [
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

function midiToNote(midiNumber) {
  const note = NOTE_NAMES[midiNumber % 12];
  const octave = Math.floor(midiNumber / 12) - 1;
  return { note, octave };
}

export function useMIDI() {
  const isSupported = ref(false);
  const isConnected = ref(false);
  const devices = ref([]);
  const currentDevice = ref(null);
  const error = ref(null);
  const activeNotes = ref(new Set());

  // Callbacks for note events
  let noteOnCallback = null;
  let noteOffCallback = null;

  // Check browser support
  const hasMIDISupport =
    typeof navigator !== "undefined" && !!navigator.requestMIDIAccess;
  isSupported.value = hasMIDISupport;

  // Handle MIDI messages
  function handleMIDIMessage(event) {
    const [status, noteNumber, velocity] = event.data;

    // MIDI status byte is split into two 4-bit nibbles:
    // - High nibble: The command type (e.g., 9 for Note On, 8 for Note Off)
    // - Low nibble: The MIDI channel (0-15)
    const command = status >> 4;
    const channel = status & 0x0f;

    // Note On (command 9) with velocity > 0
    if (command === 9 && velocity > 0) {
      const { note, octave } = midiToNote(noteNumber);
      activeNotes.value.add(noteNumber);

      if (noteOnCallback) {
        noteOnCallback(note, octave, velocity);
      }
    }
    // Note Off (command 8) OR Note On with velocity 0
    else if (command === 8 || (command === 9 && velocity === 0)) {
      const { note, octave } = midiToNote(noteNumber);
      activeNotes.value.delete(noteNumber);

      if (noteOffCallback) {
        noteOffCallback(note, octave);
      }
    }
  }

  // Handle device connection changes
  function handleStateChange(event) {
    updateDeviceList(event.target);
  }

  // Update list of connected devices
  function updateDeviceList(midiAccess) {
    const inputDevices = [];
    midiAccess.inputs.forEach((input) => {
      inputDevices.push({
        id: input.id,
        name: input.name || "Unknown MIDI Device",
        manufacturer: input.manufacturer || "Unknown",
      });
    });
    devices.value = inputDevices;

    // Auto-select first device if none selected
    if (inputDevices.length > 0 && !currentDevice.value) {
      selectDevice(inputDevices[0].id, midiAccess);
    }

    isConnected.value = inputDevices.length > 0;
  }

  // Select a specific MIDI device
  function selectDevice(deviceId, midiAccess) {
    // Remove listener from previous device
    if (currentDevice.value && midiAccess) {
      const prevInput = midiAccess.inputs.get(currentDevice.value.id);
      if (prevInput) {
        prevInput.onmidimessage = null;
      }
    }

    // Set up new device
    if (midiAccess) {
      const input = midiAccess.inputs.get(deviceId);
      if (input) {
        input.onmidimessage = handleMIDIMessage;
        currentDevice.value = devices.value.find((d) => d.id === deviceId);
      }
    }
  }

  let midiAccessRef = null;

  // Request MIDI access
  async function connect() {
    if (!isSupported.value) {
      error.value = "Web MIDI is not supported in this browser";
      return false;
    }

    try {
      const midiAccess = await navigator.requestMIDIAccess();
      midiAccessRef = midiAccess;

      // Listen for device connection changes
      midiAccess.onstatechange = handleStateChange;

      // Initial device list
      updateDeviceList(midiAccess);

      error.value = null;
      return true;
    } catch (err) {
      error.value = `Failed to access MIDI: ${err.message}`;
      isConnected.value = false;
      return false;
    }
  }

  // Register callbacks
  function onNoteOn(callback) {
    noteOnCallback = callback;
  }

  function onNoteOff(callback) {
    noteOffCallback = callback;
  }

  // Cleanup
  function disconnect() {
    if (midiAccessRef) {
      midiAccessRef.inputs.forEach((input) => {
        input.onmidimessage = null;
      });
      midiAccessRef.onstatechange = null;
    }
    isConnected.value = false;
    currentDevice.value = null;
    devices.value = [];
  }

  // Check if a specific MIDI note is currently active
  function isNoteActive(midiNumber) {
    return activeNotes.value.has(midiNumber);
  }

  // Convert note name + octave to MIDI number (for visual feedback)
  function noteToMidi(note, octave) {
    const noteIndex = NOTE_NAMES.indexOf(note);
    if (noteIndex === -1) return -1;
    return (octave + 1) * 12 + noteIndex;
  }

  return {
    // State
    isSupported,
    isConnected,
    devices,
    currentDevice,
    error,
    activeNotes,

    // Actions
    connect,
    disconnect,
    selectDevice: (deviceId) => selectDevice(deviceId, midiAccessRef),
    onNoteOn,
    onNoteOff,

    // Utilities
    isNoteActive,
    noteToMidi,
    midiToNote,
  };
}
