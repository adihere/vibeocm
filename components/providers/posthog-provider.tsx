"use client"

import type React from "react"

import { useEffect } from "react"
import { PostHogProvider } from "posthog-js/react"
import posthog from "posthog-js"
import { initPostHog } from "@/lib/posthog"

export function PostHogClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Initialize PostHog on the client side
    initPostHog()
  }, [])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

