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
  async create(request: CreateCommentRequest): Promise<Comment> {
    const resp = await this.client.request<DataResponse<Comment>>('POST', '/comments', request);
    return resp.data;
  }

  /**
   * List all comments on a file.
   */
  async list(fileId: string): Promise<Comment[]> {
    const resp = await this.client.request<ListResponse<Comment>>('GET', `/comments?file_id=${fileId}`);
    return resp.data;
  }

  /**
   * Get a specific comment by ID.
   */
  async get(commentId: string): Promise<Comment> {
    const resp = await this.client.request<DataResponse<Comment>>('GET', `/comments/${commentId}`);
    return resp.data;
  }

  /**
   * Update a comment.
   */
  async update(commentId: string, request: UpdateCommentRequest): Promise<Comment> {
    const resp = await this.client.request<DataResponse<Comment>>('PUT', `/comments/${commentId}`, request);
    return resp.data;
  }

  /**
   * Delete a comment.
   */
  async delete(commentId: string): Promise<void> {
    await this.client.request('DELETE', `/comments/${commentId}`);
  }

  /**
   * Get replies to a comment.
   */
  async getReplies(commentId: string): Promise<Comment[]> {
    const resp = await this.client.request<ListResponse<Comment>>('GET', `/comments/${commentId}/replies`);
    return resp.data;
  }
}
