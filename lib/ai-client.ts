import { logger } from "@/lib/logger"
import { captureLLMMetrics } from "@/lib/posthog"
import type { ProjectData } from "@/components/vibe-ocm-single-page"
import type { ApiProvider } from "@/lib/types"
import { SYSTEM_PROMPT, ARTIFACT_TYPE_TO_PROMPT, formatPromptWithProjectData } from "@/prompts.config"
import bcrypt from "bcryptjs"

/**
 * Configuration for API requests
 */
export interface ApiConfig {
  /** API key */
  apiKey: string
  /** API provider (openai or mistral) */
  apiProvider: ApiProvider
  /** Authentication method */
  authMethod?: "openai" | "mistral" | "passphrase" | "trial"
  /** Passphrase (if using passphrase authentication) */
  passphrase?: string
  /** Model to use for generation */
  model?: string
  /** Maximum number of tokens to generate */
  maxTokens?: number
  /** Temperature for controlling randomness (0-1) */
  temperature?: number
  /** Refinement feedback (optional) */
  refinementFeedback?: string
  /** Current content to refine (optional) */
  currentContent?: string
}

// Default Mistral API key to use with passphrase authentication or trial mode
// In a production environment, this would be stored securely in environment variables
const DEFAULT_MISTRAL_API_KEY = process.env.DEFAULT_MISTRAL_API_KEY || ""

/**
 * Makes a direct API call to OpenAI
 *
 * @param systemPrompt - The system prompt
 * @param userPrompt - The user prompt
 * @param config - Configuration for the API call
 * @returns The generated content
 */
async function callOpenAIAPI(systemPrompt: string, userPrompt: string, config: ApiConfig): Promise<string> {
  const { apiKey, model = "gpt-4", temperature = 0.7, maxTokens = 2000 } = config

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]

  // If refinement feedback is provided, add the current content and feedback
  if (config.refinementFeedback && config.currentContent) {
    messages.push(
      { role: "assistant", content: config.currentContent },
      { role: "user", content: `Please refine the above content based on this feedback: ${config.refinementFeedback}` },
    )
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: temperature,
      max_tokens: maxTokens,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: { message: "Unknown error" } }))
    const errorMessage = errorData.error?.message || `OpenAI API request failed with status ${response.status}`
    throw new Error(errorMessage)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

