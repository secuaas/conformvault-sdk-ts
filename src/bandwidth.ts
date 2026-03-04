// ============================================================================
// ConformVault TypeScript SDK — BandwidthService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type { DataResponse, ListResponse } from './types.js';

/** Bandwidth usage summary. */
export interface BandwidthSummary {
  total_upload_bytes: number;
  total_download_bytes: number;
  period: string;
}

/** Daily bandwidth statistics. */
export interface DailyBandwidthStats {
  date: string;
  upload_bytes: number;
  download_bytes: number;
}

/**
 * Service for bandwidth analytics in ConformVault.
 */
export class BandwidthService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /** Get bandwidth usage summary. */
  async getSummary(): Promise<BandwidthSummary> {
    const resp = await this.client.request<DataResponse<BandwidthSummary>>('GET', '/bandwidth');
    return resp.data;
  }

  /** Get daily bandwidth statistics. */
  async getDaily(): Promise<DailyBandwidthStats[]> {
    const resp = await this.client.request<ListResponse<DailyBandwidthStats>>('GET', '/bandwidth/daily');
    return resp.data;
  }
}
