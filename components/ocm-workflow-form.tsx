'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ProjectBasicsForm } from '@/components/form-steps/project-basics-form'
import { StakeholdersForm } from '@/components/form-steps/stakeholders-form'
import { BenefitsForm } from '@/components/form-steps/benefits-form'
import { ArtifactSelector } from '@/components/artifact-selector'
import { ResultDisplay } from '@/components/result-display'
import { RefinementInterface } from '@/components/refinement-interface'

type WorkflowStep = 'project-basics' | 'stakeholders' | 'benefits' | 'artifact-selection' | 'result' | 'refinement'

interface ProjectData {
  name: string
  goal: string
  startDate: string
  endDate: string
  stakeholders: { role: string; impact: string }[]
  impactedUsers: number
  orgBenefits: string
  userBenefits: string
  challenges: string
}

export function OCMWorkflowForm() {
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
    challenges: ''
  })
  const [selectedArtifact, setSelectedArtifact] = useState<string>('')
  const [generatedContent, setGeneratedContent] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [refinementHistory, setRefinementHistory] = useState<string[]>([])
  
  const handleProjectBasicsSubmit = (data: Partial<ProjectData>) => {
    setProjectData(prev => ({ ...prev, ...data }))
    setCurrentStep('stakeholders')
  }
  
  const handleStakeholdersSubmit = (data: Partial<ProjectData>) => {
    setProjectData(prev => ({ ...prev, ...data }))
    setCurrentStep('benefits')
  }
  
  const handleBenefitsSubmit = (data: Partial<ProjectData>) => {
    setProjectData(prev => ({ ...prev, ...data }))
    setCurrentStep('artifact-selection')
  }
  
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
    } catch (error) {
      console.error('Error generating artifact:', error)
    } finally {
      setIsGenerating(false)
    }
  }
  
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
    } catch (error) {
      console.error('Error refining content:', error)
    } finally {
      setIsGenerating(false)
    }
  }
  
  const goToRefinement = () => {
    setCurrentStep('refinement')
  }
  
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
  
  const resetWorkflow = () => {
    setCurrentStep('project-basics')
    setSelectedArtifact('')
    setGeneratedContent('')
    setRefinementHistory([])
  }
  
  return (
    <section className="py-20" id="ocm-form">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Create Your OCM Artifacts</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Fill in the details about your project to generate tailored OCM artifacts.
          </p>
        </div>
        
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            {currentStep === 'project-basics' && (
              <ProjectBasicsForm 
                initialData={projectData} 
                onSubmit={handleProjectBasicsSubmit} 
              />
            )}
            
            {currentStep === 'stakeholders' && (
              <StakeholdersForm 
                initialData={projectData} 
                onSubmit={handleStakeholdersSubmit} 
                onBack={goBack}
              />
            )}
            
            {currentStep === 'benefits' && (
              <BenefitsForm 
                initialData={projectData} 
                onSubmit={handleBenefitsSubmit} 
                onBack={goBack}
              />
            )}
            
            {currentStep === 'artifact-selection' && (
              <ArtifactSelector 
                onSelect={handleArtifactSelect} 
                isGenerating={isGenerating}
                onBack={goBack}
              />
            )}
            
            {currentStep === 'result' && (
              <ResultDisplay 
                content={generatedContent} 
                artifactType={selectedArtifact}
                onRefine={goToRefinement}
                onReset={resetWorkflow}
                isLoading={isGenerating}
              />
            )}
            
            {currentStep === 'refinement' && (
              <RefinementInterface 
                currentContent={generatedContent}
                history={refinementHistory}
                onSubmit={handleRefinementSubmit}
                onBack={goBack}
                isSubmitting={isGenerating}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </section>
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

