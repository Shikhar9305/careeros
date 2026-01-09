import express from "express";
import {
  optimizeJobDescription,
  optimizeSkills,
  generateResumeKeywords
} from "../controllers/resume.controller.js";

const router = express.Router();

router.post("/optimize-description", optimizeJobDescription);
router.post("/optimize-skills", optimizeSkills);
router.post("/keywords", generateResumeKeywords);

export default router;
