# 🎸 FretTheory

**FretTheory** is an interactive music theory learning platform built with Nuxt 3 and Vue.js. It provides virtual instruments, chord progressions, and music theory tools to help musicians understand and practice music concepts.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Nuxt](https://img.shields.io/badge/Nuxt-3.x-00DC82?logo=nuxt.js)
![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)

## ✨ Features

### 🎹 Virtual Instruments

- **Piano Keyboard** - Interactive piano with multiple modes:
  - **Player Mode** - Play notes and chords with mouse or keyboard
  - **Finder Mode** - Visualize chord shapes and scale patterns
  - **MIDI Mode** - Connect external MIDI controllers
- **Guitar** - Visual guitar fretboard with chord diagrams
- **Drums** - Drum kit with audio samples

### 🎵 Chord Progression Builder

- **Visual Timeline** - Drag-and-drop chord blocks on a beat-based grid
- **Chord Creator** - Intuitive popover for selecting root notes, chord types, and durations
- **Playback Controls** - Play, stop, and loop your progressions
- **Metronome** - Built-in click track with multiple time signatures
- **Tap Tempo** - Tap to set your BPM

### 🎼 Music Theory Support

- **40+ Chord Types** - Triads, 7ths, extended chords, and altered chords
- **Chord Categories** - Organized into Triads, 7ths, Extended, and Altered
- **Scale Degrees** - Color-coded chords based on their position in the key
- **Multiple Time Signatures** - 4/4, 3/4, 6/8, 2/4, 5/4, 7/8

### 🎧 Audio Engine

- **Tone.js Integration** - Web Audio API powered synthesis
- **Sampled Instruments** - High-quality piano and guitar samples
- **Real-time Playback** - Low-latency audio performance
- **Arpeggiator** - Multiple arpeggio patterns (up, down, up-down, random)

### 🎮 MIDI Support

- **MIDI Input** - Connect and play with external MIDI keyboards
- **Note Visualization** - See active MIDI notes highlighted on screen
- **Device Selection** - Choose between multiple connected MIDI devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/FretTheory.git
cd FretTheory

# Install dependencies
pnpm install

# Start the development server
pnpm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
# Generate static files
pnpm run generate

# Or build for SSR
pnpm run build

# Preview production build
pnpm run preview
```

## 🏗️ Project Structure

```
FretTheory/
├── components/
│   ├── instruments/      # Virtual instruments (Keyboard, Guitar, Drums)
│   ├── menu/            # Chord progression, chord creator, displays
│   ├── controls/        # Volume, octave, and other controls
│   ├── selectors/       # Chord type, scale selectors
│   └── layout/          # Header, navigation
├── composables/
│   ├── chords.js        # Chord library with 40+ chord definitions
│   ├── useToneAudio.js  # Piano audio engine (Tone.js)
│   ├── useGuitarAudio.js # Guitar audio engine
│   ├── useDrumAudio.js  # Drum machine audio
│   └── useMIDI.js       # MIDI device integration
├── stores/              # Pinia state management
├── pages/               # Nuxt pages (instruments, theory, tools)
├── layouts/             # App layouts
├── assets/              # SCSS styles
└── public/              # Static assets, audio samples
```

## 🛠️ Tech Stack

| Technology                                        | Purpose                |
| ------------------------------------------------- | ---------------------- |
| [Nuxt 3](https://nuxt.com/)                       | Vue.js meta-framework  |
| [Vue 3](https://vuejs.org/)                       | Reactive UI components |
| [Pinia](https://pinia.vuejs.org/)                 | State management       |
| [Tone.js](https://tonejs.github.io/)              | Web Audio synthesis    |
| [SASS/SCSS](https://sass-lang.com/)               | Styling                |
| [Nuxt Icon](https://github.com/nuxt-modules/icon) | Icon library           |

## 🎨 Chord Types

FretTheory supports a comprehensive chord library including:

**Triads:** Major, Minor, Diminished, Augmented, sus2, sus4, Power (5)

**Seventh Chords:** Dominant 7, Major 7, Minor 7, Diminished 7, Minor-Major 7, 7sus4

**Extended Chords:** 6, m6, 9, maj9, m9, 11, maj11, 13, 6/9, m6/9

**Altered Chords:** 7♭5, 7♯5, 7♭9, 7♯9 (Hendrix), 9♯5, 7♭9♯5, 7♭13, m7♭5, 7♯11

## 📝 Usage Tips

### Playing the Keyboard

- Click on keys to play notes
- Press **Spacebar** to play/stop the current chord
- Use the octave controls to shift the keyboard range

### Building Chord Progressions

1. Click on any beat cell in the timeline
2. Select a root note and chord type in the popover
3. Choose the beat duration
4. Click "Add" to place the chord
5. Press Play to hear your progression!

### Using MIDI

1. Connect a MIDI keyboard to your computer
2. Switch to MIDI mode in the keyboard controls
3. Select your device from the dropdown
4. Play your MIDI keyboard – notes will sound and visualize!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tone.js](https://tonejs.github.io/) for the incredible Web Audio library
- [Nuxt](https://nuxt.com/) team for the excellent framework
- All the musicians and music educators who inspired this project

---

**Made with ❤️ for musicians who want to learn and create**
