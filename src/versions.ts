// ============================================================================
// ConformVault TypeScript SDK — VersionsService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type { FileVersion, ListResponse, DataResponse } from './types.js';

/**
 * Service for managing file versions in ConformVault.
 */
export class VersionsService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /**
   * List all versions of a file.
   *
   * @param fileId - The file ID.
   * @returns Array of file versions.
   */
  async list(fileId: string): Promise<FileVersion[]> {
    const resp = await this.client.request<ListResponse<FileVersion>>(
      'GET',
      `/files/${fileId}/versions`,
    );
    return resp.data;
  }

  /**
   * Get a specific file version.
   *
   * @param fileId - The file ID.
   * @param versionId - The version ID.
   * @returns The file version details.
   */
  async get(fileId: string, versionId: string): Promise<FileVersion> {
    const resp = await this.client.request<DataResponse<FileVersion>>(
      'GET',
      `/files/${fileId}/versions/${versionId}`,
    );
    return resp.data;
  }

  /**
   * Restore a file to a previous version.
   *
   * @param fileId - The file ID.
   * @param versionId - The version ID to restore.
   */
  async restore(fileId: string, versionId: string): Promise<void> {
    await this.client.request(
      'POST',
      `/files/${fileId}/versions/${versionId}/restore`,
    );
  }

  /**
   * Permanently delete a specific file version.
   *
   * @param fileId - The file ID.
   * @param versionId - The version ID to delete.
   */
  async delete(fileId: string, versionId: string): Promise<void> {
    await this.client.request(
      'DELETE',
      `/files/${fileId}/versions/${versionId}`,
    );
  }
}
