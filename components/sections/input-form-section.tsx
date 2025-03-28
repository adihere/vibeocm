'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ProjectBasicsForm } from '@/components/form-steps/project-basics-form'
import { StakeholdersForm } from '@/components/form-steps/stakeholders-form'
import { BenefitsForm } from '@/components/form-steps/benefits-form'
import { WorkflowStep, ProjectData } from '@/components/vibe-ocm-app'

interface InputFormSectionProps {
  currentStep: WorkflowStep
  projectData: ProjectData
  onProjectBasicsSubmit: (data: Partial<ProjectData>) => void
  onStakeholdersSubmit: (data: Partial<ProjectData>) => void
  onBenefitsSubmit: (data: Partial<ProjectData>) => void
  onBack: () => void
}

export function InputFormSection({
  currentStep,
  projectData,
  onProjectBasicsSubmit,
  onStakeholdersSubmit,
  onBenefitsSubmit,
  onBack
}: InputFormSectionProps) {
  // Only show this section if we're in one of the form steps
  const isFormStep = ['project-basics', 'stakeholders', 'benefits'].includes(currentStep)
  
  if (!isFormStep) {
    return null
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
        
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'project-basics' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <div className="w-16 h-1 bg-gray-200">
              <div className={`h-full ${currentStep !== 'project-basics' ? 'bg-primary' : 'bg-gray-200'}`}></div>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'stakeholders' ? 'bg-primary text-white' : currentStep === 'project-basics' ? 'bg-gray-200' : 'bg-primary text-white'}`}>
              2
            </div>
            <div className="w-16 h-1 bg-gray-200">
              <div className={`h-full ${currentStep === 'benefits' ? 'bg-primary' : 'bg-gray-200'}`}></div>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'benefits' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
              3
            </div>
          </div>
        </div>
        
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            {currentStep === 'project-basics' && (
              <ProjectBasicsForm 
                initialData={projectData} 
                onSubmit={onProjectBasicsSubmit} 
              />
            )}
            
            {currentStep === 'stakeholders' && (
              <StakeholdersForm 
                initialData={projectData} 
                onSubmit={onStakeholdersSubmit} 
                onBack={onBack}
              />
            )}
            
            {currentStep === 'benefits' && (
              <BenefitsForm 
                initialData={projectData} 
                onSubmit={onBenefitsSubmit} 
                onBack={onBack}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

