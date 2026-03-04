// ============================================================================
// ConformVault TypeScript SDK — LegalHoldsService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  LegalHold,
  CreateLegalHoldRequest,
  AddLegalHoldFilesRequest,
  LegalHoldFile,
  ListResponse,
  DataResponse,
} from './types.js';

/**
 * Service for managing legal holds in ConformVault.
 */
export class LegalHoldsService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /**
   * Create a new legal hold.
   */
  async create(request: CreateLegalHoldRequest): Promise<LegalHold> {
    const resp = await this.client.request<DataResponse<LegalHold>>('POST', '/legal-holds', request);
    return resp.data;
  }

  /**
   * List all legal holds.
   */
  async list(): Promise<LegalHold[]> {
    const resp = await this.client.request<ListResponse<LegalHold>>('GET', '/legal-holds');
    return resp.data;
  }

  /**
   * Get a legal hold by ID.
   */
  async get(holdId: string): Promise<LegalHold> {
    const resp = await this.client.request<DataResponse<LegalHold>>('GET', `/legal-holds/${holdId}`);
    return resp.data;
  }

  /**
   * Release a legal hold.
   */
  async release(holdId: string): Promise<LegalHold> {
    const resp = await this.client.request<DataResponse<LegalHold>>('POST', `/legal-holds/${holdId}/release`);
    return resp.data;
  }

  /**
   * Add files to a legal hold.
   */
  async addFiles(holdId: string, request: AddLegalHoldFilesRequest): Promise<LegalHoldFile[]> {
    const resp = await this.client.request<ListResponse<LegalHoldFile>>('POST', `/legal-holds/${holdId}/files`, request);
    return resp.data;
  }

  /**
   * Remove a file from a legal hold.
   */
  async removeFile(holdId: string, fileId: string): Promise<void> {
    await this.client.request('DELETE', `/legal-holds/${holdId}/files/${fileId}`);
  }
}
