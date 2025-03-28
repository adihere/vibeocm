'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface ProjectContextFormProps {
  onSubmit: (context: string) => void
}

export function ProjectContextForm({ onSubmit }: ProjectContextFormProps) {
  const [context, setContext] = useState('')
  const [error, setError] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (context.trim().length < 50) {
      setError('Please provide more details about your project (at least 50 characters)')
      return
    }
    
    onSubmit(context)
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Step 2: Describe Your Project Context</h2>
        <p className="text-gray-600 mt-2">
          Provide details about your change initiative to help generate more relevant OCM deliverables.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="project-context">Project Context</Label>
          <Textarea
            id="project-context"
            placeholder="Describe your change initiative, including objectives, scope, stakeholders, timeline, and any specific challenges you're facing..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={8}
            className="resize-y"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <p className="text-sm text-gray-500">
            Example: "We are implementing a new CRM system for our sales team of 50 people. The objective is to improve customer data management and sales reporting. The timeline is 3 months, and we're concerned about user adoption."
          </p>
        </div>
        
        <Button type="submit" className="w-full">Continue to Step 3</Button>
      </form>
    </div>
  )
}

