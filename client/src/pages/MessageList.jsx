
"use client"

import { useState, useEffect } from "react"
import { MessageCircle, Search, User } from "lucide-react"

const MessageList = ({ user, onSelectChat }) => {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [counsellors, setCounsellors] = useState([])
  const [totalUnread, setTotalUnread] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (user?._id) {
      fetchConversations()
      fetchUnreadCount()
      if (user.role === "student") {
        fetchCounsellors()
      }
    }
  }, [user])

  const fetchConversations = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/conversations/${user._id}`)
      if (response.ok) {
        const data = await response.json()

        const conversationsWithNames = await Promise.all(
          data.map(async (conv) => {
            try {
              const profileType = conv.role === "counselor" ? "counsellor-profile" : "profile"
              const profileResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${profileType}/${conv.userId}`)
              if (profileResponse.ok) {
                const profile = await profileResponse.json()
                return {
                  ...conv,
                  name: profile.fullName || profile.name || "User",
                  avatar: profile.profileImage || null,
                }
              }
            } catch (error) {
              console.error("[v0] Profile fetch failed:", error)
            }
            return { ...conv, name: "User" }
          }),
        )

        setConversations(conversationsWithNames)
      }
    } catch (error) {
      console.error("Error fetching conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/unread-count/${user._id}`)
      if (response.ok) {
        const data = await response.json()
        setTotalUnread(data.count)
      }
    } catch (error) {
      console.error("Error fetching unread count:", error)
    }
  }

  const fetchCounsellors = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/users/counsellors/all`)
      if (response.ok) {
        const data = await response.json()
        setCounsellors(data)
      }
    } catch (error) {
      console.error("Error fetching counsellors:", error)
    }
  }

  const startNewChat = (counsellor) => {
    onSelectChat({
      userId: counsellor.userId,
      name: counsellor.fullName,
      role: "counselor",
    })
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            Messages
          </h2>
          {totalUnread > 0 && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ring-4 ring-blue-50">
              {totalUnread}
            </span>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-400">Loading chats...</span>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm text-gray-500 font-medium">No conversations found</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredConversations.map((conv) => (
              <button
                key={conv.userId}
                onClick={() => onSelectChat({ ...conv })}
                className="w-full group p-3 rounded-2xl hover:bg-gray-50 transition-all flex items-center gap-3 text-left relative"
              >
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center ${
                      conv.role === "counselor" ? "bg-purple-100" : "bg-blue-100"
                    }`}
                  >
                    {conv.avatar ? (
                      <img src={conv.avatar || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className={`w-6 h-6 ${conv.role === "counselor" ? "text-purple-600" : "text-blue-600"}`} />
                    )}
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{conv.name}</h4>
                    <span className="text-[10px] text-gray-400 font-medium">{formatTime(conv.lastMessageTime)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <p
                      className={`text-xs truncate flex-1 ${conv.unreadCount > 0 ? "text-gray-900 font-semibold" : "text-gray-500"}`}
                    >
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {user.role === "student" && counsellors.length > 0 && (
        <div className="p-4 bg-gray-50 rounded-t-3xl border-t border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Recommended Experts</p>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {counsellors.map((c) => (
              <button
                key={c._id}
                onClick={() => startNewChat(c)}
                className="flex-shrink-0 flex flex-col items-center gap-2 p-2"
              >
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center ring-2 ring-transparent hover:ring-blue-100 transition-all">
                  <span className="text-lg">👨‍🏫</span>
                </div>
                <span className="text-[10px] font-medium text-gray-600 w-12 truncate text-center">
                  {c.fullName.split(" ")[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MessageList
