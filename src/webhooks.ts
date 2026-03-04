// ============================================================================
// ConformVault TypeScript SDK — WebhooksService + Signature Verification
// ============================================================================

import { createHmac, timingSafeEqual } from 'node:crypto';
import type { ConformVaultClient } from './client.js';
import type {
  WebhookEndpoint,
  WebhookListOptions,
  RegisterWebhookRequest,
  RegisterWebhookResponse,
  WebhookDelivery,
  ListResponse,
  DataResponse,
} from './types.js';
import { ConformVaultError } from './errors.js';

/**
 * Service for managing webhook endpoints in ConformVault.
 */
export class WebhooksService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /**
   * List all registered webhook endpoints.
   */
  async list(opts?: WebhookListOptions): Promise<WebhookEndpoint[]> {
    const params = new URLSearchParams();
    if (opts?.page) params.set('page', String(opts.page));
    if (opts?.limit) params.set('limit', String(opts.limit));

    const query = params.toString();
    const path = '/webhooks' + (query ? `?${query}` : '');

    const resp = await this.client.request<ListResponse<WebhookEndpoint>>('GET', path);
    return resp.data;
  }

  /**
   * Register a new webhook endpoint.
   * The signing secret is returned once in the response and must be stored securely.
   */
  async register(request: RegisterWebhookRequest): Promise<RegisterWebhookResponse> {
    const resp = await this.client.request<{ data: RegisterWebhookResponse; message?: string }>(
      'POST',
      '/webhooks',
      request,
    );
    return resp.data;
  }

  /**
   * Delete a webhook endpoint by ID.
   */
  async delete(webhookId: string): Promise<void> {
    await this.client.request('DELETE', `/webhooks/${webhookId}`);
  }

  /**
   * Send a test event to a webhook endpoint.
   */
  async test(webhookId: string): Promise<void> {
    await this.client.request('POST', `/webhooks/${webhookId}/test`);
  }

  /**
   * List delivery attempts for a webhook endpoint.
   */
  async listDeliveries(webhookId: string): Promise<WebhookDelivery[]> {
    const resp = await this.client.request<ListResponse<WebhookDelivery>>(
      'GET',
      `/webhooks/${webhookId}/deliveries`,
    );
    return resp.data;
  }

  /**
   * Get a specific delivery attempt by ID.
   */
  async getDelivery(webhookId: string, deliveryId: string): Promise<WebhookDelivery> {
    const resp = await this.client.request<DataResponse<WebhookDelivery>>(
      'GET',
      `/webhooks/${webhookId}/deliveries/${deliveryId}`,
    );
    return resp.data;
  }

  /**
   * Replay a specific delivery attempt.
   */
  async replayDelivery(webhookId: string, deliveryId: string): Promise<void> {
    await this.client.request(
      'POST',
      `/webhooks/${webhookId}/deliveries/${deliveryId}/replay`,
    );
  }

  /**
   * Re-enable a disabled webhook endpoint.
   */
  async reEnable(webhookId: string): Promise<void> {
    await this.client.request('POST', `/webhooks/${webhookId}/enable`);
  }
}

/**
 * Verify a webhook signature from ConformVault.
 *
 * The signature header format is: `t=<timestamp>,s0=<hmac_hex>`
 * The HMAC is computed as: HMAC-SHA256(timestamp + "." + payload, secret)
 *
 * @param payload - The raw request body as a string or Buffer.
 * @param signatureHeader - The value of the X-Webhook-Signature header.
 * @param secret - The webhook signing secret.
 * @param toleranceSeconds - Maximum age of the signature in seconds (default: 300 = 5 minutes).
 * @returns true if the signature is valid and within the time tolerance.
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signatureHeader: string,
  secret: string,
  toleranceSeconds = 300,
): boolean {
  // Parse the signature header: t=<timestamp>,s0=<hmac_hex>
  const parts: Record<string, string> = {};
  for (const segment of signatureHeader.split(',')) {
    const eqIdx = segment.indexOf('=');
    if (eqIdx === -1) continue;
    const key = segment.slice(0, eqIdx).trim();
    const value = segment.slice(eqIdx + 1).trim();
    parts[key] = value;
  }

  const timestamp = parts['t'];
  const signature = parts['s0'];

  if (!timestamp || !signature) {
    throw new ConformVaultError('Invalid webhook signature header format');
  }

  // Check timestamp tolerance
  const timestampNum = parseInt(timestamp, 10);
  if (isNaN(timestampNum)) {
    throw new ConformVaultError('Invalid timestamp in webhook signature header');
  }

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestampNum) > toleranceSeconds) {
    return false;
  }

  // Compute expected HMAC: HMAC-SHA256(timestamp + "." + payload, secret)
  const payloadStr = typeof payload === 'string' ? payload : payload.toString('utf-8');
  const signedContent = `${timestamp}.${payloadStr}`;

  const mac = createHmac('sha256', secret);
  mac.update(signedContent);
  const expectedSig = mac.digest('hex');

  // Constant-time comparison to prevent timing attacks
  try {
    const sigBuf = Buffer.from(signature, 'utf-8');
    const expectedBuf = Buffer.from(expectedSig, 'utf-8');
    if (sigBuf.length !== expectedBuf.length) return false;
    return timingSafeEqual(sigBuf, expectedBuf);
  } catch {
    return false;
  }
}
