// API client for Career Advisor backend

const API_BASE_URL = import.meta.env.VITE_API_URL 

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    // Add Clerk user ID if available (in real app, this would come from Clerk)
    if (typeof window !== "undefined") {
      const clerkUserId = localStorage.getItem("clerk-user-id") // Mock for demo
      if (clerkUserId) {
        config.headers["x-clerk-user-id"] = clerkUserId
      }
    }

    try {
      console.log(`[v0] API Request: ${config.method || "GET"} ${url}`)

      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        console.error("[v0] API Error:", data)
        throw new Error(data.message || "API request failed")
      }

      console.log("[v0] API Response:", data)
      return data
    } catch (error) {
      console.error("[v0] API Request failed:", error)
      throw error
    }
  }

  // Health check
  async healthCheck() {
    return this.request("/api/health")
  }

  // User management
  async createUser(userData) {
    return this.request("/api/users", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async getUserProfile() {
    return this.request("/api/users/profile")
  }

  // Student profile management
  async createStudentProfile(profileData) {
    return this.request("/api/student/profile", {
      method: "POST",
      body: JSON.stringify(profileData),
    })
  }

  async getStudentProfile() {
    return this.request("/api/student/profile")
  }

  async getStudentProfileById(id) {
    return this.request(`/api/student/profile/${id}`)
  }

  // For counselors
  async getAllStudents() {
    return this.request("/api/students")
  }
}

// Create singleton instance
const apiClient = new ApiClient()

export default apiClient

export const {
  healthCheck,
  createUser,
  getUserProfile,
  createStudentProfile,
  getStudentProfile,
  getStudentProfileById,
  getAllStudents,
} = apiClient
