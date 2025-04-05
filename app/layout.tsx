import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { PostHogClientProvider } from "@/components/providers/posthog-provider"
import Script from "next/script"
// Import the ThemeToggle components
import { ThemeToggle } from "@/components/theme-toggle"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "VibeOCM - AI-Powered Organizational Change Management",
  description: "Generate professional OCM artifacts in minutes, not weeks",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inject PostHog key securely at build time */}
        <Script id="posthog-key" strategy="beforeInteractive">
          {`window.posthogApiKey = "${process.env.POSTHOG_KEY || ""}";`}
        </Script>
        <Script
          id="posthog-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
                posthog.init('${process.env.NEXT_PUBLIC_POSTHOG_KEY}', {
                  api_host: '${process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com"}',
                });
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <PostHogClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {/* Add a header with theme toggle */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center justify-between">
                <div className="mr-4 flex">
                  <a href="/" className="flex items-center space-x-2">
                    <span className="font-bold text-lg">VibeOCM</span>
                  </a>
                </div>
                <nav className="flex items-center space-x-4">
                  <a href="/blog" className="text-sm font-medium transition-colors hover:text-primary">
                    Blog
                  </a>
                  <ThemeToggle />
                </nav>
              </div>
            </header>
            {children}
          </ThemeProvider>
        </PostHogClientProvider>
      </body>
    </html>
  )
}



import './globals.css'