// ============================================================================
// ConformVault TypeScript SDK — AttestationService
// ============================================================================

import type { ConformVaultClient } from './client.js';

/**
 * Service for generating compliance attestation documents in ConformVault.
 */
export class AttestationService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /**
   * Generate a Loi 25 compliance attestation PDF.
   * Returns a raw Response for streaming the PDF binary.
   */
  async generateLoi25(): Promise<Response> {
    return this.client.requestRaw('GET', '/attestation/loi25');
  }
}
