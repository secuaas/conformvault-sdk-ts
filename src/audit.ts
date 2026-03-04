// ============================================================================
// ConformVault TypeScript SDK — AuditService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  AuditEntry,
  AuditListOptions,
  AuditSearchOptions,
  AuditExportOptions,
  AuditStats,
  AuditAnomaly,
  ListResponse,
  DataResponse,
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

  /**
   * Search audit log entries with a full-text query.
   */
  async search(opts?: AuditSearchOptions): Promise<AuditEntry[]> {
    const params = new URLSearchParams();
    if (opts?.query) params.set('q', opts.query);
    if (opts?.eventType) params.set('event_type', opts.eventType);
    if (opts?.from) params.set('from', opts.from);
    if (opts?.to) params.set('to', opts.to);
    if (opts?.page) params.set('page', String(opts.page));
    if (opts?.limit) params.set('limit', String(opts.limit));
    const query = params.toString();
    const path = '/audit/search' + (query ? `?${query}` : '');
    const resp = await this.client.request<ListResponse<AuditEntry>>('GET', path);
    return resp.data;
  }

  /**
   * Export audit logs in a specified format (e.g. CSV, JSON).
   * Returns the raw Response for streaming.
   */
  async export(opts?: AuditExportOptions): Promise<Response> {
    const params = new URLSearchParams();
    if (opts?.format) params.set('format', opts.format);
    if (opts?.eventType) params.set('event_type', opts.eventType);
    if (opts?.from) params.set('from', opts.from);
    if (opts?.to) params.set('to', opts.to);
    const query = params.toString();
    const path = '/audit/export' + (query ? `?${query}` : '');
    return this.client.requestRaw('GET', path);
  }

  /**
   * Get aggregate audit statistics.
   */
  async getStats(): Promise<AuditStats> {
    const resp = await this.client.request<DataResponse<AuditStats>>('GET', '/audit/stats');
    return resp.data;
  }

  /**
   * Get detected audit anomalies.
   */
  async getAnomalies(): Promise<AuditAnomaly[]> {
    const resp = await this.client.request<ListResponse<AuditAnomaly>>('GET', '/audit/anomalies');
    return resp.data;
  }
}
