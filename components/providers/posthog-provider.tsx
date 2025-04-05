'use client'

import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { env } from '@/config/env'

// Only initialize PostHog on the client side
if (typeof window !== 'undefined' && !window.location.host.includes('localhost')) {
  posthog.init(env.posthogKey, {
    api_host: env.posthogHost,
    loaded: (posthog) => {
      if (env.isDevelopment) posthog.debug()
    },
    capture_pageview: false,
    autocapture: false
  })
}

export function PostHogPageview(): JSX.Element {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && typeof window !== 'undefined') {
      let url = window.origin + pathname
      if (searchParams?.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      // Only capture in production
      if (!window.location.host.includes('localhost')) {
        posthog?.capture('$pageview', {
          $current_url: url,
        })
      }
    }
  }, [pathname, searchParams])

  return <></>
}

export function PostHogClientProvider({ children }: { children: React.ReactNode }) {
  if (typeof window !== 'undefined' && window.location.host.includes('localhost')) {
    return <>{children}</>
  }
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