// Update the generateMockResponse function to provide comprehensive content
function generateMockResponse(systemPrompt: string, userPrompt: string): string {
  // Extract the artifact type from the user prompt
  const artifactTypeMatch = userPrompt.match(/Generate a (.*?) for the following project/)
  const artifactType = artifactTypeMatch ? artifactTypeMatch[1] : "OCM Artifact"

  // Extract project name from the user prompt
  const projectNameMatch = userPrompt.match(/Project Name: (.*?)(\n|$)/)
  const projectName = projectNameMatch ? projectNameMatch[1] : "Your Project"

  // Extract project goal from the user prompt
  const goalMatch = userPrompt.match(/Project Goal: (.*?)(\n|$)/)
  const projectGoal = goalMatch ? goalMatch[1] : "Implement organizational change"

  // Extract stakeholders from the user prompt
  const stakeholdersMatch = userPrompt.match(/Stakeholders:(.*?)(\n\n|$)/s)
  const stakeholders = stakeholdersMatch ? stakeholdersMatch[1].trim() : "- Leadership Team\n- Employees\n- Customers"

  // Generate a comprehensive response based on the artifact type
  if (artifactType.includes("Change Management Plan")) {
    return `# Change Management Plan for ${projectName}

## Executive Summary
This change management plan outlines the comprehensive approach for implementing ${projectName}. The primary goal is to ${projectGoal} while ensuring minimal disruption to ongoing operations and maximizing stakeholder adoption.

## Project Context
${projectGoal}

## Stakeholder Analysis
${stakeholders}

## Change Impact Assessment
The implementation of ${projectName} will impact various aspects of the organization, including:

1. **Processes**: Existing workflows will need to be modified to accommodate the new system/approach
2. **People**: Staff will need training and support to adapt to the new ways of working
3. **Technology**: New tools and systems will be introduced, requiring technical adaptation
4. **Culture**: The organizational culture may need to evolve to support the new initiative

## Change Strategy
Based on the project context and stakeholders involved, we recommend a phased approach to implementing this change:

### Phase 1: Preparation (Weeks 1-4)
- Establish change management team and governance structure
- Conduct detailed stakeholder analysis and impact assessment
- Develop communication and training strategies
- Create resistance management plan

### Phase 2: Implementation (Weeks 5-12)
- Execute communication plan
- Deliver training programs
- Provide coaching and support
- Monitor adoption and address resistance

### Phase 3: Reinforcement (Weeks 13-20)
- Gather and analyze feedback
- Celebrate quick wins and successes
- Address gaps and resistance
- Adjust approach based on lessons learned

## Communication Strategy
A multi-channel communication approach will be used to ensure all stakeholders receive timely and relevant information:

| Stakeholder Group | Key Messages | Channels | Frequency |
|-------------------|--------------|----------|-----------|
| Leadership Team | Strategic importance, ROI, progress updates | Executive briefings, dashboard | Bi-weekly |
| Middle Management | Implementation details, team impact, support resources | Department meetings, email updates | Weekly |
| End Users | Benefits, training opportunities, support channels | Team meetings, intranet, email | Daily/Weekly |

## Training Plan
Training will be delivered through multiple formats to accommodate different learning styles and schedules:

- **Instructor-led workshops**: For complex topics requiring discussion
- **E-learning modules**: For self-paced learning of basic concepts
- **Job aids and quick reference guides**: For on-the-job support
- **Peer coaching**: For ongoing reinforcement

## Resistance Management
Anticipated resistance points include:

1. Concern about job security
2. Discomfort with new processes/technology
3. Skepticism about benefits
4. Time constraints during transition

Strategies to address resistance:
- Transparent communication about the impact on roles
- Comprehensive training and support
- Early involvement of key influencers
- Celebration of early adopters and quick wins

## Success Metrics
The following metrics will be used to measure the success of the change management effort:

- **Adoption rate**: Target 80% by end of Phase 2
- **Proficiency level**: Target 75% of users demonstrating competency by end of Phase 3
- **Stakeholder satisfaction**: Target 70% positive feedback
- **Business outcomes**: [Specific metrics related to project goals]

## Risk Management
Key risks to successful change implementation include:

| Risk | Likelihood | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| Insufficient resources | Medium | High | Secure dedicated budget and staff |
| Competing priorities | High | Medium | Executive alignment and clear prioritization |
| Technical issues | Medium | High | Thorough testing and contingency planning |
| Stakeholder resistance | Medium | High | Early engagement and targeted interventions |

## Timeline and Milestones
[Detailed timeline with key milestones and dependencies]

## Roles and Responsibilities
[RACI matrix for change management activities]

## Appendices
- Detailed stakeholder analysis
- Communication plan
- Training curriculum
- Feedback collection tools`
  } else if (artifactType.includes("Communication Plan")) {
    return `# Communication Plan for ${projectName}

## Communication Objectives
- Ensure all stakeholders understand the why, what, and how of ${projectName}
- Build awareness and desire for the change
- Address concerns proactively
- Provide regular updates on progress
- Celebrate successes and share lessons learned

## Key Messages
1. **Why we're making this change**: ${projectGoal}
2. **How it benefits the organization**: Improved efficiency, reduced costs, enhanced customer experience
3. **How it benefits individuals**: Streamlined workflows, better tools, professional development
4. **Timeline and what to expect**: Phased implementation with support at every stage

## Audience Segmentation
${stakeholders}

## Communication Channels
- Town halls and all-hands meetings
- Department/team meetings
- Email updates and newsletters
- Intranet/portal announcements
- Digital signage
- One-on-one conversations
- Training sessions
- FAQ documents
- Video updates

## Communication Timeline

### Pre-Change Phase
| Timing | Audience | Message | Channel | Responsible |
|--------|----------|---------|---------|-------------|
| 12 weeks before | Executive team | Project overview, strategic alignment | Executive briefing | Project Sponsor |
| 10 weeks before | Department heads | Implementation approach, resource needs | Leadership meeting | Change Manager |
| 8 weeks before | All employees | Announcement of upcoming change | Town hall, email | Project Sponsor |

### Implementation Phase
| Timing | Audience | Message | Channel | Responsible |
|--------|----------|---------|---------|-------------|
| 6 weeks before | Directly impacted teams | Detailed changes, training plan | Team meetings | Department Heads |
| 4 weeks before | All employees | Progress update, support resources | Email, intranet | Change Manager |
| 2 weeks before | Directly impacted teams | Final preparations, day 1 instructions | Team meetings, email | Team Leads |
| Go-live | All employees | Launch announcement, support channels | All channels | Project Sponsor |

### Reinforcement Phase
| Timing | Audience | Message | Channel | Responsible |
|--------|----------|---------|---------|-------------|
| 1 week after | Directly impacted teams | Early wins, issue resolution | Team meetings | Team Leads |
| 2 weeks after | All employees | Progress update, success stories | Email, intranet | Change Manager |
| 1 month after | All employees | Benefits realized, next steps | Town hall | Project Sponsor |
| Quarterly | All employees | Ongoing benefits, continuous improvement | Newsletter | Change Manager |

## Message Templates

### Announcement Email
[Template with key elements]

### Progress Update
[Template with key elements]

### Training Invitation
[Template with key elements]

### Go-Live Communication
[Template with key elements]

## Feedback Mechanisms
- Surveys after key communications
- Focus groups with representative stakeholders
- Anonymous feedback channels
- Regular check-ins with team leads
- Monitoring of intranet/portal engagement metrics

## Success Metrics
- % of employees aware of the change (target: 95%)
- % of employees who can articulate the benefits (target: 80%)
- % of employees satisfied with communication (target: 75%)
- % of employees who know where to get support (target: 90%)

## Roles and Responsibilities
[RACI matrix for communication activities]

## Appendices
- Detailed stakeholder analysis
- Complete message library
- Communication calendar
- Feedback survey templates`
  } else {
    // Generic comprehensive template for other artifact types
    return `# ${artifactType} for ${projectName}

## Executive Summary
This document provides a comprehensive framework for implementing ${artifactType} related to the ${projectName} initiative. The primary goal is to ${projectGoal} while ensuring all stakeholders are properly engaged and supported throughout the process.

## Project Context
${projectGoal}

## Stakeholder Analysis
${stakeholders}

## Strategic Approach
The implementation of ${projectName} requires a structured approach to ensure successful adoption and realization of benefits. This document outlines the key components, timelines, and responsibilities necessary to achieve the desired outcomes.

## Key Components
1. **Assessment and Planning**: Thorough analysis of current state and detailed planning for future state
2. **Stakeholder Engagement**: Targeted strategies for involving and supporting different stakeholder groups
3. **Implementation Strategy**: Phased approach with clear milestones and success criteria
4. **Monitoring and Evaluation**: Continuous assessment of progress and outcomes
5. **Sustainability Plan**: Ensuring long-term adoption and benefit realization

## Detailed Implementation Plan
[Comprehensive section with specific details relevant to the artifact type]

## Timeline and Milestones
[Detailed timeline with key milestones and dependencies]

## Risk Management
[Thorough risk assessment and mitigation strategies]

## Success Metrics
[Specific, measurable indicators of success]

## Roles and Responsibilities
[Clear delineation of who does what]

## Appendices
- Detailed analysis documents
- Supporting templates and tools
- Reference materials`
  }
}

