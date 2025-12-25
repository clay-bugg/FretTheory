import * as Tone from 'tone'
import { useKeyboardStore } from '~/stores/keyboardStore'

export function useToneAudio() {
  const store = useKeyboardStore()
  
  let synth = null
  let sampler = null
  let polySynth = null

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

    if (store.currentTone === 'synth') {
      synth.triggerAttack(playedNote)
      console.log(`${playedNote} note played.`)
    } else if (store.currentTone === 'piano') {
      sampler.triggerAttack(playedNote)
      console.log(`${playedNote} note played.`)
    }
  }

  function stopKey(note, octave) {
    if (!synth || !sampler) return

    const playedNote = `${note}${octave}`
    activeNotes.delete(playedNote)

    if (store.currentTone === 'synth') {
      synth.triggerRelease()
    } else if (store.currentTone === 'piano') {
      sampler.triggerRelease()
    }
  }

  function playChord(action) {
    const notesWithOctaves = store.assignChordOctaves(store.rootNote, store.chordNotes)
    if (!store.rootNote || !store.chordType) return

    if (action === 'play') {
      if (store.currentTone === 'synth') {
        polySynth.triggerAttack(notesWithOctaves)
      } else if (store.currentTone === 'piano') {
        sampler.triggerAttack(notesWithOctaves)
      }
      activeChord.add(notesWithOctaves)
      console.log(`${notesWithOctaves.join(', ')} chord played.`)
    } else if (action === 'stop') {
      if (store.currentTone === 'synth') {
        polySynth.triggerRelease(notesWithOctaves)
      } else if (store.currentTone === 'piano') {
        sampler.triggerRelease()
      }
      activeChord.delete(notesWithOctaves)
    }
  }

  return {
    playKey,
    stopKey,
    playChord,
    activeNotes,
    activeChord
  }
}
