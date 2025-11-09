"use client"
import { useState, useRef, useEffect, useCallback } from 'react'

interface VoiceAIState {
  isListening: boolean
  isProcessing: boolean
  transcript: string
  confidence: number
  error: string | null
  isSupported: boolean
}

interface VoiceAIControls {
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
  toggleListening: () => void
}

interface UseVoiceAIOptions {
  continuous?: boolean
  interimResults?: boolean
  language?: string
  onResult?: (transcript: string, confidence: number) => void
  onError?: (error: string) => void
  onStart?: () => void
  onEnd?: () => void
  autoSend?: boolean
  maxDuration?: number
}

export function useVoiceAI(options: UseVoiceAIOptions = {}): [VoiceAIState, VoiceAIControls] {
  const {
    continuous = true,
    interimResults = true,
    language = 'en-US',
    onResult,
    onError,
    onStart,
    onEnd,
    autoSend = false,
    maxDuration = 60000 // 60 seconds max
  } = options

  const [state, setState] = useState<VoiceAIState>({
    isListening: false,
    isProcessing: false,
    transcript: '',
    confidence: 0,
    error: null,
    isSupported: false
  })

  const recognition = useRef<any>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize speech recognition
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
    }

    return () => {
      if (recognition.current) {
        recognition.current.abort()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current)
      }
    }
  }, [continuous, interimResults, language])

  // Setup event listeners
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
        
        // Auto-send if enabled and confidence is high enough
        if (autoSend && maxConfidence > 0.7) {
          // Will be handled by parent component
        }
      }

      // Reset silence timeout on speech
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current)
      }
      
      // Set new silence timeout
      silenceTimeoutRef.current = setTimeout(() => {
        if (finalTranscript) {
          stopListening()
        }
      }, 3000) // Stop after 3 seconds of silence
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

      // Set maximum duration timeout
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
      let errorMessage = 'Speech recognition error'
      let shouldRetry = false
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Try speaking closer to your microphone.'
          shouldRetry = true
          break
        case 'audio-capture':
          errorMessage = 'Microphone not available. Please check your device settings.'
          break
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please enable permissions and reload.'
          break
        case 'network':
          errorMessage = 'Voice recognition temporarily unavailable. You can still type your message.'
          shouldRetry = true
          break
        case 'service-not-allowed':
          errorMessage = 'Speech service unavailable. Please use text input instead.'
          break
        case 'aborted':
          // User cancelled, don't show error
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
      
      // Only call onError for serious/unexpected errors that need immediate attention
      if (errorMessage && onError) {
        // Silent handling for expected/graceful errors (handled through UI state)
        const silentErrors = ['network', 'service-not-allowed', 'no-speech', 'aborted']
        
        if (!silentErrors.includes(event.error)) {
          // Only trigger onError for actual problems needing user/developer attention
          onError(errorMessage)
        }
      }

      // Auto-retry for certain recoverable errors
      if (shouldRetry && event.error === 'no-speech') {
        setTimeout(() => {
          setState(prev => ({ ...prev, error: '' }))
        }, 3000)
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
  }, [onResult, onError, onStart, onEnd, autoSend, maxDuration])

  const startListening = useCallback(() => {
    if (!recognition.current || !state.isSupported) {
      setState(prev => ({ 
        ...prev, 
        error: 'Voice recognition not available on this device' 
      }))
      return
    }

    // Check if already listening
    if (state.isListening) {
      return
    }

    // Check network connectivity (basic check)
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      setState(prev => ({ 
        ...prev, 
        error: 'Voice recognition requires an internet connection' 
      }))
      return
    }

    try {
      // Clear any previous errors
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
  }, [state.isSupported, state.isListening])

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

  return [
    state,
    {
      startListening,
      stopListening,
      resetTranscript,
      toggleListening
    }
  ]
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}