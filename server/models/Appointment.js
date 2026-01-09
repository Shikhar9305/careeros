import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    counsellorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    counsellorName: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    sessionType: {
      type: String,
      enum: ["video", "phone"],
      required: true,
    },
    message: { type: String },
    amount: { type: Number, required: true },
    paymentId: { type: String },
    orderId: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded", "failed"],
      default: "pending",
    },
  },
  { timestamps: true },
)

export default mongoose.model("Appointment", appointmentSchema)
