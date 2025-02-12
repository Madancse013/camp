"use client"
import React, { Suspense } from 'react';
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Confetti } from "@/components/ui/confetti";

// A fallback component to show while waiting for Suspense to resolve
const SuspenseFallback = () => <div>Loading...</div>;

export default function ConfirmationPage() {
  return (
    // Wrap the component with Suspense and provide a fallback
    <Suspense fallback={<SuspenseFallback />}>
      <ConfirmationContent />
    </Suspense>
  );
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sport = searchParams.get("sport") || "";
  const batch = searchParams.get("batch") || "";
  const timing = searchParams.get("timing") || "";
  const level = searchParams.get("level") || "";

  // Calculate the start date (assuming it's always the first day of the batch)
  const batchStartDate = new Date("2025-06-01"); // Example start date for summer camp 2025

  const handleBackToHome = () => {
    router.push("/");
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <Confetti />
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-xl text-center">Congratulations! You are now part of the 2025 Summer Camp!</p>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Your Registration Details:</h3>
            <p>
              <strong>Sport:</strong> {sport}
            </p>
            <p>
              <strong>Batch:</strong> {batch}
            </p>
            <p>
              <strong>Timing:</strong> {timing}
            </p>
            <p>
              <strong>Level:</strong> {level}
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">Your batch starts on:</p>
            <p className="text-xl text-primary">{batchStartDate.toDateString()}</p>
          </div>
          <div className="text-center">
            <p className="italic">We're excited to have you join us for an amazing summer of sports and fun!</p>
          </div>
          <div className="text-center">
            <Button onClick={handleBackToHome}>Back to Home</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
