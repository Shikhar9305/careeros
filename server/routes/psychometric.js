import express from "express";
import PsychometricTest from "../models/PsychometricTest.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const router = express.Router();

/* -------------------------------------------------------
   ⭐ GEMINI INITIALIZATION (NEW SDK)
-------------------------------------------------------- */

let gemini = null;

try {
  if (process.env.GEMINI_API_KEY) {
    gemini = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
    console.log("Gemini (new SDK) initialized");
  } else {
    console.warn("GEMINI_API_KEY missing in .env");
  }
} catch (err) {
  console.warn("Failed to initialize Gemini:", err.message);
}

/* -------------------------------------------------------
   LOAD QUESTION BANK
-------------------------------------------------------- */

const questionsPath = path.resolve("./data/psychometricQuestions.json");
const questionBank = JSON.parse(fs.readFileSync(questionsPath, "utf8"));

/* -------------------------------------------------------
   1️⃣ BIG FIVE SCORING
-------------------------------------------------------- */

function calculateBigFiveScores(personalityResponses = []) {
  const scores = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0,
  };

  const count = { ...scores };

  personalityResponses.forEach((response) => {
    const category = response.category?.toLowerCase();
    if (!scores.hasOwnProperty(category)) return;

    const value = Number(response.response) || 0;
    scores[category] += value;
    count[category] += 1;
  });

  Object.keys(scores).forEach((trait) => {
    const max = count[trait] * 5;
    scores[trait] = max > 0 ? Math.round((scores[trait] / max) * 100) : 0;
  });

  return scores;
}

/* -------------------------------------------------------
   2️⃣ APTITUDE SCORING
-------------------------------------------------------- */

function calculateAptitudeScores(aptitudeResponses = []) {
  const categoryScores = {
    logical: { correct: 0, total: 0 },
    verbal: { correct: 0, total: 0 },
    numerical: { correct: 0, total: 0 },
    pattern: { correct: 0, total: 0 },
  };

  aptitudeResponses.forEach((res) => {
    const cat = res.category?.toLowerCase();
    if (!categoryScores[cat]) return;

    const q = questionBank.aptitude.find((q) => q.id === res.questionId);
    if (!q) return;

    const correct = q.correctAnswer?.trim() || "";
    const given = res.userAnswer?.trim() || "";

    categoryScores[cat].total++;
    if (given === correct) categoryScores[cat].correct++;
  });

  const scores = {};
  Object.keys(categoryScores).forEach((cat) => {
    const { correct, total } = categoryScores[cat];
    scores[cat] = total > 0 ? Math.round((correct / total) * 100) : 0;
  });

  return scores;
}

/* -------------------------------------------------------
   3️⃣ RIASEC SCORING
-------------------------------------------------------- */

function calculateRIASECScores(riasecResponses = []) {
  const scores = {
    realistic: 0,
    investigative: 0,
    artistic: 0,
    social: 0,
    enterprising: 0,
    conventional: 0,
  };

  const count = { ...scores };

  riasecResponses.forEach((res) => {
    const cat = res.category?.toLowerCase();
    if (!scores[cat]) return;

    scores[cat] += Number(res.response) || 0;
    count[cat]++;
  });

  Object.keys(scores).forEach((cat) => {
    const max = count[cat] * 5;
    scores[cat] = max > 0 ? Math.round((scores[cat] / max) * 100) : 0;
  });

  return scores;
}

function deriveRIASECCode(riasecScores) {
  return Object.entries(riasecScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k[0].toUpperCase())
    .join("");
}

/* -------------------------------------------------------
   4️⃣ VALUES SCORING
-------------------------------------------------------- */

function calculateValuesScores(valuesResponses = []) {
  const scores = {};
  const count = {};

  valuesResponses.forEach((res) => {
    const key = res.value?.toLowerCase();
    if (!key) return;

    scores[key] = (scores[key] || 0) + (Number(res.response) || 0);
    count[key] = (count[key] || 0) + 1;
  });

  Object.keys(scores).forEach((key) => {
    const max = count[key] * 5;
    scores[key] = max > 0 ? Math.round((scores[key] / max) * 100) : 0;
  });

  return scores;
}

/* -------------------------------------------------------
   5️⃣ RULE-BASED INSIGHTS
-------------------------------------------------------- */

