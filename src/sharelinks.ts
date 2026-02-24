// ============================================================================
// ConformVault TypeScript SDK — ShareLinksService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  ShareLink,
  ShareLinkListOptions,
  CreateShareLinkRequest,
  ListResponse,
  DataResponse,
} from './types.js';

/**
 * Service for managing share links in ConformVault.
 */
export class ShareLinksService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /**
   * List all share links.
   */
  async list(opts?: ShareLinkListOptions): Promise<ShareLink[]> {
    const params = new URLSearchParams();
    if (opts?.page) params.set('page', String(opts.page));
    if (opts?.limit) params.set('limit', String(opts.limit));

    const query = params.toString();
    const path = '/sharelinks' + (query ? `?${query}` : '');

    const resp = await this.client.request<ListResponse<ShareLink>>('GET', path);
    return resp.data;
  }

  /**
   * Create a new share link.
   */
  async create(request: CreateShareLinkRequest): Promise<ShareLink> {
    const resp = await this.client.request<DataResponse<ShareLink>>(
      'POST',
      '/sharelinks',
      request,
    );
    return resp.data;
  }

  /**
   * Delete a share link by ID.
   */
  async delete(shareLinkId: string): Promise<void> {
    await this.client.request('DELETE', `/sharelinks/${shareLinkId}`);
  }
}
