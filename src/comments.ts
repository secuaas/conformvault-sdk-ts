// ============================================================================
// ConformVault TypeScript SDK — CommentsService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  ListResponse,
  DataResponse,
} from './types.js';

/**
 * Service for managing file comments in ConformVault.
 */
export class CommentsService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /**
   * Create a comment on a file.
   */
  async create(fileId: string, request: CreateCommentRequest): Promise<Comment> {
    const resp = await this.client.request<DataResponse<Comment>>('POST', `/files/${fileId}/comments`, request);
    return resp.data;
  }

  /**
   * List all comments on a file.
   */
  async list(fileId: string): Promise<Comment[]> {
    const resp = await this.client.request<ListResponse<Comment>>('GET', `/files/${fileId}/comments`);
    return resp.data;
  }

  /**
   * Get a specific comment by ID.
   */
  async get(fileId: string, commentId: string): Promise<Comment> {
    const resp = await this.client.request<DataResponse<Comment>>('GET', `/files/${fileId}/comments/${commentId}`);
    return resp.data;
  }

  /**
   * Update a comment.
   */
  async update(fileId: string, commentId: string, request: UpdateCommentRequest): Promise<Comment> {
    const resp = await this.client.request<DataResponse<Comment>>('PATCH', `/files/${fileId}/comments/${commentId}`, request);
    return resp.data;
  }

  /**
   * Delete a comment.
   */
  async delete(fileId: string, commentId: string): Promise<void> {
    await this.client.request('DELETE', `/files/${fileId}/comments/${commentId}`);
  }

  /**
   * Get replies to a comment.
   */
  async getReplies(fileId: string, commentId: string): Promise<Comment[]> {
    const resp = await this.client.request<ListResponse<Comment>>('GET', `/files/${fileId}/comments/${commentId}/replies`);
    return resp.data;
  }
}
