/**
 * Recommendation Engine Helper Utilities
 * Contains core ML-style functions for scoring and explainability
 */

/**
 * Cosine Similarity - Core embedding comparison
 * Measures angle between two vectors (higher = more similar)
 */
export function cosineSimilarity(a, b) {
  if (!a?.length || !b?.length || a.length !== b.length) return 0

  let dot = 0,
    magA = 0,
    magB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    magA += a[i] * a[i]
    magB += b[i] * b[i]
  }

  const magnitude = Math.sqrt(magA) * Math.sqrt(magB)
  return magnitude === 0 ? 0 : dot / magnitude
}

/**
 * Calculate Interest Overlap Score
 * Measures how well college tags/courses match student interests
 */
export function calculateInterestOverlap(studentInterests = [], collegeTags = [], collegeCourses = []) {
  if (!studentInterests.length) return 0

  // Combine college tags and course names for matching
  const collegeKeywords = [
    ...collegeTags.map((t) => t.toLowerCase()),
    ...collegeCourses.map((c) => c.courseName?.toLowerCase() || ""),
    ...collegeCourses.flatMap((c) => c.tags?.map((t) => t.toLowerCase()) || []),
  ]

  const matches = studentInterests.filter((interest) =>
    collegeKeywords.some(
      (keyword) => keyword.includes(interest.toLowerCase()) || interest.toLowerCase().includes(keyword),
    ),
  )

  return matches.length / studentInterests.length
}

/**
 * Calculate Budget Fit Score
 * Compares student budget range with college fees
 */
export function calculateBudgetFit(studentBudget, collegeCourses = []) {
  // Parse student budget range (e.g., "50000-100000", "Under 50000", "Above 200000")
  const budgetRanges = {
    "Under 50000": { min: 0, max: 50000 },
    "50000-100000": { min: 50000, max: 100000 },
    "100000-200000": { min: 100000, max: 200000 },
    "200000-500000": { min: 200000, max: 500000 },
    "Above 500000": { min: 500000, max: Number.POSITIVE_INFINITY },
  }

  const budget = budgetRanges[studentBudget] || { min: 0, max: 100000 }

  // Get average tuition from courses
  const fees = collegeCourses.map((c) => c.fees?.tuitionPerYear || 0).filter((f) => f > 0)

  if (!fees.length) return 0.5 // Neutral if no fee data

  const avgFee = fees.reduce((a, b) => a + b, 0) / fees.length

  // Score based on how well fee fits in budget
  if (avgFee <= budget.max && avgFee >= budget.min) return 1
  if (avgFee < budget.min) return 0.8 // Under budget is still good

  // Over budget - reduce score based on how much
  const overBudgetRatio = avgFee / budget.max
  return Math.max(0, 1 - (overBudgetRatio - 1) * 0.5)
}

/**
 * Calculate Location Match Score
 * Compares student preferred location with college location
 */
export function calculateLocationMatch(studentLocation, preferredLocation, collegeCity, collegeState) {
  if (!preferredLocation || preferredLocation === "Any") return 1

  const studentLoc = (studentLocation || "").toLowerCase()
  const prefLoc = preferredLocation.toLowerCase()
  const city = (collegeCity || "").toLowerCase()
  const state = (collegeState || "").toLowerCase()

  // Exact city match
  if (city === prefLoc || city === studentLoc) return 1
  // State match
  if (state === prefLoc || state === studentLoc) return 0.8
  // Same region heuristic
  if (state.includes(prefLoc) || prefLoc.includes(state)) return 0.6

  return 0.3 // Different location
}

/**
 * Calculate Placement Score
 * Normalizes college placement data into 0-1 score
 */
export function calculatePlacementScore(placements) {
  if (!placements) return 0.5

  const { placementPercentage = 0, averagePackageLPA = 0, highestPackageLPA = 0 } = placements

  // Weighted placement score (industry benchmarks)
  const placementPctScore = Math.min(placementPercentage / 100, 1)
  const avgPkgScore = Math.min(averagePackageLPA / 15, 1) // 15 LPA as benchmark
  const highPkgScore = Math.min(highestPackageLPA / 50, 1) // 50 LPA as benchmark

  return placementPctScore * 0.5 + avgPkgScore * 0.35 + highPkgScore * 0.15
}

/**
 * Calculate Scholarship Match Score
 * Checks if student needs scholarship/loan and college offers it
 */
