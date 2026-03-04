// ============================================================================
// ConformVault TypeScript SDK — ActivitySubscriptionsService
// ============================================================================

import type { ConformVaultClient } from './client.js';
import type {
  ActivitySubscription,
  CreateActivitySubscriptionRequest,
  ListResponse,
  DataResponse,
} from './types.js';

/**
 * Service for managing activity subscriptions in ConformVault.
 */
export class ActivitySubscriptionsService {
  private client: ConformVaultClient;

  /** @internal */
  constructor(client: ConformVaultClient) {
    this.client = client;
  }

  /**
   * Subscribe to activity events.
   */
  async subscribe(request: CreateActivitySubscriptionRequest): Promise<ActivitySubscription> {
    const resp = await this.client.request<DataResponse<ActivitySubscription>>('POST', '/activity-subscriptions', request);
    return resp.data;
  }

  /**
   * List all activity subscriptions.
   */
  async list(): Promise<ActivitySubscription[]> {
    const resp = await this.client.request<ListResponse<ActivitySubscription>>('GET', '/activity-subscriptions');
    return resp.data;
  }

  /**
   * Unsubscribe from activity events.
   */
  async unsubscribe(subscriptionId: string): Promise<void> {
    await this.client.request('DELETE', `/activity-subscriptions/${subscriptionId}`);
  }
}
