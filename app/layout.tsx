import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { PostHogClientProvider, PostHogPageview } from "@/components/providers/posthog-provider"
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
      <body className={inter.className}>
        <PostHogClientProvider>
          <PostHogPageview />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
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