export function calculateScholarshipMatch(studentNeedsScholarship, collegeCourses = []) {
  if (studentNeedsScholarship !== "Yes") return 1 // Doesn't need, neutral

  const hasScholarship = collegeCourses.some((c) => c.scholarshipAvailable)
  const hasLoan = collegeCourses.some((c) => c.loanFacility)

  if (hasScholarship && hasLoan) return 1
  if (hasScholarship || hasLoan) return 0.7
  return 0.3
}

/**
 * Calculate Study Mode Match Score
 * Matches student preferred study mode with college offerings
 */
export function calculateStudyModeMatch(studentMode, collegeCourses = []) {
  if (!studentMode) return 1

  const modes = collegeCourses.flatMap((c) => c.studyModes || []).map((m) => m.toLowerCase())

  const studentModeLower = studentMode.toLowerCase()

  if (modes.includes(studentModeLower)) return 1
  if (modes.includes("hybrid") || modes.includes("both")) return 0.8
  return 0.4
}

/**
 * Build Complete Feature Vector for a Student-College Pair
 * Returns normalized scores for ML-style weighted ranking
 */
export function buildFeatureVector(student, college, embeddingSimilarity) {
  return {
    similarity: embeddingSimilarity,
    interestOverlap: calculateInterestOverlap(student.interests, college.tags, college.courses),
    budgetFit: calculateBudgetFit(student.budgetRange, college.courses),
    locationMatch: calculateLocationMatch(
      student.location,
      student.preferredStudyLocation,
      college.address?.city,
      college.address?.state,
    ),
    placementScore: calculatePlacementScore(college.placements),
    scholarshipMatch: calculateScholarshipMatch(student.openToScholarshipOrLoan, college.courses),
    studyModeMatch: calculateStudyModeMatch(student.studyMode, college.courses),
  }
}

/**
 * Calculate Final Weighted Score
 * Combines all features using configurable ML weights
 */
export function calculateWeightedScore(features, weights) {
  return Object.keys(weights).reduce((total, key) => {
    return total + (features[key] || 0) * (weights[key] || 0)
  }, 0)
}

/**
 * Generate Human-Readable Recommendation Reasons
 * Explains WHY a college was recommended (explainable AI)
 */
export function generateReasons(features, student, college) {
  const reasons = []

  // High similarity - profile match
  if (features.similarity > 0.7) {
    reasons.push("Strong match with your academic profile and interests")
  } else if (features.similarity > 0.5) {
    reasons.push("Good alignment with your educational background")
  }

  // Interest overlap
  if (features.interestOverlap > 0.6) {
    const matchingInterests = student.interests?.slice(0, 2).join(", ")
    reasons.push(`Offers programs aligned with your interests${matchingInterests ? ` (${matchingInterests})` : ""}`)
  }

  // Budget fit
  if (features.budgetFit > 0.8) {
    reasons.push("Fits well within your budget range")
  } else if (features.budgetFit > 0.5) {
    reasons.push("Reasonably priced for your budget")
  }

  // Location match
  if (features.locationMatch > 0.8) {
    reasons.push(`Located in your preferred area (${college.address?.city || college.address?.state})`)
  }

  // Placement score
  if (features.placementScore > 0.7) {
    const avgPkg = college.placements?.averagePackageLPA
    reasons.push(`Excellent placement record${avgPkg ? ` (avg ${avgPkg} LPA)` : ""}`)
  } else if (features.placementScore > 0.5) {
    reasons.push("Good placement opportunities")
  }

  // Scholarship match
  if (features.scholarshipMatch === 1 && student.openToScholarshipOrLoan === "Yes") {
    reasons.push("Offers scholarships and financial aid options")
  }

  // Study mode
  if (features.studyModeMatch === 1) {
    reasons.push(`Offers ${student.studyMode || "your preferred"} study mode`)
  }

  // Facilities based on student hobbies
  if (
    college.campus?.sportsFacilities &&
    student.hobbies?.some((h) => ["sports", "cricket", "football", "basketball", "athletics"].includes(h.toLowerCase()))
  ) {
    reasons.push("Has sports facilities matching your hobbies")
  }

  // Fallback if no specific reasons
  if (reasons.length === 0) {
    reasons.push("Matches your overall profile criteria")
  }

  return reasons.slice(0, 5) // Return top 5 reasons
}
