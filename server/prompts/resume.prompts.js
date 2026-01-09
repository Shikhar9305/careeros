export const optimizeJobDescriptionPrompt = (
  jobDescription,
  jobTitle,
  company
) => `
You are an expert resume writer and ATS optimization specialist.

Rewrite the job description into 3–5 powerful resume bullet points.

Job Title: ${jobTitle}
Company: ${company}
Current Description:
${jobDescription}

Rules:
- Start with strong action verbs
- Use measurable impact (use placeholders if needed)
- ATS-friendly
- Bullet format
- Focus on achievements
`;

export const optimizeSkillsPrompt = (currentSkills, jobDescription) => `
You are an ATS optimization expert.

Current Skills:
${currentSkills.join(", ")}

Job Description:
${jobDescription}

Suggest 5–10 additional relevant skills:
- Technical
- Tools
- Industry keywords
- Commonly expected for this role

Return as a comma-separated list only.
`;

export const resumeKeywordsPrompt = (jobDescription, resumeData) => `
You are an ATS optimization specialist.

Job Description:
${jobDescription}

Resume Summary:
- Job Titles: ${resumeData.workExperience?.map(e => e.jobTitle).join(", ") || "None"}
- Skills: ${resumeData.skills?.join(", ") || "None"}
- Education: ${resumeData.education?.map(e => e.degree).join(", ") || "None"}

Extract 10–15 important ATS keywords.
Return as a clean list.
`;
