"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Timing {
  time: string
  type: string
}

interface Batch {
  name: string
  dates: string
}

interface FeeStructure {
  weekday: string
  weekend: {
    oneMonth?: string
    twoMonths?: string
    regular?: string
  }
}

interface SportCardProps {
  sport: string
  image: string
  morningTimings: Timing[]
  eveningTimings: Timing[]
  batches: Batch[]
  feeStructure: FeeStructure
  equipment?: string[]
  additionalInfo?: string
}

export function SportCard({
  sport,
  image,
  morningTimings,
  eveningTimings,
  batches,
  feeStructure,
  equipment,
  additionalInfo,
}: SportCardProps) {
  const [selectedBatch, setSelectedBatch] = useState("")
  const [selectedTiming, setSelectedTiming] = useState("")
  const [selectedType, setSelectedType] = useState<"weekday" | "weekend">("weekday")
  const [selectedFee, setSelectedFee] = useState(feeStructure.weekday)
  const router = useRouter()

  const handleTypeChange = (value: "weekday" | "weekend") => {
    setSelectedType(value)
    if (value === "weekday") {
      setSelectedFee(feeStructure.weekday)
    } else if (value === "weekend") {
      if (sport === "Swimming") {
        setSelectedFee(feeStructure.weekend.oneMonth || "")
      } else {
        setSelectedFee(feeStructure.weekend.regular || "")
      }
    }
  }

  const handleRegister = () => {
    if (selectedTiming && selectedBatch && selectedType) {
      router.push(
        `/register?sport=${sport}&timing=${selectedTiming}&batch=${selectedBatch}&type=${selectedType}&fee=${selectedFee}`,
      )
    } else {
      alert("Please select batch, type, and timing before registering.")
    }
  }

  return (
    <Card className="w-full">
      <div className="relative h-64">
        <Image src={image || "/placeholder.svg"} alt={sport} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <CardHeader className="absolute bottom-0 left-0 right-0 text-white">
          <CardTitle className="text-2xl">{sport}</CardTitle>
        </CardHeader>
      </div>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${sport}-batch`}>Select Batch:</Label>
            <Select onValueChange={setSelectedBatch}>
              <SelectTrigger id={`${sport}-batch`}>
                <SelectValue placeholder="Choose a batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch, index) => (
                  <SelectItem key={index} value={batch.name}>
                    {batch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${sport}-type`}>Select Type:</Label>
            <Select onValueChange={(value) => handleTypeChange(value as "weekday" | "weekend")}>
              <SelectTrigger id={`${sport}-type`}>
                <SelectValue placeholder="Choose weekday or weekend" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekday">Weekday</SelectItem>
                <SelectItem value="weekend">Weekend</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {sport === "Swimming" && selectedType === "weekend" && (
            <div className="space-y-2">
              <Label htmlFor={`${sport}-weekend-duration`}>Select Weekend Duration:</Label>
              <Select onValueChange={(value) => setSelectedFee(value)}>
                <SelectTrigger id={`${sport}-weekend-duration`}>
                  <SelectValue placeholder="Choose duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={feeStructure.weekend.oneMonth || ""}>1 Month</SelectItem>
                  <SelectItem value={feeStructure.weekend.twoMonths || ""}>2 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor={`${sport}-timing`}>Select Timing:</Label>
            <Select onValueChange={setSelectedTiming}>
              <SelectTrigger id={`${sport}-timing`}>
                <SelectValue placeholder="Choose a timing" />
              </SelectTrigger>
              <SelectContent>
                {[...morningTimings, ...eveningTimings].map((timing, index) => (
                  <SelectItem key={index} value={timing.time}>
                    {timing.time} - {timing.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="font-semibold">Fee: ₹{selectedFee}</div>
          <Button onClick={handleRegister} className="w-full">
            Register for {sport}
          </Button>
        </div>

        <div className="mt-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="timings">
              <AccordionTrigger>Timings</AccordionTrigger>
              <AccordionContent className="relative">
                <div className="space-y-2">
                  <h4 className="font-semibold">Morning Sessions</h4>
                  {morningTimings.map((timing, index) => (
                    <p key={index}>
                      {timing.time} - {timing.type}
                    </p>
                  ))}
                  <h4 className="font-semibold mt-4">Evening Sessions</h4>
                  {eveningTimings.map((timing, index) => (
                    <p key={index}>
                      {timing.time} - {timing.type}
                    </p>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="batches">
              <AccordionTrigger>Batches</AccordionTrigger>
              <AccordionContent className="relative">
                {batches.map((batch, index) => (
                  <div key={index} className="mb-2">
                    <h4 className="font-semibold">{batch.name}</h4>
                    <p>{batch.dates}</p>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            {equipment && (
              <AccordionItem value="equipment">
                <AccordionTrigger>Equipment</AccordionTrigger>
                <AccordionContent className="relative">
                  <ul className="list-disc list-inside">
                    {equipment.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )}

            {additionalInfo && (
              <AccordionItem value="additionalInfo">
                <AccordionTrigger>Additional Information</AccordionTrigger>
                <AccordionContent className="relative">
                  <p>{additionalInfo}</p>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  )
}

