// import express from "express";
// import mongoose from "mongoose";
// import User from "../models/user.js";
// import crypto from "crypto";
// import nodemailer from "nodemailer";
// import StudentProfile from "../models/StudentProfile.js";
// import CounsellorProfile from "../models/counsellor-profile.js";
// import PsychometricTest from "../models/PsychometricTest.js";

// import dotenv from "dotenv";
// dotenv.config();

// import fetch from "node-fetch"; // npm install node-fetch

// const router = express.Router();

// // Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,  // Use Gmail App Password
//   },
// });

// // ----------------- Gemini Embedding Setup -----------------
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // store your Gemini API key in .env

// // Function to build prompt text from student profile
// function createStudentPrompt(profile) {
//   return `
// Grade: ${profile.grade}
// Stream: ${profile.stream}
// Interests: ${profile.interests.join(", ")}
// Strong Subjects: ${profile.strongSubjects.join(", ")}
// Career Goals: ${profile.careerGoals || "Not specified"}
// Hobbies: ${profile.hobbies.join(", ")}
// Age: ${profile.age}
// Location: ${profile.location}
// Tenth Percent: ${profile.tenthPercent}
// Twelfth Percent: ${profile.twelfthPercent || "Not specified"}
// Budget Range: ${profile.budgetRange}
// Study Mode: ${profile.studyMode}
// Preferred Study Location: ${profile.preferredStudyLocation}
// Open to Scholarship or Loan: ${profile.openToScholarshipOrLoan}
// Competitive Exams: ${profile.competitiveExams.join(", ")}
// `;
// }

// // ----------------- ROUTES ------------------

// // Signup new user
// router.post("/signup", async (req, res) => {
//   const { name, email, password, role } = req.body;

//   try {
//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ error: "Email already exists" });

//     // Generate 6-digit OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     const otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

//     const newUser = new User({
//       name,
//       email,
//       password,
//       role,
//       verified: false,
//       otp,
//       otpExpires
//     });

//     await newUser.save();

//     // Nodemailer
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       }
//     });

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Your OTP Verification Code",
//       text: `Your OTP is ${otp}. It is valid for 5 minutes.`
//     });

//     res.status(201).json({
//       message: "User created. OTP sent to email.",
//       userId: newUser._id
//     });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Signup failed" });
//   }
// });

// router.post("/verify-otp", async (req, res) => {
//   try {
//     const { userId, otp } = req.body

//     console.log("VERIFY OTP BODY:", req.body)

//     const user = await User.findById(userId)
//     console.log("USER FOUND:", user)

//     if (!user) {
//       return res.status(400).json({ error: "User not found" })
//     }

//     console.log("DB OTP:", user.otp)
//     console.log("CLIENT OTP:", otp)

//     if (String(user.otp) !== String(otp)) {
//       return res.status(400).json({ error: "Invalid OTP" })
//     }

//     console.log("OTP EXPIRES AT:", user.otpExpires)
//     console.log("NOW:", Date.now())

//     if (new Date(user.otpExpires).getTime() < Date.now()) {
//       return res.status(400).json({ error: "OTP expired" })
//     }

//     user.verified = true
//     user.otp = null
//     user.otpExpires = null
//     await user.save()

//     res.json({ message: "Email verified successfully", user })
//   } catch (err) {
//     console.error("VERIFY OTP ERROR:", err)
//     res.status(500).json({ error: "Server error" })
//   }
// })



// router.post("/signin", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // 1️⃣ Find user by email
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: "User not found" });

//     // 2️⃣ Check if email is verified
//     if (!user.verified)
//       return res.status(400).json({ error: "Email not verified. Please verify your email first." });

//     // 3️⃣ Check password
//     if (user.password !== password) // ❗ Later you can hash passwords with bcrypt
//       return res.status(400).json({ error: "Incorrect password" });

//     // 4️⃣ Success: send user data
//     res.json({
//       message: "Signin successful",
//       user,
//     });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Signin failed" });
//   }
// });




