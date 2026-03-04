// ============================================================================
// ConformVault TypeScript SDK — MetadataService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  File,
  FileTag,
  AddTagsRequest,
  SetMetadataRequest,
  ListResponse,
  DataResponse,
} from './types.js';

/**
 * Service for managing file tags and custom metadata in ConformVault.
 */
export class MetadataService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /**
   * Add tags to a file.
   */
  async addTags(fileId: string, request: AddTagsRequest): Promise<FileTag[]> {
    const resp = await this.client.request<ListResponse<FileTag>>('POST', `/files/${fileId}/tags`, request);
    return resp.data;
  }

  /**
   * Remove a tag from a file.
   */
  async removeTag(fileId: string, tag: string): Promise<void> {
    await this.client.request('DELETE', `/files/${fileId}/tags/${tag}`);
  }

  /**
   * Get all tags for a file.
   */
  async getTags(fileId: string): Promise<FileTag[]> {
    const resp = await this.client.request<ListResponse<FileTag>>('GET', `/files/${fileId}/tags`);
    return resp.data;
  }

  /**
   * List all files with a given tag.
   */
  async listByTag(tag: string): Promise<File[]> {
    const resp = await this.client.request<ListResponse<File>>('GET', `/files/by-tag/${tag}`);
    return resp.data;
  }

  /**
   * Set custom metadata on a file (merge with existing).
   */
  async setMetadata(fileId: string, request: SetMetadataRequest): Promise<Record<string, string>> {
    const resp = await this.client.request<DataResponse<Record<string, string>>>('PATCH', `/files/${fileId}/metadata`, request);
    return resp.data;
  }

  /**
   * Get custom metadata for a file.
   */
  async getMetadata(fileId: string): Promise<Record<string, string>> {
    const resp = await this.client.request<DataResponse<Record<string, string>>>('GET', `/files/${fileId}/metadata`);
    return resp.data;
  }

  /**
   * Delete a specific metadata key from a file.
   */
  async deleteMetadataKey(fileId: string, key: string): Promise<void> {
    await this.client.request('DELETE', `/files/${fileId}/metadata/${key}`);
  }
}
