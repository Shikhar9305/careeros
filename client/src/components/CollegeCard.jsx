
"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

const CollegeCard = ({ college, score, rank, reasons = [], features = {}, userId, onSave, onApply, isSaved }) => {
  const navigate = useNavigate()
  const [isApplied, setIsApplied] = useState(false)
  const [showReasons, setShowReasons] = useState(false)
  const cardRef = useRef(null)
  const hasTrackedView = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTrackedView.current) {
            trackEvent("view")
            hasTrackedView.current = true
          }
        })
      },
      { threshold: 0.5 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const trackEvent = async (action) => {
    if (!userId || !college._id) return

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/recommendation-event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          collegeId: college._id,
          action,
          metadata: { score, rank },
        }),
      })
    } catch (error) {
      console.error("Failed to track event:", error)
    }
  }

  const handleViewDetails = () => {
    trackEvent("click")
    navigate(`/college/${college._id}`)
  }

  const handleToggleReasons = (e) => {
    e.stopPropagation()
    setShowReasons(!showReasons)
  }

  const handleSave = (e) => {
    e.stopPropagation()
    trackEvent("save")
    if (onSave) onSave(college)
  }

  const handleApply = (e) => {
    e.stopPropagation()
    trackEvent("apply")
    setIsApplied(true)
    if (onApply) onApply(college)
  }

  const matchPercentage = Math.round(score * 100)

  const getGradient = () => {
    if (rank === 1) return "from-amber-500 via-orange-500 to-red-500"
    if (rank === 2) return "from-slate-400 via-slate-500 to-slate-600"
    if (rank === 3) return "from-amber-600 via-amber-700 to-amber-800"
    return "from-blue-500 via-cyan-500 to-teal-500"
  }

  const getRankBadge = () => {
    if (rank === 1) return { icon: "🥇", text: "Top Pick" }
    if (rank === 2) return { icon: "🥈", text: "Excellent Match" }
    if (rank === 3) return { icon: "🥉", text: "Great Choice" }
    return null
  }

  const rankBadge = getRankBadge()

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
    >
      <div className={`h-36 bg-gradient-to-r ${getGradient()} relative p-6 flex flex-col justify-end`}>
        {rankBadge && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
            <span>{rankBadge.icon}</span>
            <span className="text-xs font-semibold text-gray-800">{rankBadge.text}</span>
          </div>
        )}

        <div className="text-white">
          <h4 className="text-xl font-bold leading-tight line-clamp-2">{college.name || "College Name"}</h4>
          <p className="text-sm text-white/80 mt-1 flex items-center gap-1">
            <span>📍</span>
            {college.address?.city}, {college.address?.state}
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {college.type && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{college.type}</span>
          )}
          {college.affiliation && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              {college.affiliation}
            </span>
          )}
        </div>

        {college.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {college.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                {tag}
              </span>
            ))}
            {college.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-400 rounded-md text-xs">
                +{college.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className={`transition-all duration-300 overflow-hidden ${showReasons ? "max-h-96" : "max-h-0"}`}>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 mb-4 border border-green-100">
            <h5 className="text-xs font-semibold text-green-800 mb-2 flex items-center gap-1">
              <span>✨</span> Why we recommend this
            </h5>
            <ul className="space-y-1.5">
              {reasons.map((reason, idx) => (
                <li key={idx} className="text-sm text-green-700 flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {features && Object.keys(features).length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <h5 className="text-xs font-semibold text-gray-600 mb-3">Match Breakdown</h5>
              <div className="space-y-2">
                {[
                  { key: "similarity", label: "Profile Match", color: "bg-blue-500" },
                  { key: "interestOverlap", label: "Interest Match", color: "bg-cyan-500" },
                  { key: "budgetFit", label: "Budget Fit", color: "bg-green-500" },
                  { key: "placementScore", label: "Placements", color: "bg-orange-500" },
                ].map(({ key, label, color }) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-24">{label}</span>
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full transition-all duration-500`}
                        style={{ width: `${(features[key] || 0) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-8">{Math.round((features[key] || 0) * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {reasons.length > 0 && (
          <button
            onClick={handleToggleReasons}
            className="w-full mb-4 py-2 px-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <span>💡</span>
            {showReasons ? "Hide Recommendation Details" : "Why is this recommended?"}
          </button>
        )}

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-600">Overall Match</span>
            <span
              className={`text-sm font-bold ${
                matchPercentage >= 80 ? "text-green-600" : matchPercentage >= 60 ? "text-blue-600" : "text-orange-600"
              }`}
            >
              {matchPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                matchPercentage >= 80
                  ? "bg-gradient-to-r from-green-400 to-emerald-500"
                  : matchPercentage >= 60
                    ? "bg-gradient-to-r from-blue-400 to-cyan-500"
                    : "bg-gradient-to-r from-orange-400 to-amber-500"
              }`}
              style={{ width: `${matchPercentage}%` }}
            />
          </div>
        </div>

        {college.placements?.averagePackageLPA && (
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-1">
              <span>💰</span>
              <span>Avg Package:</span>
            </div>
            <span className="font-semibold text-gray-800">₹{college.placements.averagePackageLPA} LPA</span>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleViewDetails}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>🎓</span>
            View Full Details
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                isSaved
                  ? "bg-pink-100 text-pink-700 cursor-default"
                  : "bg-gray-100 text-gray-700 hover:bg-pink-50 hover:text-pink-600"
              }`}
            >
              <span>{isSaved ? "❤️" : "🤍"}</span>
              {isSaved ? "Saved" : "Save"}
            </button>

            <button
              onClick={handleApply}
              disabled={isApplied}
              className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                isApplied
                  ? "bg-green-100 text-green-700 cursor-default"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              <span>{isApplied ? "✅" : "📝"}</span>
              {isApplied ? "Applied" : "Apply"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollegeCard
