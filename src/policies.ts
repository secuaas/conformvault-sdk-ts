// ============================================================================
// ConformVault TypeScript SDK — PoliciesService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  IPPolicy,
  SetIPPolicyRequest,
  MFAPolicy,
  SetMFAPolicyRequest,
  EncryptionSalt,
  SetEncryptionSaltRequest,
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
    const resp = await this.client.request<DataResponse<IPPolicy>>('GET', '/policies/ip');
    return resp.data;
  }

  /**
   * Set the IP allowlist/denylist policy.
   */
  async setIPPolicy(request: SetIPPolicyRequest): Promise<IPPolicy> {
    const resp = await this.client.request<DataResponse<IPPolicy>>('PUT', '/policies/ip', request);
    return resp.data;
  }

  /**
   * Get the current MFA policy.
   */
  async getMFAPolicy(): Promise<MFAPolicy> {
    const resp = await this.client.request<DataResponse<MFAPolicy>>('GET', '/policies/mfa');
    return resp.data;
  }

  /**
   * Set the MFA policy.
   */
  async setMFAPolicy(request: SetMFAPolicyRequest): Promise<MFAPolicy> {
    const resp = await this.client.request<DataResponse<MFAPolicy>>('PUT', '/policies/mfa', request);
    return resp.data;
  }

  /**
   * Get the encryption salt.
   */
  async getEncryptionSalt(): Promise<EncryptionSalt> {
    const resp = await this.client.request<DataResponse<EncryptionSalt>>('GET', '/policies/encryption-salt');
    return resp.data;
  }

  /**
   * Set the encryption salt.
   */
  async setEncryptionSalt(request: SetEncryptionSaltRequest): Promise<EncryptionSalt> {
    const resp = await this.client.request<DataResponse<EncryptionSalt>>('PUT', '/policies/encryption-salt', request);
    return resp.data;
  }
}
