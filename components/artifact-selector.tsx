'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, MessageSquare, Users, FileOutput, BarChart, FileCheck } from 'lucide-react'

interface ArtifactSelectorProps {
  onSelect: (artifact: string) => void
  isGenerating: boolean
  onBack: () => void
}

const artifacts = [
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
    id: 'communicationTemplates',
    title: 'Communication Message Templates',
    description: 'Ready-to-use templates for key communications throughout the change process.',
    icon: FileOutput
  },
  {
    id: 'stakeholderStrategy',
    title: 'Stakeholder Engagement Strategy',
    description: 'A plan for engaging and managing stakeholders based on their influence and interest.',
    icon: Users
  },
  {
    id: 'feedbackSurvey',
    title: 'Feedback Survey Templates',
    description: 'Templates for gathering feedback at different stages of the change process.',
    icon: BarChart
  },
  {
    id: 'readinessAssessment',
    title: 'Readiness Assessment',
    description: 'An evaluation of the organization\'s readiness to implement the change.',
    icon: FileCheck
  }
]

export function ArtifactSelector({ onSelect, isGenerating, onBack }: ArtifactSelectorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  
  const handleSelect = (artifactId: string) => {
    setSelectedId(artifactId)
    
    // Find the title of the selected artifact
    const artifact = artifacts.find(a => a.id === artifactId)
    if (artifact) {
      onSelect(artifact.title)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {artifacts.map((artifact) => {
          const Icon = artifact.icon
          const isSelected = selectedId === artifact.id
          
          return (
            <Card 
              key={artifact.id} 
              className={`cursor-pointer transition-colors ${isSelected ? 'border-primary' : 'hover:border-primary/50'}`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{artifact.title}</CardTitle>
                <Icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{artifact.description}</CardDescription>
                <Button 
                  className="w-full mt-4" 
                  onClick={() => handleSelect(artifact.id)}
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
      
      <div className="flex justify-start pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Form
        </Button>
      </div>
    </div>
  )
}

