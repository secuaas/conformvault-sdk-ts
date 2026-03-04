// ============================================================================
// ConformVault TypeScript SDK — JobsService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  Job,
  CreateJobRequest,
  ListResponse,
  DataResponse,
} from './types.js';

/**
 * Service for managing asynchronous jobs in ConformVault.
 */
export class JobsService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /**
   * Create a new asynchronous job.
   */
  async create(request: CreateJobRequest): Promise<Job> {
    const resp = await this.client.request<DataResponse<Job>>('POST', '/jobs', request);
    return resp.data;
  }

  /**
   * List all jobs.
   */
  async list(): Promise<Job[]> {
    const resp = await this.client.request<ListResponse<Job>>('GET', '/jobs');
    return resp.data;
  }

  /**
   * Get a job by ID.
   */
  async get(jobId: string): Promise<Job> {
    const resp = await this.client.request<DataResponse<Job>>('GET', `/jobs/${jobId}`);
    return resp.data;
  }

  /**
   * Cancel a running job.
   */
  async cancel(jobId: string): Promise<void> {
    await this.client.request('DELETE', `/jobs/${jobId}`);
  }
}