// Update the callMistralAPI function to better handle trial mode
async function callMistralAPI(systemPrompt: string, userPrompt: string, config: ApiConfig): Promise<string> {
  // If using passphrase or trial authentication, use the default Mistral API key
  let apiKey = config.apiKey

  if (config.authMethod === "passphrase" || config.authMethod === "trial") {
    // Use DEFAULT_MISTRAL_API_KEY if available
    apiKey = DEFAULT_MISTRAL_API_KEY || config.apiKey

    // For trial mode, if no API key is available, generate a comprehensive mock response
    if (config.authMethod === "trial" && (!apiKey || apiKey.trim() === "")) {
      logger.info("Using mock response generator for trial mode")
      return generateMockResponse(systemPrompt, userPrompt)
    }
  }

  // Check if we have a valid API key (only for non-trial modes)
  if (config.authMethod !== "trial" && (!apiKey || apiKey.trim() === "")) {
    if (config.authMethod === "passphrase") {
      throw new Error(
        "Passphrase authentication is currently unavailable. Please go back to the authentication step and use your own API key instead.",
      )
    } else {
      throw new Error("API key is required for Mistral API calls.")
    }
  }

  const { model = "mistral-small-latest", temperature = 0.7, maxTokens = 2000 } = config

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ]

  // If refinement feedback is provided, add the current content and feedback
  if (config.refinementFeedback && config.currentContent) {
    messages.push(
      { role: "assistant", content: config.currentContent },
      { role: "user", content: `Please refine the above content based on this feedback: ${config.refinementFeedback}` },
    )
  }

  // Log the API call (without sensitive information)
  logger.info(`Making Mistral API call with auth method: ${config.authMethod}`, {
    model,
    authMethod: config.authMethod,
    isUsingDefaultKey: config.authMethod === "passphrase" || config.authMethod === "trial",
  })

  // If we're in trial mode and don't have a valid API key, return a mock response
  if (config.authMethod === "trial" && (!apiKey || apiKey.trim() === "")) {
    return generateMockResponse(systemPrompt, userPrompt)
  }

  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: temperature,
        max_tokens: maxTokens,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: "Unknown error" } }))
      const errorMessage = errorData.error?.message || `Mistral API request failed with status ${response.status}`

      // If in trial mode and API call fails, fall back to mock response
      if (config.authMethod === "trial") {
        logger.warn(`Trial mode API call failed, falling back to mock response: ${errorMessage}`)
        return generateMockResponse(systemPrompt, userPrompt)
      }

      throw new Error(errorMessage)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    // If in trial mode and there's an error, fall back to mock response
    if (config.authMethod === "trial") {
      logger.warn(
        `Trial mode API call error, falling back to mock response: ${error instanceof Error ? error.message : "Unknown error"}`,
      )
      return generateMockResponse(systemPrompt, userPrompt)
    }

    // For other auth methods, rethrow the error
    throw error
  }
}

/**
 * Gets the appropriate model name for the provider
 *
 * @param provider - The API provider (openai or mistral)
 * @returns The default model name for the provider
 */
export function getDefaultModelForProvider(provider: ApiProvider): string {
  if (provider === "openai") {
    return "gpt-4"
  } else if (provider === "mistral") {
    return "mistral-small-latest"
  } else {
    throw new Error(`Unsupported API provider: ${provider}`)
  }
}

/**
 * Validates a passphrase against the stored hashed passphrase
 * Uses bcrypt to securely compare the provided passphrase with the stored hash
 *
 * @param passphrase - The plain text passphrase to validate
 * @returns A Promise that resolves to a boolean indicating whether the passphrase is valid
 */
export async function validatePassphrase(passphrase: string): Promise<boolean> {
  try {
    // Get the hashed passphrase from environment variables
    const hashedPassphrase = process.env.HASHED_PASSPHRASE

    // If no hashed passphrase is configured, validation fails
    if (!hashedPassphrase) {
      logger.error("No hashed passphrase configured in environment variables")
      return false
    }

    // Use bcrypt to compare the provided passphrase with the stored hash
    // This is a secure way to validate passwords without storing them in plain text

    // Trim the passphrase to remove any leading/trailing whitespace
    const trimmedPassphrase = passphrase.trim()
    // Use bcrypt to compare the trimmed passphrase with the stored hash
    const isValid = await bcrypt.compare(trimmedPassphrase, hashedPassphrase)

    logger.info(`Passphrase validation ${isValid ? "succeeded" : "failed"}`)
    return isValid
  } catch (error) {
    // Log any errors that occur during validation
    logger.error("Error validating passphrase", error)
    return false
  }
}

/**
 * Checks if the trial mode is available
 * Always returns true to allow trial mode regardless of API key availability
 *
 * @returns A boolean indicating whether trial mode is available
 */
export function isTrialModeAvailable(): boolean {
  return true // Always return true to allow trial mode
}

// Update the generateOCMArtifact function to bypass trial mode availability check
export async function generateOCMArtifact(
  artifactType: string,
  projectData: ProjectData,
  config: ApiConfig,
): Promise<string> {
  const startTime = Date.now()
  const isRefinement = !!config.refinementFeedback
  const isPassphrase = config.authMethod === "passphrase"
  const isTrial = config.authMethod === "trial"

  try {
    // Remove the trial mode availability check
    // We'll allow trial mode to proceed regardless of DEFAULT_MISTRAL_API_KEY

    // Use the default model for the provider if not specified
    const model = config.model || getDefaultModelForProvider(config.apiProvider)

    logger.info(
      `${isRefinement ? "Refining" : "Generating"} ${artifactType} using ${config.apiProvider} (${model}) for project ${projectData.name}`,
      {
        authMethod: config.authMethod || config.apiProvider,
      },
    )

    // Get the appropriate prompt template for this artifact type
    const promptTemplate =
      ARTIFACT_TYPE_TO_PROMPT[artifactType] ||
      `Generate a ${artifactType} for the following project details:

{projectDetails}`

    // Format the prompt with project data
    const userPrompt = formatPromptWithProjectData(promptTemplate, projectData)

    // Call the appropriate API based on the provider
    let result: string
    if (config.apiProvider === "openai") {
      result = await callOpenAIAPI(SYSTEM_PROMPT, userPrompt, config)
    } else {
      result = await callMistralAPI(SYSTEM_PROMPT, userPrompt, config)
    }

    const latencyMs = Date.now() - startTime

    // Log and capture metrics
    logger.info(`${isRefinement ? "Refined" : "Generated"} ${artifactType} in ${latencyMs}ms`, {
      artifactType,
      projectName: projectData.name,
      provider: config.apiProvider,
      authMethod: config.authMethod || config.apiProvider,
      model: model,
      latencyMs,
      isRefinement,
      isPassphrase,
      isTrial,
    })

    captureLLMMetrics({
      provider: config.apiProvider,
      authMethod: config.authMethod || config.apiProvider,
      model: model,
      latencyMs,
      success: true,
      artifactType,
      isRefinement,
      isPassphrase: isPassphrase || isTrial,
    })

    return result
  } catch (error) {
    const latencyMs = Date.now() - startTime

    // Log the error
    logger.error(`Failed to ${isRefinement ? "refine" : "generate"} ${artifactType} with ${config.apiProvider}`, error)

    // Capture error metrics
    captureLLMMetrics({
      provider: config.apiProvider,
      authMethod: config.authMethod || config.apiProvider,
      model: config.model || getDefaultModelForProvider(config.apiProvider),
      latencyMs,
      success: false,
      errorType: error instanceof Error ? error.name : "Unknown",
      artifactType,
      isRefinement,
      isPassphrase: isPassphrase || isTrial,
    })

    // Provide a more helpful error message
    let errorMessage = `Failed to generate ${artifactType}. `

    if (error instanceof Error) {
      errorMessage += error.message
    } else {
      if (isPassphrase) {
        errorMessage +=
          "There was an issue with the passphrase authentication. Please try using your own API key instead."
      } else if (isTrial) {
        errorMessage += "There was an issue with the trial mode. Please try using your own API key instead."
      } else {
        errorMessage += `Please check your ${config.apiProvider} API key and try again.`
      }
    }

    // Add provider-specific troubleshooting tips
    if (!isPassphrase && !isTrial) {
      if (config.apiProvider === "mistral") {
        errorMessage += " Make sure you're using a valid Mistral API key from https://console.mistral.ai/api-keys/"
      } else if (config.apiProvider === "openai") {
        errorMessage += " Make sure you're using a valid OpenAI API key from https://platform.openai.com/api-keys"
      }
    }

    throw new Error(errorMessage)
  }
}

