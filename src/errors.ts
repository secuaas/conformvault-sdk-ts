// ============================================================================
// ConformVault TypeScript SDK — Error Classes
// ============================================================================

/**
 * Base error class for all ConformVault SDK errors.
 */
export class ConformVaultError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConformVaultError';
    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Represents an error response from the ConformVault API.
 */
export class APIError extends ConformVaultError {
  /** HTTP status code of the response. */
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(`HTTP ${statusCode}: ${message}`);
    this.name = 'APIError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Returned when the API responds with 429 Too Many Requests.
 */
export class RateLimitError extends APIError {
  /** Number of seconds to wait before retrying. */
  public readonly retryAfter: number;

  constructor(retryAfter: number, message = 'rate limited') {
    super(429, message);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Returned when the API responds with 401 Unauthorized.
 */
export class AuthenticationError extends APIError {
  constructor(message = 'unauthorized') {
    super(401, message);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Checks if an error is a not-found (404) API error.
 */
export function isNotFound(err: unknown): boolean {
  return err instanceof APIError && err.statusCode === 404;
}

/**
 * Checks if an error is a rate-limit (429) error.
 */
export function isRateLimited(err: unknown): boolean {
  return err instanceof RateLimitError;
}
