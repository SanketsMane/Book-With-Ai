"use client"
import { useState, useRef, useEffect, useCallback } from 'react'

interface VoiceConversationState {
  // Speech Recognition
  isListening: boolean
  isProcessing: boolean
  transcript: string
  confidence: number
  error: string | null
  isSupported: boolean

  // Text-to-Speech
  isSpeaking: boolean
  speechQueue: string[]
  voiceEnabled: boolean
}

interface VoiceConversationControls {
  // Speech Recognition
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
  toggleListening: () => void

  // Text-to-Speech
  speak: (text: string) => Promise<void>
  stopSpeaking: () => void
  clearSpeechQueue: () => void
  toggleVoice: () => void
  setVoiceEnabled: (enabled: boolean) => void
}

interface UseVoiceConversationOptions {
  // Speech Recognition options
  continuous?: boolean
  interimResults?: boolean
  language?: string
  onResult?: (transcript: string, confidence: number) => void
  onError?: (error: string) => void
  onStart?: () => void
  onEnd?: () => void
  autoSend?: boolean
  maxDuration?: number

  // Text-to-Speech options
  voiceEnabled?: boolean
  voicePitch?: number
  voiceRate?: number
  voiceVolume?: number
  autoSpeak?: boolean
  onSpeechStart?: () => void
  onSpeechEnd?: () => void
}

