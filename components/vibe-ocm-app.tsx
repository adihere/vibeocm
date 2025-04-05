'use client'

import { useState, useRef } from 'react'
import { ApiProvider } from './vibe-ocm-single-page'
import { HeroSection } from '@/components/sections/hero-section'
import { ToolOverviewSection } from '@/components/sections/tool-overview-section'
import { HowItWorksSection } from '@/components/sections/how-it-works-section'
import { InputFormSection } from '@/components/sections/input-form-section'
import { ArtifactGenerationSection } from '@/components/sections/artifact-generation-section'
import { ResultsSection } from '@/components/sections/results-section'
import { RefinementSection } from '@/components/sections/refinement-section'

// Define the types for our form data
import { AuthMethod } from './vibe-ocm-single-page'

export interface ProjectData {
  // Project Basics
  name: string
  goal: string
  startDate: string
  endDate: string
  
  // Stakeholders
  stakeholders: { role: string; impact: string }[]
  impactedUsers: number
  
  // Benefits & Challenges
  orgBenefits: string
  userBenefits: string
  challenges: string
  // API Configuration
  apiKey: string
  apiProvider: ApiProvider
  authMethod: AuthMethod
}

// Define the possible workflow steps
export type WorkflowStep = 
  'project-basics' | 
  'stakeholders' | 
  'benefits' | 
  'artifact-selection' | 
  'result' | 
  'refinement'

