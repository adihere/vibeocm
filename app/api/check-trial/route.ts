import { NextResponse } from "next/server"

export async function GET() {
  // Check if the DEFAULT_MISTRAL_API_KEY environment variable is set
  const trialAvailable = !!process.env.DEFAULT_MISTRAL_API_KEY && process.env.DEFAULT_MISTRAL_API_KEY.trim() !== ""

  return NextResponse.json({
    available: trialAvailable,
    message: trialAvailable ? "Trial mode is available" : "Trial mode is not available",
  })
}

