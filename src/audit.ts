// ============================================================================
// ConformVault TypeScript SDK — AuditService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  AuditEntry,
  AuditListOptions,
  ListResponse,
} from './types.js';

/**
 * Service for querying audit logs in ConformVault.
 */
export class AuditService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /**
   * List audit log entries with optional filters.
   */
  async list(opts?: AuditListOptions): Promise<AuditEntry[]> {
    const params = new URLSearchParams();
    if (opts?.eventType) params.set('event_type', opts.eventType);
    if (opts?.from) params.set('from', opts.from);
    if (opts?.to) params.set('to', opts.to);
    if (opts?.page) params.set('page', String(opts.page));
    if (opts?.limit) params.set('limit', String(opts.limit));

    const query = params.toString();
    const path = '/audit' + (query ? `?${query}` : '');

    const resp = await this.client.request<ListResponse<AuditEntry>>('GET', path);
    return resp.data;
  }
}
