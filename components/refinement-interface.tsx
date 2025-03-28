'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { History } from 'lucide-react'

interface RefinementInterfaceProps {
  currentContent: string
  history: string[]
  onSubmit: (feedback: string, focus: string[]) => void
  onBack: () => void
  isSubmitting: boolean
}

const focusAreas = [
  { id: 'tone', label: 'Tone and Style' },
  { id: 'detail', label: 'Level of Detail' },
  { id: 'structure', label: 'Document Structure' },
  { id: 'content', label: 'Content Accuracy' },
  { id: 'format', label: 'Formatting' }
]

export function RefinementInterface({ 
  currentContent, 
  history, 
  onSubmit, 
  onBack,
  isSubmitting 
}: RefinementInterfaceProps) {
  const [feedback, setFeedback] = useState('')
  const [selectedFocus, setSelectedFocus] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)
  
  const handleFocusToggle = (id: string) => {
    setSelectedFocus(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    )
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (feedback.trim()) {
      onSubmit(feedback, selectedFocus)
    }
  }
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="feedback">What would you like to change?</Label>
          <Textarea
            id="feedback"
            placeholder="Please make the tone more formal, add more details about stakeholder engagement, etc."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={6}
            className="resize-y"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label>Focus Areas (Optional)</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {focusAreas.map((area) => (
              <div key={area.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={area.id} 
                  checked={selectedFocus.includes(area.id)}
                  onCheckedChange={() => handleFocusToggle(area.id)}
                />
                <Label htmlFor={area.id} className="cursor-pointer">{area.label}</Label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <div className="space-x-2">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowHistory(!showHistory)}
            >
              <History className="mr-2 h-4 w-4" /> 
              {showHistory ? 'Hide History' : 'Show History'}
            </Button>
          </div>
          <Button type="submit" disabled={isSubmitting || !feedback.trim()}>
            {isSubmitting ? 'Refining...' : 'Refine Content'}
          </Button>
        </div>
      </form>
      
      {showHistory && history.length > 1 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Revision History</h3>
          <div className="space-y-4">
            {history.map((content, index) => (
              <Card key={index} className={index === history.length - 1 ? 'border-primary' : ''}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Version {index + 1}</h4>
                    {index === history.length - 1 && (
                      <span className="text-sm text-primary font-medium">Current</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {content.substring(0, 150)}...
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

