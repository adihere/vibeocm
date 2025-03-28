"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { ProjectData } from "@/components/vibe-ocm-single-page"

// Import the SlothBearIcon at the top of the file
import { SlothBearIcon } from "@/components/icons/sloth-bear-icon"

/**
 * Props for the ArtifactGenerationSection component
 */
interface ArtifactGenerationSectionProps {
  /**
   * Callback function called when an artifact is selected
   * @param artifact - The selected artifact type
   */
  onSelect: (artifact: string) => void

  /**
   * Callback function called when the back button is clicked
   */
  onBack: () => void

  /**
   * Callback function called when the "I AM FEELING LAZY" button is clicked
   */
  onFeelingLazy: () => void

  /**
   * Whether the artifact generation is currently in progress
   */
  isGenerating: boolean

  /**
   * Project data for context
   */
  projectData: ProjectData

  /**
   * Whether to disable the "I AM FEELING LAZY" button
   */
  disableLazy?: boolean
}

/**
 * Component for selecting and generating OCM artifacts
 * This is the fourth step (Step 4) in the OCM workflow
 *
 * @param props - Component props
 * @returns The rendered component
 */
export function ArtifactGenerationSection({
  onSelect,
  onBack,
  onFeelingLazy,
  isGenerating,
  projectData,
  disableLazy = false, // We'll ignore this parameter now
}: ArtifactGenerationSectionProps) {
  // State for the selected artifact
  const [selectedArtifact, setSelectedArtifact] = useState<string>("")

  /**
   * Handles artifact selection
   * Updates the selected artifact state and calls the onSelect callback
   *
   * @param artifact - The selected artifact type
   */
  const handleSelect = (artifact: string) => {
    setSelectedArtifact(artifact)
    onSelect(artifact)
  }

  // List of available artifacts
  const artifacts = [
    "Organizational Change Plan",
    "Communication Plan",
    "Communication Message Templates",
    "Stakeholder Engagement Strategy",
    "Feedback Survey Templates",
  ]

  return (
    <div className="py-20 min-h-screen flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Generate OCM Artifacts</h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Select an artifact to generate based on your project details
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artifacts.map((artifact) => (
            <Card key={artifact} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{artifact}</CardTitle>
                <CardDescription>{getArtifactDescription(artifact)}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => handleSelect(artifact)} disabled={isGenerating} className="w-full">
                  {isGenerating && selectedArtifact === artifact ? (
                    <>
                      <span className="mr-2">
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </span>
                      Generating...
                    </>
                  ) : (
                    "Generate"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    variant="outline"
                    size="lg"
                    className="font-bold"
                    onClick={(e) => {
                      // Always enable the button
                      const dialogTrigger = document.getElementById("lazy-dialog-trigger")
                      if (dialogTrigger) {
                        dialogTrigger.click()
                      }
                    }}
                    disabled={isGenerating}
                  >
                    <SlothBearIcon className="mr-2 h-5 w-5" /> I AM FEELING LAZY
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate all artifacts at once and download as a ZIP file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Hidden dialog trigger */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button id="lazy-dialog-trigger" className="hidden">
                Hidden Trigger
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Generate All Artifacts</AlertDialogTitle>
                <AlertDialogDescription>
                  This will generate all available artifacts based on your project details and package them into a ZIP
                  file for download. This process may take a few minutes.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onFeelingLazy}>Generate All</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {isGenerating && (
            <div className="mt-8">
              <Alert className="bg-blue-50 border-blue-200 max-w-md mx-auto">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-sm text-blue-700">
                  Generating artifacts. This may take a few minutes...
                </AlertDescription>
              </Alert>
              <Progress value={75} className="mt-4 max-w-md mx-auto" />
            </div>
          )}

          <div className="mt-8">
            <Button variant="ghost" onClick={onBack} disabled={isGenerating}>
              ← Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Gets a description for the given artifact type
 *
 * @param artifact - The artifact type
 * @returns A description of the artifact
 */
function getArtifactDescription(artifact: string): string {
  switch (artifact) {
    case "Organizational Change Plan":
      return "A comprehensive plan outlining the change strategy, timeline, and implementation approach."
    case "Communication Plan":
      return "A structured plan for communicating change to different stakeholders at various stages."
    case "Communication Message Templates":
      return "Ready-to-use templates for announcements, updates, and other communications."
    case "Stakeholder Engagement Strategy":
      return "A targeted approach for engaging key stakeholders throughout the change process."
    case "Feedback Survey Templates":
      return "Templates for gathering feedback before, during, and after the change implementation."
    default:
      return "Generate this artifact based on your project details."
  }
}

