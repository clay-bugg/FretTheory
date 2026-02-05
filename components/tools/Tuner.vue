<template>
  <div class="page">
    <div class="tuner">
      <h1>{{ note }}</h1>

      <div class="meter">
        <div
          class="needle"
          :style="{ transform: `rotate(${detune}deg)` }"
        ></div>
      </div>

      <p>{{ frequency }} Hz</p>

      <div class="status">
        <span v-if="Math.abs(detune) < 5 && frequency > 0" class="in-tune"
          >IN TUNE</span
        >
      </div>

      <button @click="isRunning ? stopTuner() : startTuner()">
        {{ isRunning ? "Stop" : "Start" }} Mic
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const isRunning = ref(false);
const note = ref("-");
const detune = ref(0); // Cents off (perfect tune = 0)
const frequency = ref(0);

let audioContext = null;
let analyser = null;
let micStream = null;
let animationFrameId = null;

// Guitar Standard Tuning Frequencies (simplified)
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

const startTuner = async () => {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const source = audioContext.createMediaStreamSource(micStream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);

    isRunning.value = true;
    detectPitch();
  } catch (err) {
    console.error("Microphone access denied", err);
  }
};

const stopTuner = () => {
  isRunning.value = false;
  cancelAnimationFrame(animationFrameId);
  if (micStream) micStream.getTracks().forEach((track) => track.stop());
  if (audioContext) audioContext.close();
};

const detectPitch = () => {
  const bufferLength = analyser.fftSize;
  const buffer = new Float32Array(bufferLength);
  analyser.getFloatTimeDomainData(buffer);

  // --- Autocorrelation Algorithm ---
  const autoCorrelateValue = autoCorrelate(buffer, audioContext.sampleRate);

  if (autoCorrelateValue > -1) {
    frequency.value = Math.round(autoCorrelateValue);
    const { noteName, cents } = getNote(frequency.value);
    note.value = noteName;
    detune.value = cents;
  }

  if (isRunning.value) {
    animationFrameId = requestAnimationFrame(detectPitch);
  }
};

// Basic Autocorrelation implementation
const autoCorrelate = (buf, sampleRate) => {
  let size = buf.length;
  let rms = 0; // Root Mean Square (Volume)

  for (let i = 0; i < size; i++) {
    const val = buf[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / size);

  if (rms < 0.01) return -1; // Signal too quiet

  let r1 = 0,
    r2 = size - 1,
    thres = 0.2;
  for (let i = 0; i < size / 2; i++) {
    if (Math.abs(buf[i]) < thres) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < size / 2; i++) {
    if (Math.abs(buf[size - i]) < thres) {
      r2 = size - i;
      break;
    }
  }

  buf = buf.slice(r1, r2);
  size = buf.length;

  let c = new Array(size).fill(0);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size - i; j++) {
      c[i] = c[i] + buf[j] * buf[j + i];
    }
  }

  let d = 0;
  while (c[d] > c[d + 1]) d++;
  let maxval = -1,
    maxpos = -1;
  for (let i = d; i < size; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }
  let T0 = maxpos;

  return sampleRate / T0;
};

// Helper to convert Frequency to Note
const getNote = (freq) => {
  const noteNum = 12 * (Math.log(freq / 440) / Math.log(2));
  const noteIndex = (Math.round(noteNum) + 69) % 12;
  return {
    noteName: notes[noteIndex],
    cents: Math.floor((noteNum - Math.round(noteNum)) * 100),
  };
};

onUnmounted(() => {
  stopTuner();
});
</script>

<style scoped>
.tuner {
  width: 800px;
  height: 600px;
}
.meter {
  width: 200px;
  height: 100px;
  background: #eee;
  border-radius: 100px 100px 0 0;
  position: relative;
  overflow: hidden;
  margin: 20px auto;
}
.needle {
  width: 4px;
  height: 90px;
  background: red;
  position: absolute;
  left: 50%;
  bottom: 0;
  transform-origin: bottom center;
  transition: transform 0.1s ease;
}
.in-tune {
  color: green;
  font-weight: bold;
}
</style>
