"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"

interface RefinementSectionProps {
  content: string
  history?: string[]
  artifactType: string
  isSubmitting: boolean
  error?: string | null
  onSubmit: (feedback: string, focus?: string[]) => Promise<void>
  onBack: () => void
}

export function RefinementSection({
  content,
  history = [],
  artifactType,
  isSubmitting,
  error,
  onSubmit,
  onBack,
}: RefinementSectionProps) {
  const [feedback, setFeedback] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (feedback.trim()) {
      onSubmit(feedback)
    }
  }

  return (
    <div className="py-20 min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Refine Your {artifactType}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Provide feedback to improve the generated content
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card className="mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">How would you like to improve this content?</h3>
                  <p className="text-muted-foreground">
                    Describe what changes you'd like to make to the {artifactType}. Be specific about what you want to
                    add, remove, or modify.
                  </p>
                  <Textarea
                    placeholder="Example: Make the language more formal, add more details about stakeholder engagement, include specific metrics for success..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={8}
                    className="resize-y"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
                    Back to Results
                  </Button>
                  <Button type="submit" disabled={isSubmitting || !feedback.trim()}>
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Refining...
                      </>
                    ) : (
                      "Regenerate Content"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold mb-4">Current Content Preview</h3>
            <div className="max-h-96 overflow-y-auto bg-white p-4 rounded border border-gray-200">
              <pre className="whitespace-pre-wrap font-mono text-sm">{content.slice(0, 500)}...</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

