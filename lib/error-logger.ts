// Browser-safe error logging utility

/**
 * Log error information to console and optionally to a server endpoint
 */
export function logError(error: Error | unknown, context: string, metadata: Record<string, any> = {}) {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : String(error);
  const stackTrace = error instanceof Error ? error.stack : 'No stack trace available';
  
  const logEntry = {
    timestamp,
    context,
    error: errorMessage,
    stackTrace,
    ...metadata
  };
  

  // Send to server endpoint for logging
  try {
    fetch('/api/log-error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logEntry),
    }).catch(e => console.warn('Failed to send error log to server:', e));
  } catch (e) {
    console.warn('Failed to send error log to server:', e);
  }

  return logEntry; // Return for possible local handling
}
