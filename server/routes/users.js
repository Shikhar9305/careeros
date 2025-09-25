import express from "express"
import User from "../models/user.js"
import StudentProfile from "../models/StudentProfile.js"
import CounsellorProfile from "../models/counsellor-profile.js"
import mongoose from "mongoose"

const router = express.Router()

// Create user (signup)
router.post("/signup", async (req, res) => {
  const { email, password, role } = req.body
  try {
    const newUser = new User({ email, password, role })
    await newUser.save()
    res.status(201).json({ message: "User created", user: newUser })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Signup failed" })
  }
})

// Complete student profile
router.post("/complete-profile", async (req, res) => {
  try {
    const { userId, ...profileData } = req.body

    const newProfile = new StudentProfile({
      userId,
      ...profileData,
    })

    await newProfile.save()
    res.status(201).json({ message: "Profile completed", profile: newProfile })
  } catch (error) {
    console.error("Profile completion error:", error)
    res.status(500).json({ error: "Failed to save profile" })
  }
})

// Complete counsellor profile
router.post("/complete-counsellor-profile", async (req, res) => {
  try {
    const { userId, ...profileData } = req.body

    const newProfile = new CounsellorProfile({
      userId,
      ...profileData,
    })

    await newProfile.save()
    res.status(201).json({ message: "Counsellor profile completed", profile: newProfile })
  } catch (error) {
    console.error("Counsellor profile completion error:", error)
    res.status(500).json({ error: "Failed to save counsellor profile" })
  }
})

// Get student profile by userId
router.get("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params

    const profile = await StudentProfile.findOne({ userId: new mongoose.Types.ObjectId(userId) })

    if (!profile) {
      console.log("No profile found for userId:", userId)
      return res.status(404).json({ message: "Profile not found" })
    }

    console.log("Fetched profile from DB:", profile)
    res.json(profile)
  } catch (error) {
    console.error("Error fetching profile:", error)
    res.status(500).json({ error: "Failed to fetch profile" })
  }
})

// Get counsellor profile by userId
router.get("/counsellor-profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params

    const profile = await CounsellorProfile.findOne({ userId: new mongoose.Types.ObjectId(userId) })

    if (!profile) {
      console.log("No counsellor profile found for userId:", userId)
      return res.status(404).json({ message: "Counsellor profile not found" })
    }

    console.log("Fetched counsellor profile from DB:", profile)
    res.json(profile)
  } catch (error) {
    console.error("Error fetching counsellor profile:", error)
    res.status(500).json({ error: "Failed to fetch counsellor profile" })
  }
})

// GET all counsellors
router.get("/counsellors/all", async (req, res) => {
  try {
    const counsellors = await CounsellorProfile.find({});
    res.json(counsellors);
  } catch (error) {
    console.error("Error fetching counsellors:", error);
    res.status(500).json({ error: "Failed to fetch counsellors" });
  }
});


export default router
