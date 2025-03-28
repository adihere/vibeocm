"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ProjectData } from "@/components/vibe-ocm-single-page"
import { AlertCircle, BarChart } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"

interface BenefitsSectionProps {
  onSubmit: (data: Partial<ProjectData>) => void
  onBack: () => void
  initialData: ProjectData
}

export function BenefitsSection({ onSubmit, onBack, initialData }: BenefitsSectionProps) {
  const [formData, setFormData] = useState({
    orgBenefits: initialData.orgBenefits || "",
    userBenefits: initialData.userBenefits || "",
    challenges: initialData.challenges || "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors: Record<string, string> = {}

    if (!formData.orgBenefits.trim()) {
      newErrors.orgBenefits = "Organizational benefits are required"
    }

    if (!formData.userBenefits.trim()) {
      newErrors.userBenefits = "User benefits are required"
    }

    if (!formData.challenges.trim()) {
      newErrors.challenges = "Expected challenges are required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Submit form data
    onSubmit(formData)
  }

  return (
    <div className="py-20 min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Benefits & Challenges</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Describe the benefits and challenges of this change
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">Benefits & Challenges</h3>
                </div>

                {Object.keys(errors).length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Please fix the errors in the form before continuing.</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="orgBenefits">Benefits to Organization</Label>
                  <Textarea
                    id="orgBenefits"
                    name="orgBenefits"
                    placeholder="Describe how this change will benefit the organization..."
                    value={formData.orgBenefits}
                    onChange={handleChange}
                    rows={4}
                    className={errors.orgBenefits ? "border-red-500" : ""}
                  />
                  {errors.orgBenefits && <p className="text-sm text-red-500">{errors.orgBenefits}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userBenefits">Benefits to End Users</Label>
                  <Textarea
                    id="userBenefits"
                    name="userBenefits"
                    placeholder="Describe how this change will benefit the end users..."
                    value={formData.userBenefits}
                    onChange={handleChange}
                    rows={4}
                    className={errors.userBenefits ? "border-red-500" : ""}
                  />
                  {errors.userBenefits && <p className="text-sm text-red-500">{errors.userBenefits}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="challenges">Expected Challenges</Label>
                  <Textarea
                    id="challenges"
                    name="challenges"
                    placeholder="Describe the challenges you anticipate with this change..."
                    value={formData.challenges}
                    onChange={handleChange}
                    rows={4}
                    className={errors.challenges ? "border-red-500" : ""}
                  />
                  {errors.challenges && <p className="text-sm text-red-500">{errors.challenges}</p>}
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={onBack}>
                  ← Back
                </Button>
                <Button type="submit">Next →</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

