import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ProfilePictureUpload from "./ProfilePictureUpload"

const ProfilePage = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null)
  const [avatarImage, setAvatarImage] = useState(() => localStorage.getItem("userAvatar") || null)
  const [userProfile, setUserProfile] = useState(() => JSON.parse(localStorage.getItem("userProfile")) || null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(userProfile || {})

  useEffect(() => {
    if (!user) {
      navigate("/")
      return
    }
    // Fetch full profile from backend if available
    if (user._id) {
      fetch(`${import.meta.env.VITE_API_URL}/api/users/profile/${user._id}`)
        .then((res) => res.json())
        .then((data) => {
          setUserProfile(data)
          setFormData(data)
          localStorage.setItem("userProfile", JSON.stringify(data))
        })
        .catch((err) => console.log("Profile fetch not available:", err))
    }
  }, [user, navigate])

  const handleAvatarUpdate = (imageUrl) => {
    setAvatarImage(imageUrl)
    localStorage.setItem("userAvatar", imageUrl)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = () => {
    setUserProfile(formData)
    localStorage.setItem("userProfile", JSON.stringify(formData))
    setIsEditing(false)
  }

  const profileFields = [
    { label: "Name", key: "name", value: formData?.name || user?.email?.split("@")[0] || "Student" },
    { label: "Email", key: "email", value: user?.email || "Not provided" },
    { label: "Age", key: "age", value: formData?.age || "Not provided" },
    { label: "Grade", key: "grade", value: formData?.grade || "Not provided" },
    { label: "Stream", key: "stream", value: formData?.stream || "Not provided" },
    { label: "Location", key: "location", value: formData?.location || "Not provided" },
    {
      label: "Interests",
      key: "interests",
      value: Array.isArray(formData?.interests)
        ? formData.interests.join(", ")
        : formData?.interests || "Not provided",
    },
    {
      label: "Strong Subjects",
      key: "strongSubjects",
      value: Array.isArray(formData?.strongSubjects)
        ? formData.strongSubjects.join(", ")
        : formData?.strongSubjects || "Not provided",
    },
    { label: "Career Goals", key: "careerGoals", value: formData?.careerGoals || "Not provided" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            </div>
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Picture Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Picture</h2>
          <ProfilePictureUpload currentImage={avatarImage} onImageUpdate={handleAvatarUpdate} />
        </div>

        {/* Personal Information Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Personal Information</h2>

          <div className="space-y-6">
            {profileFields.map((field) => (
              <div key={field.key} className="border-b border-gray-200 pb-6 last:border-b-0">
                <label className="block text-sm font-semibold text-gray-700 mb-2">{field.label}</label>
                {isEditing ? (
                  <input
                    type="text"
                    name={field.key}
                    value={formData?.[field.key] || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                ) : (
                  <p className="text-gray-600 text-lg">{field.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-blue-50 rounded-2xl shadow-lg p-8 mt-8 border border-blue-200">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-blue-700 font-medium">Email</p>
              <p className="text-lg text-blue-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-blue-700 font-medium">Role</p>
              <p className="text-lg text-blue-900 capitalize">{user?.role || "Student"}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage