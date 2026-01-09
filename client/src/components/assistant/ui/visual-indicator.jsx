


"use client"

import { useEffect, useState } from "react"
import { Mic, Loader2, CheckCircle, XCircle } from "lucide-react"

export function VisualIndicator({
  isListening,
  isProcessing,
  lastResponse,
  transcript,
  interimTranscript,
  className = "",
}) {
  const [showResponse, setShowResponse] = useState(false)

  useEffect(() => {
    if (lastResponse) {
      setShowResponse(true)
      const timer = setTimeout(() => setShowResponse(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [lastResponse])
const waveStyle = (i) => ({
  position: "absolute",
  borderRadius: "50%",
  width: `${80 + i * 30}px`,
  height: `${80 + i * 30}px`,
  opacity: 0.15 - i * 0.03,
  animation: `wave-pulse ${1.5 + i * 0.3}s ease-in-out infinite`,
  animationDelay: `${i * 0.2}s`,
})

  return (
    <div
      style={{
        pointerEvents: "none",
        position: "fixed",
        bottom: 120,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
      }}
      className={className}
    >
      {(isListening || isProcessing) && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={waveStyle(i)} />

              ))}
            </div>

            <div
              style={{
                position: "relative",
                zIndex: 10,
                borderRadius: "50%",
                padding: 24,
                background: "#ffffff",
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
                border: `2px solid ${isListening ? "#0d5c4d" : "#d97706"}`,
              }}
            >
              <div style={{ position: "relative" }}>
                {isListening && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          border: "2px solid #0d5c4d",
                          animation: `ripple ${2}s ease-out infinite`,
                          animationDelay: `${i * 0.6}s`,
                        }}
                      />
                    ))}
                  </div>
                )}
                {isListening ? (
                  <Mic style={{ width: 32, height: 32, color: "#0d5c4d", position: "relative", zIndex: 10 }} />
                ) : (
                  <Loader2 style={{ width: 32, height: 32, color: "#d97706", position: "relative", zIndex: 10, animation: "spin 1s linear infinite" }} />
                )}
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: "12px 24px",
              borderRadius: 999,
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 500, color: isListening ? "#0d5c4d" : "#d97706" }}>
              {isListening && (interimTranscript || "Listening...")}
              {isProcessing && !isListening && (transcript ? `Processing: ${transcript}` : "Processing...")}

            </span>
          </div>
        </div>
      )}

      {showResponse && lastResponse && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 24px",
            borderRadius: 999,
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
            border: `1px solid ${lastResponse.success ? "#10b981" : "#ef4444"}`,
            background: "#ffffff",
          }}
        >
          <div
            style={{
              padding: 4,
              borderRadius: "50%",
              background: lastResponse.success ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
            }}
          >
            {lastResponse.success ? (
              <CheckCircle style={{ width: 20, height: 20, color: "#10b981" }} />
            ) : (
              <XCircle style={{ width: 20, height: 20, color: "#ef4444" }} />
            )}
          </div>
          <span style={{ fontSize: 14, fontWeight: 500, color: lastResponse.success ? "#10b981" : "#ef4444", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {lastResponse.reply || lastResponse.error}
          </span>
        </div>
      )}

      <style jsx>{`
        @keyframes wave-pulse {
          0%, 100% {
            transform: scale(0.95);
            opacity: 0.15;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.25;
          }
        }

        @keyframes ripple {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export function VoiceButton({ isListening, isProcessing, onClick, disabled, size = "default", className = "" }) {
  const sizeMap = {
    small: 48,
    default: 64,
    large: 80,
  }

  const iconSizeMap = {
    small: 22,
    default: 28,
    large: 36,
  }

  const buttonSize = sizeMap[size]
  const iconSize = iconSizeMap[size]

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: buttonSize,
        height: buttonSize,
        borderRadius: "50%",
        border: "none",
        background:
          isListening
            ? "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)"
            : isProcessing
              ? "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)"
              : "linear-gradient(135deg, #0d5c4d 0%, #10b981 100%)",
        cursor: disabled || isProcessing ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow:
          isListening
            ? "0 8px 32px rgba(220, 38, 38, 0.4), 0 0 0 4px rgba(220, 38, 38, 0.15)"
            : isProcessing
              ? "0 4px 20px rgba(217, 119, 6, 0.4)"
              : "0 8px 32px rgba(13, 92, 77, 0.4), 0 0 0 4px rgba(16, 185, 129, 0.15)",
        transition: "all 0.3s ease",
        opacity: disabled || isProcessing ? 0.8 : 1,
        position: "relative",
      }}
      className={className}
      aria-label={isListening ? "Stop listening" : "Start voice command"}
    >
      {isListening &&
        [...Array(3)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "2px solid #dc2626",
              animation: `ripple ${2}s ease-out infinite`,
              animationDelay: `${i * 0.6}s`,
            }}
          />
        ))}

      <div style={{ position: "relative", zIndex: 10 }}>
        {isProcessing ? (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            style={{ animation: "spin 1s linear infinite" }}
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        ) : isListening ? (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
            <line x1="2" y1="2" x2="22" y2="22" />
            <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" />
            <path d="M5 10v2a7 7 0 0 0 12 5" />
            <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33" />
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        ) : (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        )}
      </div>

      <style jsx>{`
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </button>
  )
}

export default VisualIndicator





