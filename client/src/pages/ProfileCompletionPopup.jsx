"use client"

import { useState } from "react"

const ProfileCompletionPopup = ({ user, onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [formData, setFormData] = useState({
    grade: "",
    stream: "",
    interests: [],
    strongSubjects: [],
    age: "",
    location: "",
    tenthPercent: "",
    twelfthPercent: "",
    budgetRange: "",
    studyMode: "",
    preferredStudyLocation: "",
    openToScholarshipOrLoan: "",
    competitiveExams: [],
    careerGoals: "",
    hobbies: [],
  })

  const steps = [
    { title: "Academic Information", subtitle: "Tell us about your current studies" },
    { title: "Personal Details", subtitle: "Basic information about you" },
    { title: "Performance & Study Preferences", subtitle: "Your academic performance and preferences" },
    { title: "Interests & Subjects", subtitle: "What excites you the most?" },
    { title: "Goals & Hobbies", subtitle: "Your aspirations and activities" },
  ]

  const gradeOptions = ["10th", "11th", "12th", "Graduate", "Post Graduate"]
  const streamOptions = ["Science", "Commerce", "Arts", "Engineering", "Medical", "Other"]
  const interestOptions = [
    "Technology",
    "Medicine",
    "Business",
    "Arts",
    "Sports",
    "Music",
    "Writing",
    "Teaching",
    "Research",
    "Social Work",
  ]
  const subjectOptions = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "History",
    "Geography",
    "Economics",
    "Computer Science",
    "Psychology",
  ]
  const hobbyOptions = [
    "Reading",
    "Sports",
    "Music",
    "Dancing",
    "Painting",
    "Coding",
    "Gaming",
    "Traveling",
    "Photography",
    "Cooking",
  ]

  const budgetRangeOptions = ["< 50k", "50k–1 lakh", "1–3 lakh", "3–7 lakh", "7–15 lakh", "15+ lakh"]
  const studyModeOptions = ["Offline", "Online-Hybrid", "Abroad", "No Preference"]
  const studyLocationOptions = ["Same City", "Same State", "Anywhere in India", "Abroad"]
  const competitiveExamsOptions = ["JEE", "NEET", "CUET", "CLAT", "NIFT", "UPSC", "None"]

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMultiSelect = (field, option) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(option) ? prev[field].filter((item) => item !== option) : [...prev[field], option],
    }))
  }

  const handleAutoDetectLocation = () => {
    setIsDetectingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            )
            const data = await response.json()
            const city = data.address?.city || data.address?.town || data.address?.village || ""
            const state = data.address?.state || ""
            const location = city && state ? `${city}, ${state}` : "Location detected"
            handleInputChange("location", location)
            setIsDetectingLocation(false)
          } catch (error) {
            console.error("Error fetching location:", error)
            handleInputChange("location", "Unable to detect location")
            setIsDetectingLocation(false)
          }
        },
        (error) => {
          console.error("Geolocation error:", error)
          alert("Unable to detect location. Please enable location access in your browser settings.")
          setIsDetectingLocation(false)
        },
      )
    } else {
      alert("Geolocation is not supported by your browser.")
      setIsDetectingLocation(false)
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      console.log("User in profile popup:", user)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/complete-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          ...formData,
          profileCompleted: true,
        }),
      })

      if (response.ok) {
        const profileData = await response.json()
        onComplete(profileData)
      } else {
        alert("Failed to save profile. Please try again.")
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      alert("Error saving profile. Please try again.")
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Academic Information
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Current Grade/Level *</label>
              <div className="grid grid-cols-2 gap-3">
                {gradeOptions.map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => handleInputChange("grade", grade)}
                    className={`p-3 text-sm rounded-xl border-2 transition-all ${
                      formData.grade === grade
                        ? "bg-blue-500 text-white border-blue-500 shadow-lg"
                        : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Stream *</label>
              <div className="grid grid-cols-2 gap-3">
                {streamOptions.map((stream) => (
                  <button
                    key={stream}
                    type="button"
                    onClick={() => handleInputChange("stream", stream)}
                    className={`p-3 text-sm rounded-xl border-2 transition-all ${
                      formData.stream === stream
                        ? "bg-green-500 text-white border-green-500 shadow-lg"
                        : "bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:bg-green-50"
                    }`}
                  >
                    {stream}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 1: // Personal Details
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Age *</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your age"
                min="13"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Location *</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="City, State (e.g., Mumbai, Maharashtra)"
                />
                <button
                  type="button"
                  onClick={handleAutoDetectLocation}
                  disabled={isDetectingLocation}
                  className="px-4 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-400 transition-all font-medium text-sm whitespace-nowrap"
                >
                  {isDetectingLocation ? "Detecting..." : "Auto-Detect"}
                </button>
              </div>
            </div>
          </div>
        )

      case 2: // Performance & Study Preferences
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">10th Grade Percentage *</label>
              <input
                type="number"
                value={formData.tenthPercent}
                onChange={(e) => handleInputChange("tenthPercent", e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your 10th percentage (0-100)"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                12th Grade Percentage (Optional if below class 12)
              </label>
              <input
                type="number"
                value={formData.twelfthPercent}
                onChange={(e) => handleInputChange("twelfthPercent", e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your 12th percentage (0-100)"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Budget Range *</label>
              <select
                value={formData.budgetRange}
                onChange={(e) => handleInputChange("budgetRange", e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select budget range</option>
                {budgetRangeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Preferred Study Mode *</label>
              <select
                value={formData.studyMode}
                onChange={(e) => handleInputChange("studyMode", e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select study mode</option>
                {studyModeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Preferred Study Location *</label>
              <select
                value={formData.preferredStudyLocation}
                onChange={(e) => handleInputChange("preferredStudyLocation", e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Select location preference</option>
                {studyLocationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Open to Scholarship or Loan? *</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleInputChange("openToScholarshipOrLoan", "Yes")}
                  className={`flex-1 p-3 text-sm rounded-xl border-2 transition-all ${
                    formData.openToScholarshipOrLoan === "Yes"
                      ? "bg-green-500 text-white border-green-500 shadow-lg"
                      : "bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:bg-green-50"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange("openToScholarshipOrLoan", "No")}
                  className={`flex-1 p-3 text-sm rounded-xl border-2 transition-all ${
                    formData.openToScholarshipOrLoan === "No"
                      ? "bg-red-500 text-white border-red-500 shadow-lg"
                      : "bg-white text-gray-700 border-gray-200 hover:border-red-300 hover:bg-red-50"
                  }`}
                >
                  No
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Competitive Exams (Select multiple)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {competitiveExamsOptions.map((exam) => (
                  <button
                    key={exam}
                    type="button"
                    onClick={() => handleMultiSelect("competitiveExams", exam)}
                    className={`p-3 text-sm rounded-xl border-2 transition-all ${
                      formData.competitiveExams.includes(exam)
                        ? "bg-indigo-500 text-white border-indigo-500 shadow-lg"
                        : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                    }`}
                  >
                    {exam}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 3: // Interests & Subjects
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                What are your interests? (Select multiple)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleMultiSelect("interests", interest)}
                    className={`p-3 text-sm rounded-xl border-2 transition-all ${
                      formData.interests.includes(interest)
                        ? "bg-purple-500 text-white border-purple-500 shadow-lg"
                        : "bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Which subjects are you strongest in? (Select multiple)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {subjectOptions.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => handleMultiSelect("strongSubjects", subject)}
                    className={`p-3 text-sm rounded-xl border-2 transition-all ${
                      formData.strongSubjects.includes(subject)
                        ? "bg-orange-500 text-white border-orange-500 shadow-lg"
                        : "bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 4: // Goals & Hobbies
        return (
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">What are your career goals?</label>
              <textarea
                value={formData.careerGoals}
                onChange={(e) => handleInputChange("careerGoals", e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Describe your career aspirations, dream job, or what you want to achieve..."
                rows="4"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                What are your hobbies? (Select multiple)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {hobbyOptions.map((hobby) => (
                  <button
                    key={hobby}
                    type="button"
                    onClick={() => handleMultiSelect("hobbies", hobby)}
                    className={`p-3 text-sm rounded-xl border-2 transition-all ${
                      formData.hobbies.includes(hobby)
                        ? "bg-pink-500 text-white border-pink-500 shadow-lg"
                        : "bg-white text-gray-700 border-gray-200 hover:border-pink-300 hover:bg-pink-50"
                    }`}
                  >
                    {hobby}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.grade && formData.stream
      case 1:
        return formData.age && formData.location
      case 2:
        return (
          formData.tenthPercent &&
          formData.budgetRange &&
          formData.studyMode &&
          formData.preferredStudyLocation &&
          formData.openToScholarshipOrLoan
        )
      case 3:
        return true // Optional fields
      case 4:
        return true // Optional fields
      default:
        return false
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
              <p className="text-gray-600">Help us personalize your career journey</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl font-light transition-colors"
            >
              ×
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      index <= currentStep ? "bg-blue-500 text-white shadow-lg" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-1 mx-2 rounded-full transition-all ${
                        index < currentStep ? "bg-blue-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">{steps[currentStep].title}</h3>
              <p className="text-sm text-gray-600">{steps[currentStep].subtitle}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">{renderStepContent()}</div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-200 bg-gray-50 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
          >
            Previous
          </button>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all font-medium"
            >
              Complete Profile
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              Next Step
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileCompletionPopup
