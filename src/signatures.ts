// ============================================================================
// ConformVault TypeScript SDK — SignaturesService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  SignatureEnvelope,
  CreateSignatureRequest,
  AnalyzePDFRequest,
  PDFAnalysisResult,
  EmbeddedSignLinkResponse,
  DataResponse,
} from './types.js';

/**
 * Service for managing electronic signature envelopes in ConformVault.
 */
export class SignaturesService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /**
   * List all signature envelopes for the organization.
   */
  async list(): Promise<SignatureEnvelope[]> {
    const resp = await this.client.request<DataResponse<SignatureEnvelope[]>>(
      'GET',
      '/signatures',
    );
    return resp.data;
  }

  /**
   * Create a new signature envelope.
   */
  async create(request: CreateSignatureRequest): Promise<SignatureEnvelope> {
    const resp = await this.client.request<DataResponse<SignatureEnvelope>>(
      'POST',
      '/signatures',
      request,
    );
    return resp.data;
  }

  /**
   * Get the current status of a signature envelope.
   */
  async getStatus(envelopeId: string): Promise<SignatureEnvelope> {
    const resp = await this.client.request<DataResponse<SignatureEnvelope>>(
      'GET',
      `/signatures/${envelopeId}`,
    );
    return resp.data;
  }

  /**
   * Download the completed signed document. Returns a Response object for streaming.
   */
  async downloadSigned(envelopeId: string): Promise<Response> {
    return this.client.requestRaw('GET', `/signatures/${envelopeId}/download`);
  }

  /**
   * Download the audit trail (completion certificate) PDF.
   */
  async downloadAuditTrail(envelopeId: string): Promise<Response> {
    return this.client.requestRaw('GET', `/signatures/${envelopeId}/audit-trail`);
  }

  /**
   * Revoke (cancel) a pending signature envelope.
   */
  async revoke(envelopeId: string): Promise<void> {
    await this.client.request('POST', `/signatures/${envelopeId}/revoke`);
  }

  /**
   * Analyze a PDF to detect page dimensions and suggest signature field placements.
   */
  async analyzePDF(request: AnalyzePDFRequest): Promise<PDFAnalysisResult> {
    const resp = await this.client.request<DataResponse<PDFAnalysisResult>>(
      'POST',
      '/signatures/analyze',
      request,
    );
    return resp.data;
  }

  /**
   * Preview a PDF file. Returns a raw Response for streaming the binary content.
   */
  async previewPDF(fileId: string): Promise<Response> {
    return this.client.requestRaw(
      'GET',
      `/signatures/preview-pdf?file_id=${encodeURIComponent(fileId)}`,
    );
  }

  /**
   * Get an embedded signing link for a specific signer on an envelope.
   */
  async getEmbeddedSignLink(
    envelopeId: string,
    signerEmail: string,
    redirectUrl?: string,
  ): Promise<EmbeddedSignLinkResponse> {
    const params = new URLSearchParams({ signer_email: signerEmail });
    if (redirectUrl) params.set('redirect_url', redirectUrl);
    const resp = await this.client.request<EmbeddedSignLinkResponse>(
      'GET',
      `/signatures/${envelopeId}/embed-sign?${params.toString()}`,
    );
    return resp;
  }
}
