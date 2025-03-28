/**
 * This file contains type definitions used throughout the application
 */

/**
 * API provider type - either OpenAI or Mistral
 * Used to determine which API to call for generating content
 */
export type ApiProvider = "openai" | "mistral"

/**
 * Error types that can occur during API calls
 * Used for better error handling and reporting
 */
export enum ApiErrorType {
  /** Authentication error (invalid API key) */
  AUTH_ERROR = "auth_error",
  /** Rate limit exceeded */
  RATE_LIMIT = "rate_limit",
  /** Server error from the API provider */
  SERVER_ERROR = "server_error",
  /** Network error (connection issues) */
  NETWORK_ERROR = "network_error",
  /** Unknown or unexpected error */
  UNKNOWN_ERROR = "unknown_error",
}

/**
 * Response structure for API calls
 * Used to standardize API responses
 */
export interface ApiResponse<T> {
  /** Whether the API call was successful */
  success: boolean
  /** The data returned by the API (if successful) */
  data?: T
  /** Error information (if unsuccessful) */
  error?: {
    /** Type of error that occurred */
    type: ApiErrorType
    /** Error message */
    message: string
    /** Original error object (if available) */
    originalError?: unknown
  }
}

