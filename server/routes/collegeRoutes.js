import express from "express"
import College from "../models/college.js"

const router = express.Router()

router.get("/:collegeId", async (req, res) => {
  try {
    const { collegeId } = req.params

    // Find college by ID
    const college = await College.findById(collegeId)

    if (!college) {
      return res.status(404).json({ error: "College not found" })
    }

    res.json(college)
  } catch (error) {
    console.error("Error fetching college details:", error)
    res.status(500).json({ error: "Failed to fetch college details" })
  }
})

router.get("/", async (req, res) => {
  try {
    const colleges = await College.find().select("name address.city address.state type affiliation placements tags")
    res.json(colleges)
  } catch (error) {
    console.error("Error fetching colleges:", error)
    res.status(500).json({ error: "Failed to fetch colleges" })
  }
})

export default router
