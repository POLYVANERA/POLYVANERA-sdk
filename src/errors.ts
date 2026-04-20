/**
 * Base error class for all POLYVANERA SDK errors.
 */
export class POLYVANERAError extends Error {
  code?: string;
  cause?: unknown;
  
  constructor(message: string, code?: string, cause?: unknown) {
    super(message);
    this.name = "POLYVANERAError";
    this.code = code;
    this.cause = cause;
  }
}

/**
 * Error thrown when an HTTP request fails.
 */
export class HttpError extends POLYVANERAError {
  status: number;
  
  constructor(status: number, message: string, cause?: unknown) {
    super(message, "HTTP_ERROR", cause);
    this.status = status;
  }
}