function buildRuleBasedInsights(bigFive, aptitude, riasec, values) {
  const strengths = [];
  const weaknesses = [];

  // Big Five strengths
  if (bigFive.openness >= 70) strengths.push("Highly creative and open to new ideas.");
  if (bigFive.conscientiousness >= 70) strengths.push("Organized and disciplined.");
  if (bigFive.extraversion >= 70) strengths.push("Confident in social situations.");
  if (bigFive.agreeableness >= 70) strengths.push("Empathetic and cooperative.");
  if (bigFive.neuroticism <= 30) strengths.push("Calm under pressure.");

  // Big Five weaknesses
  if (bigFive.conscientiousness <= 40) weaknesses.push("May struggle with routine or consistency.");
  if (bigFive.extraversion <= 40) weaknesses.push("May avoid networking or group work.");
  if (bigFive.neuroticism >= 70) weaknesses.push("Can feel overwhelmed or stressed.");

  // Aptitude strengths
  if (aptitude.logical >= 70) strengths.push("Strong logical problem-solving ability.");
  if (aptitude.numerical >= 70) strengths.push("Strong numerical reasoning.");
  if (aptitude.verbal >= 70) strengths.push("Good verbal and language skills.");
  if (aptitude.pattern >= 70) strengths.push("Strong pattern-recognition ability.");

  // Values-based strengths
  if ((values.creativity || 0) >= 70) strengths.push("Prefers creative and expressive work environments.");

  return {
    strengths: [...new Set(strengths)],
    weaknesses: [...new Set(weaknesses)],
  };
}

/* -------------------------------------------------------
   6️⃣ GEMINI JSON SAFE PARSING
-------------------------------------------------------- */

function extractCleanJSON(text) {
  if (!text) return null;

  // Remove markdown code blocks like ```json ... ```
  let clean = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // Extract FIRST {...} block
  const match = clean.match(/\{[\s\S]*\}/);
  if (!match) return null;

  clean = match[0];

  try {
    return JSON.parse(clean);
  } catch (err) {
    console.warn("JSON parse error after cleanup:", clean);
    return null;
  }
}

/* -------------------------------------------------------
   7️⃣ GEMINI NARRATIVE GENERATION
-------------------------------------------------------- */

async function generateNarrativeWithGemini(payload) {
  if (!gemini) return null;

  const prompt = `
Return ONLY clean JSON.
NO markdown.
NO backticks.
NO explanations.

Format:
{
  "personalitySummary": "string",
  "strengths": ["string"],
  "weaknesses": ["string"]
}

User Data:
${JSON.stringify(payload, null, 2)}
`;

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    // NEW SDK → text is a FIELD, not a function
    let text = response.text;

    // Backup extraction from parts
    if (!text && response.response?.candidates?.length) {
      text = response.response.candidates
        .flatMap((c) => c.content?.parts || [])
        .map((p) => p.text || "")
        .join(" ");
    }

    const parsed = extractCleanJSON(text);
    return parsed;
  } catch (err) {
    console.warn("Gemini narrative generation failed:", err.message);
    return null;
  }
}

/* -------------------------------------------------------
   8️⃣ CAREER RECOMMENDATION ENGINE
-------------------------------------------------------- */

const CAREERS = [
  {
    domain: "Software Engineer",
    description: "Builds and maintains software applications.",
    weights: {
      logical: 0.30,
      numerical: 0.10,
      pattern: 0.20,
      investigative: 0.20,
      conscientiousness: 0.20,
    },
  },
  {
    domain: "Data Scientist",
    description: "Analyzes data, builds predictive models, and works with machine learning.",
    weights: {
      numerical: 0.30,
      logical: 0.20,
      pattern: 0.20,
      investigative: 0.20,
      openness: 0.10,
    },
  },
  {
    domain: "UX/UI Designer",
    description: "Designs user-friendly digital interfaces and experiences.",
    weights: {
      artistic: 0.30,
      openness: 0.20,
      creativity: 0.20,
      pattern: 0.10,
      verbal: 0.20,
    },
  },
  {
    domain: "Teacher / Trainer",
    description: "Educates and guides students or professionals.",
    weights: {
      social: 0.30,
      agreeableness: 0.20,
      verbal: 0.20,
      helping: 0.20,
      extraversion: 0.10,
    },
  },
  {
    domain: "Product Manager",
    description: "Leads cross-functional teams, defines product strategy, and prioritizes features.",
    weights: {
      enterprising: 0.25,
      extraversion: 0.20,
      logical: 0.15,
      leadership: 0.15,
      social: 0.10,
      openness: 0.15,
    },
  },
  {
    domain: "Entrepreneur / Startup Founder",
    description: "Builds, operates, and grows a new business under uncertainty.",
    weights: {
      enterprising: 0.30,
      autonomy: 0.20,
      extraversion: 0.15,
      openness: 0.15,
      leadership: 0.20,
    },
  },
  {
    domain: "Counselor / Psychologist / Social Worker",
    description: "Supports individuals emotionally and helps them improve mental well-being.",
    weights: {
      social: 0.30,
      helping: 0.25,
      agreeableness: 0.20,
      ethics: 0.15,
      extraversion: 0.10,
    },
  },
];


