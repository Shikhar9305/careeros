import mongoose from "mongoose"

/**
 * RecommendationEvent Model
 * Tracks user interactions with recommended colleges for ML feedback loop
 * Actions: view (impression), click (engagement), save (interest), apply (conversion)
 */
const recommendationEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for faster queries by user
    },
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true, // Index for college analytics
    },
    action: {
      type: String,
      enum: ["view", "click", "save", "apply"],
      required: true,
    },
    // Additional context for ML training
    metadata: {
      score: { type: Number }, // The recommendation score when event occurred
      rank: { type: Number }, // Position in recommendation list
      sessionId: { type: String }, // Group events by session
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  },
)

// Compound index for efficient querying of user-college pairs
recommendationEventSchema.index({ userId: 1, collegeId: 1, action: 1 })

// Index for time-based analytics
recommendationEventSchema.index({ createdAt: -1 })

export default mongoose.model("RecommendationEvent", recommendationEventSchema)
