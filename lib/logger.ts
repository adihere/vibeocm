/**
 * Logger utility for application-wide logging with different severity levels
 * Provides a consistent interface for logging throughout the application
 */

/**
 * Enum defining the available log levels
 */
export enum LogLevel {
  /** Detailed information, typically useful for debugging */
  DEBUG = "debug",
  /** General information about application operation */
  INFO = "info",
  /** Potentially harmful situations that don't prevent the application from working */
  WARN = "warn",
  /** Error events that might still allow the application to continue running */
  ERROR = "error",
}

/**
 * Configuration interface for the logger
 */
interface LoggerConfig {
  /** Minimum log level to process */
  minLevel: LogLevel
  /** Whether to output logs to the console */
  enableConsole: boolean
}

/**
 * Default configuration for the logger
 * Uses different defaults based on the environment
 */
const defaultConfig: LoggerConfig = {
  minLevel: process.env.NODE_ENV === "production" ? LogLevel.INFO : LogLevel.DEBUG,
  enableConsole: true,
}

/**
 * Logger class for handling application logs
 * Provides methods for different log levels and handles log filtering
 */
class Logger {
  private config: LoggerConfig

  /**
   * Creates a new Logger instance
   * @param config - Configuration options for the logger
   */
  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  /**
   * Logs a debug message
   * Use for detailed information that is helpful for debugging
   *
   * @param message - The message to log
   * @param data - Optional data to include with the log
   */
  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data)
  }

  /**
   * Logs an info message
   * Use for general information about application operation
   *
   * @param message - The message to log
   * @param data - Optional data to include with the log
   */
  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data)
  }

  /**
   * Logs a warning message
   * Use for potentially harmful situations that don't prevent the application from working
   *
   * @param message - The message to log
   * @param data - Optional data to include with the log
   */
  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data)
  }

  /**
   * Logs an error message
   * Use for error events that might still allow the application to continue running
   *
   * @param message - The message to log
   * @param error - The error object or additional data
   */
  error(message: string, error?: any): void {
    this.log(LogLevel.ERROR, message, error)
  }

  /**
   * Internal method to handle the actual logging
   * Formats the log entry and sends it to the appropriate outputs
   *
   * @param level - The log level
   * @param message - The message to log
   * @param data - Optional data to include with the log
   */
  private log(level: LogLevel, message: string, data?: any): void {
    // Skip if log level is below minimum configured level
    if (!this.shouldLog(level)) {
      return
    }

    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level,
      message,
      ...(data ? { data } : {}),
    }

    // Log to console if enabled
    if (this.config.enableConsole) {
      const consoleMethod = this.getConsoleMethod(level)
      if (data) {
        console[consoleMethod](`[${timestamp}] [${level.toUpperCase()}] ${message}`, data)
      } else {
        console[consoleMethod](`[${timestamp}] [${level.toUpperCase()}] ${message}`)
      }
    }

    // Here you could add additional logging targets like:
    // - Send to a logging service
    // - Write to a file
    // - Store in a database
  }

  /**
   * Determines if a log entry should be processed based on configured minimum level
   *
   * @param level - The log level to check
   * @returns Whether the log should be processed
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR]
    const configLevelIndex = levels.indexOf(this.config.minLevel)
    const currentLevelIndex = levels.indexOf(level)

    return currentLevelIndex >= configLevelIndex
  }

  /**
   * Maps log levels to console methods
   *
   * @param level - The log level
   * @returns The corresponding console method name
   */
  private getConsoleMethod(level: LogLevel): "debug" | "info" | "warn" | "error" {
    switch (level) {
      case LogLevel.DEBUG:
        return "debug"
      case LogLevel.INFO:
        return "info"
      case LogLevel.WARN:
        return "warn"
      case LogLevel.ERROR:
        return "error"
      default:
        return "info"
    }
  }
}

/**
 * Singleton instance of the Logger for app-wide use
 * Import this instance throughout the application for consistent logging
 */
export const logger = new Logger()