function generateCareerRecommendations(scores) {
  return CAREERS.map((career) => {
    let total = 0;
    let max = 0;

    for (const [trait, weight] of Object.entries(career.weights)) {
      total += (scores[trait] || 0) * weight;
      max += 100 * weight;
    }

    const match = Math.round((total / max) * 100);

    return {
      careerDomain: career.domain,
      description: career.description,
      matchPercentage: match,
    };
  })
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .map((c, i) => ({ ...c, rank: i + 1 }))
    .slice(0, 5);
}

/* -------------------------------------------------------
   9️⃣ SUBMIT TEST ROUTE
-------------------------------------------------------- */

router.post("/submit-psychometric-test", async (req, res) => {
  try {
    const { userId, personalityResponses, aptitudeResponses, riasecResponses, valuesResponses } = req.body;

    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const bigFive = calculateBigFiveScores(personalityResponses);
    const aptitude = calculateAptitudeScores(aptitudeResponses);
    const riasec = calculateRIASECScores(riasecResponses);
    const values = calculateValuesScores(valuesResponses);
    const riasecCode = deriveRIASECCode(riasec);

    const allScores = { ...bigFive, ...aptitude, ...riasec, ...values };

    const recommendedCareers = generateCareerRecommendations(allScores);

    const fallback = buildRuleBasedInsights(bigFive, aptitude, riasec, values);

    let personalitySummary = "";
    let strengths = fallback.strengths;
    let weaknesses = fallback.weaknesses;

    // Gemini Attempt
    const geminiOutput = await generateNarrativeWithGemini({
      bigFive,
      aptitude,
      riasec,
      values,
      riasecCode,
      recommendedCareers,
    });

    if (geminiOutput) {
      personalitySummary = geminiOutput.personalitySummary || "";
      strengths = geminiOutput.strengths?.length ? geminiOutput.strengths : strengths;
      weaknesses = geminiOutput.weaknesses?.length ? geminiOutput.weaknesses : weaknesses;
    } else {
      personalitySummary =
        "Your results highlight a balanced combination of personality traits, cognitive strengths, interests, and values. Explore matching careers and areas of growth using your personalized insights.";
    }

    const record = new PsychometricTest({
      userId,
      personalityResponses,
      aptitudeResponses,
      riasecResponses,
      valuesResponses,
      calculatedScores: { bigFive, aptitude, riasec, values },
      personalitySummary,
      strengths,
      weaknesses,
      recommendedCareers,
    });

    await record.save();

    res.status(201).json({
      message: "Psychometric test submitted successfully",
      testId: record._id,
      calculatedScores: record.calculatedScores,
      personalitySummary,
      strengths,
      weaknesses,
      recommendedCareers,
    });
  } catch (err) {
    console.error("Submit Test Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});



/* -------------------------------------------------------
   1️⃣2️⃣ GET SPECIFIC REPORT BY ID (NEW)
-------------------------------------------------------- */
router.get("/psychometric-report/:reportId", async (req, res) => {
  try {
    const record = await PsychometricTest.findById(req.params.reportId)

    if (!record) {
      return res.status(404).json({ error: "Report not found" })
    }

    res.json(record)
  } catch (err) {
    console.error("Report fetch error:", err)
    res.status(500).json({ error: "Internal server error" })
  }
})

/* -------------------------------------------------------
   🔟 GET LATEST REPORT
-------------------------------------------------------- */

router.get("/psychometric-report/latest/:userId", async (req, res) => {
  try {
    const record = await PsychometricTest
      .findOne({ userId: req.params.userId })
      .sort({ createdAt: -1 })

    if (!record) return res.status(404).json({ error: "No report found" })

    res.json(record)
  } catch (err) {
    res.status(500).json({ error: "Internal server error" })
  }
})


/* -------------------------------------------------------
   1️⃣1️⃣ GET ALL REPORTS FOR USER (NEW)
-------------------------------------------------------- */

router.get("/all-reports/:userId", async (req, res) => {
  try {
    const records = await PsychometricTest.find({ userId: req.params.userId })
      .sort({ testCompletedAt: -1 })
      .select("_id personalitySummary testCompletedAt recommendedCareers")

    if (!records || records.length === 0) {
      return res.status(200).json([])
    }

    res.json(records)
  } catch (err) {
    console.error("All reports fetch error:", err)
    res.status(500).json({ error: "Internal server error" })
  }
})





export default router;
