import { NextResponse } from "next/server"

/**
 * API route that provides PostHog configuration
 * This keeps the actual key on the server side
 */
export async function GET() {
  // Only return a masked/hashed version of the key for verification purposes
  // The actual initialization will happen through a secure mechanism
  return NextResponse.json({
    enabled: !!process.env.POSTHOG_KEY,
    host: process.env.POSTHOG_HOST,
    // We don't return the actual key, just whether it's configured
  })
}

