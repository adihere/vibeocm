import type { WorkflowStep } from "@/components/vibe-ocm-single-page"

interface ProgressIndicatorProps {
  currentStep: WorkflowStep
}

/**
 * Component that displays the current progress in the workflow
 * Shows a visual indicator of the current step and completed steps
 *
 * @param props - Component props
 * @returns The rendered component
 */
export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  // Define all steps in the workflow with their display labels
  const steps = [
    { id: "api-key", label: "Authentication", number: 0 },
    { id: "project-basics", label: "Project Basics", number: 1 },
    { id: "stakeholders", label: "Stakeholders", number: 2 },
    { id: "benefits", label: "Benefits", number: 3 },
    { id: "artifact-selection", label: "Artifacts", number: 4 },
    { id: "results", label: "Results", number: 5 },
    { id: "refinement", label: "Refinement", number: 6 },
  ]

  // Don't show progress indicator on hero page
  if (currentStep === "hero") {
    return null
  }

  // Find the current step index
  const currentIndex = steps.findIndex((step) => step.id === currentStep)

  return (
    <div className="hidden md:flex items-center space-x-2">
      {steps.map((step, index) => {
        // Determine if the step is active or completed
        const isActive = step.id === currentStep
        const isCompleted = index < currentIndex

        return (
          <div key={step.id} className="flex items-center">
            {/* Step indicator circle */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                isActive
                  ? "bg-primary text-white"
                  : isCompleted
                    ? "bg-primary/80 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
              aria-current={isActive ? "step" : undefined}
              aria-label={`Step ${step.number + 1}: ${step.label}`}
            >
              {step.number + 1}
            </div>

            {/* Connector line between steps */}
            {index < steps.length - 1 && (
              <div className="w-8 h-1 bg-gray-200 mx-1" aria-hidden="true">
                <div
                  className={`h-full ${index < currentIndex ? "bg-primary" : "bg-gray-200"}`}
                  style={{ width: isActive ? "50%" : index < currentIndex ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        )
      })}

      {/* Current step label */}
      <span className="ml-2 text-sm font-medium">{steps.find((step) => step.id === currentStep)?.label || ""}</span>
    </div>
  )
}

