// ============================================================================
// ConformVault TypeScript SDK — FilesService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  File,
  FileListOptions,
  UploadResult,
  UploadOptions,
  ListResponse,
  DataResponse,
} from './types.js';

/**
 * Service for managing files in ConformVault.
 */
export class FilesService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /**
   * List files, optionally filtered by folder.
   */
  async list(opts?: FileListOptions): Promise<File[]> {
    const params = new URLSearchParams();
    if (opts?.folderId) params.set('folder_id', opts.folderId);
    if (opts?.page) params.set('page', String(opts.page));
    if (opts?.limit) params.set('limit', String(opts.limit));

    const query = params.toString();
    const path = '/files' + (query ? `?${query}` : '');

    const resp = await this.client.request<ListResponse<File>>('GET', path);
    return resp.data;
  }

  /**
   * Get a single file by ID.
   */
  async get(fileId: string): Promise<File> {
    const resp = await this.client.request<DataResponse<File>>('GET', `/files/${fileId}`);
    return resp.data;
  }

  /**
   * Upload a file. Accepts a Blob, Buffer, or ArrayBuffer.
   */
  async upload(
    file: Blob | Buffer | ArrayBuffer,
    filename: string,
    opts?: UploadOptions,
  ): Promise<UploadResult> {
    const formData = new FormData();

    // Convert to Blob for FormData compatibility
    let blob: Blob;
    if (file instanceof Blob) {
      blob = file;
    } else if (Buffer.isBuffer(file)) {
      // Use Array.from to produce a plain number[] which Blob always accepts
      const bytes = Array.from(file) as unknown as BlobPart[];
      blob = new Blob([new Uint8Array(bytes as unknown as number[]) as BlobPart], {
        type: opts?.contentType ?? 'application/octet-stream',
      });
    } else {
      // ArrayBuffer — wrap in Uint8Array for safety
      blob = new Blob([file as BlobPart], {
        type: opts?.contentType ?? 'application/octet-stream',
      });
    }

    formData.append('file', blob, filename);
    if (opts?.folderId) {
      formData.append('folder_id', opts.folderId);
    }

    const resp = await this.client.request<DataResponse<UploadResult>>(
      'POST',
      '/files',
      formData,
    );
    return resp.data;
  }

  /**
   * Download a file by ID. Returns a Response object for streaming.
   */
  async download(fileId: string): Promise<Response> {
    return this.client.requestRaw('GET', `/files/${fileId}/download`);
  }

  /**
   * Delete a file by ID.
   */
  async delete(fileId: string): Promise<void> {
    await this.client.request('DELETE', `/files/${fileId}`);
  }

  /**
   * Get a thumbnail image for a file. Returns a raw Response for streaming.
   */
  async getThumbnail(fileId: string): Promise<Response> {
    return this.client.requestRaw('GET', `/files/${fileId}/thumbnail`);
  }

  /**
   * Get the security scan report for a file.
   */
  async getScanReport(fileId: string): Promise<unknown> {
    const resp = await this.client.request<DataResponse<unknown>>('GET', `/files/${fileId}/scan-report`);
    return resp.data;
  }
}
