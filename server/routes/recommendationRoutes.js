
import express from "express"
import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import mongoose from "mongoose";  
import StudentProfile from "../models/StudentProfile.js"
import College from "../models/college.js"
import RecommendationEvent from "../models/RecommendationEvent.js"
import SavedItem from "../models/SavedItem.js";

import { isEligible } from "../utils/eligibilityGate.js"
import {
  cosineSimilarity,
  buildFeatureVector,
  calculateWeightedScore,
  generateReasons,
} from "../utils/recommendationHelpers.js"

const router = express.Router()

// Load ML weights from config (simulates trained model weights)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
let mlWeights

try {
  const weightsPath = join(__dirname, "../config/mlWeights.json")
  mlWeights = JSON.parse(readFileSync(weightsPath, "utf-8"))
  console.log("✅ ML Weights loaded:", mlWeights)
} catch (error) {
  console.warn("⚠️ Could not load mlWeights.json, using defaults")
  mlWeights = {
    similarity: 0.48,
    interestOverlap: 0.22,
    budgetFit: 0.14,
    locationMatch: 0.06,
    placementScore: 0.05,
    scholarshipMatch: 0.03,
    studyModeMatch: 0.02,
  }
}


router.get("/recommendations/:userId", async (req, res) => {
  try {
    // Step 0: Find student profile
    const student = await StudentProfile.findOne({ userId: req.params.userId })

    if (!student) {
      return res.status(404).json({ error: "Student profile not found" })
    }

    if (!student.embedding?.length) {
      return res.status(400).json({
        error: "Student profile incomplete - missing embedding. Please complete your profile.",
      })
    }

    const colleges = await College.find()

    // ═══════════════════════════════════════════════════════
    // STEP 1: HARD FILTERS (Eligibility Gate)
    // ═══════════════════════════════════════════════════════
   const eligibleColleges = colleges.filter((col) =>
   col.courses.some((course) => isEligible(student, course))
 )

    if (eligibleColleges.length === 0) {
      return res.json({
        recommended: [],
        message: "No colleges match your eligibility criteria. Consider updating your profile.",
      })
    }

    // ═══════════════════════════════════════════════════════
    // STEP 2-4: CANDIDATE SCORING + FEATURE ENGINEERING
    // ═══════════════════════════════════════════════════════
    const scoredColleges = eligibleColleges.map((college) => {
      // Calculate embedding similarity (candidate generation score)
      const embeddingSimilarity = college.embedding?.length ? cosineSimilarity(student.embedding, college.embedding) : 0

      // Build feature vector for this (student, college) pair
      const features = buildFeatureVector(student, college, embeddingSimilarity)

      // Calculate final weighted score using ML weights
      const finalScore = calculateWeightedScore(features, mlWeights)

      // Generate explainable reasons
      const reasons = generateReasons(features, student, college)

      return {
        college,
        features,
        finalScore,
        reasons,
        // Legacy compatibility: also include raw similarity score
        score: embeddingSimilarity,
      }
    })

    // ═══════════════════════════════════════════════════════
    // STEP 5: RANKING
    // ═══════════════════════════════════════════════════════
    scoredColleges.sort((a, b) => b.finalScore - a.finalScore)

    // Return top 10 recommendations with explanations
    const topRecommendations = scoredColleges.slice(0, 10).map((item, index) => ({
      college: item.college,
      score: item.finalScore,
      rank: index + 1,
      features: item.features,
      reasons: item.reasons,
      // Legacy compatibility
      legacyScore: item.score,
    }))

    res.json({
      recommended: topRecommendations,
      totalEligible: eligibleColleges.length,
      weightsUsed: mlWeights,
    })
  } catch (error) {
    console.error("Recommendation Error:", error)
    res.status(500).json({ error: "Server error generating recommendations" })
  }
})

/**
 * POST /api/recommendation-event
 *
 * Track user interactions for ML feedback loop
 * Actions: view, click, save, apply
 */
