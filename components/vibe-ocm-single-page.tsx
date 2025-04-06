"use client"

import { useState, useRef, useEffect } from "react"
import { HeroSection } from "@/components/sections/hero-section"
import { ApiKeySection } from "@/components/sections/api-key-section"
import { ProjectBasicsSection } from "@/components/sections/project-basics-section"
import { StakeholdersSection } from "@/components/sections/stakeholders-section"
import { BenefitsSection } from "@/components/sections/benefits-section"
import { ArtifactGenerationSection } from "@/components/sections/artifact-generation-section"
import { ResultsSection } from "@/components/sections/results-section"
import { RefinementSection } from "@/components/sections/refinement-section"
import { ProgressIndicator } from "@/components/progress-indicator"
import { logger } from "@/lib/logger"
import { captureEvent } from "@/lib/posthog"
import { validatePassphrase } from "@/lib/ai-client"
import { getDefaultModelForProvider } from "@/lib/ai-client"
import { generateOCMArtifactWithLangChain, DEFAULT_MISTRAL_API_KEY } from "@/lib/langchain"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { ApiProvider } from "@/lib/types"
import type { AuthMethod as ImportedAuthMethod } from "@/components/sections/api-key-section"
import JSZip from "jszip"
import FileSaver from "file-saver"
import { TooltipProvider } from "@/components/ui/tooltip"

/**
 * Auth method type for the OCM workflow
 * Represents different authentication methods available
 */
export type AuthMethod = 
  | "openai"
  | "mistral" 
  | "passphrase"
  | "trial";

/**
 * Project data structure for the OCM workflow
 * Contains all information needed to generate OCM artifacts
 */
export interface ProjectData {
  /** API key provided by the user */
  apiKey: string
  /** API provider selected by the user */
  apiProvider: "openai" | "mistral"
  /** Authentication method selected by the user */
  authMethod: AuthMethod
  /** Passphrase (if using passphrase authentication) */
  passphrase?: string
  /** Name of the project or change initiative */
  name: string
  /** Description of the project's goal or objective */
  goal: string
  /** Project start date in ISO format (YYYY-MM-DD) */
  startDate: string
  /** Project end date in ISO format (YYYY-MM-DD) */
  endDate: string
  /** List of stakeholders affected by the change */
  stakeholders: Array<{
    /** Stakeholder role or group (e.g., "Department Managers") */
    role: string
    /** Description of how the stakeholder is impacted (e.g., "High - Daily workflow changes") */
    impact: string
  }>
  /** Estimated number of users impacted by the change */
  impactedUsers: number
  /** Benefits to the organization from implementing the change */
  orgBenefits: string
  /** Benefits to end users from implementing the change */
  userBenefits: string
  /** Expected challenges during implementation */
  challenges: string
}

/**
 * Possible workflow steps in the OCM application
 * Represents the different sections/stages of the application
 */
export type WorkflowStep =
  | "hero" // Landing page
  | "api-key" // API key input (Step 0)
  | "project-basics" // Project details (Step 1)
  | "stakeholders" // Stakeholder information (Step 2)
  | "benefits" // Benefits and challenges (Step 3)
  | "artifact-selection" // Artifact type selection (Step 4)
  | "results" // Results display
  | "refinement" // Content refinement

/**
 * List of all available artifacts
 */
const ALL_ARTIFACTS = [
  "Organizational Change Plan",
  "Communication Plan",
  "Communication Message Templates",
  "Stakeholder Engagement Strategy",
  "Feedback Survey Templates",
]

/**
 * Configuration for LangChain API calls
 */
export interface LangChainConfig {
  apiKey: string
  apiProvider: string
  model: string
  maxTokens: number
  temperature: number
  refinementFeedback?: string
  currentContent?: string
}

/**
 * Main component for the VibeOCM single-page application
 * Manages the overall state and workflow of the application
 *
 * @returns The rendered component
 */
