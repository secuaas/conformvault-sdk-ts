// ============================================================================
// ConformVault TypeScript SDK — Encryption Service
// ============================================================================

import type { ConformVaultClient } from './client.js';
import { isNotFound } from './errors.js';

/** Response from GET /encryption/salt */
export interface EncryptionSaltResponse {
  salt: string; // base64-encoded 16-byte salt
}

/**
 * Encryption-related operations (salt sync for cross-platform E2E).
 *
 * @example
 * ```typescript
 * // Get existing salt
 * const existing = await client.encryption.getSalt();
 * if (existing) {
 *   console.log('Salt:', existing.salt);
 * }
 *
 * // Store a new salt
 * await client.encryption.setSalt('base64EncodedSalt==');
 * ```
 */
export class EncryptionService {
  constructor(private readonly client: ConformVaultClient) {}

  /**
   * Get the stored encryption salt for the authenticated user.
   * Returns null if no salt has been stored yet (404).
   */
  async getSalt(): Promise<EncryptionSaltResponse | null> {
    try {
      return await this.client.request<EncryptionSaltResponse>('GET', '/encryption/salt');
    } catch (err: unknown) {
      if (isNotFound(err)) {
        return null;
      }
      throw err;
    }
  }

  /**
   * Store or update the encryption salt for the authenticated user.
   * Salt must be a base64-encoded string that decodes to exactly 16 bytes.
   */
  async setSalt(saltBase64: string): Promise<void> {
    await this.client.request<{ message: string }>('PUT', '/encryption/salt', {
      salt: saltBase64,
    });
  }
}
