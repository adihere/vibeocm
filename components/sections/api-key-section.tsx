"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, KeyRound, Info, Lock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { logger } from "@/lib/logger"
import { captureEvent } from "@/lib/posthog"
import type { ApiProvider } from "@/lib/types"

/**
 * Authentication method options
 */
export type AuthMethod = "openai" | "mistral" | "passphrase" | "trial"

/**
 * Props for the ApiKeySection component
 */
interface ApiKeySectionProps {
  /**
   * Callback function called when the authentication is submitted
   * @param apiKey - The API key entered by the user (or empty string for passphrase)
   * @param provider - The selected API provider (openai or mistral)
   * @param authMethod - The authentication method selected
   * @param passphrase - The passphrase (if using passphrase authentication)
   */
  onSubmit: (apiKey: string, provider: ApiProvider, authMethod: AuthMethod, passphrase?: string) => void

  /**
   * Initial value for the API key input
   * Used when returning to this step after proceeding further
   */
  initialValue: string

  /**
   * Initial API provider selection
   * Defaults to "openai" if not provided
   */
  initialProvider?: ApiProvider

  /**
   * Initial authentication method
   * Defaults to "openai" if not provided
   */
  initialAuthMethod?: AuthMethod

  /**
   * Initial passphrase value
   */
  initialPassphrase?: string

  /**
   * Whether the form is currently submitting
   */
  isLoading?: boolean
}

/**
 * Component for collecting and validating the API key or passphrase
 * This is the first step (Step 0) in the OCM workflow
 *
 * @param props - Component props
 * @returns The rendered component
 */
