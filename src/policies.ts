// ============================================================================
// ConformVault TypeScript SDK — PoliciesService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  IPPolicy,
  SetIPPolicyRequest,
  MFAPolicy,
  SetMFAPolicyRequest,
  DataResponse,
} from './types.js';

/**
 * Service for managing security policies in ConformVault.
 */
export class PoliciesService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /**
   * Get the current IP allowlist/denylist policy.
   */
  async getIPPolicy(): Promise<IPPolicy> {
    const resp = await this.client.request<DataResponse<IPPolicy>>('GET', '/ip-policy');
    return resp.data;
  }

  /**
   * Set the IP allowlist/denylist policy.
   */
  async setIPPolicy(request: SetIPPolicyRequest): Promise<IPPolicy> {
    const resp = await this.client.request<DataResponse<IPPolicy>>('PUT', '/ip-policy', request);
    return resp.data;
  }

  /**
   * Get the current MFA policy.
   */
  async getMFAPolicy(): Promise<MFAPolicy> {
    const resp = await this.client.request<DataResponse<MFAPolicy>>('GET', '/mfa-policy');
    return resp.data;
  }

  /**
   * Set the MFA policy.
   */
  async setMFAPolicy(request: SetMFAPolicyRequest): Promise<MFAPolicy> {
    const resp = await this.client.request<DataResponse<MFAPolicy>>('PUT', '/mfa-policy', request);
    return resp.data;
  }

}