router.post("/recommendation-event", async (req, res) => {
  try {
    const { userId, collegeId, action, metadata } = req.body

    // Validate required fields
    if (!userId || !collegeId || !action) {
      return res.status(400).json({
        error: "Missing required fields: userId, collegeId, action",
      })
    }

    // Validate action type
    const validActions = ["view", "click", "save", "apply"]
    if (!validActions.includes(action)) {
      return res.status(400).json({
        error: `Invalid action. Must be one of: ${validActions.join(", ")}`,
      })
    }

    // Create event record
    const event = new RecommendationEvent({
      userId,
      collegeId,
      action,
      metadata: {
        score: metadata?.score,
        rank: metadata?.rank,
        sessionId: metadata?.sessionId || `session_${Date.now()}`,
      },
    })

    await event.save()

    res.status(201).json({
      success: true,
      message: "Event tracked successfully",
      eventId: event._id,
    })
  } catch (error) {
    console.error("Event Tracking Error:", error)
    res.status(500).json({ error: "Failed to track event" })
  }
})

/**
 * GET /api/recommendation-events/:userId
 *
 * Get user's recommendation interaction history
 * Useful for personalization and analytics
 */
router.get("/recommendation-events/:userId", async (req, res) => {
  try {
    const events = await RecommendationEvent.find({
      userId: req.params.userId,
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("collegeId", "name address")

    res.json({ events })
  } catch (error) {
    console.error("Event Fetch Error:", error)
    res.status(500).json({ error: "Failed to fetch events" })
  }
})

/**
 * GET /api/recommendation-analytics/:collegeId
 *
 * Get analytics for a specific college
 * Useful for college admins and system optimization
 */
router.get("/recommendation-analytics/:collegeId", async (req, res) => {
  try {
    const analytics = await RecommendationEvent.aggregate([
      { $match: { collegeId: req.params.collegeId } },
      {
        $group: {
          _id: "$action",
          count: { $sum: 1 },
        },
      },
    ])

    const result = {
      views: 0,
      clicks: 0,
      saves: 0,
      applies: 0,
    }

    analytics.forEach((item) => {
      result[item._id + "s"] = item.count
    })

    // Calculate conversion rates
    result.clickThroughRate = result.views > 0 ? ((result.clicks / result.views) * 100).toFixed(2) + "%" : "0%"
    result.applicationRate = result.clicks > 0 ? ((result.applies / result.clicks) * 100).toFixed(2) + "%" : "0%"

    res.json({ analytics: result })
  } catch (error) {
    console.error("Analytics Error:", error)
    res.status(500).json({ error: "Failed to fetch analytics" })
  }
})

router.post("/recommendations/save/:userId", async (req, res) => {
  try {
    const { itemId, itemType } = req.body;
    const { userId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(itemId)
    ) {
      return res.status(400).json({ error: "Invalid IDs" });
    }

    const existing = await SavedItem.findOne({
      user: userId,
      itemType,
      itemId,
    });

    if (existing) {
      await SavedItem.deleteOne({ _id: existing._id });
      return res.json({ success: true, isSaved: false });
    }

    await SavedItem.create({
      user: userId,
      itemType,
      itemId,
    });

    res.json({ success: true, isSaved: true });
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ error: error.message });
  }
});


/**
 * GET /api/recommendations/saved/:userId
 * Fetch saved colleges and courses for a user
 */
router.get("/recommendations/saved/:userId", async (req, res) => {
  try {
    const savedItems = await SavedItem.find({ user: req.params.userId })
      .populate("itemId")
      .sort({ createdAt: -1 });

    const savedColleges = savedItems.filter(i => i.itemType === "College");
const savedCourses = savedItems.filter(i => i.itemType === "Course");


    res.json({ savedColleges, savedCourses });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch saved items" });
  }
});



export default router

