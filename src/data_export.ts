// ============================================================================
// ConformVault TypeScript SDK — DataExportService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type { DataResponse } from './types.js';

/** User data export package (GDPR/Loi 25). */
export interface UserDataExport {
  user_id: string;
  status: string;
  url?: string;
  expires_at?: string;
  created_at: string;
}

/**
 * Service for user data exports (GDPR/Loi 25 compliance).
 */
export class DataExportService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /** Request a data export for a user. */
  async export(userId: string): Promise<UserDataExport> {
    const resp = await this.client.request<DataResponse<UserDataExport>>('GET', `/users/${userId}/export`);
    return resp.data;
  }
}
