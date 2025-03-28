"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ProjectData } from "@/components/vibe-ocm-single-page"
import { AlertCircle, Users, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"

interface StakeholdersSectionProps {
  onSubmit: (data: Partial<ProjectData>) => void
  onBack: () => void
  initialData: ProjectData
}

export function StakeholdersSection({ onSubmit, onBack, initialData }: StakeholdersSectionProps) {
  const [stakeholders, setStakeholders] = useState(
    initialData.stakeholders.length > 0 ? initialData.stakeholders : [{ role: "", impact: "" }],
  )
  const [impactedUsers, setImpactedUsers] = useState(initialData.impactedUsers || 0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const addStakeholder = () => {
    setStakeholders([...stakeholders, { role: "", impact: "" }])
  }

  const removeStakeholder = (index: number) => {
    if (stakeholders.length > 1) {
      const newStakeholders = [...stakeholders]
      newStakeholders.splice(index, 1)
      setStakeholders(newStakeholders)
    }
  }

  const handleStakeholderChange = (index: number, field: "role" | "impact", value: string) => {
    const newStakeholders = [...stakeholders]
    newStakeholders[index][field] = value
    setStakeholders(newStakeholders)

    // Clear error for this field if it exists
    const errorKey = `stakeholders[${index}].${field}`
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors: Record<string, string> = {}

    stakeholders.forEach((stakeholder, index) => {
      if (!stakeholder.role.trim()) {
        newErrors[`stakeholders[${index}].role`] = "Stakeholder role is required"
      }
      if (!stakeholder.impact.trim()) {
        newErrors[`stakeholders[${index}].impact`] = "Impact description is required"
      }
    })

    if (impactedUsers <= 0) {
      newErrors.impactedUsers = "Number of impacted users must be greater than 0"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Submit form data
    onSubmit({ stakeholders, impactedUsers })
  }

  return (
    <div className="py-20 min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Stakeholder Details</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Identify the key stakeholders affected by this change
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">Stakeholders</h3>
                </div>

                {Object.keys(errors).length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Please fix the errors in the form before continuing.</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4 dynamic-inputs">
                  {stakeholders.map((stakeholder, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md relative">
                      <div className="space-y-2">
                        <Label htmlFor={`role-${index}`}>Stakeholder Role</Label>
                        <Input
                          id={`role-${index}`}
                          placeholder="e.g., Department Manager"
                          value={stakeholder.role}
                          onChange={(e) => handleStakeholderChange(index, "role", e.target.value)}
                          className={errors[`stakeholders[${index}].role`] ? "border-red-500" : ""}
                        />
                        {errors[`stakeholders[${index}].role`] && (
                          <p className="text-sm text-red-500">{errors[`stakeholders[${index}].role`]}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`impact-${index}`}>Impact Description</Label>
                        <Input
                          id={`impact-${index}`}
                          placeholder="e.g., High - Daily workflow changes"
                          value={stakeholder.impact}
                          onChange={(e) => handleStakeholderChange(index, "impact", e.target.value)}
                          className={errors[`stakeholders[${index}].impact`] ? "border-red-500" : ""}
                        />
                        {errors[`stakeholders[${index}].impact`] && (
                          <p className="text-sm text-red-500">{errors[`stakeholders[${index}].impact`]}</p>
                        )}
                      </div>

                      {stakeholders.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => removeStakeholder(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button type="button" variant="outline" className="w-full" onClick={addStakeholder}>
                    <Plus className="h-4 w-4 mr-2" /> Add Stakeholder
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="impactedUsers">Estimated Number of Impacted Users</Label>
                  <Input
                    id="impactedUsers"
                    type="number"
                    min="1"
                    value={impactedUsers}
                    onChange={(e) => setImpactedUsers(Number.parseInt(e.target.value) || 0)}
                    className={errors.impactedUsers ? "border-red-500" : ""}
                  />
                  {errors.impactedUsers && <p className="text-sm text-red-500">{errors.impactedUsers}</p>}
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

