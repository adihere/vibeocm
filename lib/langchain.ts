import { ChatOpenAI } from "@langchain/openai"
import { MistralAI } from "@langchain/mistralai";
import { StringOutputParser } from "@langchain/core/output_parsers"
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "@langchain/core/prompts"
import { logger } from "@/lib/logger"
import { logError } from './error-logger'
import type { ProjectData } from "@/components/vibe-ocm-single-page"
import type { ApiProvider } from "@/lib/types"
import { SYSTEM_PROMPT, ARTIFACT_TYPE_TO_PROMPT, formatPromptWithProjectData } from "@/prompts.config"

const CONSOLE_DEBUGGING_ENABLED = process.env.NEXT_PUBLIC_CONSOLE_DEBUGGING_ENABLED === "true" || false

console.log("Console debugging enabled:", CONSOLE_DEBUGGING_ENABLED)

/**
 * Configuration for LangChain API requests
 */
interface LangChainConfig {
  /** API key */
  apiKey: string
  /** API provider (openai or mistral) */
  apiProvider: ApiProvider
  /** Model to use for generation */
  model: string
  /** Maximum number of tokens to generate */
  maxTokens?: number
  /** Temperature for controlling randomness (0-1) */
  temperature?: number
  /** Feedback for refinement (if refining existing content) */
  refinementFeedback?: string
  /** Current content (if refining) */
  currentContent?: string
}

/**
 * Response from the LangChain API
 */
interface LangChainResponse {
  /** Generated content text */
  content: string
  /** Token usage statistics (if available) */
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

/**
 * Creates a LangChain chat model for OpenAI
 *
 * @param config - Configuration for the LangChain model
 * @returns A LangChain chat model
 */
function createOpenAIChatModel(config: LangChainConfig) {
  const { apiKey, model, temperature = 0.7, maxTokens = 2000 } = config
  return new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: model,
    temperature,
    maxTokens,
  })
}

/**
 * Makes a direct API call to Mistral API
 * This is used as a fallback when the @langchain/mistral package is not available
 *
 * @param systemPrompt - The system prompt
 * @param userPrompt - The user prompt
 * @param config - Configuration for the API call
 * @returns The generated content
 */
async function callMistralAPI(systemPrompt: string, userPrompt: string, config: LangChainConfig): Promise<string> {
  const { apiKey, model, temperature = 0.7, maxTokens = 2000 } = config
  const maxRetries = 3
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: temperature,
          max_tokens: maxTokens,
        }),
      })

      // Check if response is OK before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        // Log the error response for debugging
        if (CONSOLE_DEBUGGING_ENABLED) {
          console.log("Mistral API error response:", errorText);
        }
        throw new Error(`Mistral API request failed with status ${response.status}: ${errorText}`);
      }

      // Parse response as JSON
      let responseData;
      try {
        responseData = await response.json();
      } catch (jsonError) {
        const rawText = await response.text();
        throw new Error(`Failed to parse Mistral API response as JSON: ${rawText.substring(0, 100)}...`);
      }

      if (!responseData.choices?.[0]?.message?.content) {
        throw new Error("Invalid response format from Mistral API")
      }

      return responseData.choices[0].message.content
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      // Log error with context
      const logEntry = logError(lastError, 'Mistral API Call', {
        attempt: attempt + 1,
        maxRetries,
        apiProvider: config.apiProvider,
        model: config.model
      });
      logger.warn(`Mistral API attempt ${attempt + 1} failed:`, logEntry);
      
      // Only wait and retry if we haven't reached max retries
      if (attempt < maxRetries - 1) {
        // Exponential backoff: wait longer between each retry
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
        continue
      }
    }
  }

  // If we've exhausted all retries, throw the last error
  throw new Error(`Failed to call Mistral API after ${maxRetries} attempts: ${lastError?.message}`)
}

/**
 * Generates an OCM artifact using LangChain for OpenAI or direct API for Mistral
 *
 * @param artifactType - The type of artifact to generate (e.g., "Change Management Plan")
 * @param projectData - The project data to use for generation
 * @param config - Configuration for the LangChain request
 * @returns The generated artifact content as a string
 * @throws Error if the LangChain request fails
 */