export function ApiKeySection({
  onSubmit,
  initialValue,
  initialProvider = "openai",
  initialAuthMethod = "openai",
  initialPassphrase = "",
  isLoading,
}: ApiKeySectionProps) {
  // State for the API key input
  const [apiKey, setApiKey] = useState(initialValue || "")

  // State for the passphrase input
  const [passphrase, setPassphrase] = useState(initialPassphrase || "")

  // State for validation errors
  const [error, setError] = useState("")

  // State for disclaimer acceptance
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false)

  // State for authentication method
  const [authMethod, setAuthMethod] = useState<AuthMethod>(initialAuthMethod || "trial")

  // State for API provider selection (only used when authMethod is not "passphrase")
  const [apiProvider, setApiProvider] = useState<ApiProvider>(initialProvider)

  // Add this state inside the ApiKeySection component
  const [showTrialWarning, setShowTrialWarning] = useState(false)

  // Add this effect to check if trial mode is available
  useEffect(() => {
    // We'll always allow trial mode, so we don't need to check availability
    setShowTrialWarning(false)
  }, [authMethod])

  /**
   * Handles form submission
   * Validates the API key/passphrase and disclaimer acceptance before proceeding
   *
   * @param e - The form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validate disclaimer acceptance
      if (!disclaimerAccepted) {
        setError("You must accept the disclaimer to continue")
        return
      }

      // Validate based on authentication method
      if (authMethod === "passphrase") {
        // Validate passphrase
        if (!passphrase.trim()) {
          setError("Passphrase is required")
          return
        }

        // Check if passphrase meets minimum length requirement
        if (passphrase.length < 10) {
          setError("Passphrase must be at least 10 characters long")
          return
        }

        // Log the successful passphrase submission (without the actual passphrase)
        logger.info("Passphrase authentication submitted")

        // Track the event in PostHog
        captureEvent("passphrase_submitted", {
          passphraseLength: passphrase.length,
        })

        // Clear any errors and submit with empty API key and Mistral as provider
        setError("")
        onSubmit("", "mistral", "passphrase", passphrase)
      } else if (authMethod === "trial") {
        // Log the trial authentication attempt
        logger.info("Trial authentication submitted")

        // Track the event in PostHog
        captureEvent("trial_submitted", {
          authMethod: "trial",
        })

        // Clear any errors and submit with empty API key and Mistral as provider
        setError("")
        onSubmit("", "mistral", "trial")
      } else {
        // Validate API key
        if (!apiKey.trim()) {
          setError("API key is required")
          return
        }

        // Check if it looks like a valid API key based on the provider
        if (authMethod === "openai" && (!apiKey.startsWith("sk-") || apiKey.length < 20)) {
          setError('Please enter a valid OpenAI API key (starts with "sk-")')
          return
        }

        // For Mistral, only check the length
        if (authMethod === "mistral" && apiKey.length < 8) {
          setError("Please enter a valid Mistral API key")
          return
        }

        // Log the successful API key submission (without the actual key)
        logger.info(`${authMethod.toUpperCase()} API key submitted`)

        // Track the event in PostHog
        captureEvent("api_key_submitted", {
          provider: authMethod,
        })

        // Clear any errors and submit
        setError("")
        onSubmit(apiKey, authMethod as ApiProvider, authMethod)
      }
    } catch (error) {
      // Log the error
      logger.error(`Error submitting authentication`, error)

      // Track the error in PostHog
      captureEvent("authentication_error", {
        method: authMethod,
        errorType: error instanceof Error ? error.name : "Unknown",
      })

      // Set a generic error message
      setError(`An error occurred while submitting your authentication. Please try again.`)
    }
  }

  // Get the appropriate API documentation URL based on the selected provider
  const getApiDocsUrl = () => {
    return authMethod === "openai" ? "https://platform.openai.com/api-keys" : "https://console.mistral.ai/api-keys/"
  }

  // Get the appropriate disclaimer text based on the selected authentication method
  const getDisclaimerText = () => {
    if (authMethod === "passphrase") {
      return "By using the passphrase authentication, you agree to our terms of service. The system will use our Mistral API key for generating content."
    } else if (authMethod === "trial") {
      return "This trial option uses our Mistral API key with limited functionality. For full access, please use your own API key."
    } else if (authMethod === "openai") {
      return "Your OpenAI API key will be used to make requests to OpenAI's API. Standard OpenAI API rates apply. You are responsible for any charges incurred."
    } else {
      return "Your Mistral API key will be used to make requests to Mistral's API. Standard Mistral API rates apply. You are responsible for any charges incurred."
    }
  }

  // Get the appropriate placeholder text based on the selected provider
  const getPlaceholderText = () => {
    return authMethod === "openai" ? "sk-..." : "Enter your Mistral API key"
  }

  return (
    <div className="py-20 min-h-screen flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Authentication</h2>
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose your authentication method to get started
          </p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">Authentication Method</h3>
                </div>

                <p className="text-muted-foreground">
                  Choose how you want to authenticate with our service. You can use your own API key or a secure
                  passphrase.
                </p>

                {/* Authentication Method Selection */}
                <div className="space-y-2">
                  <Label>Select Authentication Method</Label>
                  <RadioGroup
                    value={authMethod}
                    onValueChange={(value) => {
                      setAuthMethod(value as AuthMethod)
                      // If switching to passphrase or trial, set provider to mistral
                      if (value === "passphrase" || value === "trial") {
                        setApiProvider("mistral")
                      } else {
                        // Otherwise, set provider to match the auth method
                        setApiProvider(value as ApiProvider)
                      }
                      // Clear any errors
                      setError("")
                    }}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="trial" id="trial" />
                      <Label htmlFor="trial" className="cursor-pointer">
                        Let Me Try This
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="openai" id="openai" />
                      <Label htmlFor="openai" className="cursor-pointer">
                        OpenAI API Key
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mistral" id="mistral" />
                      <Label htmlFor="mistral" className="cursor-pointer">
                        Mistral AI API Key
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="passphrase" id="passphrase" />
                      <Label htmlFor="passphrase" className="cursor-pointer">
                        Use Secure Passphrase
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {authMethod === "trial" && showTrialWarning && (
                  <Alert variant="warning" className="mt-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <AlertDescription className="text-sm text-amber-700">
                      Trial mode may not be available. If you encounter errors, please use your own API key instead.
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive" className="validation-error">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Conditional input based on authentication method */}
                {authMethod === "passphrase" ? (
                  <div className="space-y-2">
                    <Label htmlFor="passphrase">Secure Passphrase</Label>
                    <div className="flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        id="passphrase"
                        type="password"
                        placeholder="Enter your secure passphrase (min 10 characters)"
                        value={passphrase}
                        onChange={(e) => setPassphrase(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter a secure passphrase to use our service without an API key. This option uses our Mistral AI
                      integration.
                    </p>
                  </div>
                ) : authMethod === "trial" ? (
                  <div className="space-y-2">
                    <Alert className="bg-blue-50 border-blue-200">
                      <Info className="h-4 w-4 text-blue-500" />
                      <AlertDescription className="text-sm text-blue-700">
                        The trial option lets you try the service without an API key. Some features like "I AM FEELING
                        LAZY" will be disabled. For full functionality, use your own API key.
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">{authMethod === "openai" ? "OpenAI" : "Mistral"} API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder={getPlaceholderText()}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="font-mono"
                    />
                    <p className="text-xs text-muted-foreground">
                      Don't have an API key? Get one from{" "}
                      <a
                        href={getApiDocsUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {authMethod === "openai" ? "OpenAI's" : "Mistral's"} website
                      </a>
                      .
                    </p>
                  </div>
                )}

                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-500" />
                  <AlertDescription className="text-sm text-blue-700">{getDisclaimerText()}</AlertDescription>
                </Alert>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="disclaimer"
                    checked={disclaimerAccepted}
                    onCheckedChange={(checked) => setDisclaimerAccepted(checked === true)}
                  />
                  <Label htmlFor="disclaimer" className="text-sm">
                    {authMethod === "passphrase"
                      ? "I understand and agree to the terms of service for using the passphrase authentication method."
                      : authMethod === "trial"
                        ? "I understand that the trial option has limited functionality and is for evaluation purposes only."
                        : `I understand that my ${authMethod === "openai" ? "OpenAI" : "Mistral"} API key will be used to generate content and I am responsible for any associated costs.`}
                  </Label>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={
                    (authMethod === "passphrase" ? !passphrase : authMethod === "trial" ? false : !apiKey) ||
                    !disclaimerAccepted ||
                    isLoading
                  }
                >
                  {isLoading ? (
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
                      Verifying...
                    </>
                  ) : (
                    "Next →"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