// // ---------- COMPLETE PROFILE (Gemini Version) ----------
// router.post("/complete-profile", async (req, res) => {
//   try {
//     const { userId, ...profileData } = req.body;

//     const newProfile = new StudentProfile({ userId, ...profileData });
//     const promptText = createStudentPrompt(newProfile);

//     // ===== Gemini REST API Call using API key in URL =====
//     const embeddingResponse = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           content: { parts: [{ text: promptText }] },
//         }),
//       }
//     );

//     const result = await embeddingResponse.json();

//     // ✅ Correct embedding extraction
//     const embeddingVector = result.embedding?.values;
//     if (!embeddingVector) {
//       console.error("Gemini embedding error:", result);
//       return res.status(500).json({
//         error: "Embedding failed (Gemini error)",
//         details: result,
//       });
//     }

//     newProfile.embedding = embeddingVector;
//     await newProfile.save();

//     res.status(201).json({
//       message: "Profile completed with Gemini embedding",
//       profile: newProfile,
//     });
//   } catch (error) {
//     console.error("Profile completion error:", error);
//     res.status(500).json({
//       error: "Failed to save profile with embedding",
//       details: error.message,
//     });
//   }
// });



// // Complete counsellor profile
// router.post("/complete-counsellor-profile", async (req, res) => {
//   try {
//     const { userId, ...profileData } = req.body;
//     const newProfile = new CounsellorProfile({ userId, ...profileData });
//     await newProfile.save();
//     res.status(201).json({ message: "Counsellor profile completed", profile: newProfile });
//   } catch (error) {
//     console.error("Counsellor profile completion error:", error);
//     res.status(500).json({ error: "Failed to save counsellor profile" });
//   }
// });

// // Get student profile
// router.get("/profile/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const profile = await StudentProfile.findOne({ userId: new mongoose.Types.ObjectId(userId) });
//     if (!profile) return res.status(404).json({ message: "Profile not found" });
//     res.json(profile);
//   } catch (error) {
//     console.error("Error fetching profile:", error);
//     res.status(500).json({ error: "Failed to fetch profile" });
//   }
// });

// // Get counsellor profile
// router.get("/counsellor-profile/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const profile = await CounsellorProfile.findOne({ userId: new mongoose.Types.ObjectId(userId) });
//     if (!profile) return res.status(404).json({ message: "Counsellor profile not found" });
//     res.json(profile);
//   } catch (error) {
//     console.error("Error fetching counsellor profile:", error);
//     res.status(500).json({ error: "Failed to fetch counsellor profile" });
//   }
// });

// // GET all counsellors
// router.get("/counsellors/all", async (req, res) => {
//   try {
//     const counsellors = await CounsellorProfile.find({});
//     res.json(counsellors);
//   } catch (error) {
//     console.error("Error fetching counsellors:", error);
//     res.status(500).json({ error: "Failed to fetch counsellors" });
//   }
// });



// export default router;

import express from "express";
import mongoose from "mongoose";
import User from "../models/user.js";
import nodemailer from "nodemailer";
import StudentProfile from "../models/StudentProfile.js";
import CounsellorProfile from "../models/counsellor-profile.js";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const router = express.Router();

/* -------------------- BREVO SMTP MAILER -------------------- */
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER, // 9fb6d7001@smtp-brevo.com
    pass: process.env.BREVO_SMTP_PASS, // SMTP key
  },
});

// Optional: verify SMTP on startup
transporter.verify((err) => {
  if (err) {
    console.error("❌ Brevo SMTP error:", err);
  } else {
    console.log("✅ Brevo SMTP ready");
  }
});