export async function generateOCMArtifactWithLangChain(
  artifactType: string,
  projectData: ProjectData,
  config: LangChainConfig,
): Promise<string> {
  const startTime = Date.now()
  try {
    logger.info(
      `Generating ${artifactType} using ${config.apiProvider === "openai" ? "LangChain" : "Direct API"} with ${config.apiProvider} for project ${projectData.name}`,
    )

    // Get the appropriate prompt template for this artifact type
    const promptTemplate =
      ARTIFACT_TYPE_TO_PROMPT[artifactType] ||
      `Generate a ${artifactType} for the following project details:\n\n{projectDetails}`
    
    // Format the prompt with project data
    const userPrompt = formatPromptWithProjectData(promptTemplate, projectData)
    
    let result: string
    
    if (config.apiProvider === "openai") {
      // Use LangChain for OpenAI
      const model = createOpenAIChatModel(config)
      
      // Create a prompt template
      const chatPrompt = ChatPromptTemplate.fromMessages([
        SystemMessagePromptTemplate.fromTemplate(SYSTEM_PROMPT),
        HumanMessagePromptTemplate.fromTemplate(userPrompt),
      ])
      
      // Create a chain
      const chain = chatPrompt.pipe(model).pipe(new StringOutputParser())
      
      // Execute the chain
      result = await chain.invoke({})
    } else {
      // Use direct API call for Mistral
      result = await callMistralAPI(SYSTEM_PROMPT, userPrompt, config)
    }

    const latencyMs = Date.now() - startTime
    // Log and capture metrics
    logger.info(`Generated ${artifactType} in ${latencyMs}ms`, {
      artifactType,
      projectName: projectData.name,
      provider: config.apiProvider,
      model: config.model,
      latencyMs,
      usedLangChain: config.apiProvider === "openai",
    })
    
    return result
  } catch (error) {
    const latencyMs = Date.now() - startTime
    logError(error, 'Generate OCM Artifact', {
      artifactType,
      projectName: projectData.name,
      provider: config.apiProvider,
      model: config.model,
      latencyMs
    })
    
    // Provide a more helpful error message
    let errorMessage = `Failed to generate ${artifactType}. `
    if (error instanceof Error) {
      errorMessage += error.message
    } else {
      errorMessage += `Please check your ${config.apiProvider} API key and try again.`
    }
    
    // Add provider-specific troubleshooting tips
    if (config.apiProvider === "mistral") {
      errorMessage += " Make sure you're using a valid Mistral API key from https://console.mistral.ai/api-keys/"
    } else if (config.apiProvider === "openai") {
      errorMessage += " Make sure you're using a valid OpenAI API key from https://platform.openai.com/api-keys"
    }
    
    throw new Error(errorMessage)
  }
}

/**
 * Generates an OCM artifact using LangChain for Mistral
 *
 * @param artifactType - The type of artifact to generate (e.g., "Change Management Plan")
 * @param projectData - The project data to use for generation
 * @param config - Configuration for the LangChain request
 * @returns The generated artifact content as a string
 * @throws Error if the LangChain request fails
 */
export async function generateOCMArtifactWithLangChainMistral(
  artifactType: string,
  projectData: ProjectData,
  config: LangChainConfig,
): Promise<string> {
  const startTime = Date.now()
  try {
    logger.info(
      `Generating ${artifactType} using LangChain with Mistral for project ${projectData.name}`,
    )

    // Get the appropriate prompt template for this artifact type
    const promptTemplate =
      ARTIFACT_TYPE_TO_PROMPT[artifactType] ||
      `Generate a ${artifactType} for the following project details:\n\n{projectDetails}`
    
    // Format the prompt with project data
    const userPrompt = formatPromptWithProjectData(promptTemplate, projectData)
    
    // Create a MistralAI instance using LangChain
    const { apiKey, model, temperature = 0.7, maxTokens = 2000 } = config
    const llm = new MistralAI({
      apiKey: apiKey,
      model: model,
      temperature: temperature,
      maxTokens: maxTokens,
    })
    
    // Create a prompt template
    const chatPrompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(SYSTEM_PROMPT),
      HumanMessagePromptTemplate.fromTemplate(userPrompt),
    ])
    
    // Create a chain
    const chain = chatPrompt.pipe(llm).pipe(new StringOutputParser())
    
    // Execute the chain
    const result = await chain.invoke({})

    const latencyMs = Date.now() - startTime
    // Log and capture metrics
    logger.info(`Generated ${artifactType} in ${latencyMs}ms`, {
      artifactType,
      projectName: projectData.name,
      provider: "mistral",
      model: config.model,
      latencyMs,
      usedLangChain: true,
    })
    
    return result
  } catch (error) {
    const latencyMs = Date.now() - startTime
    logError(error, 'Generate OCM Artifact with Mistral', {
      artifactType,
      projectName: projectData.name,
      provider: "mistral",
      model: config.model,
      latencyMs
    })
    
    // Provide a more helpful error message
    let errorMessage = `Failed to generate ${artifactType} with Mistral. `
    if (error instanceof Error) {
      errorMessage += error.message
    } else {
      errorMessage += `Please check your Mistral API key and try again.`
    }
    
    errorMessage += " Make sure you're using a valid Mistral API key from https://console.mistral.ai/api-keys/"
    
    throw new Error(errorMessage)
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

export const DEFAULT_MISTRAL_API_KEY = process.env.NEXT_PUBLIC_MISTRAL_API_KEY || '';
