// ============================================================================
// ConformVault TypeScript SDK — Document Template Operations
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  DocumentTemplate,
  GeneratedDocument,
  TemplateListResponse,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  GenerateDocumentRequest,
  DataResponse,
  ListResponse,
} from './types.js';

export class TemplatesService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /** Create a new document template. */
  async create(request: CreateTemplateRequest): Promise<DocumentTemplate> {
    const resp = await this.client.request<DataResponse<DocumentTemplate>>('POST', '/templates', request);
    return resp.data;
  }

  /** List document templates with optional pagination. */
  async list(opts?: { page?: number; limit?: number }): Promise<TemplateListResponse> {
    const params = new URLSearchParams();
    if (opts?.page) params.set('page', String(opts.page));
    if (opts?.limit) params.set('limit', String(opts.limit));

    const query = params.toString();
    const path = '/templates' + (query ? `?${query}` : '');

    return this.client.request<TemplateListResponse>('GET', path);
  }

  /** Get a single document template by ID. */
  async get(templateId: string): Promise<DocumentTemplate> {
    const resp = await this.client.request<DataResponse<DocumentTemplate>>('GET', `/templates/${templateId}`);
    return resp.data;
  }

  /** Update a document template. */
  async update(templateId: string, request: UpdateTemplateRequest): Promise<DocumentTemplate> {
    const resp = await this.client.request<DataResponse<DocumentTemplate>>('PUT', `/templates/${templateId}`, request);
    return resp.data;
  }

  /** Delete a document template. */
  async delete(templateId: string): Promise<void> {
    await this.client.request('DELETE', `/templates/${templateId}`);
  }

  /** Generate a PDF document from a template. Returns the raw Response for binary streaming. */
  async generate(templateId: string, request: GenerateDocumentRequest): Promise<Response> {
    return this.client.requestRaw('POST', `/templates/${templateId}/generate`, request);
  }

  /** List documents generated from a template. */
  async listDocuments(templateId: string): Promise<GeneratedDocument[]> {
    const resp = await this.client.request<ListResponse<GeneratedDocument>>('GET', `/templates/${templateId}/documents`);
    return resp.data;
  }
}
