

"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Minimize2, Maximize2, HelpCircle, Volume2, VolumeX, ChevronUp, ChevronDown } from "lucide-react"
import { useVoiceAssistant } from "../hooks/use-voice-assistant"
import { VisualIndicator, VoiceButton } from "./visual-indicator"
import { getHelpText } from "../core/command-registry"

export function AssistantOverlay({
  position = "bottom-right",
  defaultExpanded = false,
  onAction,
  setSelectedRole,
  setIsSignUp,
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [isMinimized, setIsMinimized] = useState(false)
  const [inputText, setInputText] = useState("")
  const [speakEnabled, setSpeakEnabled] = useState(true)
  const [showHelp, setShowHelp] = useState(false)

  const inputRef = useRef(null)
  const historyRef = useRef(null)

  const {
    isListening,
    isProcessing,
    transcript,
    interimTranscript,
    lastResponse,
    error,
    history,
    startListening,
    stopListening,
    toggleListening,
    processTextCommand,
    clearHistory,
    isSupported,
  } = useVoiceAssistant({
    speakResponses: speakEnabled,
    setSelectedRole,
    setIsSignUp,
    onStateChange: (state) => {
      onAction?.(state)
    },
  })

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight
    }
  }, [history])

  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputText.trim()) {
      processTextCommand(inputText.trim())
      setInputText("")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e)
    }
  }

 const status = isListening
  ? { text: "Listening...", color: "#0d5c4d" }
  : isProcessing
    ? { text: "Processing...", color: "#d97706" }
    : { text: "Ready", color: "#10b981" }



  if (isMinimized) {
    return (
      <>
        <VisualIndicator
          isListening={isListening}
          isProcessing={isProcessing}
          lastResponse={lastResponse}
          transcript={transcript}
          interimTranscript={interimTranscript}
        />
        <div className={`fixed ${positionClasses[position]} z-50`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMinimized(false)}
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                transition: "all 0.2s",
              }}
              aria-label="Expand assistant"
            >
              <Maximize2 style={{ width: 20, height: 20, color: "#6b7280" }} />
            </button>
            <VoiceButton
              isListening={isListening}
              isProcessing={isProcessing}
              onClick={toggleListening}
              disabled={!isSupported}
            />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <VisualIndicator
        isListening={isListening}
        isProcessing={isProcessing}
        lastResponse={lastResponse}
        transcript={transcript}
        interimTranscript={interimTranscript}
      />

      <div className={`fixed ${positionClasses[position]} z-50`}>
        <div
          style={{
            width: isExpanded ? 380 : 320,
            background: "#ffffff",
            borderRadius: 20,
            boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
            overflow: "hidden",
            transition: "all 0.3s ease",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#ffffff",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #0d5c4d 0%, #10b981 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(13, 92, 77, 0.3)",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
              </div>
              <div>
  <div style={{ color: "#111827", fontWeight: 600, fontSize: 15 }}>
    Smart Assistant
  </div>

  <div
    style={{
      color: status.color,
      fontSize: 12,
      display: "flex",
      alignItems: "center",
      gap: 6,
    }}
  >
    <span
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: status.color,
        boxShadow: `0 0 8px ${status.color}`,
      }}
    />
    {status.text}
  </div>
