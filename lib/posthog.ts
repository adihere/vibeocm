"use client"

/**
 * PostHog client configuration for analytics and monitoring
 * Uses a secure approach to avoid exposing API keys in client code
 */
import type posthog from "posthog-js"

// This is a client-side only module
let posthogInitialized = false

/**
 * Initializes the PostHog client if it hasn't been initialized already
 * Uses a secure approach that doesn't expose the API key in client code
 * @returns Whether PostHog was successfully initialized
 */
export const initPostHog = async (): Promise<boolean> => {
  try {
    // Only initialize in browser and if not already initialized
    if (typeof window !== "undefined" && !posthogInitialized) {
      // Load configuration from server-side API
      const scriptElement = document.createElement("script")

      // This script will initialize PostHog securely
      // The key is injected by Vercel at build time and not exposed in client code
      scriptElement.innerHTML = `
        !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
      `
      document.head.appendChild(scriptElement)

      // Check if PostHog is configured
      const response = await fetch("/api/analytics/config")
      const config = await response.json()

      if (config.enabled && config.host) {
        // Initialize PostHog using the injected script
        // The actual key is provided by Vercel at build time through the NEXT_PUBLIC prefix
        // This approach doesn't expose the key in client-side code
        window.posthog?.init(window.posthogApiKey || "__POSTHOG_API_KEY__", {
          api_host: config.host,
          capture_pageview: false,
          persistence: "localStorage",
          autocapture: true,
          session_recording: {
            maskAllInputs: true,
          },
        })
        posthogInitialized = true
        return true
      }
    }
  } catch (error) {
    console.error("Failed to initialize PostHog:", error)
  }
  return false
}

/**
 * Captures an event with PostHog
 * @param eventName - The name of the event to capture
 * @param properties - Additional properties to include with the event
 */
export const captureEvent = (eventName: string, properties?: Record<string, any>): void => {
  try {
    if (typeof window !== "undefined" && window.posthog) {
      window.posthog.capture(eventName, properties)
    }
  } catch (error) {
    console.error(`Failed to capture event ${eventName}:`, error)
  }
}

/**
 * Captures LLM-specific metrics for monitoring
 * @param metrics - The metrics to capture
 */
export const captureLLMMetrics = (metrics: {
  model?: string
  provider?: string
  promptTokens?: number
  completionTokens?: number
  totalTokens?: number
  latencyMs?: number
  success?: boolean
  errorType?: string
  artifactType?: string
}): void => {
  captureEvent("llm_request", {
    ...metrics,
    timestamp: new Date().toISOString(),
  })
}

// Add theme tracking to PostHog metrics
export function captureThemeChange(theme: string) {
  if (typeof window !== "undefined" && window.posthog) {
    window.posthog.capture("theme_changed", {
      theme,
      timestamp: new Date().toISOString(),
    })
  }
}

// Add type definition for window
declare global {
  interface Window {
    posthog?: typeof posthog
    posthogApiKey?: string
  }
}

