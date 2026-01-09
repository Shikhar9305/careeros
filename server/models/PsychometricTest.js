import mongoose from "mongoose"

const psychometricTestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
   
    personalityResponses: [
      {
        questionId: Number,
        question: String,
        category: String, // openness, conscientiousness, extraversion, agreeableness, neuroticism
        response: Number, // 1-5 Likert scale
      },
    ],

    aptitudeResponses: [
      {
        questionId: Number,
        question: String,
        category: String, // logical, verbal, numerical, pattern
        userAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean,
      },
    ],

    riasecResponses: [
      {
        questionId: Number,
        question: String,
        category: String, // Realistic, Investigative, Artistic, Social, Enterprising, Conventional
        response: Number, // 1-5 Likert scale
      },
    ],
    
    valuesResponses: [
      {
        questionId: Number,
        question: String,
        value: String,
        response: Number, // 1-5 Likert scale
      },
    ],
    // Calculated Scores
    calculatedScores: {
      bigFive: {
        openness: Number,
        conscientiousness: Number,
        extraversion: Number,
        agreeableness: Number,
        neuroticism: Number,
      },
      aptitude: {
        logical: Number,
        verbal: Number,
        numerical: Number,
        pattern: Number,
      },
      riasec: {
        realistic: Number,
        investigative: Number,
        artistic: Number,
        social: Number,
        enterprising: Number,
        conventional: Number,
      },
      values: {
        creativity: Number,
        security: Number,
        autonomy: Number,
        helping: Number,
        leadership: Number,
      },
    },
    // Personality Summary
    personalitySummary: String,
    strengths: [String],
    weaknesses: [String],
    // Top 5 Recommended Career Domains
    recommendedCareers: [
      {
        rank: Number,
        careerDomain: String,
        matchPercentage: Number,
        description: String,
      },
    ],
    testCompletedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

export default mongoose.model("PsychometricTest", psychometricTestSchema)
