import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

/* ---------------- GEMINI INIT ---------------- */
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // 🔒 backend only
});

/* ---------------- AI COLLEGE SEARCH ---------------- */
router.post("/ai-search", async (req, res) => {
  try {
    const filters = req.body;

    const prompt = `
      List top colleges in India that mostly match these criteria:
      Location: ${filters.location || "Any"}
      College Type: ${filters.collegeType || "Any"}
      Courses: ${filters.courses || "Any"}
      Degree Level: ${filters.degreeLevel || "Any"}
      Budget: ${filters.budget || "Any"}
      Ranking: ${filters.ranking || "Any"}
      Exams Accepted: ${filters.examsAccepted || "Any"}

      Return ONLY a strict JSON array:
      [
        {
          "name": "",
          "location": "",
          "coordinates": [lng, lat],
          "ranking": "",
          "fees": "",
          "students": "",
          "rating": "",
          "type": "",
          "programs": [],
          "facilities": [],
          "hostels": "",
          "scholarships": "",
          "notes": ""
        }
      ]
    `;

    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
      contents: prompt,
      temperature: 0.4,
      maxOutputTokens: 800,
    });

    const text = response.text || "";
    const match = text.match(/\[[\s\S]*\]/);

    const colleges = match ? JSON.parse(match[0]) : [];

    res.json({
      success: true,
      colleges,
    });
  } catch (error) {
    console.error("❌ College Explore AI Error:", error);
    res.status(500).json({
      success: false,
      message: "AI college exploration failed",
    });
  }
});

export default router;
