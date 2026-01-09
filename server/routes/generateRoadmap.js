import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  apiVersion: "v1"
});

router.post("/generate-roadmap", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // EXACT FORMAT FROM GOOGLE DOCS
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt  // IMPORTANT: plain text input
    });

    // OFFICIAL DOCS: response.text  (NOT a function)
    const output = response.text;

    if (!output) {
      return res.status(500).json({ error: "Gemini returned no text output" });
    }

    res.json({ text: output });

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
