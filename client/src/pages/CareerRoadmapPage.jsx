"use client"

import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge, MarkerType } from "reactflow"
import "reactflow/dist/style.css"

const CareerRoadmapPage = () => {
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    grade: "",
    interests: [],
    targetCareer: "",
    preferredSubjects: [],
  })

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges])

  const interestOptions = [
    "Technology",
    "Arts",
    "Science",
    "Business",
    "Sports",
    "Music",
    "Literature",
    "Mathematics",
    "Medicine",
    "Engineering",
  ]

  const careerOptions = [
    "Engineering",
    "Arts",
    "Business",
    "Medicine",
    "Science Research",
    "Technology",
    "Creative Arts",
    "Sports",
    "Education",
    "Law",
  ]

  const subjectOptions = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "History",
    "Geography",
    "Computer Science",
    "Economics",
    "Psychology",
  ]

  const handleInterestChange = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleSubjectChange = (subject) => {
    setFormData((prev) => ({
      ...prev,
      preferredSubjects: prev.preferredSubjects.includes(subject)
        ? prev.preferredSubjects.filter((s) => s !== subject)
        : [...prev.preferredSubjects, subject],
    }))
  }

  const generateRoadmapWithGemini = async (inputData) => {
    try {
      // Mock Gemini API call - replace with actual API integration
      const prompt = `Generate a detailed career roadmap for a student with the following profile:
      Grade: ${inputData.grade}
      Interests: ${inputData.interests.join(", ")}
      Target Career: ${inputData.targetCareer}
      Preferred Subjects: ${inputData.preferredSubjects.join(", ")}
      
      Please provide a structured roadmap with steps, courses, skills, and timeline in JSON format.`

      // Simulated API response - replace with actual Gemini API call
      const mockResponse = {
        roadmap: [
          {
            id: "1",
            title: "Foundation Phase",
            description: "Build strong academic foundation",
            timeline: "Current - Grade 12",
            courses: ["Advanced Mathematics", "Physics", "Chemistry"],
            skills: ["Problem Solving", "Analytical Thinking"],
            type: "foundation",
          },
          {
            id: "2",
            title: "Higher Education",
            description: "Pursue relevant degree program",
            timeline: "After Grade 12",
            courses: ["Bachelor's in Engineering", "Computer Science Fundamentals"],
            skills: ["Programming", "Technical Design"],
            type: "education",
          },
          {
            id: "3",
            title: "Skill Development",
            description: "Develop industry-specific skills",
            timeline: "During College",
            courses: ["Web Development", "Data Structures", "Software Engineering"],
            skills: ["Coding", "Project Management", "Team Collaboration"],
            type: "skills",
          },
          {
            id: "4",
            title: "Professional Experience",
            description: "Gain practical work experience",
            timeline: "Final Year & Beyond",
            courses: ["Internships", "Industry Projects", "Certifications"],
            skills: ["Professional Communication", "Industry Knowledge"],
            type: "experience",
          },
          {
            id: "5",
            title: "Career Launch",
            description: "Start professional career",
            timeline: "Post Graduation",
            courses: ["Job Search", "Interview Preparation", "Networking"],
            skills: ["Leadership", "Specialization", "Continuous Learning"],
            type: "career",
          },
        ],
      }

      return mockResponse.roadmap
    } catch (error) {
      console.error("Error generating roadmap:", error)
      return []
    }
  }

  const createFlowNodes = (roadmapData) => {
    const nodeTypes = {
      foundation: { color: "#3B82F6", bgColor: "#EFF6FF" },
      education: { color: "#10B981", bgColor: "#ECFDF5" },
      skills: { color: "#F59E0B", bgColor: "#FFFBEB" },
      experience: { color: "#8B5CF6", bgColor: "#F5F3FF" },
      career: { color: "#EF4444", bgColor: "#FEF2F2" },
    }

    return roadmapData.map((step, index) => ({
      id: step.id,
      type: "default",
      position: { x: 100 + (index % 2) * 400, y: 100 + Math.floor(index / 2) * 300 },
      data: {
        label: (
          <div
            className="p-4 rounded-lg border-2 min-w-[300px]"
            style={{
              borderColor: nodeTypes[step.type]?.color || "#6B7280",
              backgroundColor: nodeTypes[step.type]?.bgColor || "#F9FAFB",
            }}
          >
            <h3 className="font-bold text-lg mb-2" style={{ color: nodeTypes[step.type]?.color }}>
              {step.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">{step.description}</p>
            <div className="text-xs text-gray-500 mb-2">
              <strong>Timeline:</strong> {step.timeline}
            </div>
            <div className="text-xs mb-2">
              <strong>Courses:</strong>
              <ul className="list-disc list-inside mt-1">
                {step.courses.map((course, idx) => (
                  <li key={idx}>{course}</li>
                ))}
              </ul>
            </div>
            <div className="text-xs">
              <strong>Skills:</strong> {step.skills.join(", ")}
            </div>
          </div>
        ),
      },
      style: {
        background: "transparent",
        border: "none",
      },
    }))
  }

  const createFlowEdges = (roadmapData) => {
    return roadmapData.slice(0, -1).map((_, index) => ({
      id: `e${index + 1}-${index + 2}`,
      source: (index + 1).toString(),
      target: (index + 2).toString(),
      type: "smoothstep",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#6B7280",
      },
      style: {
        stroke: "#6B7280",
        strokeWidth: 2,
      },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const roadmapData = await generateRoadmapWithGemini(formData)
      const flowNodes = createFlowNodes(roadmapData)
      const flowEdges = createFlowEdges(roadmapData)

      setNodes(flowNodes)
      setEdges(flowEdges)
      setShowForm(false)
    } catch (error) {
      console.error("Error creating roadmap:", error)
      alert("Error generating roadmap. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <button onClick={() => navigate("/")} className="text-blue-600 hover:text-blue-800">
                  ← Back to Dashboard
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Career Roadmap Generator</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Form */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Let's Create Your Personalized Career Roadmap
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Tell us about yourself and we'll generate a detailed career path tailored just for you.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-lg font-medium mb-4">What grade are you currently in?</label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData((prev) => ({ ...prev, grade: e.target.value }))}
                  className="w-full p-4 border-2 rounded-lg text-lg"
                  required
                >
                  <option value="">Select your grade</option>
                  <option value="9th">9th Grade</option>
                  <option value="10th">10th Grade</option>
                  <option value="11th">11th Grade</option>
                  <option value="12th">12th Grade</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium mb-4">What are your interests? (Select multiple)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {interestOptions.map((interest) => (
                    <label
                      key={interest}
                      className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(interest)}
                        onChange={() => handleInterestChange(interest)}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium mb-4">What's your target career field?</label>
                <select
                  value={formData.targetCareer}
                  onChange={(e) => setFormData((prev) => ({ ...prev, targetCareer: e.target.value }))}
                  className="w-full p-4 border-2 rounded-lg text-lg"
                  required
                >
                  <option value="">Select target career</option>
                  {careerOptions.map((career) => (
                    <option key={career} value={career}>
                      {career}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium mb-4">
                  Which subjects do you excel in? (Select multiple)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {subjectOptions.map((subject) => (
                    <label
                      key={subject}
                      className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.preferredSubjects.includes(subject)}
                        onChange={() => handleSubjectChange(subject)}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-105"
                >
                  {loading ? "Generating Your Roadmap..." : "Generate Career Roadmap 🚀"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button onClick={() => navigate("/")} className="text-blue-600 hover:text-blue-800">
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Your Career Roadmap</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Generate New Roadmap
            </button>
          </div>
        </div>
      </header>

      {/* Roadmap Visualization */}
      <main className="h-[calc(100vh-4rem)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          className="bg-gray-50"
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </main>
    </div>
  )
}

export default CareerRoadmapPage