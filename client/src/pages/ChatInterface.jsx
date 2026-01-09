



"use client"

import { useState, useEffect, useRef } from "react"
import { useSocket } from "../context/SocketContext"
import { Send, ArrowLeft, MessageCircle, CheckCheck, Check } from "lucide-react"

const ChatInterface = ({ user, selectedChat, onBack }) => {
  const [messageInput, setMessageInput] = useState("")
  const [chatHistory, setChatHistory] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  const { socket, sendMessage, emitTyping, registerUser } = useSocket()

  useEffect(() => {
    if (user?._id) {
      registerUser(user._id, user.role)
    }
  }, [user, registerUser])

  useEffect(() => {
    if (selectedChat?.userId) {
      fetchChatHistory()
    }
  }, [selectedChat])

  useEffect(() => {
    if (socket) {
      socket.on("receive_message", (message) => {
        if (message.senderId === selectedChat?.userId && message.receiverId === user._id) {
          setChatHistory((prev) => [...prev, message])
          scrollToBottom()
        }
      })

      socket.on("user_typing", ({ isTyping }) => {
        setIsTyping(isTyping)
      })

      return () => {
        socket.off("receive_message")
        socket.off("user_typing")
      }
    }
  }, [socket, selectedChat, user])

  const fetchChatHistory = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/history/${user._id}/${selectedChat.userId}`)
      if (response.ok) {
        const data = await response.json()
        setChatHistory(data)
        scrollToBottom()
      }
    } catch (error) {
      console.error("Error fetching chat history:", error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const handleSendMessage = () => {
    if (!messageInput.trim()) return

    sendMessage({
      senderId: user._id,
      receiverId: selectedChat.userId,
      content: messageInput,
      senderRole: user.role,
      receiverRole: selectedChat.role,
    })

    // Optimistically update UI if needed (already handled by message_sent in context)
    setMessageInput("")
  }

  const handleTyping = (e) => {
    setMessageInput(e.target.value)

    emitTyping(selectedChat.userId, true)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(selectedChat.userId, false)
    }, 1000)
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-gray-600">Select a conversation to start messaging</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="lg:hidden p-2 hover:bg-gray-50 rounded-xl text-gray-500 transition-all">
            <ArrowLeft size={18} />
          </button>
          <div className="relative">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                selectedChat.role === "counselor" ? "bg-purple-100" : "bg-blue-100"
              }`}
            >
              <span className="text-lg">{selectedChat.role === "counselor" ? "👨‍🏫" : "👨‍🎓"}</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{selectedChat.name}</h3>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{selectedChat.role}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-blue-100" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-900">Start the conversation</p>
              <p className="text-xs text-gray-500">Say hi to {selectedChat.name.split(" ")[0]}!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {chatHistory.map((msg, index) => {
              const isSender = msg.senderId === user._id
              const showTime =
                index === 0 ||
                new Date(msg.createdAt).getTime() - new Date(chatHistory[index - 1].createdAt).getTime() > 300000

              return (
                <div key={msg._id || index} className={`flex flex-col ${isSender ? "items-end" : "items-start"}`}>
                  {showTime && (
                    <span className="text-[10px] text-gray-400 font-medium mb-2 w-full text-center py-4">
                      {new Date(msg.createdAt).toLocaleDateString()} at {formatTime(msg.createdAt)}
                    </span>
                  )}
                  <div
                    className={`group relative max-w-[80%] px-4 py-2.5 rounded-2xl text-sm transition-all ${
                      isSender
                        ? "bg-blue-600 text-white rounded-tr-none shadow-sm"
                        : "bg-white text-gray-900 rounded-tl-none border border-gray-100 shadow-sm"
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <div
                      className={`flex items-center gap-1 mt-1 justify-end ${isSender ? "text-blue-100" : "text-gray-400"}`}
                    >
                      <span className="text-[8px] font-medium uppercase">{formatTime(msg.createdAt)}</span>
                      {isSender &&
                        (msg.read ? (
                          <CheckCheck size={10} className="text-blue-200" />
                        ) : (
                          <Check size={10} className="text-blue-300" />
                        ))}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-100 bg-white">
        {isTyping && (
          <div className="absolute bottom-[100px] left-6 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-100 shadow-sm transition-all animate-in fade-in slide-in-from-bottom-2">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              {selectedChat.name.split(" ")[0]} is typing
            </span>
          </div>
        )}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={messageInput}
            onChange={handleTyping}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Write a message..."
            className="flex-1 px-5 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="w-11 h-11 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:shadow-none"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface
