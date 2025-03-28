import { logger } from "@/lib/logger"
import type { ProjectData } from "@/components/vibe-ocm-single-page"
import type { ApiProvider } from "@/lib/types"
import { generateOCMArtifactWithLangChain, getDefaultModelForProvider } from "@/lib/langchain"

/**
 * Configuration for API requests
 */
interface ApiConfig {
  /** API key */
  apiKey: string
  /** API provider (openai or mistral) */
  apiProvider: ApiProvider
  /** Model to use for generation */
  model?: string
  /** Maximum number of tokens to generate */
  maxTokens?: number
  /** Temperature for controlling randomness (0-1) */
  temperature?: number
}

/**
 * Generates an OCM artifact using LangChain for OpenAI or direct API for Mistral
 *
 * @param artifactType - The type of artifact to generate (e.g., "Change Management Plan")
 * @param projectData - The project data to use for generation
 * @param config - Configuration for the API request
 * @returns The generated artifact content as a string
 * @throws Error if the API request fails
 */
export async function generateOCMArtifact(
  artifactType: string,
  projectData: ProjectData,
  config: ApiConfig,
): Promise<string> {
  const startTime = Date.now()

  try {
    // Use the default model for the provider if not specified
    const model = config.model || getDefaultModelForProvider(config.apiProvider)

    logger.info(`Generating ${artifactType} using ${config.apiProvider} (${model}) for project ${projectData.name}`)

    // Use LangChain to generate the artifact
    const content = await generateOCMArtifactWithLangChain(artifactType, projectData, {
      apiKey: config.apiKey,
      apiProvider: config.apiProvider,
      model: model,
      maxTokens: config.maxTokens,
      temperature: config.temperature,
    })

    const latencyMs = Date.now() - startTime

    // Log and capture metrics
    logger.info(`Generated ${artifactType} in ${latencyMs}ms`, {
      artifactType,
      projectName: projectData.name,
      provider: config.apiProvider,
      model: model,
      latencyMs,
    })

    return content
  } catch (error) {
    const latencyMs = Date.now() - startTime

    // Log the error
    logger.error(`Failed to generate ${artifactType} with ${config.apiProvider}`, error)

    // Re-throw the error for the caller to handle
    throw error
  }
}

