// ============================================================================
// ConformVault TypeScript SDK — KeysService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  APIKey,
  CreateAPIKeyRequest,
  CreateAPIKeyResponse,
  ListResponse,
  DataResponse,
} from './types.js';

/**
 * Service for managing API keys in ConformVault.
 */
export class KeysService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /**
   * List all API keys for the organization.
   */
  async list(): Promise<APIKey[]> {
    const resp = await this.client.request<ListResponse<APIKey>>('GET', '/keys');
    return resp.data;
  }

  /**
   * Create a new API key. The full key is returned once and must be stored securely.
   */
  async create(request: CreateAPIKeyRequest): Promise<CreateAPIKeyResponse> {
    const resp = await this.client.request<DataResponse<CreateAPIKeyResponse>>(
      'POST',
      '/keys',
      request,
    );
    return resp.data;
  }

  /**
   * Get a single API key by ID (key value is not included).
   */
  async get(keyId: string): Promise<APIKey> {
    const resp = await this.client.request<DataResponse<APIKey>>('GET', `/keys/${keyId}`);
    return resp.data;
  }

  /**
   * Revoke (delete) an API key.
   */
  async revoke(keyId: string): Promise<void> {
    await this.client.request('DELETE', `/keys/${keyId}`);
  }

  /**
   * Rotate an API key. Returns a new key value.
   */
  async rotate(keyId: string): Promise<CreateAPIKeyResponse> {
    const resp = await this.client.request<DataResponse<CreateAPIKeyResponse>>(
      'POST',
      `/keys/${keyId}/rotate`,
    );
    return resp.data;
  }
}
