import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  affiliation: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    lat: { type: Number },
    lng: { type: Number }
  },
  website: { type: String },
  contact: {
    phone: { type: String },
    email: { type: String }
  },
  courses: [
    {
      courseName: { type: String, required: true },
      specialization: { type: String },
      durationYears: { type: Number },
      degreeType: { type: String },
      stream: { type: String },
      description: { type: String },
      tags: [String],
      eligibility: {
        minTenthPercent: { type: Number },
        minTwelfthPercent: { type: Number },
        requiredStreams: [String],
        acceptedEntranceExams: [String]
      },
      fees: {
        tuitionPerYear: { type: Number },
        hostelPerYear: { type: Number },
        otherFees: { type: Number }
      },
      studyModes: [String],
      scholarshipAvailable: { type: Boolean, default: false },
      loanFacility: { type: Boolean, default: false }
    }
  ],
  campus: {
    hostel: { type: Boolean, default: false },
    library: { type: Boolean, default: false },
    labs: { type: Boolean, default: false },
    sportsFacilities: { type: Boolean, default: false },
    transport: { type: Boolean, default: false },
    cafeteria: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    otherFacilities: [String]
  },
  placements: {
    placementPercentage: { type: Number },
    highestPackageLPA: { type: Number },
    averagePackageLPA: { type: Number },
    topRecruiters: [String]
  },
  ratings: {
    studentRating: { type: Number },
    facultyRating: { type: Number },
    reviewCount: { type: Number }
  },
  tags: [String],
  description: { type: String },
  notes: { type: String },
  sources: [String],

  // ✅ ADD EMBEDDING FIELD AT THE END
  embedding: {
    type: [Number], // stores array of embedding values
    default: []
  }

}, { timestamps: true });

const College = mongoose.model("College", collegeSchema);

export default College;
