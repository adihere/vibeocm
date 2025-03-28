'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, MessageSquare, Users, Calendar, BarChart, FileCheck } from 'lucide-react'

interface DeliverableSelectorProps {
  onSelect: (deliverable: string) => void
  isGenerating: boolean
}

const deliverables = [
  {
    id: 'changePlan',
    title: 'Change Management Plan',
    description: 'A comprehensive plan outlining the approach to managing the people side of change.',
    icon: FileText
  },
  {
    id: 'communicationPlan',
    title: 'Communication Plan',
    description: 'A structured approach to communicating with stakeholders throughout the change process.',
    icon: MessageSquare
  },
  {
    id: 'stakeholderAnalysis',
    title: 'Stakeholder Analysis',
    description: 'Identification and assessment of key stakeholders and their relationship to the change.',
    icon: Users
  },
  {
    id: 'trainingPlan',
    title: 'Training Plan',
    description: 'A plan for developing the skills and knowledge required for the change.',
    icon: Calendar
  },
  {
    id: 'impactAssessment',
    title: 'Impact Assessment',
    description: 'Analysis of how the change will affect different parts of the organization.',
    icon: BarChart
  },
  {
    id: 'readinessAssessment',
    title: 'Readiness Assessment',
    description: 'Evaluation of the organization\'s readiness to implement the change.',
    icon: FileCheck
  }
]

export function DeliverableSelector({ onSelect, isGenerating }: DeliverableSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  
  const handleSelect = (deliverableId: string) => {
    setSelectedId(deliverableId)
    
    // Find the title of the selected deliverable
    const deliverable = deliverables.find(d => d.id === deliverableId)
    if (deliverable) {
      onSelect(deliverable.title)
    }
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Step 3: Select an OCM Deliverable</h2>
        <p className="text-gray-600 mt-2">
          Choose the type of OCM deliverable you want to generate based on your project context.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deliverables.map((deliverable) => {
          const Icon = deliverable.icon
          const isSelected = selectedId === deliverable.id
          
          return (
            <Card 
              key={deliverable.id} 
              className={`cursor-pointer transition-colors ${isSelected ? 'border-primary' : 'hover:border-primary/50'}`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{deliverable.title}</CardTitle>
                <Icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{deliverable.description}</CardDescription>
                <Button 
                  className="w-full mt-4" 
                  onClick={() => handleSelect(deliverable.id)}
                  disabled={isGenerating}
                  variant={isSelected && isGenerating ? "outline" : "default"}
                >
                  {isSelected && isGenerating ? 'Generating...' : 'Generate'}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

