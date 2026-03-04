// ============================================================================
// ConformVault TypeScript SDK — QuotaService & RateLimitService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  QuotaInfo,
  RateLimitInfo,
  DataResponse,
} from './types.js';

/**
 * Service for querying storage quota information in ConformVault.
 */
export class QuotaService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /**
   * Get current quota usage and limits.
   */
  async get(): Promise<QuotaInfo> {
    const resp = await this.client.request<DataResponse<QuotaInfo>>('GET', '/quota');
    return resp.data;
  }
}

/**
 * Service for querying rate limit information in ConformVault.
 */
export class RateLimitService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /**
   * Get current rate limit status.
   */
  async get(): Promise<RateLimitInfo> {
    const resp = await this.client.request<DataResponse<RateLimitInfo>>('GET', '/rate-limit');
    return resp.data;
  }
}
