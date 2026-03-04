// ============================================================================
// ConformVault TypeScript SDK — Batch Operations
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  BatchOperation,
  BatchOperationResponse,
  BatchListResponse,
  CreateBatchRequest,
  DataResponse,
} from './types.js';

export class BatchesService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /** Create a new batch operation. */
  async create(request: CreateBatchRequest): Promise<BatchOperationResponse> {
    const resp = await this.client.request<DataResponse<BatchOperationResponse>>('POST', '/batches', request);
    return resp.data;
  }

  /** List batch operations with optional pagination. */
  async list(opts?: { page?: number; limit?: number }): Promise<BatchListResponse> {
    const params = new URLSearchParams();
    if (opts?.page) params.set('page', String(opts.page));
    if (opts?.limit) params.set('limit', String(opts.limit));

    const query = params.toString();
    const path = '/batches' + (query ? `?${query}` : '');

    return this.client.request<BatchListResponse>('GET', path);
  }

  /** Get a single batch operation by ID. */
  async get(batchId: string): Promise<BatchOperationResponse> {
    const resp = await this.client.request<DataResponse<BatchOperationResponse>>('GET', `/batches/${batchId}`);
    return resp.data;
  }

  /** Commit a batch operation to trigger processing. */
  async commit(batchId: string): Promise<BatchOperationResponse> {
    const resp = await this.client.request<DataResponse<BatchOperationResponse>>('POST', `/batches/${batchId}/commit`);
    return resp.data;
  }

  /** Cancel a batch operation. */
  async cancel(batchId: string): Promise<void> {
    await this.client.request('DELETE', `/batches/${batchId}`);
  }

  /** Upload a file to a batch operation at the given index. */
  async uploadFile(batchId: string, index: number, data: Blob | ArrayBuffer | Buffer): Promise<BatchOperationResponse> {
    const resp = await this.client.requestRaw('PUT', `/batches/${batchId}/files/${index}`, data);
    const json = await resp.json() as DataResponse<BatchOperationResponse>;
    return json.data;
  }
}
