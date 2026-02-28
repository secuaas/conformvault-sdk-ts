// ============================================================================
// ConformVault TypeScript SDK — ScanReportsService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  FileScanReport,
  FileScanSummary,
  ScanReportListOptions,
  ScanReportListResponse,
} from './types.js';

/**
 * Service for querying ClamAV file scan reports in ConformVault.
 */
export class ScanReportsService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /**
   * Get the scan report for a specific file.
   *
   * @param fileId - The file ID to retrieve the scan report for.
   * @returns The scan report for the file.
   */
  async getReport(fileId: string): Promise<FileScanReport> {
    return this.client.request<FileScanReport>('GET', `/files/${fileId}/scan-report`);
  }

  /**
   * List all scan reports with optional pagination.
   *
   * @param opts - Optional pagination parameters.
   * @returns Paginated list of scan reports.
   */
  async list(opts?: ScanReportListOptions): Promise<ScanReportListResponse> {
    const params = new URLSearchParams();
    if (opts?.limit) params.set('limit', String(opts.limit));
    if (opts?.offset) params.set('offset', String(opts.offset));

    const query = params.toString();
    const path = '/scan-reports' + (query ? `?${query}` : '');

    return this.client.request<ScanReportListResponse>('GET', path);
  }

  /**
   * Get a summary of scan statistics for the organization.
   *
   * @returns Aggregate scan counts and engine info.
   */
  async getSummary(): Promise<FileScanSummary> {
    return this.client.request<FileScanSummary>('GET', '/scan-reports/summary');
  }
}
