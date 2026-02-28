// ============================================================================
// ConformVault TypeScript SDK — SearchService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type { SearchOptions, SearchResponse } from './types.js';

/**
 * Service for searching files and folders in ConformVault.
 */
export class SearchService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /**
   * Search across files and folders.
   *
   * @param query - The search query string.
   * @param opts - Optional filters (types, folderId, pagination).
   * @returns Search results with pagination metadata.
   */
  async search(query: string, opts?: SearchOptions): Promise<SearchResponse> {
    const params = new URLSearchParams();
    params.set('q', query);
    if (opts?.types) params.set('types', opts.types);
    if (opts?.folderId) params.set('folder_id', opts.folderId);
    if (opts?.page) params.set('page', String(opts.page));
    if (opts?.pageSize) params.set('page_size', String(opts.pageSize));

    const path = '/search?' + params.toString();

    return this.client.request<SearchResponse>('GET', path);
  }
}