export function VibeOCMSinglePage() {
  // State for current visible section
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("hero")
  // State for general application errors
  const [appError, setAppError] = useState<string | null>(null)
  // Refs for scrolling to sections
  const apiKeySectionRef = useRef<HTMLDivElement>(null)
  const projectBasicsSectionRef = useRef<HTMLDivElement>(null)
  const stakeholdersSectionRef = useRef<HTMLDivElement>(null)
  const benefitsSectionRef = useRef<HTMLDivElement>(null)
  const artifactSectionRef = useRef<HTMLDivElement>(null)
  const resultsSectionRef = useRef<HTMLDivElement>(null)
  const refinementSectionRef = useRef<HTMLDivElement>(null)
  // State for form data
  const [projectData, setProjectData] = useState<ProjectData>({
    apiKey: "",
    apiProvider: "openai",
    authMethod: "openai",
    name: "",
    goal: "",
    startDate: "",
    endDate: "",
    stakeholders: [{ role: "", impact: "" }],
    impactedUsers: 0,
    orgBenefits: "",
    userBenefits: "",
    challenges: "",
  })
  // State for artifact generation
  const [selectedArtifact, setSelectedArtifact] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRefining, setIsRefining] = useState(false)
  // State for "I AM FEELING LAZY" functionality
  const [isLazyGenerating, setIsLazyGenerating] = useState(false)
  const [lazyProgress, setLazyProgress] = useState(0)
  const [currentLazyArtifact, setCurrentLazyArtifact] = useState("")
  const [generatedArtifacts, setGeneratedArtifacts] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Scrolls to the specified section and updates the current step
   * This function handles both the state update and the UI scrolling
   *
   * @param step - The step to navigate to
   */
  const scrollToSection = (step: WorkflowStep) => {
    try {
      setCurrentStep(step)
      // Track step navigation
      captureEvent("navigate_step", { step })
      logger.info(`Navigating to step: ${step}`)
      let ref = null
      switch (step) {
        case "api-key":
          ref = apiKeySectionRef
          break
        case "project-basics":
          ref = projectBasicsSectionRef
          break
        case "stakeholders":
          ref = stakeholdersSectionRef
          break
        case "benefits":
          ref = benefitsSectionRef
          break
        case "artifact-selection":
          ref = artifactSectionRef
          break
        case "results":
          ref = resultsSectionRef
          break
        case "refinement":
          ref = refinementSectionRef
          break
        default:
          break
      }

      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    } catch (error) {
      logger.error("Error navigating to section", error)
      setAppError("An error occurred while navigating. Please refresh the page and try again.")
    }
  }

  // Update the handleAuthSubmit function to check for trial mode availability
  const handleAuthSubmit = async (
    apiKey: string,
    provider: ApiProvider,
    authMethod: AuthMethod,
    passphrase?: string,
  ) => {
    try {
      setIsLoading(true)
      // If using passphrase, validate it
      if (authMethod === "passphrase") {
        if (!passphrase) {
          setAppError("Passphrase is required")
          return
        }

        // Validate the passphrase against the stored hash
        const isValid = await validatePassphrase(passphrase)
        if (!isValid) {
          setAppError("Invalid passphrase. Please try again.")
          return
        }

        // For passphrase auth, we use Mistral as the provider
        setProjectData((prev) => ({
          ...prev,
          apiKey,
          apiProvider: "mistral",
          authMethod,
          passphrase,
        }))
      }
      // If using trial option, allow it without checking availability
      else if (authMethod === "trial") {
        // For trial auth, we use Mistral as the provider
        setProjectData((prev) => ({
          ...prev,
          apiKey,
          apiProvider: "mistral",
          authMethod,
        }))
      } else {
        // For API key auth, use the selected provider
        setProjectData((prev) => ({
          ...prev,
          apiKey,
          apiProvider: provider,
          authMethod,
          passphrase: undefined,
        }))
      }

      scrollToSection("project-basics")
    } catch (error) {
      logger.error("Error handling authentication submission", error)
      setAppError("An error occurred while processing your authentication. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handles project basics form submission
   * Updates the project data and navigates to the next step
   *
   * @param data - The project basics data
   */
  const handleProjectBasicsSubmit = (data: Partial<ProjectData>) => {
    try {
      setProjectData((prev) => ({ ...prev, ...data }))
      scrollToSection("stakeholders")
    } catch (error) {
      logger.error("Error handling project basics submission", error)
      setAppError("An error occurred while saving your project details. Please try again.")
    }
  }

  /**
   * Handles stakeholders form submission
   * Updates the project data and navigates to the next step
   *
   * @param data - The stakeholders data
   */
  const handleStakeholdersSubmit = (data: Partial<ProjectData>) => {
    try {
      setProjectData((prev) => ({ ...prev, ...data }))
      scrollToSection("benefits")
    } catch (error) {
      logger.error("Error handling stakeholders submission", error)
      setAppError("An error occurred while saving stakeholder information. Please try again.")
    }
  }

  /**
   * Handles benefits form submission
   * Updates the project data and navigates to the next step
   *
   * @param data - The benefits data
   */
  const handleBenefitsSubmit = (data: Partial<ProjectData>) => {
    try {
      setProjectData((prev) => ({ ...prev, ...data }))
      scrollToSection("artifact-selection")
    } catch (error) {
      logger.error("Error handling benefits submission", error)
      setAppError("An error occurred while saving benefits information. Please try again.")
    }
  }

  const handleArtifactSelect = async (artifact: string) => {
    setSelectedArtifact(artifact)
    setIsGenerating(true)
    setAppError(null)
    try {
      // Get the appropriate API key based on auth method
      const apiKey = projectData.authMethod === "trial" ?
        DEFAULT_MISTRAL_API_KEY :
        projectData.apiKey;
      // Get the default model
      const model = getDefaultModelForProvider("mistral")
      // Generate the artifact content using LangChain
      const content = await generateOCMArtifactWithLangChain(artifact, projectData, {
        apiKey,
        apiProvider: "mistral",
        model,
        maxTokens: 2000,
        temperature: 0.7,
      })
      // Store the generated artifact
      setGeneratedArtifacts((prev) => ({
        ...prev,
        [artifact]: content,
      }))
      // Set the generated content and navigate to results
      setGeneratedContent(content)
      scrollToSection("results")
    } catch (error) {
      // Log the error
      logger.error(`Error generating ${artifact}`, error)
      // Set a more detailed error message
      let errorMessage = `Failed to generate ${artifact}. `
      if (error instanceof Error) {
        errorMessage += error.message
      } else {
        if (projectData.authMethod === "passphrase") {
          errorMessage +=
            "There was an issue with the passphrase authentication. Please try again or use an API key instead."
        } else if (projectData.authMethod === "trial") {
          errorMessage += "There was an issue with the trial mode. Please try using your own API key instead."
        } else {
          errorMessage += `Please check your ${projectData.apiProvider} API key and try again.`
        }
      }
      setAppError(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }

  /**
   * Handles the "I AM FEELING LAZY" button click
   * Generates all artifacts and packages them into a ZIP file for download
   */
  const handleFeelingLazy = async () => {
    setIsLazyGenerating(true)
    setLazyProgress(0)
    setAppError(null)
    try {
      // Log the lazy generation attempt
      logger.info("Starting lazy generation of all artifacts", {
        projectName: projectData.name,
        provider: projectData.apiProvider,
        authMethod: projectData.authMethod,
      })
      // Track the lazy generation event
      captureEvent("lazy_generation", {
        projectName: projectData.name,
        provider: projectData.apiProvider,
        authMethod: projectData.authMethod,
      })
      // Get the default model for the selected provider
      const model = getDefaultModelForProvider(projectData.apiProvider)
      // Create a new ZIP file
      const zip = new JSZip()
      // Generate each artifact
      const generatedContents: Record<string, string> = {}
      for (let i = 0; i < ALL_ARTIFACTS.length; i++) {
        const artifact = ALL_ARTIFACTS[i]
        setCurrentLazyArtifact(artifact)
        // Update progress
        const progressStart = (i / ALL_ARTIFACTS.length) * 100
        const progressEnd = ((i + 1) / ALL_ARTIFACTS.length) * 100
        setLazyProgress(progressStart)
        try {
          // Generate the artifact content
          const content = await generateOCMArtifactWithLangChain(artifact, projectData, {
            apiKey: projectData.authMethod === "trial" ? DEFAULT_MISTRAL_API_KEY : projectData.apiKey,
            apiProvider: "mistral",
            model,
            maxTokens: 2000,
            temperature: 0.7,
          })
          // Store the generated content
          generatedContents[artifact] = content
          // Add the artifact to the ZIP file
          const fileName = `${artifact.replace(/\s+/g, "-").toLowerCase()}.md`
          zip.file(fileName, content)
          // Update progress
          setLazyProgress(progressEnd)
        } catch (error) {
          // Log the error but continue with other artifacts
          logger.error(`Error generating ${artifact} during lazy generation`, error)
          // Add a placeholder file for the failed artifact
          const errorMessage = `Failed to generate ${artifact}. Please try generating this artifact individually.`
          const fileName = `${artifact.replace(/\s+/g, "-").toLowerCase()}-ERROR.md`
          zip.file(fileName, errorMessage)
          // Update progress
          setLazyProgress(progressEnd)
        }
      }

      // Store all generated artifacts
      setGeneratedArtifacts(generatedContents)
      // Generate the ZIP file
      const zipBlob = await zip.generateAsync({ type: "blob" })
      // Download the ZIP file
      FileSaver.saveAs(zipBlob, `${projectData.name.replace(/\s+/g, "-").toLowerCase()}-ocm-artifacts.zip`)
      // Show success message
      alert("Your artifacts have been successfully generated and downloaded!")
      // If at least one artifact was generated, show it in the results
      const firstArtifact = Object.keys(generatedContents)[0]
      if (firstArtifact) {
        setSelectedArtifact(firstArtifact)
        setGeneratedContent(generatedContents[firstArtifact])
        scrollToSection("results")
      }
    } catch (error) {
      // Log the error
      logger.error("Error during lazy generation", error)
      // Set a more detailed error message
      let errorMessage = "Failed to generate all artifacts. "
      if (error instanceof Error) {
        errorMessage += error.message
      } else {
        if (projectData.authMethod === "passphrase") {
          errorMessage +=
            "There was an issue with the passphrase authentication. Please try again or use an API key instead."
        } else {
          errorMessage += `Please check your ${projectData.apiProvider} API key and try again.`
        }
      }
      setAppError(errorMessage)
    } finally {
      setIsLazyGenerating(false)
    }
  }

  const handleRefinement = async (feedback: string) => {
    setIsRefining(true)
    setAppError(null)
    try {
      const apiKey = projectData.authMethod === "trial" ?
        DEFAULT_MISTRAL_API_KEY :
        projectData.apiKey;
      const model = getDefaultModelForProvider("mistral")
      // Refine the artifact content using LangChain
      const refinedContent = await generateOCMArtifactWithLangChain(selectedArtifact, projectData, {
        apiKey,
        apiProvider: "mistral",
        model,
        maxTokens: 2000,
        temperature: 0.7,
        refinementFeedback: feedback,
        currentContent: generatedContent,
      })
      // Update the stored artifact
      setGeneratedArtifacts((prev) => ({
        ...prev,
        [selectedArtifact]: refinedContent,
      }))
      // Set the refined content and navigate back to results
      setGeneratedContent(refinedContent)
      scrollToSection("results")
    } catch (error) {
      // Log the error
      logger.error(`Error refining ${selectedArtifact}`, error)
      // Set a more detailed error message
      let errorMessage = `Failed to refine ${selectedArtifact}. `
      if (error instanceof Error) {
        errorMessage += error.message
      } else {
        if (projectData.authMethod === "passphrase") {
          errorMessage +=
            "There was an issue with the passphrase authentication. Please try again or use an API key instead."
        } else {
          errorMessage += `Please check your ${projectData.apiProvider} API key and try again.`
        }
      }
      setAppError(errorMessage)
    } finally {
      setIsRefining(false)
    }
  }


  /**
   * Navigates to the previous step based on the current step
   * Implements the "Back" button functionality
   */
  const goBack = () => {
    try {
      switch (currentStep) {
        case "project-basics":
          scrollToSection("api-key")
          break
        case "stakeholders":
          scrollToSection("project-basics")
          break
        case "benefits":
          scrollToSection("stakeholders")
          break
        case "artifact-selection":
          scrollToSection("benefits")
          break
        case "results":
          scrollToSection("artifact-selection")
          break
        case "refinement":
          scrollToSection("results")
          break
        default:
          break
      }
    } catch (error) {
      logger.error("Error navigating back", error)
      setAppError("An error occurred while navigating. Please refresh the page and try again.")
    }
  }

  /**
   * Resets the workflow to start over
   * Allows users to generate a new artifact
   */
  const startOver = () => {
    try {
      // Track the event
      captureEvent("generate_another")
      logger.info("User chose to generate another artifact")

      // Clear the current artifact and content
      setSelectedArtifact("")
      setGeneratedContent("")

      // Navigate back to artifact selection
      scrollToSection("artifact-selection")
    } catch (error) {
      logger.error("Error navigating to artifact selection", error)
      setAppError("An error occurred while navigating. Please refresh the page and try again.")
    }
  }

  /**
   * Handles hash changes to support direct navigation via URL
   * Allows deep linking to specific sections
   */
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#step0") {
        scrollToSection("api-key")
      }
    }

    // Check hash on initial load
    handleHashChange()

    // Add event listener for hash changes
    window.addEventListener("hashchange", handleHashChange)

    // Log application initialization
    logger.info("VibeOCM application initialized")
    captureEvent("app_initialized")

    // Cleanup
    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen">
        <header className="bg-primary text-white p-6 sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">VibeOCM</h1>
            <ProgressIndicator currentStep={currentStep} />
          </div>
        </header>

        <main className="flex-1">
          {/* Application-wide error message */}
          {appError && (
            <div className="container mx-auto px-4 py-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{appError}</AlertDescription>
              </Alert>
            </div>
          )}

          {/* API Key Section (Step 0) */}
          <div id="step0" ref={apiKeySectionRef} className="section">
            <ApiKeySection
              onSubmit={handleAuthSubmit}
              initialValue={projectData.apiKey}
              initialProvider={projectData.apiProvider}
              initialAuthMethod={projectData.authMethod}
              initialPassphrase={projectData.passphrase}
              isLoading={isLoading}
            />
          </div>

          {/* Project Basics Section (Step 1) */}
          <div id="step1" ref={projectBasicsSectionRef} className="section">
            <ProjectBasicsSection onSubmit={handleProjectBasicsSubmit} onBack={goBack} initialData={projectData} />
          </div>

          {/* Stakeholders Section (Step 2) */}
          <div id="step2" ref={stakeholdersSectionRef} className="section">
            <StakeholdersSection onSubmit={handleStakeholdersSubmit} onBack={goBack} initialData={projectData} />
          </div>

          {/* Benefits Section (Step 3) */}
          <div id="step3" ref={benefitsSectionRef} className="section">
            <BenefitsSection onSubmit={handleBenefitsSubmit} onBack={goBack} initialData={projectData} />
          </div>

          {/* Artifact Generation Section (Step 4) */}
          <div id="step4" ref={artifactSectionRef} className="section">
            <ArtifactGenerationSection
              onSelect={handleArtifactSelect}
              onBack={goBack}
              isGenerating={isGenerating || isLazyGenerating}
              projectData={projectData}
              onFeelingLazy={handleFeelingLazy}
              disableLazy={false} // Enable "I AM FEELING LAZY" for all authentication methods
            />
          </div>

          {/* Results Section */}
          <div id="results" ref={resultsSectionRef} className="section">
            <ResultsSection
              content={generatedContent}
              artifactType={selectedArtifact}
              onRefine={() => scrollToSection("refinement")}
              onReset={startOver}
              isLoading={isGenerating || isLazyGenerating}
            />
          </div>

          {/* Refinement Section */}
          <div id="refinement" ref={refinementSectionRef} className="section">
            <RefinementSection
              content={generatedContent}
              artifactType={selectedArtifact}
              isSubmitting={isRefining}
              error={appError}
              onBack={goBack}
              history={[]}
              onSubmit={handleRefinement}
            />
          </div>
        </main>

        <footer className="bg-gray-900 text-white p-6">
          <div className="container mx-auto">
            <p className="text-center">© 2024 VibeOCM. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  )
}

