"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import ProfileCompletionPopup from "./ProfileCompletionPopup"

const StudentDashboard = ({ onLogout }) => {
  const location = useLocation()
  const navigate = useNavigate()

  // Load user from location.state or localStorage
  const [user, setUser] = useState(() => {
    return location.state?.user || JSON.parse(localStorage.getItem("user")) || null
  })

  const [showProfilePopup, setShowProfilePopup] = useState(false)
  const [profileCompleted, setProfileCompleted] = useState(false)
  const [userProfile, setUserProfile] = useState(null)

  console.log("🔵 StudentDashboard rendered. User state:", user)

  useEffect(() => {
    console.log("🟠 useEffect triggered. Current user:", user)

    if (!user) {
      console.log("⛔ No user found. Skipping profile fetch.")
      return
    }
    if (!user._id) {
      console.log("⛔ User object has no _id:", user)
      return
    }
    if (user.role !== "student") {
      console.log("ℹ User role is not student. Role:", user.role)
      return
    }

    const checkProfileCompletion = async () => {
      try {
        console.log("🟢 Fetching profile for userId:", user._id)

        const response = await fetch(`http://localhost:5002/api/users/profile/${user._id}`)
        console.log("🔵 Fetch response status:", response.status)

        if (!response.ok) {
          console.warn("⚠ No profile found, showing popup.")
          setShowProfilePopup(true)
          return
        }

        const profile = await response.json()
        console.log("✅ Fetched profile data from backend:", profile)

        if (profile && profile.profileCompleted) {
          console.log("🎉 Profile marked completed in DB.")
          setUserProfile(profile)
          setProfileCompleted(true)
        } else {
          console.warn("⚠ Profile exists but profileCompleted=false.")
          setShowProfilePopup(true)
        }
      } catch (error) {
        console.error("🔥 Error checking profile:", error)
        setShowProfilePopup(true)
      }
    }

    checkProfileCompletion()
  }, [user])

  const handleProfileComplete = (profileData) => {
    console.log("✅ Profile completed in popup. Saving to state:", profileData)
    setUserProfile(profileData)
    setProfileCompleted(true)
    setShowProfilePopup(false)

    // Update localStorage so state persists after refresh
    const updatedUser = { ...user, profileCompleted: true }
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const features = [
    {
      title: "Explore Colleges",
      description: "Discover colleges that match your interests and academic profile",
      icon: "🏫",
      gradient: "from-blue-500 to-blue-600",
      hoverGradient: "from-blue-600 to-blue-700",
    },
    {
      title: "Generate Career Roadmap",
      description: "Get personalized career guidance based on your profile and goals",
      icon: "🗺",
      gradient: "from-green-500 to-green-600",
      hoverGradient: "from-green-600 to-green-700",
    },
    {
      title: "Still Confused?",
      description: "Take our comprehensive assessment to find your perfect career path",
      icon: "🤔",
      gradient: "from-yellow-500 to-orange-500",
      hoverGradient: "from-yellow-600 to-orange-600",
    },
    {
      title: "Consult Counsellor",
      description: "Get expert advice from professional career counsellors",
      icon: "👨‍🏫",
      gradient: "from-purple-500 to-purple-600",
      hoverGradient: "from-purple-600 to-purple-700",
    },
  ]

  const handleFeatureClick = (featureTitle) => {
    if (!profileCompleted) {
      alert("Please complete your profile first to access this feature!")
      setShowProfilePopup(true)
      return
    }
    console.log(`Clicked ${featureTitle}`)
    if (featureTitle === "Explore Colleges") {
      navigate("/explore-colleges")
    }
    if (featureTitle === "Generate Career Roadmap") {
      navigate("/career-roadmap")
    }
    if (featureTitle === "Consult Counsellor") {
      navigate("/consult-counsellor", { state: { user } })
    }
    // TODO: add navigation or logic for other features
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎓</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Career Advisor</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  profileCompleted
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                }`}
              >
                Dashboard
              </button>
              <span className="text-gray-700">Welcome, {user?.email}</span>
              <button
                onClick={() => {
                  localStorage.removeItem("user")
                  setUser(null)
                  navigate("/")
                  if (onLogout) onLogout()
                }}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Completion Status */}
      {profileCompleted ? (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-4 mt-4 rounded-r-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-green-400 text-xl">✅</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700 font-medium">
                Profile completed! You're all set to explore your career options.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4 mt-4 rounded-r-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-yellow-400 text-xl">⚠</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 font-medium">
                Complete your profile to unlock all features and get personalized recommendations.
              </p>
              <button
                onClick={() => setShowProfilePopup(true)}
                className="mt-2 text-yellow-800 underline hover:text-yellow-900"
              >
                Complete Profile Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Career Journey Starts Here</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore colleges, get career guidance, and plan your future with our comprehensive tools designed just for
            students like you.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 ${
                !profileCompleted ? "opacity-75" : ""
              }`}
              onClick={() => handleFeatureClick(feature.title)}
            >
              <div className="p-6">
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 mx-auto transform transition-transform duration-200 hover:scale-110`}
                >
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-sm text-center leading-relaxed">{feature.description}</p>
              </div>
              <div className="px-6 pb-6">
                <button
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    profileCompleted
                      ? `bg-gradient-to-r ${feature.gradient} hover:${feature.hoverGradient} text-white shadow-md hover:shadow-lg`
                      : "bg-gray-100 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {profileCompleted ? "Get Started" : "Complete Profile First"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Profile Summary */}
        {profileCompleted && userProfile && (
          <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Profile Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-2">Academic Info</h4>
                <p className="text-sm text-blue-700">Grade: {userProfile.grade}</p>
                <p className="text-sm text-blue-700">Stream: {userProfile.stream}</p>
                <p className="text-sm text-blue-700">Age: {userProfile.age}</p>
              </div>
              <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                <h4 className="font-bold text-green-900 mb-2">Location</h4>
                <p className="text-sm text-green-700">{userProfile.location}</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                <h4 className="font-bold text-purple-900 mb-2">Interests</h4>
                <p className="text-sm text-purple-700">{userProfile.interests?.join(", ") || "Not specified"}</p>
              </div>
              <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                <h4 className="font-bold text-orange-900 mb-2">Strong Subjects</h4>
                <p className="text-sm text-orange-700">{userProfile.strongSubjects?.join(", ") || "Not specified"}</p>
              </div>
            </div>
            {userProfile.careerGoals && (
              <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-2">Career Goals</h4>
                <p className="text-sm text-gray-700">{userProfile.careerGoals}</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Profile Completion Popup */}
      {showProfilePopup && (
        <ProfileCompletionPopup
          user={user}
          onComplete={handleProfileComplete}
          onClose={() => setShowProfilePopup(false)}
        />
      )}
    </div>
  )
}

export default StudentDashboard