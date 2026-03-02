// ============================================================================
// ConformVault TypeScript SDK — Transaction Folder Operations
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  TransactionFolder,
  TransactionFolderItem,
  TransactionFolderResponse,
  TransactionListResponse,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  CreateTransactionItemRequest,
  UpdateTransactionItemRequest,
  DataResponse,
} from './types.js';

export class TransactionsService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /** Create a new transaction folder. */
  async create(request: CreateTransactionRequest): Promise<TransactionFolderResponse> {
    const resp = await this.client.request<DataResponse<TransactionFolderResponse>>('POST', '/transactions', request);
    return resp.data;
  }

  /** List transaction folders with optional pagination. */
  async list(opts?: { page?: number; limit?: number }): Promise<TransactionListResponse> {
    const params = new URLSearchParams();
    if (opts?.page) params.set('page', String(opts.page));
    if (opts?.limit) params.set('limit', String(opts.limit));

    const query = params.toString();
    const path = '/transactions' + (query ? `?${query}` : '');

    return this.client.request<TransactionListResponse>('GET', path);
  }

  /** Get a single transaction folder by ID. */
  async get(transactionId: string): Promise<TransactionFolderResponse> {
    const resp = await this.client.request<DataResponse<TransactionFolderResponse>>('GET', `/transactions/${transactionId}`);
    return resp.data;
  }

  /** Update a transaction folder. */
  async update(transactionId: string, request: UpdateTransactionRequest): Promise<TransactionFolderResponse> {
    const resp = await this.client.request<DataResponse<TransactionFolderResponse>>('PUT', `/transactions/${transactionId}`, request);
    return resp.data;
  }

  /** Delete a transaction folder. */
  async delete(transactionId: string): Promise<void> {
    await this.client.request('DELETE', `/transactions/${transactionId}`);
  }

  /** Add an item to a transaction folder. */
  async addItem(transactionId: string, request: CreateTransactionItemRequest): Promise<TransactionFolderItem> {
    const resp = await this.client.request<DataResponse<TransactionFolderItem>>('POST', `/transactions/${transactionId}/items`, request);
    return resp.data;
  }

  /** Update an item in a transaction folder. */
  async updateItem(transactionId: string, itemId: string, request: UpdateTransactionItemRequest): Promise<TransactionFolderItem> {
    const resp = await this.client.request<DataResponse<TransactionFolderItem>>('PUT', `/transactions/${transactionId}/items/${itemId}`, request);
    return resp.data;
  }

  /** Delete an item from a transaction folder. */
  async deleteItem(transactionId: string, itemId: string): Promise<void> {
    await this.client.request('DELETE', `/transactions/${transactionId}/items/${itemId}`);
  }
}