</div>

            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                onClick={() => setSpeakEnabled(!speakEnabled)}
                style={{
                  background: "#f3f4f6",
                  border: "none",
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6b7280",
                  transition: "all 0.2s",
                }}
                aria-label={speakEnabled ? "Mute responses" : "Unmute responses"}
              >
                {speakEnabled ? <Volume2 style={{ width: 16, height: 16 }} /> : <VolumeX style={{ width: 16, height: 16 }} />}
              </button>
              <button
                onClick={() => setShowHelp(!showHelp)}
                style={{
                  background: "#f3f4f6",
                  border: "none",
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6b7280",
                  transition: "all 0.2s",
                }}
                aria-label="Show help"
              >
                <HelpCircle style={{ width: 16, height: 16 }} />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                  background: "#f3f4f6",
                  border: "none",
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6b7280",
                  transition: "all 0.2s",
                }}
                aria-label={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <ChevronDown style={{ width: 16, height: 16 }} /> : <ChevronUp style={{ width: 16, height: 16 }} />}
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                style={{
                  background: "#f3f4f6",
                  border: "none",
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6b7280",
                  transition: "all 0.2s",
                }}
                aria-label="Minimize"
              >
                <Minimize2 style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>

          {showHelp && (
            <div
              style={{
                padding: "16px 20px",
                background: "rgba(13, 92, 77, 0.05)",
                borderBottom: "1px solid #e5e7eb",
                maxHeight: 200,
                overflowY: "auto",
              }}
            >
              <pre style={{ fontSize: 12, color: "#374151", whiteSpace: "pre-wrap", fontFamily: "monospace", margin: 0 }}>
                {getHelpText()}
              </pre>
            </div>
          )}

          {isExpanded && (
            <div
              ref={historyRef}
              style={{
                height: 240,
                overflowY: "auto",
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                background: "#fafafa",
              }}
            >
              {history.length === 0 ? (
                <div style={{ textAlign: "center", color: "#9ca3af", marginTop: 40 }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, rgba(13, 92, 77, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0d5c4d" strokeWidth="2">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" x2="12" y1="19" y2="22" />
                    </svg>
                  </div>
                  <div style={{ fontSize: 14, color: "#6b7280" }}>Say something or type a command</div>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>Try "help" for available commands</div>
                </div>
              ) : (
                history.map((item, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div
                      style={{
                        alignSelf: item.type==="user" ? "flex-end" : "flex-start",
                        maxWidth: "80%",
                      }}
                    >
                      <div
                        style={{
                          padding: "10px 14px",
                          borderRadius: item.type === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                          background: item.type === "user" ? "#0d5c4d" : "#ffffff",
                          color: item.type === "user" ? "#ffffff" : "#374151",
                          fontSize: 14,
                          lineHeight: 1.5,
                          boxShadow: item.text === "user" ? "none" : "0 1px 3px rgba(0,0,0,0.1)",
                          border: item.text === "user" ? "none" : "1px solid #e5e7eb",
                        }}
                      >
                        {item.text ?? item.reply ?? item.error}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {error && (
            <div
              style={{
                padding: "12px 20px",
                background: "rgba(239, 68, 68, 0.1)",
                borderTop: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              <p style={{ fontSize: 12, color: "#dc2626", margin: 0, fontWeight: 500 }}>{error}</p>
            </div>
          )}

          <div
            style={{
              padding: 16,
              borderTop: "1px solid #e5e7eb",
              display: "flex",
              gap: 12,
              alignItems: "center",
              background: "#ffffff",
            }}
          >
            <VoiceButton
              isListening={isListening}
              isProcessing={isProcessing}
              onClick={toggleListening}
              disabled={!isSupported}
              size="small"
            />

            <form onSubmit={handleSubmit} style={{ flex: 1, display: "flex", gap: 8 }}>
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Listening..." : "Type command..."}
                disabled={isProcessing}
                style={{
                  flex: 1,
                  background: "#f3f4f6",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: "12px 16px",
                  color: "#111827",
                  fontSize: 14,
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isProcessing}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  border: "none",
                  background: "linear-gradient(135deg, #0d5c4d 0%, #10b981 100%)",
                  cursor: !inputText.trim() || isProcessing ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: !inputText.trim() || isProcessing ? 0.5 : 1,
                  transition: "all 0.2s",
                  boxShadow: "0 2px 8px rgba(13, 92, 77, 0.3)",
                }}
              >
                <Send style={{ width: 18, height: 18, color: "#ffffff" }} />
              </button>
            </form>
          </div>

          {(interimTranscript || (isListening && transcript)) && (
            <div
              style={{
                padding: "8px 20px 16px",
                background: "rgba(13, 92, 77, 0.05)",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  padding: "8px 12px",
                  background: "#ffffff",
                  border: "1px solid rgba(13, 92, 77, 0.2)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "#0d5c4d",
                  fontWeight: 500,
                }}
              >
                {interimTranscript || transcript}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AssistantOverlay



