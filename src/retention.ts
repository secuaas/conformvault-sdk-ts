// ============================================================================
// ConformVault TypeScript SDK — RetentionService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  RetentionPolicy,
  CreateRetentionPolicyRequest,
  UpdateRetentionPolicyRequest,
  ListResponse,
  DataResponse,
} from './types.js';

/**
 * Service for managing retention policies in ConformVault.
 */
export class RetentionService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /**
   * Create a new retention policy.
   */
  async create(request: CreateRetentionPolicyRequest): Promise<RetentionPolicy> {
    const resp = await this.client.request<DataResponse<RetentionPolicy>>('POST', '/retention-policies', request);
    return resp.data;
  }

  /**
   * List all retention policies.
   */
  async list(): Promise<RetentionPolicy[]> {
    const resp = await this.client.request<ListResponse<RetentionPolicy>>('GET', '/retention-policies');
    return resp.data;
  }

  /**
   * Get a retention policy by ID.
   */
  async get(policyId: string): Promise<RetentionPolicy> {
    const resp = await this.client.request<DataResponse<RetentionPolicy>>('GET', `/retention-policies/${policyId}`);
    return resp.data;
  }

  /**
   * Update a retention policy.
   */
  async update(policyId: string, request: UpdateRetentionPolicyRequest): Promise<RetentionPolicy> {
    const resp = await this.client.request<DataResponse<RetentionPolicy>>('PATCH', `/retention-policies/${policyId}`, request);
    return resp.data;
  }

  /**
   * Delete a retention policy.
   */
  async delete(policyId: string): Promise<void> {
    await this.client.request('DELETE', `/retention-policies/${policyId}`);
  }
}
