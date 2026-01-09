import express from "express"
import Razorpay from "razorpay"
import crypto from "crypto"

const router = express.Router()

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_YourTestKeyHere",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "YourTestSecretHere",
})

// Create order for payment
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", counsellorId, studentId } = req.body

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        counsellorId: counsellorId,
        studentId: studentId,
      },
    }

    const order = await razorpay.orders.create(options)

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    res.status(500).json({
      success: false,
      error: "Failed to create payment order",
    })
  }
})

// Verify payment signature
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    const sign = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "YourTestSecretHere")
      .update(sign.toString())
      .digest("hex")

    if (razorpay_signature === expectedSign) {
      res.json({
        success: true,
        message: "Payment verified successfully",
      })
    } else {
      res.status(400).json({
        success: false,
        error: "Invalid signature",
      })
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    res.status(500).json({
      success: false,
      error: "Payment verification failed",
    })
  }
})

export default router