/* ----------------- GEMINI SETUP ----------------- */
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function createStudentPrompt(profile) {
  return `
Grade: ${profile.grade}
Stream: ${profile.stream}
Interests: ${profile.interests.join(", ")}
Strong Subjects: ${profile.strongSubjects.join(", ")}
Career Goals: ${profile.careerGoals || "Not specified"}
Hobbies: ${profile.hobbies.join(", ")}
Age: ${profile.age}
Location: ${profile.location}
Tenth Percent: ${profile.tenthPercent}
Twelfth Percent: ${profile.twelfthPercent || "Not specified"}
Budget Range: ${profile.budgetRange}
Study Mode: ${profile.studyMode}
Preferred Study Location: ${profile.preferredStudyLocation}
Open to Scholarship or Loan: ${profile.openToScholarshipOrLoan}
Competitive Exams: ${profile.competitiveExams.join(", ")}
`;
}

/* -------------------- SIGNUP + OTP -------------------- */
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    const newUser = new User({
      name,
      email,
      password,
      role,
      verified: false,
      otp,
      otpExpires,
    });

    await newUser.save();

    await transporter.sendMail({
      from: '"CareerOS" <sshikhar442@gmail.com>',
      to: email,
      subject: "Your OTP Verification Code",
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This code is valid for 5 minutes.</p>
      `,
    });

    res.status(201).json({
      message: "User created. OTP sent to email.",
      userId: newUser._id,
    });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({
    error: err.message,
    code: err.code,
    response: err.response,
  });
  }
});

/* -------------------- VERIFY OTP -------------------- */
router.post("/verify-otp", async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (new Date(user.otpExpires).getTime() < Date.now()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    user.verified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "Email verified successfully", user });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* -------------------- SIGNIN -------------------- */
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    if (!user.verified) {
      return res
        .status(400)
        .json({ error: "Email not verified. Please verify your email first." });
    }

    if (user.password !== password) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    res.json({ message: "Signin successful", user });
  } catch (err) {
    console.error("SIGNIN ERROR:", err);
    res.status(500).json({ error: "Signin failed" });
  }
});

/* ---------- COMPLETE PROFILE (Gemini) ---------- */
router.post("/complete-profile", async (req, res) => {
  try {
    const { userId, ...profileData } = req.body;

    const newProfile = new StudentProfile({ userId, ...profileData });
    const promptText = createStudentPrompt(newProfile);

    const embeddingResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: { parts: [{ text: promptText }] },
        }),
      }
    );

    const result = await embeddingResponse.json();
    const embeddingVector = result.embedding?.values;

    if (!embeddingVector) {
      return res.status(500).json({ error: "Gemini embedding failed" });
    }

    newProfile.embedding = embeddingVector;
    await newProfile.save();

    res.status(201).json({
      message: "Profile completed",
      profile: newProfile,
    });
  } catch (error) {
    console.error("PROFILE ERROR:", error);
    res.status(500).json({ error: "Failed to save profile" });
  }
});

//Complete counsellor profile

router.post("/complete-counsellor-profile", async (req, res) => {
  try {
    const { userId, ...profileData } = req.body;
    const newProfile = new CounsellorProfile({ userId, ...profileData });
    await newProfile.save();
    res.status(201).json({ message: "Counsellor profile completed", profile: newProfile });
  } catch (error) {
    console.error("Counsellor profile completion error:", error);
    res.status(500).json({ error: "Failed to save counsellor profile" });
  }
});

// Get student profile
router.get("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await StudentProfile.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Get counsellor profile
router.get("/counsellor-profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = await CounsellorProfile.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if (!profile) return res.status(404).json({ message: "Counsellor profile not found" });
    res.json(profile);
  } catch (error) {
    console.error("Error fetching counsellor profile:", error);
    res.status(500).json({ error: "Failed to fetch counsellor profile" });
  }
});

// GET all counsellors
router.get("/counsellors/all", async (req, res) => {
  try {
    const counsellors = await CounsellorProfile.find({});
    res.json(counsellors);
  } catch (error) {
    console.error("Error fetching counsellors:", error);
    res.status(500).json({ error: "Failed to fetch counsellors" });
  }
});


export default router;