export function useVoiceConversation(options: UseVoiceConversationOptions = {}): [VoiceConversationState, VoiceConversationControls] {
  const {
    // Recognition options
    continuous = true,
    interimResults = true,
    language = 'en-US',
    onResult,
    onError,
    onStart,
    onEnd,
    autoSend = false,
    maxDuration = 60000,

    // TTS options
    voiceEnabled: initialVoiceEnabled = false,
    voicePitch = 1,
    voiceRate = 1,
    voiceVolume = 1,
    autoSpeak = true,
    onSpeechStart,
    onSpeechEnd
  } = options

  const [state, setState] = useState<VoiceConversationState>({
    isListening: false,
    isProcessing: false,
    transcript: '',
    confidence: 0,
    error: null,
    isSupported: false,
    isSpeaking: false,
    speechQueue: [],
    voiceEnabled: initialVoiceEnabled
  })

  const recognition = useRef<any>(null)
  const synthesis = useRef<SpeechSynthesis | null>(null)
  const utterance = useRef<SpeechSynthesisUtterance | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        try {
          recognition.current = new SpeechRecognition()
          recognition.current.continuous = continuous
          recognition.current.interimResults = interimResults
          recognition.current.lang = language
          recognition.current.maxAlternatives = 1

          setState(prev => ({ ...prev, isSupported: true }))
        } catch (error) {
          console.warn('Speech recognition initialization failed:', error)
          setState(prev => ({
            ...prev,
            isSupported: false,
            error: 'Voice recognition not available on this device'
          }))
        }
      } else {
        setState(prev => ({
          ...prev,
          isSupported: false,
          error: 'Speech recognition not supported in this browser'
        }))
      }

      // Initialize Speech Synthesis
      if ('speechSynthesis' in window) {
        synthesis.current = window.speechSynthesis
      }
    }

    return () => {
      if (recognition.current) {
        recognition.current.abort()
      }
      if (synthesis.current) {
        synthesis.current.cancel()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current)
      }
    }
  }, [continuous, interimResults, language])

  // Setup Speech Recognition event listeners
  useEffect(() => {
    if (!recognition.current) return

    const handleResult = (event: any) => {
      let finalTranscript = ''
      let interimTranscript = ''
      let maxConfidence = 0

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcript = result[0].transcript
        const confidence = result[0].confidence

        if (result.isFinal) {
          finalTranscript += transcript
          maxConfidence = Math.max(maxConfidence, confidence)
        } else {
          interimTranscript += transcript
        }
      }

      const currentTranscript = finalTranscript || interimTranscript
      const currentConfidence = maxConfidence || (interimResults ? 0.5 : 0)

      setState(prev => ({
        ...prev,
        transcript: currentTranscript,
        confidence: currentConfidence,
        isProcessing: false
      }))

      if (finalTranscript && onResult) {
        onResult(finalTranscript, maxConfidence)
      }

      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current)
      }

      silenceTimeoutRef.current = setTimeout(() => {
        if (finalTranscript) {
          stopListening()
        }
      }, 3000)
    }

    const handleStart = () => {
      setState(prev => ({
        ...prev,
        isListening: true,
        isProcessing: true,
        error: null,
        transcript: '',
        confidence: 0
      }))

      onStart?.()

      timeoutRef.current = setTimeout(() => {
        stopListening()
      }, maxDuration)
    }

    const handleEnd = () => {
      setState(prev => ({
        ...prev,
        isListening: false,
        isProcessing: false
      }))

      onEnd?.()

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current)
      }
    }

    const handleError = (event: any) => {
      let errorMessage = ''

      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Try speaking closer to your microphone.'
          break
        case 'audio-capture':
          errorMessage = 'Microphone not available. Please check your device settings.'
          break
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please enable permissions and reload.'
          break
        case 'network':
          errorMessage = 'Voice recognition temporarily unavailable. You can still type your message.'
          break
        case 'service-not-allowed':
          errorMessage = 'Speech service unavailable. Please use text input instead.'
          break
        case 'aborted':
          errorMessage = ''
          break
        default:
          errorMessage = `Voice input error: ${event.error}. Please use text input.`
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        isListening: false,
        isProcessing: false
      }))

      if (errorMessage && onError) {
        const silentErrors = ['network', 'service-not-allowed', 'no-speech', 'aborted']
        if (!silentErrors.includes(event.error)) {
          onError(errorMessage)
        }
      }
    }

    recognition.current.addEventListener('result', handleResult)
    recognition.current.addEventListener('start', handleStart)
    recognition.current.addEventListener('end', handleEnd)
    recognition.current.addEventListener('error', handleError)

    return () => {
      if (recognition.current) {
        recognition.current.removeEventListener('result', handleResult)
        recognition.current.removeEventListener('start', handleStart)
        recognition.current.removeEventListener('end', handleEnd)
        recognition.current.removeEventListener('error', handleError)
      }
    }
  }, [onResult, onError, onStart, onEnd, maxDuration])

  // Speech Recognition Controls
  const startListening = useCallback(() => {
    if (!recognition.current || !state.isSupported) {
      setState(prev => ({
        ...prev,
        error: 'Voice recognition not available on this device'
      }))
      return
    }

    if (state.isListening) {
      return
    }

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      setState(prev => ({
        ...prev,
        error: 'Voice recognition requires an internet connection'
      }))
      return
    }

    // Stop speaking before listening
    if (synthesis.current && state.isSpeaking) {
      synthesis.current.cancel()
      setState(prev => ({ ...prev, isSpeaking: false }))
    }

    try {
      setState(prev => ({ ...prev, error: '' }))
      recognition.current.start()
    } catch (error: any) {
      let errorMessage = 'Failed to start voice recognition'

      if (error.name === 'InvalidStateError') {
        errorMessage = 'Voice recognition is already active'
      } else if (error.name === 'NotAllowedError') {
        errorMessage = 'Microphone permission denied'
      }

      setState(prev => ({
        ...prev,
        error: errorMessage
      }))
    }
  }, [state.isSupported, state.isListening, state.isSpeaking])

  const stopListening = useCallback(() => {
    if (recognition.current && state.isListening) {
      recognition.current.stop()
    }
  }, [state.isListening])

  const resetTranscript = useCallback(() => {
    setState(prev => ({
      ...prev,
      transcript: '',
      confidence: 0,
      error: null
    }))
  }, [])

  const toggleListening = useCallback(() => {
    if (state.isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [state.isListening, startListening, stopListening])

  // Text-to-Speech Controls
  const speak = useCallback(async (text: string): Promise<void> => {
    if (!synthesis.current || !state.voiceEnabled) {
      return
    }

    // Stop current speech
    synthesis.current.cancel()

    return new Promise((resolve, reject) => {
      try {
        const utterance = new SpeechSynthesisUtterance(text)

        // Configure voice settings
        utterance.pitch = voicePitch
        utterance.rate = voiceRate
        utterance.volume = voiceVolume
        utterance.lang = language

        // Get available voices and select best one
        const voices = synthesis.current!.getVoices()
        const preferredVoice = voices.find(voice =>
          voice.lang.startsWith(language.split('-')[0]) && voice.name.includes('Google')
        ) || voices.find(voice =>
          voice.lang.startsWith(language.split('-')[0])
        ) || voices[0]

        if (preferredVoice) {
          utterance.voice = preferredVoice
        }

        utterance.onstart = () => {
          setState(prev => ({ ...prev, isSpeaking: true }))
          onSpeechStart?.()
        }

        utterance.onend = () => {
          setState(prev => ({ ...prev, isSpeaking: false }))
          onSpeechEnd?.()
          resolve()
        }

        utterance.onerror = (event) => {
          setState(prev => ({ ...prev, isSpeaking: false }))
          // Only log actual errors, not interrupted/canceled events
          if (event.error && event.error !== 'interrupted' && event.error !== 'canceled') {
            console.error('Speech synthesis error:', event.error)
          }
          reject(event.error || 'Speech synthesis failed')
        }

        synthesis.current!.speak(utterance)
      } catch (error) {
        console.error('Error in text-to-speech:', error)
        reject(error)
      }
    })
  }, [state.voiceEnabled, voicePitch, voiceRate, voiceVolume, language, onSpeechStart, onSpeechEnd])

  const stopSpeaking = useCallback(() => {
    if (synthesis.current) {
      synthesis.current.cancel()
      setState(prev => ({ ...prev, isSpeaking: false, speechQueue: [] }))
    }
  }, [])

  const clearSpeechQueue = useCallback(() => {
    setState(prev => ({ ...prev, speechQueue: [] }))
  }, [])

  const toggleVoice = useCallback(() => {
    setState(prev => {
      const newEnabled = !prev.voiceEnabled
      if (!newEnabled && synthesis.current) {
        synthesis.current.cancel()
      }
      return { ...prev, voiceEnabled: newEnabled, isSpeaking: false }
    })
  }, [])

  const setVoiceEnabled = useCallback((enabled: boolean) => {
    setState(prev => {
      if (!enabled && synthesis.current) {
        synthesis.current.cancel()
      }
      return { ...prev, voiceEnabled: enabled, isSpeaking: false }
    })
  }, [])

  return [
    state,
    {
      startListening,
      stopListening,
      resetTranscript,
      toggleListening,
      speak,
      stopSpeaking,
      clearSpeechQueue,
      toggleVoice,
      setVoiceEnabled
    }
  ]
}

// Extend Window interface
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}
