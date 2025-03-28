'use client'

import { Button } from '@/components/ui/button'
import { ArrowDown } from 'lucide-react'
import { useEffect, useState } from 'react'

export function HeroSection() {
  const [isAnimating, setIsAnimating] = useState(false)
  
  useEffect(() => {
    setIsAnimating(true)
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  const scrollToForm = () => {
    const formElement = document.getElementById('ocm-form')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' })
    }
  }
  
  return (
    <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              VibeOCM: AI-Powered Organizational Change Management
            </h1>
            <p className="text-xl text-muted-foreground">
              Generate professional OCM artifacts in minutes, not weeks
            </p>
            <Button size="lg" onClick={scrollToForm} className="mt-4">
              Get Started <ArrowDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="md:w-1/2 relative h-[300px] md:h-[400px] bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`transition-all duration-1000 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <span className="text-primary text-xl font-bold">Input</span>
                  </div>
                  <div className="h-16 w-1 bg-primary/20"></div>
                  <div className="w-16 h-16 rounded-full bg-primary/50 flex items-center justify-center my-4">
                    <span className="text-primary text-xl font-bold">AI</span>
                  </div>
                  <div className="h-16 w-1 bg-primary/20"></div>
                  <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center mt-4">
                    <span className="text-white text-xl font-bold">OCM</span>
                  </div>
                </div>
              </div>
              
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                <div className="w-64 h-64 bg-gray-100 rounded-lg shadow-md p-4 flex flex-col">
                  <div className="text-lg font-bold mb-2">Change Management Plan</div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/6"></div>
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

