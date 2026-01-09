

"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { processIntent } from "../core/intent-processor"
import {
  scrollPage,
  scrollToPosition,
  fillInput,
  clickElement,
  selectFromDropdown,
  focusElement,
  tabNavigate,
  toggleElement,
  clearInput,
  readElement,
  navigateHistory,
} from "../core/action-executor"
import { getHelpText } from "../core/command-registry"

// Voice recognition setup
function createSpeechRecognition() {
  if (typeof window === "undefined") return null

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) return null

  const recognition = new SpeechRecognition()
  recognition.continuous = false
  recognition.interimResults = true
  recognition.lang = "en-US"
  recognition.maxAlternatives = 1

  return recognition
}

// Text-to-speech
function speak(text, options = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis) return

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = options.rate || 1.1
  utterance.pitch = options.pitch || 1
  utterance.volume = options.volume || 0.9

  window.speechSynthesis.speak(utterance)
}

export function useVoiceAssistant(options = {}) {
  const {
    onStateChange,
    onError,
    speakResponses = true,
    autoStart = false,
    sessionId = "default",
    setSelectedRole,
    setIsSignUp,
  } = options

  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [lastResponse, setLastResponse] = useState(null)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])

  const recognitionRef = useRef(null)
  const isListeningRef = useRef(false)
  const restartAllowed = useRef(true)
  const isRestarting = useRef(false)

  // Initialize speech recognition
  useEffect(() => {
    recognitionRef.current = createSpeechRecognition()

    if (!recognitionRef.current) {
      setError("Speech recognition not supported in this browser")
      return
    }

    const recognition = recognitionRef.current

    recognition.onstart = () => {
      console.log("[v0] Speech recognition started")
      isListeningRef.current = true
      setIsListening(true)
      setError(null)
      restartAllowed.current = false
    }

    recognition.onend = () => {
      console.log("[v0] Speech recognition ended")
      isListeningRef.current = false
      setIsListening(false)
      restartAllowed.current = true
      isRestarting.current = false
    }

    recognition.onerror = (event) => {
      console.error("[v0] Speech recognition error:", event.error)
      if (event.error !== "no-speech" && event.error !== "aborted") {
        setError(`Speech recognition error: ${event.error}`)
        onError?.(event.error)
      }
      isListeningRef.current = false
      setIsListening(false)
      restartAllowed.current = true
      isRestarting.current = false
    }

    recognition.onresult = (event) => {
      let interim = ""
      let final = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += transcript
        } else {
          interim += transcript
        }
      }

      setInterimTranscript(interim)

      if (final) {
        setTranscript(final)
        handleCommand(final.trim()).then(() => {
          // Auto-restart listening after command execution
          setTimeout(() => {
            if (restartAllowed.current && !isListeningRef.current && !isRestarting.current) {
              isRestarting.current = true
              startListening()
            }
          }, 500)
        })
      }
    }

    if (autoStart) {
      startListening()
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListeningRef.current) {
      console.log("[v0] Cannot start - already listening or no recognition")
      return
    }

    if (!restartAllowed.current) {
      console.log("[v0] Restart not allowed yet")
      return
    }

    try {
      console.log("[v0] Starting speech recognition...")
      recognitionRef.current.start()
    } catch (err) {
      console.warn("[v0] Recognition start error:", err)
      restartAllowed.current = true
      isRestarting.current = false
    }
  }, [])

  // Stop listening
  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return

    try {
      console.log("[v0] Stopping speech recognition...")
      recognitionRef.current.stop()
      restartAllowed.current = false
    } catch (err) {
      console.warn("[v0] Recognition stop error:", err)
    }
  }, [])

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (isListeningRef.current) {
      stopListening()
    } else {
      restartAllowed.current = true
      isRestarting.current = false
      startListening()
    }
  }, [startListening, stopListening])

  // Execute action based on intent
  const executeAction = useCallback(
    async (intent) => {
      const { action, element, value, direction, targetAction, role } = intent

      console.log("[v0] Executing action:", action, intent)

      let result = { success: false }

      try {
        switch (action) {
          case "scroll":
            if (direction === "top" || direction === "bottom") {
              result = await scrollToPosition(direction)
            } else if (direction === "to top") {
              result = await scrollToPosition("top")
            } else if (direction === "to bottom") {
              result = await scrollToPosition("bottom")
            } else {
              result = await scrollPage(direction)
            }
            break

          case "navigate_back":
            result = navigateHistory("back")
            break

          case "navigate_forward":
            result = navigateHistory("forward")
            break

          case "tab_next":
            result = await tabNavigate("next")
            break

          case "tab_prev":
            result = await tabNavigate("prev")
            break

          case "click": {
            const target = element || targetAction
            if (target) {
              result = await clickElement(target)
            } else {
              result = { success: false, error: "No target specified for click" }
            }
            break
          }

          case "fill": {
            const target = element || targetAction
            if (target && value) {
              result = await fillInput(target, value, { simulateTyping: true })
            } else {
              result = { success: false, error: `Missing target or value for fill. Target: ${target}, Value: ${value}` }
            }
            break
          }

          case "fill_focused": {
            const focusedInput = document.activeElement
            if (focusedInput && ["INPUT", "TEXTAREA"].includes(focusedInput.tagName)) {
              result = await fillInput(focusedInput, value, { simulateTyping: true, useElement: true })
            } else {
              result = { success: false, error: "No input is focused" }
            }
            break
          }

          case "select": {
            const target = element || targetAction
            console.log("[v0] Select action - target:", target, "value:", value, "role:", role)

            // If this is a role selection, use React state setter directly
            if (role && setSelectedRole) {
              console.log("[v0] Setting role via React state:", role)
              setSelectedRole(role)
              result = { success: true, message: `Selected ${role} role` }
            } else if (target && (value || role)) {
              result = await selectFromDropdown(target, value || role)
            } else {
              result = { success: false, error: "Missing target or value for select" }
            }
            break
          }

          case "select_role": {
            // Direct role selection via React state
            if (role && setSelectedRole) {
              console.log("[v0] Setting role via React state (select_role):", role)
              setSelectedRole(role)
              if (setIsSignUp) {
                setIsSignUp(true)
              }
              result = { success: true, message: `Selected ${role} role` }
            } else {
              result = { success: false, error: "Role not specified" }
            }
            break
          }

          case "focus": {
            const target = element || targetAction
            if (target) {
              result = await focusElement(target)
            } else {
              result = { success: false, error: "No target for focus" }
            }
            break
          }

          case "clear": {
            const target = element || targetAction
            if (target) {
              result = await clearInput(target)
            } else {
              result = { success: false, error: "No target for clear" }
            }
            break
          }

          case "toggle": {
            const target = element || targetAction
            if (target) {
              result = await toggleElement(target)
            } else {
              result = { success: false, error: "No target for toggle" }
            }
            break
          }

          case "read": {
            const target = element || targetAction
            if (target) {
              result = readElement(target)
            } else {
              result = { success: false, error: "No target for read" }
            }
            break
          }

          case "show_help":
            result = { success: true, text: getHelpText() }
            break

          case "page_info":
            result = { success: true }
            break

          case "confirm":
          case "cancel":
          case "none":
            result = { success: true }
            break

          default:
            result = { success: false, error: `Unknown action: ${action}` }
        }
      } catch (err) {
        console.error("[v0] Action execution error:", err)
        result = { success: false, error: err.message }
      }

      return result
    },
    [setSelectedRole, setIsSignUp],
  )

  // Handle voice command
  const handleCommand = useCallback(
    async (text) => {
      if (!text.trim()) return

      setIsProcessing(true)
      setError(null)

      try {
        console.log("[v0] Processing command:", text)

        // Process intent
        const intent = await processIntent(text, { sessionId })
        console.log("[v0] Processed intent:", intent)

        // Execute action
        const result = await executeAction(intent)
        console.log("[v0] Action result:", result)

        // Update response
        const response = {
          text,
          intent: intent.intent,
          reply: result.error ? `Error: ${result.error}` : intent.reply || "Done",
          success: result.success,
          error: result.error,
          timestamp: Date.now(),
        }

        setLastResponse(response)
        setHistory((prev) => [...prev.slice(-19), response])

        // Speak response
        if (speakResponses && (intent.reply || result.error)) {
          speak(result.error ? `Error: ${result.error}` : intent.reply)
        }

        onStateChange?.({ intent, result, response })
      } catch (err) {
        console.error("[v0] Command handling error:", err)
        setError(err.message)
        onError?.(err)
        if (speakResponses) {
          speak("Sorry, something went wrong. Please try again.")
        }
      } finally {
        setIsProcessing(false)
      }
    },
    [executeAction, onStateChange, onError, speakResponses, sessionId],
  )

  // Process text command (for typing)
  const processTextCommand = useCallback(
    (text) => {
      setTranscript(text)
      handleCommand(text)
    },
    [handleCommand],
  )

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([])
    setLastResponse(null)
  }, [])

  return {
    // State
    isListening,
    isProcessing,
    transcript,
    interimTranscript,
    lastResponse,
    error,
    history,

    // Actions
    startListening,
    stopListening,
    toggleListening,
    processTextCommand,
    clearHistory,
    speak,

    // Utilities
    isSupported: !!recognitionRef.current,
  }
}

export default useVoiceAssistant





