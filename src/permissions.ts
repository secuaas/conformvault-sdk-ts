// ============================================================================
// ConformVault TypeScript SDK — PermissionsService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  FolderPermission,
  SetFolderPermissionRequest,
  ListResponse,
  DataResponse,
} from './types.js';

/**
 * Service for managing folder permissions in ConformVault.
 */
export class PermissionsService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /**
   * Set a permission on a folder for a user.
   */
  async set(folderId: string, request: SetFolderPermissionRequest): Promise<FolderPermission> {
    const resp = await this.client.request<DataResponse<FolderPermission>>('POST', `/folders/${folderId}/permissions`, request);
    return resp.data;
  }

  /**
   * Get all permissions for a folder.
   */
  async get(folderId: string): Promise<FolderPermission[]> {
    const resp = await this.client.request<ListResponse<FolderPermission>>('GET', `/folders/${folderId}/permissions`);
    return resp.data;
  }

  /**
   * Revoke a user's permission on a folder.
   */
  async revoke(folderId: string, userId: string): Promise<void> {
    await this.client.request('DELETE', `/folders/${folderId}/permissions/${userId}`);
  }
}
