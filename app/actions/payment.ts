

import Razorpay from "razorpay"
import mysql from "mysql2/promise"
import crypto from "crypto"

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// Database connection
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "sports_registration",
}

// Validate payment details
function validatePaymentDetails(paymentDetails: any) {
  const requiredFields = ["method", "email", "contact", "amount", "currency"]
  const missingFields = requiredFields.filter((field) => !paymentDetails[field])

  if (missingFields.length > 0) {
    throw new Error(`Missing required payment details: ${missingFields.join(", ")}`)
  }
}

export async function createOrder(amount: number, registrationData: any) {
  // Test database connection
  try {
    const connection = await mysql.createConnection(dbConfig)
    await connection.ping()
    console.log("Database connection successful")
    await connection.end()
  } catch (dbError) {
    console.error("Database connection failed:", dbError)
    throw new Error("Database connection failed")
  }

  try {
    const orderOptions = {
      amount: amount * 100, // Razorpay expects amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    }

    const order = await razorpay.orders.create(orderOptions)
    console.log("Razorpay order created:", order)

    // Store registration data in database
    const connection = await mysql.createConnection(dbConfig)
    console.log("Inserting registration data into database:", registrationData)
    const [result] = await connection.execute(
      `INSERT INTO registrations (
        order_id, 
        sport, 
        child_name, 
        father_name, 
        mother_name, 
        address, 
        phone_number, 
        emergency_phone_number, 
        child_standard, 
        medical_conditions, 
        gender, 
        batch, 
        timing, 
        type, 
        fee, 
        payment_status,
        razorpay_order_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order.id,
        registrationData.sport,
        registrationData.childName,
        registrationData.fatherName,
        registrationData.motherName,
        registrationData.address,
        registrationData.phoneNumber,
        registrationData.emergencyPhoneNumber,
        registrationData.childStandard,
        registrationData.medicalConditions,
        registrationData.gender,
        registrationData.batch,
        registrationData.timing,
        registrationData.type,
        registrationData.fee,
        "pending",
        order.id,
      ],
    )
    console.log("Registration data inserted successfully")
    await connection.end()

    return { orderId: order.id }
  } catch (error) {
    console.error("Error creating order:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to create order: ${error.message}`)
    } else {
      throw new Error("Failed to create order: Unknown error")
    }
  }
}

export async function verifyPayment(orderId: string, paymentId: string, signature: string, paymentDetails: any) {
  console.log("Starting payment verification for order:", orderId)
  console.log("Payment details received:", paymentDetails)

  let connection

  try {
    // Validate payment details first
    validatePaymentDetails(paymentDetails)

    connection = await mysql.createConnection(dbConfig)
    await connection.beginTransaction()

    // First, update the payment details
    const [updateResult] = await connection.execute(
      `UPDATE registrations SET 
        payment_id = ?,
        razorpay_payment_id = ?,
        razorpay_signature = ?,
        payment_method = ?,
        payment_email = ?,
        payment_contact = ?,
        payment_amount = ?,
        payment_currency = ?,
        payment_date = NOW(),
        payment_verification_status = 'processing'
      WHERE razorpay_order_id = ?`,
      [
        paymentId,
        paymentId,
        signature,
        paymentDetails.method,
        paymentDetails.email,
        paymentDetails.contact,
        paymentDetails.amount / 100,
        paymentDetails.currency,
        orderId,
      ],
    )

    if ((updateResult as any).affectedRows === 0) {
      throw new Error(`No registration found for order_id: ${orderId}`)
    }

    // Verify payment signature
    const body = orderId + "|" + paymentId
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex")

    console.log("Signature verification:", {
      expected: expectedSignature,
      received: signature,
    })

    const isAuthentic = expectedSignature === signature

    if (isAuthentic) {
      console.log("Signature verified successfully")

      // Update verification status to success
      await connection.execute(
        `UPDATE registrations SET 
          payment_status = 'completed',
          payment_verification_status = 'success',
          verification_error = NULL
        WHERE razorpay_order_id = ?`,
        [orderId],
      )

      await connection.commit()
      return true
    } else {
      console.error("Signature verification failed")

      await connection.execute(
        `UPDATE registrations SET 
          payment_verification_status = 'failed',
          verification_error = ?
        WHERE razorpay_order_id = ?`,
        ["Signature verification failed", orderId],
      )

      await connection.commit()
      return false
    }
  } catch (error) {
    console.error("Error in payment verification:", error)

    if (connection) {
      try {
        await connection.rollback()

        // Log the error in the database
        await connection.execute(
          `UPDATE registrations SET 
            payment_verification_status = 'error',
            verification_error = ?
          WHERE razorpay_order_id = ?`,
          [error instanceof Error ? error.message : "Unknown error", orderId],
        )

        await connection.commit()
      } catch (dbError) {
        console.error("Error updating verification status:", dbError)
      }
    }

    throw new Error(error instanceof Error ? error.message : "Unknown error in payment verification")
  } finally {
    if (connection) {
      try {
        await connection.end()
      } catch (error) {
        console.error("Error closing database connection:", error)
      }
    }
  }
}

