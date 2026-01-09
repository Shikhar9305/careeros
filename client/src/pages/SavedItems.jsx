"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AvatarMenu from "./AvatarMenu"

const SavedItems = ({ onLogout }) => {
  const navigate = useNavigate()
  const [user] = useState(() => JSON.parse(localStorage.getItem("user")) || null)
  const [savedColleges, setSavedColleges] = useState([])
  const [savedCourses, setSavedCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAvatarMenu, setShowAvatarMenu] = useState(false)
  const [avatarImage] = useState(() => localStorage.getItem("userAvatar") || null)

  useEffect(() => {
    if (!user?._id) {
      navigate("/")
      return
    }
    fetchSavedItems()
  }, [user?._id])

  const fetchSavedItems = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/recommendations/saved/${user._id}`)
      if (response.ok) {
        const data = await response.json()
        setSavedColleges(data.savedColleges || [])
        setSavedCourses(data.savedCourses || [])
      }
    } catch (error) {
      console.error("Error fetching saved items:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("userAvatar")
    navigate("/")
    if (onLogout) onLogout()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate("/dashboard")}>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎓</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Career Advisor</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button onClick={() => navigate("/dashboard")} className="text-gray-600 hover:text-blue-600 font-medium">
                Dashboard
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                  className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold cursor-pointer overflow-hidden"
                >
                  {avatarImage ? (
                    <img src={avatarImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>{user?.email?.charAt(0).toUpperCase()}</span>
                  )}
                </button>
                <AvatarMenu
                  isOpen={showAvatarMenu}
                  onClose={() => setShowAvatarMenu(false)}
                  onNavigateToProfile={() => navigate("/profile")}
                  onLogout={handleLogout}
                  user={user}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Your Saved Items</h2>
          <p className="text-gray-600 mt-2">Manage your shortlisted colleges and courses here.</p>
        </div>

        <div className="space-y-12">
          {/* Section 1: Saved Colleges */}
          <section>
            <div className="flex items-center space-x-2 mb-6 border-b pb-2">
              <span className="text-2xl">🏫</span>
              <h3 className="text-xl font-bold text-gray-800">Saved Colleges</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {savedColleges.length}
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl h-64 animate-pulse shadow-sm"></div>
                ))}
              </div>
            ) : savedColleges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {savedColleges.map((item) => (
  <div key={item._id} className="bg-white rounded-xl shadow-md">
    <div className="p-5">
      <h4 className="font-bold text-lg text-gray-900">
        {item.itemId?.name}
      </h4>

      <p className="text-gray-500 text-sm mt-1">
        📍 {item.itemId?.address?.city}, {item.itemId?.address?.state}
      </p>

      <div className="mt-4 text-xs text-gray-400">
        Saved on {new Date(item.createdAt).toLocaleDateString()}
      </div>

      <button
        onClick={() => navigate(`/college/${item.itemId?._id}`)}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
      >
        View Details
      </button>
    </div>
  </div>
))}

              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-dashed border-gray-300">
                <div className="text-4xl mb-4 text-gray-300 italic">No colleges saved yet</div>
                <button onClick={() => navigate("/dashboard")} className="text-blue-600 font-medium hover:underline">
                  Go explore recommendations
                </button>
              </div>
            )}
          </section>

          {/* Section 2: Saved Courses */}
          <section>
            <div className="flex items-center space-x-2 mb-6 border-b pb-2">
              <span className="text-2xl">📚</span>
              <h3 className="text-xl font-bold text-gray-800">Saved Courses</h3>
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {savedCourses.length}
              </span>
            </div>

            {savedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedCourses.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900">{item.courseName}</h4>
                        <p className="text-sm text-gray-500 mt-1">{item.metadata?.collegeName}</p>
                        {item.metadata?.courseSpecialization && (
                          <span className="mt-2 inline-block text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase tracking-wider font-bold">
                            {item.metadata.courseSpecialization}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          /* Implement remove logic */
                        }}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      >
                        <span className="text-xl">✕</span>
                      </button>
                    </div>
                    <div className="mt-4 flex items-center text-[10px] text-gray-400">
                      <span>Saved {new Date(item.savedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-300">
                <p className="text-gray-500">You haven't saved any specific courses yet.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default SavedItems
