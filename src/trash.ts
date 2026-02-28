// ============================================================================
// ConformVault TypeScript SDK — TrashService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  File,
  TrashListOptions,
  TrashListResponse,
  EmptyTrashResponse,
} from './types.js';

/**
 * Service for managing trashed files in ConformVault.
 */
export class TrashService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /**
   * List all files in the trash.
   *
   * @param opts - Optional pagination parameters.
   * @returns Trashed files with pagination metadata.
   */
  async list(opts?: TrashListOptions): Promise<TrashListResponse> {
    const params = new URLSearchParams();
    if (opts?.page) params.set('page', String(opts.page));
    if (opts?.limit) params.set('limit', String(opts.limit));

    const query = params.toString();
    const path = '/trash' + (query ? `?${query}` : '');

    return this.client.request<TrashListResponse>('GET', path);
  }

  /**
   * Restore a file from the trash.
   *
   * @param fileId - The file ID to restore.
   */
  async restore(fileId: string): Promise<void> {
    await this.client.request('POST', `/trash/${fileId}/restore`);
  }

  /**
   * Permanently delete a file from the trash.
   *
   * @param fileId - The file ID to permanently delete.
   */
  async delete(fileId: string): Promise<void> {
    await this.client.request('DELETE', `/trash/${fileId}`);
  }

  /**
   * Empty the entire trash. All trashed files are permanently deleted.
   *
   * @returns Summary with message and count of deleted files.
   */
  async empty(): Promise<EmptyTrashResponse> {
    return this.client.request<EmptyTrashResponse>('DELETE', '/trash');
  }
}
