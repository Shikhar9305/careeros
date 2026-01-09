// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const RoadmapForm = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     career: '',
//     specialization: '',
//     educationLevel: '',
//     skillLevel: '',
//     timeAvailability: '',
//     learningStyle: '',
//     goal: ''
//   });

//   const careerOptions = [
//     'Software Development',
//     'Data Science',
//     'Web Development',
//     'Mobile Development',
//     'Artificial Intelligence',
//     'Cybersecurity',
//     'Cloud Computing',
//     'DevOps',
//     'UI/UX Design',
//     'Product Management',
//     'Digital Marketing',
//     'Business Analysis',
//     'Project Management',
//     'Content Writing',
//     'Video Editing',
//     'Graphic Design',
//     'Finance',
//     'Healthcare',
//     'Teaching',
//     'Other'
//   ];

//   const educationLevels = [
//     'High School',
//     '12th Grade',
//     'Diploma',
//     'Bachelor\'s Degree',
//     'Master\'s Degree',
//     'PhD',
//     'Self-Taught'
//   ];

//   const skillLevels = ['Beginner', 'Intermediate', 'Advanced'];

//   const timeAvailabilityOptions = [
//     '5-10 hours/week',
//     '10-15 hours/week',
//     '15-20 hours/week',
//     '20-30 hours/week',
//     '30+ hours/week'
//   ];

//   const learningStyles = [
//     'Visual (Videos, Diagrams)',
//     'Reading (Articles, Books)',
//     'Hands-on (Projects, Practice)',
//     'Interactive (Live Classes, Mentorship)',
//     'Mixed (All of the above)'
//   ];

//   const careerGoals = [
//     'Get a Job',
//     'Internship',
//     'Freelancing',
//     'Start a Startup',
//     'Career Switch',
//     'Skill Enhancement'
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!formData.career || !formData.educationLevel || !formData.skillLevel ||
//         !formData.timeAvailability || !formData.learningStyle || !formData.goal) {
//       alert('Please fill in all required fields');
//       return;
//     }

//     navigate('/career-roadmap', { state: { formData } });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
//       <div className="max-w-3xl mx-auto">
//         <div className="text-center mb-8">
//           <button
//     type="button"
//     onClick={() => navigate("/student-dashboard")}
//     className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6"
//   >
//     ← Back to Dashboard
//   </button>
//           <h1 className="text-4xl font-bold text-gray-900 mb-3">
//             Career Roadmap Generator
//           </h1>
//           <p className="text-lg text-gray-600">
//             Answer a few questions to get your personalized career roadmap
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Career Field <span className="text-red-500">*</span>
//             </label>
//             <select
//               name="career"
//               value={formData.career}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//               required
//             >
//               <option value="">Select a career field</option>
//               {careerOptions.map((career) => (
//                 <option key={career} value={career}>
//                   {career}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Specialization (Optional)
//             </label>
//             <input
//               type="text"
//               name="specialization"
//               value={formData.specialization}
//               onChange={handleChange}
//               placeholder="e.g., Machine Learning, Frontend, iOS, etc."
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Education Level <span className="text-red-500">*</span>
//             </label>
//             <select
//               name="educationLevel"
//               value={formData.educationLevel}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//               required
//             >
//               <option value="">Select your education level</option>
//               {educationLevels.map((level) => (
//                 <option key={level} value={level}>
//                   {level}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Current Skill Level <span className="text-red-500">*</span>
//             </label>
//             <select
//               name="skillLevel"
//               value={formData.skillLevel}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//               required
//             >
//               <option value="">Select your skill level</option>
//               {skillLevels.map((level) => (
//                 <option key={level} value={level}>
//                   {level}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Time Availability per Week <span className="text-red-500">*</span>
//             </label>
//             <select
//               name="timeAvailability"
//               value={formData.timeAvailability}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//               required
//             >
//               <option value="">Select time availability</option>
//               {timeAvailabilityOptions.map((time) => (
//                 <option key={time} value={time}>
//                   {time}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Preferred Learning Style <span className="text-red-500">*</span>
//             </label>
//             <select
//               name="learningStyle"
//               value={formData.learningStyle}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//               required
//             >
//               <option value="">Select your learning style</option>
//               {learningStyles.map((style) => (
//                 <option key={style} value={style}>
//                   {style}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Career Goal <span className="text-red-500">*</span>
//             </label>
//             <select
//               name="goal"
//               value={formData.goal}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//               required
//             >
//               <option value="">Select your career goal</option>
//               {careerGoals.map((goal) => (
//                 <option key={goal} value={goal}>
//                   {goal}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="pt-4">
//             <button
//               type="submit"
//               className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
//             >
//               Generate Career Roadmap
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RoadmapForm;




"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

const RoadmapForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    career: "",
    specialization: "",
    educationLevel: "",
    skillLevel: "",
    timeAvailability: "",
    learningStyle: "",
    goal: "",
  })

  const [currentStep, setCurrentStep] = useState(0)

  const careerOptions = [
    "Software Development",
    "Data Science",
    "Web Development",
    "Mobile Development",
    "Artificial Intelligence",
    "Cybersecurity",
    "Cloud Computing",
    "DevOps",
    "UI/UX Design",
    "Product Management",
    "Digital Marketing",
    "Business Analysis",
    "Project Management",
    "Content Writing",
    "Video Editing",
    "Graphic Design",
    "Finance",
    "Healthcare",
    "Teaching",
    "Other",
  ]

  const educationLevels = [
    "High School",
    "12th Grade",
    "Diploma",
    "Bachelor's Degree",
    "Master's Degree",
    "PhD",
    "Self-Taught",
  ]

  const skillLevels = ["Beginner", "Intermediate", "Advanced"]

  const timeAvailabilityOptions = [
    "5-10 hours/week",
    "10-15 hours/week",
    "15-20 hours/week",
    "20-30 hours/week",
    "30+ hours/week",
  ]

  const learningStyles = [
    "Visual (Videos, Diagrams)",
    "Reading (Articles, Books)",
    "Hands-on (Projects, Practice)",
    "Interactive (Live Classes, Mentorship)",
    "Mixed (All of the above)",
  ]

  const careerGoals = [
    "Get a Job",
    "Internship",
    "Freelancing",
    "Start a Startup",
    "Career Switch",
    "Skill Enhancement",
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (
      !formData.career ||
      !formData.educationLevel ||
      !formData.skillLevel ||
      !formData.timeAvailability ||
      !formData.learningStyle ||
      !formData.goal
    ) {
      alert("Please fill in all required fields")
      return
    }

    navigate("/career-roadmap", { state: { formData } })
  }

  const formSections = [
    {
      title: "Career & Specialization",
      icon: "🎯",
      description: "Choose your target career path",
      fields: [
        {
          name: "career",
          label: "Career Field",
          type: "select",
          required: true,
          options: careerOptions,
        },
        {
          name: "specialization",
          label: "Specialization (Optional)",
          type: "input",
          placeholder: "e.g., Machine Learning, Frontend, iOS",
        },
      ],
    },
    {
      title: "Your Background",
      icon: "📚",
      description: "Help us understand your current level",
      fields: [
        {
          name: "educationLevel",
          label: "Education Level",
          type: "select",
          required: true,
          options: educationLevels,
        },
        {
          name: "skillLevel",
          label: "Current Skill Level",
          type: "select",
          required: true,
          options: skillLevels,
        },
      ],
    },
    {
      title: "Learning Preferences",
      icon: "⏰",
      description: "Customize your learning plan",
      fields: [
        {
          name: "timeAvailability",
          label: "Time Availability per Week",
          type: "select",
          required: true,
          options: timeAvailabilityOptions,
        },
        {
          name: "learningStyle",
          label: "Preferred Learning Style",
          type: "select",
          required: true,
          options: learningStyles,
        },
      ],
    },
    {
      title: "Your Goal",
      icon: "🚀",
      description: "What do you want to achieve?",
      fields: [
        {
          name: "goal",
          label: "Career Goal",
          type: "select",
          required: true,
          options: careerGoals,
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/student-dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors py-2 px-3 rounded-lg hover:bg-blue-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">
              Step <span className="text-blue-600">{currentStep + 1}</span> of {formSections.length}
            </span>
          </div>
        </div>

        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / formSections.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Career Roadmap Generator</h1>
          <p className="text-lg text-gray-600">
            Answer a few questions to get your personalized career roadmap tailored to your goals
          </p>
        </div>

        {/* Form with Steps */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {formSections.map((section, index) => (
            <div key={index} className={`transition-all duration-300 ${index === currentStep ? "block" : "hidden"}`}>
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                {/* Section Header */}
                <div className="mb-8 pb-6 border-b border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{section.icon}</div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">{section.title}</h2>
                      <p className="text-gray-600">{section.description}</p>
                    </div>
                  </div>
                </div>

                {/* Section Fields */}
                <div className="space-y-6">
                  {section.fields.map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>

                      {field.type === "select" ? (
                        <select
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none bg-white cursor-pointer font-medium text-gray-700"
                          required={field.required}
                        >
                          <option value="">Select {field.label.toLowerCase()}</option>
                          {field.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium text-gray-700"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="mt-10 flex justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    className={`px-8 py-3 font-semibold rounded-lg transition-all ${
                      currentStep === 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                    disabled={currentStep === 0}
                  >
                    Previous
                  </button>

                  {currentStep === formSections.length - 1 ? (
                    <button
                      type="submit"
                      className="px-12 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      Generate Roadmap
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(Math.min(formSections.length - 1, currentStep + 1))}
                      className="px-12 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </form>

        <div className="mt-12 flex justify-center gap-3">
          {formSections.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentStep ? "bg-blue-600 w-8" : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default RoadmapForm
