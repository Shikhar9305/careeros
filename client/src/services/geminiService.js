const API_BASE = `${import.meta.env.VITE_API_URL}/api/resume`;

export const optimizeJobDescription = async ({ jobDescription, jobTitle, company }) => {
  const res = await fetch(`${API_BASE}/optimize-description`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobDescription, jobTitle, company })
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const data = await res.json();
  return data.text;
};

export const optimizeSkillsForJob = async ({ currentSkills, jobDescription }) => {
  const res = await fetch(`${API_BASE}/optimize-skills`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentSkills, jobDescription })
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const data = await res.json();
  return data.text;
};

export const generateResumeKeywords = async ({ jobDescription, resumeData }) => {
  const res = await fetch(`${API_BASE}/keywords`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobDescription, resumeData })
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const data = await res.json();
  return data.text;
};
