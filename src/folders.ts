// ============================================================================
// ConformVault TypeScript SDK — FoldersService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  Folder,
  FolderListOptions,
  CreateFolderRequest,
  ListResponse,
  DataResponse,
} from './types.js';

/**
 * Service for managing folders in ConformVault.
 */
export class FoldersService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /**
   * List folders, optionally filtered by parent.
   */
  async list(opts?: FolderListOptions): Promise<Folder[]> {
    const params = new URLSearchParams();
    if (opts?.parentId) params.set('parent_id', opts.parentId);
    if (opts?.page) params.set('page', String(opts.page));
    if (opts?.limit) params.set('limit', String(opts.limit));

    const query = params.toString();
    const path = '/folders' + (query ? `?${query}` : '');

    const resp = await this.client.request<ListResponse<Folder>>('GET', path);
    return resp.data;
  }

  /**
   * Get a single folder by ID.
   */
  async get(folderId: string): Promise<Folder> {
    const resp = await this.client.request<DataResponse<Folder>>('GET', `/folders/${folderId}`);
    return resp.data;
  }

  /**
   * Create a new folder.
   */
  async create(request: CreateFolderRequest): Promise<Folder> {
    const resp = await this.client.request<DataResponse<Folder>>('POST', '/folders', request);
    return resp.data;
  }

  /**
   * Delete a folder by ID.
   */
  async delete(folderId: string): Promise<void> {
    await this.client.request('DELETE', `/folders/${folderId}`);
  }
}
