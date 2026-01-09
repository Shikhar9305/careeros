import mongoose from "mongoose";
import College from "./models/college.js";
import dotenv from "dotenv";
dotenv.config();

// --- Create Prompt from College Data ---
function createCollegePrompt(college) {
  return `
College Name: ${college.name}
Type: ${college.type}
Affiliation: ${college.affiliation}
City: ${college.address.city}
State: ${college.address.state}

Courses Offered:
${college.courses.map(c => `- ${c.courseName} (${c.stream})`).join("\n")}

Facilities: ${college.campus ? Object.keys(college.campus).filter(k => college.campus[k]).join(", ") : ""}

Placements:
- Average Package: ${college.placements?.averagePackageLPA} LPA
- Highest Package: ${college.placements?.highestPackageLPA} LPA
- Recruiters: ${college.placements?.topRecruiters?.join(", ")}

Description:
${college.description}

Tags: ${college.tags?.join(", ")}
`;
}

async function generateEmbeddings() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected.");

    const colleges = await College.find();

    for (const college of colleges) {
      console.log(`Embedding: ${college.name}`);

      const prompt = createCollegePrompt(college);

      // --- SAME FORMAT AS STUDENT PROFILE EMBEDDINGS ---
      const embeddingResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: {
              parts: [{ text: prompt }],
            },
          }),
        }
      );

      const result = await embeddingResponse.json();

      const vector = result.embedding?.values;
      if (!vector) {
        console.error("❌ Embedding FAILED for:", college.name);
        console.error(result);
        continue;
      }

      college.embedding = vector;
      await college.save();

      console.log(`✔ Saved embedding for ${college.name}`);
    }

    console.log("🎉 All embeddings generated successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error generating embeddings:", err);
    process.exit(1);
  }
}

generateEmbeddings();
