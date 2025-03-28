import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    trialAvailable: !!process.env.DEFAULT_MISTRAL_API_KEY && process.env.DEFAULT_MISTRAL_API_KEY.trim() !== "",
  })
}

