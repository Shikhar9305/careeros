
"use client"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useState, useCallback } from "react" // Added useCallback
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, Users, UserCheck, BookOpen, Target, TrendingUp } from "lucide-react"
import { AssistantOverlay } from "@/components/assistant"
import ProfileCompletionPopup from "./ProfileCompletionPopup"
import CounsellorProfilePopup from "./CounsellorProfilePopup"

export default function LandingPage() {
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOTP] = useState("")
  const [tempUserId, setTempUserId] = useState("")
  const [tempEmail, setTempEmail] = useState("")
  const [user, setUser] = useState(null)
  const [verifying, setVerifying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showProfilePopup, setShowProfilePopup] = useState(false)
  const [showCounsellorPopup, setShowCounsellorPopup] = useState(false)

  const handleVoiceAction = useCallback(({ intent, result }) => {
    console.log("[v0] Voice Action in Landing:", intent, result)

    if (intent?.intent === "SIGNUP_START" || intent?.workflow === "SIGNUP") {
      setIsSignUp(true)
    } else if (intent?.intent === "LOGIN_START" || intent?.workflow === "SIGNIN") {
      setIsSignUp(false)
    }

    if (intent?.role) {
      console.log("[v0] Setting role from voice intent:", intent.role)
      setSelectedRole(intent.role.toLowerCase())
    }
  }, [])

  const handleRoleSelection = async (role) => {
    if (!name || !email || !password || !role) {
      alert("Please fill all fields!")
      return
    }

    try {
      setIsLoading(true) // Added loading state
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/signup`, {
        name,
        email,
        password,
        role,
      })

      alert("OTP sent to your email!")
      setTempUserId(res.data.userId)
      setTempEmail(email)
      setShowOTP(true)
    } catch (err) {
      console.error("[v0] Signup error:", err)
      alert(err.response?.data?.error || "Error creating user")
    } finally {
      setIsLoading(false) // Clear loading state
    }
  }

  const handleVerifyOTP = async () => {
    if (verifying) return
    setVerifying(true)

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/verify-otp`, {
        userId: tempUserId,
        otp: otp.trim(),
      })

      const verifiedUser = res.data.user
      setUser(verifiedUser)
      localStorage.setItem("user", JSON.stringify(verifiedUser))

      if (verifiedUser.role === "student") {
        setShowProfilePopup(true)
      } else if (verifiedUser.role === "counselor") {
        setShowCounsellorPopup(true)
      } else {
        navigate("/parent-dashboard", { state: { user: verifiedUser } })
      }
    } catch (err) {
      alert(err.response?.data?.error || "Invalid or expired OTP")
    } finally {
      setVerifying(false)
    }
  }

  const handleSignIn = async () => {
    if (!email || !password) {
      alert("Please enter email and password")
      return
    }

    try {
      setIsLoading(true) // Added loading state
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/signin`, {
        email,
        password,
      })

      const loggedInUser = res.data.user
      setUser(loggedInUser)
      localStorage.setItem("user", JSON.stringify(loggedInUser))

      if (loggedInUser.role === "student") {
        try {
          await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile/${loggedInUser._id}`)
          navigate("/student-dashboard", { state: { user: loggedInUser } })
        } catch {
          setShowProfilePopup(true)
        }
      } else if (loggedInUser.role === "counselor") {
        try {
          await axios.get(`${import.meta.env.VITE_API_URL}/api/users/counsellor-profile/${loggedInUser._id}`)
          navigate("/counselor-dashboard", { state: { user: loggedInUser } })
        } catch {
          setShowCounsellorPopup(true)
        }
      } else navigate("/parent-dashboard", { state: { user: loggedInUser } })
    } catch (err) {
      console.error("[v0] Signin error:", err)
      alert(err.response?.data?.error || "Signin failed")
    } finally {
      setIsLoading(false) // Clear loading state
    }
  }

  return (
    <div className="min-h-screen bg-background" data-voice-page="landing" data-context="landing">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">CareerOS</h1>
          </div>

          <Button
            variant="outline"
            data-action="toggle-auth-mode"
            data-voice-action="toggle-auth-mode"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-balance">
              Your Path to a <span className="text-primary">Successful Career</span>
            </h2>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Connect students, parents, and counselors on one comprehensive platform. Get personalized career guidance,
              track progress, and make informed decisions about your future.
            </p>

            {/* Features */}
            <div className="grid gap-4 mt-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Personalized Career Paths</h3>
                  <p className="text-sm text-muted-foreground">
                    Tailored recommendations based on your interests and goals
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Progress Tracking</h3>
                  <p className="text-sm text-muted-foreground">Monitor your journey and celebrate milestones</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Expert Guidance</h3>
                  <p className="text-sm text-muted-foreground">Connect with professional counselors and mentors</p>
                </div>
              </div>
            </div>
          </div>

          {!showOTP && (
            <Card className="w-full max-w-md mx-auto" data-form-state={isSignUp ? "signup" : "signin"}>
              <CardHeader className="text-center">
                <CardTitle>{isSignUp ? "Create Your Account" : "Welcome Back"}</CardTitle>
                <CardDescription>
                  {isSignUp ? "Join thousands of students on their career journey" : "Sign in to continue your journey"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      data-action="name"
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      aria-label="Enter your full name"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    data-action="email"
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Enter your email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    data-action="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-label="Enter your password"
                  />
                </div>

                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="role">I am a...</Label>
                    <Select
                      value={selectedRole}
                      onValueChange={(v) => {
                        console.log("[v0] Role selected:", v)
                        setSelectedRole(v)
                      }}
                    >
                      <SelectTrigger id="role" data-action="role" aria-label="Select your role">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student" data-action="role-student">
                          Student
                        </SelectItem>
                        <SelectItem value="parent" data-action="role-parent">
                          Parent
                        </SelectItem>
                        <SelectItem value="counselor" data-action="role-counselor">
                          Counselor
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button
                  className="w-full"
                  data-action="submit-auth"
                  data-voice-action="submit-auth" // Added consistent voice action
                  onClick={() => (isSignUp ? handleRoleSelection(selectedRole) : handleSignIn())}
                  disabled={(isSignUp && !selectedRole) || isLoading}
                  aria-label={isSignUp ? "Create your account" : "Sign in to your account"}
                >
                  {isLoading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                  <button
                    data-action="toggle-signup-link"
                    data-voice-action="toggle-auth-mode" // Added voice action
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-primary hover:underline font-medium"
                  >
                    {isSignUp ? "Sign in" : "Sign up"}
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {showOTP && (
            <Card className="w-full max-w-md mx-auto">
              <CardHeader className="text-center">
                <CardTitle>Verify Your Email</CardTitle>
                <CardDescription>Enter the 6-digit OTP sent to {tempEmail}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    data-action="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                    aria-label="Enter the OTP sent to your email"
                  />
                </div>
                <Button className="w-full" data-action="submit-otp" onClick={handleVerifyOTP} disabled={verifying}>
                  {verifying ? "Verifying..." : "Verify OTP"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <section className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Choose Your Path</h3>
            <p className="text-muted-foreground text-lg">Different roles, tailored experiences</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              data-action="select-student-role"
              onClick={() => {
                setSelectedRole("student")
                setIsSignUp(true)
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              tabIndex={0}
              role="button"
            >
              <CardHeader className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Students</CardTitle>
                <CardDescription>Discover your potential and plan your future</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Personalized career assessments</li>
                  <li>• Goal setting and tracking</li>
                  <li>• Course recommendations</li>
                  <li>• Progress monitoring</li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              data-action="select-parent-role"
              onClick={() => {
                setSelectedRole("parent")
                setIsSignUp(true)
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              tabIndex={0}
              role="button"
            >
              <CardHeader className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Parents</CardTitle>
                <CardDescription>Support your child's career journey</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Track your child's progress</li>
                  <li>• Access guidance resources</li>
                  <li>• Connect with counselors</li>
                  <li>• Stay informed on opportunities</li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              data-action="select-counselor-role"
              onClick={() => {
                setSelectedRole("counselor")
                setIsSignUp(true)
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              tabIndex={0}
              role="button"
            >
              <CardHeader className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <UserCheck className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Counselors</CardTitle>
                <CardDescription>Guide students to success</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Manage student portfolios</li>
                  <li>• Track student progress</li>
                  <li>• Schedule appointments</li>
                  <li>• Generate insights and reports</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card/50 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-semibold text-primary">Career Advisor</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Career Advisor. Empowering futures, one student at a time.
            </p>
          </div>
        </div>
      </footer>
      {/* Profile Completion Popups */}
      {showProfilePopup && user && (
        <ProfileCompletionPopup
          user={user}
          onComplete={(profile) => {
            setShowProfilePopup(false)
            navigate("/student-dashboard", { state: { user } })
          }}
          onClose={() => setShowProfilePopup(false)}
        />
      )}

      {showCounsellorPopup && user && (
        <CounsellorProfilePopup
          user={user}
          onComplete={(profile) => {
            setShowCounsellorPopup(false)
            navigate("/counselor-dashboard", { state: { user } })
          }}
          onClose={() => setShowCounsellorPopup(false)}
        />
      )}

      {/* Voice Assistant Overlay */}
      <AssistantOverlay position="bottom-right" defaultExpanded={false} onAction={handleVoiceAction} />
    </div>
  )
}







