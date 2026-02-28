// ============================================================================
// ConformVault TypeScript SDK — BulkService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  BulkDeleteRequest,
  BulkMoveRequest,
  BulkDownloadRequest,
  BulkResult,
} from './types.js';

/**
 * Service for bulk file operations in ConformVault.
 */
export class BulkService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /**
   * Bulk-delete multiple files.
   *
   * @param request - The file IDs to delete.
   * @returns Summary of deleted/failed items.
   */
  async delete(request: BulkDeleteRequest): Promise<BulkResult> {
    return this.client.request<BulkResult>('POST', '/files/bulk-delete', request);
  }

  /**
   * Bulk-move multiple files to a target folder.
   *
   * @param request - The file IDs and target folder.
   * @returns Summary of moved/failed items.
   */
  async move(request: BulkMoveRequest): Promise<BulkResult> {
    return this.client.request<BulkResult>('POST', '/files/bulk-move', request);
  }

  /**
   * Bulk-download multiple files as a ZIP archive.
   *
   * @param request - The file IDs to download.
   * @returns Raw Response containing the ZIP stream.
   */
  async download(request: BulkDownloadRequest): Promise<Response> {
    return this.client.requestRaw('POST', '/files/bulk-download', request);
  }
}
