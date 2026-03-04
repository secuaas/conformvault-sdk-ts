// ============================================================================
// ConformVault TypeScript SDK — UploadSessionsService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  File,
  UploadSession,
  CreateUploadSessionRequest,
  DataResponse,
} from './types.js';

/**
 * Service for managing chunked upload sessions in ConformVault.
 */
export class UploadSessionsService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /**
   * Create a new upload session for chunked uploads.
   */
  async create(request: CreateUploadSessionRequest): Promise<UploadSession> {
    const resp = await this.client.request<DataResponse<UploadSession>>('POST', '/upload-sessions', request);
    return resp.data;
  }

  /**
   * Upload a chunk to an active upload session.
   */
  async uploadChunk(sessionId: string, chunkNumber: number, data: Blob | Buffer | ArrayBuffer): Promise<void> {
    const resp = await this.client.requestRaw(
      'PUT',
      `/upload-sessions/${sessionId}/chunks/${chunkNumber}`,
      data,
    );
    // Consume the response to ensure the request completed
    await resp.text();
  }

  /**
   * Get the current status of an upload session.
   */
  async getStatus(sessionId: string): Promise<UploadSession> {
    const resp = await this.client.request<DataResponse<UploadSession>>('GET', `/upload-sessions/${sessionId}`);
    return resp.data;
  }

  /**
   * Complete an upload session and finalize the file.
   */
  async complete(sessionId: string): Promise<File> {
    const resp = await this.client.request<DataResponse<File>>('POST', `/upload-sessions/${sessionId}/complete`);
    return resp.data;
  }

  /**
   * Cancel and discard an upload session.
   */
  async cancel(sessionId: string): Promise<void> {
    await this.client.request('DELETE', `/upload-sessions/${sessionId}`);
  }
}
