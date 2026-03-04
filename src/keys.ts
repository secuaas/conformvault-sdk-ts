// ============================================================================
// ConformVault TypeScript SDK — KeysService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  APIKey,
  KeyListOptions,
  CreateAPIKeyRequest,
  CreateAPIKeyResponse,
  ListResponse,
  DataResponse,
} from './types.js';

/** API key revocation status. */
export interface KeyRevocationStatus {
  key_id: string;
  revoked: boolean;
  revoked_at?: string;
}

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
  async list(opts?: KeyListOptions): Promise<APIKey[]> {
    const params = new URLSearchParams();
    if (opts?.page) params.set('page', String(opts.page));
    if (opts?.limit) params.set('limit', String(opts.limit));

    const query = params.toString();
    const path = '/keys' + (query ? `?${query}` : '');

    const resp = await this.client.request<ListResponse<APIKey>>('GET', path);
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

  /** Instantly revoke an API key via Redis. */
  async instantRevoke(keyId: string): Promise<void> {
    await this.client.request('POST', `/api-keys/${keyId}/revoke`);
  }

  /** Check the revocation status of an API key. */
  async getRevocationStatus(keyId: string): Promise<KeyRevocationStatus> {
    const resp = await this.client.request<DataResponse<KeyRevocationStatus>>('GET', `/api-keys/${keyId}/revocation-status`);
    return resp.data;
  }
}