export function VibeOCMApp() {
  // Refs for scrolling to sections
  const formSectionRef = useRef<HTMLDivElement>(null)
  const resultsSectionRef = useRef<HTMLDivElement>(null)
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('project-basics')
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    goal: '',
    startDate: '',
    endDate: '',
    stakeholders: [{ role: '', impact: '' }],
    impactedUsers: 0,
    orgBenefits: '',
    userBenefits: '',
    challenges: '',
    apiKey: '',
    apiProvider: 'OPENAI',
    authMethod: ''
  })
  const [selectedArtifact, setSelectedArtifact] = useState<string>('')
  const [generatedContent, setGeneratedContent] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [refinementHistory, setRefinementHistory] = useState<string[]>([])
  
  // Function to scroll to form section
  const scrollToForm = () => {
    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }
  
  // Function to scroll to results section
  const scrollToResults = () => {
    if (resultsSectionRef.current) {
      resultsSectionRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }
  
  // Handler for project basics form submission
  const handleProjectBasicsSubmit = (data: Partial<ProjectData>) => {
    setProjectData(prev => ({ ...prev, ...data }))
    setCurrentStep('stakeholders')
  }
  
  // Handler for stakeholders form submission
  const handleStakeholdersSubmit = (data: Partial<ProjectData>) => {
    setProjectData(prev => ({ ...prev, ...data }))
    setCurrentStep('benefits')
  }
  
  // Handler for benefits form submission
  const handleBenefitsSubmit = (data: Partial<ProjectData>) => {
    setProjectData(prev => ({ ...prev, ...data }))
    setCurrentStep('artifact-selection')
  }
  
  // Handler for artifact selection
  const handleArtifactSelect = async (artifact: string) => {
    setSelectedArtifact(artifact)
    setIsGenerating(true)
    
    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate sample content based on the selected artifact and project data
      const content = generateSampleContent(artifact, projectData)
      setGeneratedContent(content)
      setRefinementHistory([content])
      setCurrentStep('result')
      
      // Scroll to results section
      setTimeout(() => scrollToResults(), 100)
    } catch (error) {
      console.error('Error generating artifact:', error)
    } finally {
      setIsGenerating(false)
    }
  }
  
  // Handler for refinement submission
  const handleRefinementSubmit = async (feedback: string, focus: string[]) => {
    setIsGenerating(true)
    
    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate refined content based on feedback
      const refinedContent = `${generatedContent}\n\n[Refined based on feedback: ${feedback}]\n\nFocus areas: ${focus.join(', ')}`
      setGeneratedContent(refinedContent)
      setRefinementHistory(prev => [...prev, refinedContent])
      setCurrentStep('result')
      
      // Scroll to results section
      setTimeout(() => scrollToResults(), 100)
    } catch (error) {
      console.error('Error refining content:', error)
    } finally {
      setIsGenerating(false)
    }
  }
  
  // Function to go to refinement step
  const goToRefinement = () => {
    setCurrentStep('refinement')
    // Scroll to results section where refinement UI will be shown
    setTimeout(() => scrollToResults(), 100)
  }
  
  // Function to go back to previous step
  const goBack = () => {
    switch (currentStep) {
      case 'stakeholders':
        setCurrentStep('project-basics')
        break
      case 'benefits':
        setCurrentStep('stakeholders')
        break
      case 'artifact-selection':
        setCurrentStep('benefits')
        break
      case 'refinement':
        setCurrentStep('result')
        break
      default:
        break
    }
  }
  
  // Function to reset workflow
  const resetWorkflow = () => {
    setCurrentStep('project-basics')
    setSelectedArtifact('')
    setGeneratedContent('')
    setRefinementHistory([])
    // Scroll back to form section
    setTimeout(() => scrollToForm(), 100)
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-white p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">VibeOCM</h1>
          <p className="mt-2">AI-Powered Organizational Change Management</p>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection onGetStarted={scrollToForm} />
        
        {/* Tool Overview Section */}
        <ToolOverviewSection />
        
        {/* How It Works Section */}
        <HowItWorksSection />
        
        {/* Input Form Section */}
        <div ref={formSectionRef}>
          <InputFormSection 
            currentStep={currentStep}
            projectData={projectData}
            onProjectBasicsSubmit={handleProjectBasicsSubmit}
            onStakeholdersSubmit={handleStakeholdersSubmit}
            onBenefitsSubmit={handleBenefitsSubmit}
            onBack={goBack}
          />
        </div>
        
        {/* Artifact Generation Section - Only shown when on artifact-selection step */}
        {currentStep === 'artifact-selection' && (
          <ArtifactGenerationSection 
            onSelect={handleArtifactSelect}
            isGenerating={isGenerating}
            onBack={goBack}
            onFeelingLazy={() => handleArtifactSelect('Change Management Plan')}
            projectData={projectData}
          />
        )}
        
        {/* Results Section - Only shown when on result step */}
        {(currentStep === 'result' || currentStep === 'refinement') && (
          <div ref={resultsSectionRef}>
            {currentStep === 'result' ? (
              <ResultsSection 
                content={generatedContent}
                artifactType={selectedArtifact}
                onRefine={goToRefinement}
                onReset={resetWorkflow}
                isLoading={isGenerating}
              />
            ) : (
              <RefinementSection 
                content={generatedContent}
                history={refinementHistory}
                onSubmit={handleRefinementSubmit}
                onBack={goBack}
                isSubmitting={isGenerating}
              />
            )}
          </div>
        )}
      </main>
      
      <footer className="bg-gray-900 text-white p-6 mt-20">
        <div className="container mx-auto">
          <p className="text-center">© 2024 VibeOCM. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

// Helper function to generate sample content
function generateSampleContent(artifactType: string, data: ProjectData): string {
  const { name, goal, startDate, endDate, stakeholders, challenges } = data
  
  switch (artifactType) {
    case 'Change Management Plan':
      return `# Change Management Plan for ${name}

## Executive Summary
This change management plan outlines the approach for implementing ${name}. The primary goal is to ${goal}.

## Project Timeline
- Start Date: ${startDate}
- End Date: ${endDate}

## Stakeholder Analysis
${stakeholders.map(s => `- **${s.role}**: ${s.impact}`).join('\n')}

## Anticipated Challenges
${challenges}

## Change Strategy
Based on the project context and stakeholders involved, we recommend a phased approach to implementing this change:

1. **Awareness Phase** (Weeks 1-2)
   - Communicate the vision and reasons for change
   - Address initial concerns and questions

2. **Understanding Phase** (Weeks 3-4)
   - Provide detailed information about what will change
   - Conduct impact assessments for each stakeholder group

3. **Adoption Phase** (Weeks 5-8)
   - Deliver training and support
   - Implement feedback mechanisms

4. **Reinforcement Phase** (Weeks 9-12)
   - Celebrate quick wins
   - Address ongoing concerns
   - Monitor adoption metrics

## Success Metrics
- Adoption rate: Target 80% by end of month 2
- Stakeholder satisfaction: Target 75% positive feedback
- Business impact: [Specific metrics related to project goals]`;

    case 'Communication Plan':
      return `# Communication Plan for ${name}

## Communication Objectives
- Ensure all stakeholders understand the why, what, and how of ${name}
- Build awareness and desire for the change
- Address concerns proactively
- Provide regular updates on progress

## Key Messages
1. **Why we're making this change**: ${goal}
2. **How it benefits the organization**: [Benefits to organization]
3. **How it benefits individuals**: [Benefits to users]
4. **Timeline and what to expect**: From ${startDate} to ${endDate}

## Audience Segmentation
${stakeholders.map((s, i) => `### ${s.role}\n- **Impact Level**: ${s.impact}\n- **Key Concerns**: [Anticipated concerns]\n- **Communication Needs**: [Specific information needs]`).join('\n\n')}

## Communication Channels
- Town halls and all-hands meetings
- Email updates
- Intranet/portal announcements
- Team meetings
- One-on-one conversations
- Training sessions

## Communication Timeline
- **Pre-change (${startDate})**: Focus on building awareness
- **During change**: Focus on providing support and addressing concerns
- **Post-change**: Focus on reinforcement and celebration

## Feedback Mechanisms
- Surveys after key milestones
- Focus groups with representative stakeholders
- Anonymous feedback channels
- Regular check-ins with team leads`;

    default:
      return `# ${artifactType} for ${name}

## Overview
This document provides a framework for ${artifactType.toLowerCase()} related to the ${name} project.

## Project Context
${goal}

## Timeline
- Start Date: ${startDate}
- End Date: ${endDate}

## Key Stakeholders
${stakeholders.map(s => `- ${s.role}`).join('\n')}

## Challenges and Considerations
${challenges}

## Next Steps
1. Review this document with the project team
2. Gather feedback from key stakeholders
3. Refine and finalize the approach
4. Implement and monitor progress`;
  }
}

