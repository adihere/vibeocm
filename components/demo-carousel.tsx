'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const demoSlides = [
  {
    title: "Enter Your OpenAI API Key",
    description: "Securely provide your OpenAI API key which is only stored in your browser for the current session.",
    image: "/placeholder.svg?height=400&width=600"
  },
  {
    title: "Describe Your Project Context",
    description: "Tell us about your change initiative, including objectives, scope, and stakeholders.",
    image: "/placeholder.svg?height=400&width=600"
  },
  {
    title: "Select OCM Deliverables",
    description: "Choose from a variety of OCM deliverables like change plans, communication strategies, and more.",
    image: "/placeholder.svg?height=400&width=600"
  },
  {
    title: "Review AI-Generated Content",
    description: "Get tailored OCM content based on your project context, ready to use or customize further.",
    image: "/placeholder.svg?height=400&width=600"
  }
]

export function DemoCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === demoSlides.length - 1 ? 0 : prev + 1))
  }
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? demoSlides.length - 1 : prev - 1))
  }
  
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="relative max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <CardContent className="p-0 relative">
          <div className="flex items-center">
            <div className="w-1/2 p-8">
              <h3 className="text-2xl font-bold mb-4">{demoSlides[currentSlide].title}</h3>
              <p className="text-gray-600">{demoSlides[currentSlide].description}</p>
            </div>
            <div className="w-1/2">
              <img 
                src={demoSlides[currentSlide].image || "/placeholder.svg"} 
                alt={demoSlides[currentSlide].title}
                className="w-full h-auto"
              />
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </CardContent>
      </Card>
      
      <div className="flex justify-center mt-4 gap-2">
        {demoSlides.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentSlide ? 'bg-primary' : 'bg-gray-300'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

