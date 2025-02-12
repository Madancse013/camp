"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createOrder, verifyPayment } from "../actions/payment"
import Script from "next/script"
import React, { Suspense } from "react"

// Fallback component for Suspense
const SuspenseFallback = () => <div>Loading...</div>

export default function RegisterPage() {
  return (
    // Wrap the RegisterForm component inside Suspense with a fallback UI
    <Suspense fallback={<SuspenseFallback />}>
      <RegisterForm />
    </Suspense>
  )
}

function RegisterForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialParamsLoaded = useRef(false)
  const [formData, setFormData] = useState({
    childName: "",
    fatherName: "",
    motherName: "",
    address: "",
    phoneNumber: "",
    emergencyPhoneNumber: "",
    childStandard: "",
    medicalConditions: "",
    gender: "",
    sport: "",
    timing: "",
    batch: "",
    type: "",
    fee: "",
    email: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!initialParamsLoaded.current) {
      const sport = searchParams.get("sport") || ""
      const timing = searchParams.get("timing") || ""
      const batch = searchParams.get("batch") || ""
      const type = searchParams.get("type") || ""
      const fee = searchParams.get("fee") || ""

      setFormData((prevData) => ({
        ...prevData,
        sport,
        timing,
        batch,
        type,
        fee,
      }))

      initialParamsLoaded.current = true
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Create Razorpay order
      const { orderId } = await createOrder(Number.parseInt(formData.fee), formData)

      // Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Number.parseInt(formData.fee) * 100,
        currency: "INR",
        name: "Sports Registration",
        description: `Registration for ${formData.sport}`,
        order_id: orderId,
        prefill: {
          name: formData.childName,
          email: formData.email,
          contact: formData.phoneNumber,
        },
        handler: async (response: any) => {
          try {
            // Extract all necessary details from the response
            const paymentDetails = {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              method: "card", // Default to card if not provided
              email: formData.email, // Use email from form data
              contact: formData.phoneNumber, // Use phone from form data
              amount: options.amount,
              currency: options.currency,
            }

            console.log("Payment details being sent to verification:", paymentDetails)

            const verified = await verifyPayment(
              paymentDetails.orderId,
              paymentDetails.paymentId,
              paymentDetails.signature,
              {
                method: paymentDetails.method,
                email: paymentDetails.email,
                contact: paymentDetails.contact,
                amount: paymentDetails.amount,
                currency: paymentDetails.currency,
              },
            )

            if (verified) {
              const confirmationParams = new URLSearchParams({
                sport: formData.sport,
                batch: formData.batch,
                timing: formData.timing,
                level: formData.type,
              }).toString()
              router.push(`/confirmation?${confirmationParams}`)
            } else {
              setError("Payment verification failed. Please contact support.")
            }
          } catch (error) {
            console.error("Payment verification error:", error)
            if (error instanceof Error) {
              setError(`Payment verification failed: ${error.message}`)
            } else {
              setError("Payment verification failed. Please try again or contact support.")
            }
          }
        },
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.open()
    } catch (error) {
      console.error("Payment initiation error:", error)
      if (error instanceof Error) {
        setError(`Failed to initiate payment: ${error.message}`)
      } else {
        setError("Failed to initiate payment. Please try again or contact support.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/")
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold">Registration Form</CardTitle>
                <CardDescription>Please fill in all the required information</CardDescription>
              </div>
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[700px] pr-4">
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                  >
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}
                {/* Form content goes here */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Complete Registration"}
                </Button>
              </form>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
