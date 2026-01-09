import express from "express"
import Appointment from "../models/Appointment.js"

const router = express.Router()

// Book a new appointment
router.post("/book", async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      studentEmail,
      counsellorId,
      counsellorName,
      date,
      time,
      sessionType,
      message,
      amount,
      paymentId,
      orderId,
      status,
      paymentStatus,
    } = req.body

    const appointment = new Appointment({
      studentId,
      studentName,
      studentEmail,
      counsellorId,
      counsellorName,
      date,
      time,
      sessionType,
      message,
      amount,
      paymentId,
      orderId,
      status: status || "confirmed",
      paymentStatus: paymentStatus || "paid",
    })

    await appointment.save()

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    })
  } catch (error) {
    console.error("Error booking appointment:", error)
    res.status(500).json({
      success: false,
      error: "Failed to book appointment",
    })
  }
})

// Get appointments for a student
router.get("/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params
    const appointments = await Appointment.find({ studentId }).sort({ createdAt: -1 })

    res.json(appointments)
  } catch (error) {
    console.error("Error fetching student appointments:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch appointments",
    })
  }
})

// Get appointments for a counsellor
router.get("/counsellor/:counsellorId", async (req, res) => {
  try {
    const { counsellorId } = req.params
    const appointments = await Appointment.find({ counsellorId }).sort({ createdAt: -1 })

    res.json(appointments)
  } catch (error) {
    console.error("Error fetching counsellor appointments:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch appointments",
    })
  }
})

// Update appointment status
router.put("/:appointmentId/status", async (req, res) => {
  try {
    const { appointmentId } = req.params
    const { status } = req.body

    const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status }, { new: true })

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      })
    }

    res.json({
      success: true,
      message: "Appointment status updated",
      appointment,
    })
  } catch (error) {
    console.error("Error updating appointment:", error)
    res.status(500).json({
      success: false,
      error: "Failed to update appointment",
    })
  }
})

// Get single appointment
router.get("/:appointmentId", async (req, res) => {
  try {
    const { appointmentId } = req.params
    const appointment = await Appointment.findById(appointmentId)

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
      })
    }

    res.json(appointment)
  } catch (error) {
    console.error("Error fetching appointment:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch appointment",
    })
  }
})

export default router
