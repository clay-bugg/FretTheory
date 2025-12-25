import { ref, onMounted, onUnmounted } from 'vue'
import * as Tone from 'tone'

export function useToneAudio(startingOctave, notes) {
  let synth = null
  let sampler = null
  let polySynth = null

  const currentTone = ref('piano')
  const activeNotes = new Set()
  const activeChord = new Set()

  onMounted(() => {
    if (typeof window !== 'undefined') {
      synth = new Tone.Synth({
        oscillator: {
          type: 'sine'
        },
        envelope: {
          attack: 0.05,
          decay: 0.2,
          sustain: 0.3,
          release: 1
        }
      }).toDestination()

      sampler = new Tone.Sampler({
        urls: {
          'A1': 'A1.mp3',
          'A2': 'A2.mp3',
          'A3': 'A3.mp3',
          'A4': 'A4.mp3',
          'A5': 'A5.mp3',
          'A6': 'A6.mp3',
          'A7': 'A7.mp3',
        },
        baseUrl: '/sounds/piano_samples/',
        onload: () => {
          console.log('Sampler Loaded')
        }
      }).toDestination()

      polySynth = new Tone.PolySynth(Tone.Synth).toDestination()
    }
  })

  function playKey(note, octave) {
    const playedNote = `${note}${octave}`
    activeNotes.add(playedNote)

    if (currentTone.value === 'synth') {
      synth.triggerAttack(playedNote)
      console.log(`${playedNote} note played.`)
    } else if (currentTone.value === 'piano') {
      sampler.triggerAttack(playedNote)
      console.log(`${playedNote} note played.`)
    }
  }

  function stopKey(note, octave) {
    if (!synth || !sampler) return

    const playedNote = `${note}${octave}`
    activeNotes.delete(playedNote)

    if (currentTone.value === 'synth') {
      synth.triggerRelease()
    } else if (currentTone.value === 'piano') {
      sampler.triggerRelease()
    }
  }

  function assignChordOctaves(root, chordNotesArray) {
    let currentOctave = startingOctave.value
    let lastNoteIndex = notes.value.indexOf(root)

    const chordWithOctaves = []

    chordNotesArray.forEach((note) => {
      const noteIndex = notes.value.indexOf(note)
      if (noteIndex <= lastNoteIndex) {
        currentOctave++
      }
      chordWithOctaves.push(`${note}${currentOctave}`)
      lastNoteIndex = noteIndex
    })

    return chordWithOctaves
  }

  function playChord(action, rootNote, chordType, chordNotes) {
    const notesWithOctaves = assignChordOctaves(rootNote, chordNotes)
    if (!rootNote || !chordType) return

    if (action === 'play') {
      if (currentTone.value === 'synth') {
        polySynth.triggerAttack(notesWithOctaves)
      } else if (currentTone.value === 'piano') {
        sampler.triggerAttack(notesWithOctaves)
      }
      activeChord.add(notesWithOctaves)
      console.log(`${notesWithOctaves.join(', ')} chord played.`)
    } else if (action === 'stop') {
      if (currentTone.value === 'synth') {
        polySynth.triggerRelease(notesWithOctaves)
      } else if (currentTone.value === 'piano') {
        sampler.triggerRelease()
      }
      activeChord.delete(notesWithOctaves)
    }
  }

  return {
    currentTone,
    playKey,
    stopKey,
    playChord,
    activeNotes,
    activeChord
  }
}
