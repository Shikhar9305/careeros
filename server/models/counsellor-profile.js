import mongoose from "mongoose"

const counsellorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true }, // years of experience
    qualifications: [{ type: String }], // array of qualifications
    expertise: [{ type: String }], // areas of expertise
    location: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    bio: { type: String, required: true },
    consultationFee: { type: Number, required: true },
    availability: {
      days: [{ type: String }], // ['Monday', 'Tuesday', etc.]
      timeSlots: [{ type: String }], // ['9:00-10:00', '10:00-11:00', etc.]
    },
    languages: [{ type: String }],
    profileCompleted: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export default mongoose.model("CounsellorProfile", counsellorProfileSchema)
