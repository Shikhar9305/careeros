
const cleanJsonResponse = (text) => {
  let cleaned = text.trim();

  cleaned = cleaned.replace(/```json\s*/g, "");
  cleaned = cleaned.replace(/```\s*/g, "");
  cleaned = cleaned.replace(/`/g, "");

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) cleaned = jsonMatch[0];

  return cleaned;
};

export const generateCareerRoadmap = async (formData) => {
  try {
    // Build your SAME prompt EXACTLY the way you already do
    const prompt = `You are an expert career architect.

Generate a complete CAREER ROADMAP with React Flow JSON structure for the following user:

Career: ${formData.career}
Specialization: ${formData.specialization || "Not specified"}
Education Level: ${formData.educationLevel}
Skill Level: ${formData.skillLevel}
Time Availability: ${formData.timeAvailability}
Learning Style: ${formData.learningStyle}
Career Goal: ${formData.goal}

RULES:
- Return ONLY CLEAN JSON (no markdown, no code fences).
- JSON MUST be directly compatible with React Flow.
- Include 7–12 roadmap nodes.
- Each roadmap node MUST contain:

  id (string)
  title (string)
  description (string)
  timeline (string)
  difficulty (string: Easy, Medium, Hard)
  estimatedHours (number)
  skillsToLearn (array of strings)
  courses (array of strings)
  tools (array of strings)
  projects (array of strings)
  certifications (array of strings)
  position { x (number), y (number) }

- Include edges with:
  id (string)
  source (string)
  target (string)

- Personalize the roadmap based on:
  • education level
  • skill level
  • time availability
  • learning style
  • career goal

- Include extra metadata:

  industryOverview (string)
  salaryRange (string)
  companiesHiring (array of strings)
  jobTitles (array of strings)
  softSkills (array of strings)

Output JSON ONLY:
{
  "nodes": [...],
  "edges": [...],
  "metadata": {...}
}`;

    // Call your BACKEND instead of Gemini
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/generate-roadmap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formData, prompt })
    });

    const data = await res.json();

    const cleanedJson = cleanJsonResponse(data.text);
    const roadmapData = JSON.parse(cleanedJson);

    return roadmapData;
  } catch (err) {
    console.error("ROADMAP ERROR:", err);
    throw new Error(err.message);
  }
};

