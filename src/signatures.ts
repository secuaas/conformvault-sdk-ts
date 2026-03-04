// ============================================================================
// ConformVault TypeScript SDK — SignaturesService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  SignatureEnvelope,
  CreateSignatureRequest,
  DataResponse,
} from './types.js';

/**
 * Service for managing electronic signature envelopes in ConformVault.
 */
export class SignaturesService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /**
   * List all signature envelopes for the organization.
   */
  async list(): Promise<SignatureEnvelope[]> {
    const resp = await this.client.request<DataResponse<SignatureEnvelope[]>>(
      'GET',
      '/signatures',
    );
    return resp.data;
  }

  /**
   * Create a new signature envelope.
   */
  async create(request: CreateSignatureRequest): Promise<SignatureEnvelope> {
    const resp = await this.client.request<DataResponse<SignatureEnvelope>>(
      'POST',
      '/signatures',
      request,
    );
    return resp.data;
  }

  /**
   * Get the current status of a signature envelope.
   */
  async getStatus(envelopeId: string): Promise<SignatureEnvelope> {
    const resp = await this.client.request<DataResponse<SignatureEnvelope>>(
      'GET',
      `/signatures/${envelopeId}`,
    );
    return resp.data;
  }

  /**
   * Download the completed signed document. Returns a Response object for streaming.
   */
  async downloadSigned(envelopeId: string): Promise<Response> {
    return this.client.requestRaw('GET', `/signatures/${envelopeId}/download`);
  }

  /**
   * Download the audit trail (completion certificate) PDF.
   */
  async downloadAuditTrail(envelopeId: string): Promise<Response> {
    return this.client.requestRaw('GET', `/signatures/${envelopeId}/audit-trail`);
  }

  /**
   * Revoke (cancel) a pending signature envelope.
   */
  async revoke(envelopeId: string): Promise<void> {
    await this.client.request('POST', `/signatures/${envelopeId}/revoke`);
  }
}
