"use client"

import posthog from 'posthog-js'

// Initialize PostHog only on the client side and when in production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    loaded: function(posthog) {
      // Add any post-load configuration here
    },
    autocapture: false, // Disable autocapture if you want to manually control events
  })
}

/**
 * Safely capture events in PostHog
 * @param eventName - Name of the event to capture
 * @param properties - Optional properties to include with the event
 */
export const captureEvent = (eventName: string, properties?: Record<string, any>) => {
  try {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      posthog?.capture?.(eventName, properties)
    } else {
      // In development, just log to console
      console.log('[DEV] PostHog Event:', eventName, properties)
    }
  } catch (error) {
    // Silently fail in case of PostHog errors to not disrupt the application
    console.error('PostHog event capture failed:', error)
  }
}

// Export posthog instance for direct access if needed
export const analytics = posthog

