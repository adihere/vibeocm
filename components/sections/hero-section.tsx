"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import { useEffect, useState } from "react"

interface HeroSectionProps {
  onGetStarted: () => void
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const [animationStep, setAnimationStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 4)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-20 bg-gradient-to-b from-primary/10 to-background min-h-[calc(100vh-64px)] flex items-center">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              VibeOCM: AI-Powered Organizational Change Management
            </h1>
            <p className="text-xl text-muted-foreground">Generate professional OCM artifacts in minutes, not weeks</p>
            <Button size="lg" onClick={onGetStarted} className="mt-4">
              Begin <ArrowDown className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="md:w-1/2 relative h-[300px] md:h-[400px] bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full p-8">
                <div className="relative h-full">
                  {/* Input Form */}
                  <div
                    className={`absolute top-0 left-0 w-full transition-all duration-1000 ${animationStep === 0 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}
                  >
                    <div className="bg-gray-100 rounded-lg p-4 shadow-md">
                      <div className="h-6 bg-primary/20 rounded w-1/2 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-8 bg-primary/40 rounded w-1/4 mt-3"></div>
                    </div>
                  </div>

                  {/* AI Processing */}
                  <div
                    className={`absolute top-1/3 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ${animationStep === 1 ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
                  >
                    <div className="w-20 h-20 rounded-full bg-primary/30 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/50 flex items-center justify-center animate-pulse">
                        <span className="text-primary font-bold">AI</span>
                      </div>
                    </div>
                  </div>

                  {/* OCM Document */}
                  <div
                    className={`absolute bottom-0 right-0 w-3/4 transition-all duration-1000 ${animationStep === 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                  >
                    <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
                      <div className="h-6 bg-primary/80 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/5 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>

                  {/* Final Result */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${animationStep === 3 ? "opacity-100" : "opacity-0"}`}
                  >
                    <div className="text-center">
                      <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                        <svg
                          className="h-12 w-12 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold mb-2">OCM Artifact Ready!</h3>
                      <p className="text-muted-foreground">Your professional document is ready to use</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

