'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ApiKeyForm } from '@/components/api-key-form'
import { ProjectContextForm } from '@/components/project-context-form'
import { DeliverableSelector } from '@/components/deliverable-selector'
import { ResultDisplay } from '@/components/result-display'
import { useToast } from '@/hooks/use-toast'

type WorkflowStep = 'api-key' | 'project-context' | 'deliverable-selection' | 'result'

export function OCMWorkflow() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('api-key')
  const [apiKey, setApiKey] = useState<string>('')
  const [projectContext, setProjectContext] = useState<string>('')
  const [selectedDeliverable, setSelectedDeliverable] = useState<string>('')
  const [generatedContent, setGeneratedContent] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()
  
  const handleApiKeySubmit = (key: string) => {
    setApiKey(key)
    setCurrentStep('project-context')
  }
  
  const handleProjectContextSubmit = (context: string) => {
    setProjectContext(context)
    setCurrentStep('deliverable-selection')
  }
  
  const handleDeliverableSelect = async (deliverable: string) => {
    setSelectedDeliverable(deliverable)
    setIsGenerating(true)
    
    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate sample content
      const content = `# ${deliverable} for ${projectContext.split(' ').slice(0, 3).join(' ')}...

## Executive Summary
This document outlines the approach for managing the organizational change related to the project described.

## Objectives
- Ensure smooth transition
- Minimize resistance
- Maximize adoption

## Stakeholders
- Leadership team
- Employees
- Customers
- Partners

## Timeline
- Planning phase: 2 weeks
- Implementation phase: 6 weeks
- Evaluation phase: 2 weeks

## Communication Strategy
Regular updates will be provided through multiple channels to ensure all stakeholders are informed.

## Training Plan
Comprehensive training will be provided to all affected employees.

## Success Metrics
- Adoption rate
- Productivity impact
- User satisfaction`;
      
      setGeneratedContent(content)
      setCurrentStep('result')
    } catch (error) {
      console.error('Error generating deliverable:', error)
      toast({
        title: "Error generating content",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }
  
  const resetWorkflow = () => {
    setCurrentStep('api-key')
    setProjectContext('')
    setSelectedDeliverable('')
    setGeneratedContent('')
    // We keep the API key for convenience
  }
  
  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="p-6">
        {currentStep === 'api-key' && (
          <ApiKeyForm onSubmit={handleApiKeySubmit} />
        )}
        
        {currentStep === 'project-context' && (
          <ProjectContextForm onSubmit={handleProjectContextSubmit} />
        )}
        
        {currentStep === 'deliverable-selection' && (
          <DeliverableSelector 
            onSelect={handleDeliverableSelect}
            isGenerating={isGenerating}
          />
        )}
        
        {currentStep === 'result' && (
          <ResultDisplay 
            content={generatedContent} 
            deliverableType={selectedDeliverable}
            onReset={resetWorkflow}
          />
        )}
      </CardContent>
    </Card>
  )
}

