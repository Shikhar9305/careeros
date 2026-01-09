import { generateWithGemini } from "../services/gemini.service.js";
import {
  optimizeJobDescriptionPrompt,
  optimizeSkillsPrompt,
  resumeKeywordsPrompt
} from "../prompts/resume.prompts.js";

export const optimizeJobDescription = async (req, res) => {
  try {
    const { jobDescription, jobTitle, company } = req.body;

    const prompt = optimizeJobDescriptionPrompt(
      jobDescription,
      jobTitle,
      company
    );

    const text = await generateWithGemini(prompt);
    res.json({ text });

  } catch (err) {
    console.error("Resume optimize error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const optimizeSkills = async (req, res) => {
  try {
    const { currentSkills, jobDescription } = req.body;
    const prompt = optimizeSkillsPrompt(currentSkills, jobDescription);

    const text = await generateWithGemini(prompt);
    res.json({ text });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const generateResumeKeywords = async (req, res) => {
  try {
    const { jobDescription, resumeData } = req.body;
    const prompt = resumeKeywordsPrompt(jobDescription, resumeData);

    const text = await generateWithGemini(prompt);
    res.json({ text });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
