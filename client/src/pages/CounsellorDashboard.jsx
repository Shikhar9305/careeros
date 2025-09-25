"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import CounsellorProfilePopup from "./CounsellorProfilePopup"

const CounsellorDashboard = ({ onLogout }) => {
  const location = useLocation()
  const navigate = useNavigate()

  // Load user from location.state or localStorage
  const [user, setUser] = useState(() => {
    return location.state?.user || JSON.parse(localStorage.getItem("user")) || null
  })

  const [showProfilePopup, setShowProfilePopup] = useState(false)
  const [profileCompleted, setProfileCompleted] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "student",
      senderName: "Rahul Sharma",
      subject: "Career guidance needed",
      message: "Hi, I am confused about choosing between engineering and medicine. Can you help me?",
      timestamp: "2 hours ago",
      unread: true,
    },
    {
      id: 2,
      from: "parent",
      senderName: "Mrs. Priya Patel",
      subject: "My daughter's career path",
      message: "My daughter is interested in arts but I want her to pursue science. Need your advice.",
      timestamp: "5 hours ago",
      unread: true,
    },
    {
      id: 3,
      from: "counsellor",
      senderName: "Dr. Amit Kumar",
      subject: "Collaboration opportunity",
      message: "Would you be interested in collaborating on a career guidance workshop?",
      timestamp: "1 day ago",
      unread: false,
    },
  ])

  console.log("CounsellorDashboard rendered. User state:", user)

  useEffect(() => {
    console.log("useEffect triggered. Current user:", user)

    if (!user) {
      console.log("No user found. Skipping profile fetch.")
      return
    }
    if (!user._id) {
      console.log("User object has no _id:", user)
      return
    }
    if (user.role !== "counselor") {
      console.log("User role is not counselor. Role:", user.role)
      return
    }

    const checkProfileCompletion = async () => {
      try {
        console.log("Fetching counsellor profile for userId:", user._id)

        const response = await fetch(`http://localhost:5002/api/users/counsellor-profile/${user._id}`)
        console.log("Fetch response status:", response.status)

        if (!response.ok) {
          console.warn("No profile found, showing popup.")
          setShowProfilePopup(true)
          return
        }

        const profile = await response.json()
        console.log("Fetched counsellor profile data from backend:", profile)

        if (profile && profile.profileCompleted) {
          console.log("Profile marked completed in DB.")
          setUserProfile(profile)
          setProfileCompleted(true)
        } else {
          console.warn("Profile exists but profileCompleted=false.")
          setShowProfilePopup(true)
        }
      } catch (error) {
        console.error("Error checking counsellor profile:", error)
        setShowProfilePopup(true)
      }
    }

    checkProfileCompletion()
  }, [user])

  const handleProfileComplete = (profileData) => {
    console.log("Profile completed in popup. Saving to state:", profileData)
    setUserProfile(profileData)
    setProfileCompleted(true)
    setShowProfilePopup(false)

    // Update localStorage so state persists after refresh
    const updatedUser = { ...user, profileCompleted: true }
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const dashboardFeatures = [
    {
      title: "Student Consultations",
      description: "Manage your upcoming and past consultation sessions",
      icon: "👥",
      count: "12 Active",
      gradient: "from-blue-500 to-blue-600",
      hoverGradient: "from-blue-600 to-blue-700",
    },
    {
      title: "Career Assessments",
      description: "Review and provide feedback on student assessments",
      icon: "📊",
      count: "8 Pending",
      gradient: "from-green-500 to-green-600",
      hoverGradient: "from-green-600 to-green-700",
    },
    {
      title: "Resource Library",
      description: "Access and share career guidance resources",
      icon: "📚",
      count: "45 Resources",
      gradient: "from-purple-500 to-purple-600",
      hoverGradient: "from-purple-600 to-purple-700",
    },
    {
      title: "Analytics & Reports",
      description: "Track your counseling impact and student progress",
      icon: "📈",
      count: "View Reports",
      gradient: "from-orange-500 to-orange-600",
      hoverGradient: "from-orange-600 to-orange-700",
    },
  ]

  const unreadCount = messages.filter((msg) => msg.unread).length

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">127</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👨‍🎓</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📅</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold text-gray-900">94%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="text-2xl font-bold text-gray-900">4.8</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 ${
                    !profileCompleted ? "opacity-75" : ""
                  }`}
                  onClick={() => {
                    if (!profileCompleted) {
                      alert("Please complete your profile first to access this feature!")
                      setShowProfilePopup(true)
                      return
                    }
                    console.log(`Clicked ${feature.title}`)
                  }}
                >
                  <div className="p-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 mx-auto transform transition-transform duration-200 hover:scale-110`}
                    >
                      <span className="text-3xl">{feature.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{feature.title}</h3>
                    <p className="text-gray-600 text-sm text-center leading-relaxed mb-4">{feature.description}</p>
                    <div className="text-center">
                      <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {feature.count}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "messages":
        return (
          <div className="bg-white rounded-2xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Messages</h3>
              <p className="text-gray-600">Communicate with students, parents, and other counsellors</p>
            </div>
            <div className="divide-y divide-gray-200">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                    message.unread ? "bg-blue-50 border-l-4 border-blue-500" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                            message.from === "student"
                              ? "bg-blue-500"
                              : message.from === "parent"
                                ? "bg-green-500"
                                : "bg-purple-500"
                          }`}
                        >
                          {message.from === "student" ? "👨‍🎓" : message.from === "parent" ? "👨‍👩‍👧‍👦" : "👨‍🏫"}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{message.senderName}</h4>
                          <p className="text-sm text-gray-500 capitalize">{message.from}</p>
                        </div>
                        {message.unread && <span className="w-3 h-3 bg-blue-500 rounded-full"></span>}
                      </div>
                      <h5 className="font-medium text-gray-900 mb-1">{message.subject}</h5>
                      <p className="text-gray-600 text-sm mb-2">{message.message}</p>
                      <p className="text-xs text-gray-500">{message.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-gray-200">
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                View All Messages
              </button>
            </div>
          </div>
        )

      case "profile":
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h3>
            {profileCompleted && userProfile ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h4 className="font-bold text-blue-900 mb-3">Personal Information</h4>
                    <p className="text-sm text-blue-700 mb-1">
                      <strong>Name:</strong> {userProfile.fullName}
                    </p>
                    <p className="text-sm text-blue-700 mb-1">
                      <strong>Location:</strong> {userProfile.location}
                    </p>
                    <p className="text-sm text-blue-700">
                      <strong>Phone:</strong> {userProfile.phoneNumber}
                    </p>
                  </div>
                  <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                    <h4 className="font-bold text-green-900 mb-3">Professional Details</h4>
                    <p className="text-sm text-green-700 mb-1">
                      <strong>Specialization:</strong> {userProfile.specialization}
                    </p>
                    <p className="text-sm text-green-700 mb-1">
                      <strong>Experience:</strong> {userProfile.experience} years
                    </p>
                    <p className="text-sm text-green-700">
                      <strong>Fee:</strong> ₹{userProfile.consultationFee}/session
                    </p>
                  </div>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                  <h4 className="font-bold text-purple-900 mb-3">Expertise Areas</h4>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.expertise?.map((area, index) => (
                      <span key={index} className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                  <h4 className="font-bold text-orange-900 mb-3">Qualifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.qualifications?.map((qual, index) => (
                      <span key={index} className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm">
                        {qual}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-3">Professional Bio</h4>
                  <p className="text-sm text-gray-700">{userProfile.bio}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Complete your profile to start helping students</p>
                <button
                  onClick={() => setShowProfilePopup(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  Complete Profile
                </button>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">👨‍🏫</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Counsellor Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab("messages")}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-xl">💬</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
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
                Profile completed! You're ready to help students achieve their career goals.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4 mt-4 rounded-r-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-yellow-400 text-xl">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 font-medium">
                Complete your profile to start accepting student consultations and unlock all features.
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

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", name: "Overview", icon: "📊" },
              { id: "messages", name: "Messages", icon: "💬", badge: unreadCount },
              { id: "profile", name: "Profile", icon: "👤" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.name}
                {tab.badge > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-1">{tab.badge}</span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{renderTabContent()}</main>

      {/* Profile Completion Popup */}
      {showProfilePopup && (
        <CounsellorProfilePopup
          user={user}
          onComplete={handleProfileComplete}
          onClose={() => setShowProfilePopup(false)}
        />
      )}
    </div>
  )
}

export default CounsellorDashboard
