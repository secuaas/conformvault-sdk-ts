// ============================================================================
// ConformVault TypeScript SDK — Main Client
// ============================================================================

import type { ConformVaultOptions, ErrorResponse } from './types.js';
import {
  APIError,
  AuthenticationError,
  RateLimitError,
  ConformVaultError,
} from './errors.js';
import { FilesService } from './files.js';
import { FoldersService } from './folders.js';
import { ShareLinksService } from './sharelinks.js';
import { SignaturesService } from './signatures.js';
import { WebhooksService } from './webhooks.js';
import { AuditService } from './audit.js';
import { KeysService } from './keys.js';
import { BulkService } from './bulk.js';
import { VersionsService } from './versions.js';
import { SearchService } from './search.js';
import { TrashService } from './trash.js';
import { ScanReportsService } from './scan_reports.js';
import { AttestationService } from './attestation.js';
import { EncryptionService } from './encryption.js';
import { TransactionsService } from './transactions.js';
import { TemplatesService } from './templates.js';
import { BatchesService } from './batches.js';
import { MetadataService } from './metadata.js';
import { RetentionService } from './retention.js';
import { LegalHoldsService } from './legal_holds.js';
import { PermissionsService } from './permissions.js';
import { CommentsService } from './comments.js';
import { QuotaService, RateLimitService } from './quota.js';
import { UploadSessionsService } from './upload_sessions.js';
import { JobsService } from './jobs.js';
import { ActivitySubscriptionsService } from './activity_subscriptions.js';
import { PoliciesService } from './policies.js';
import { BandwidthService } from './bandwidth.js';
import { DataExportService } from './data_export.js';

/** Default base URL for the ConformVault Developer API. */
export const DEFAULT_BASE_URL = 'https://api.conformvault.com/dev/v1';

/** SDK version. */
export const VERSION = '2.2.1';

/** User-Agent header sent with every request. */
const USER_AGENT = `conformvault-ts/${VERSION}`;

/**
 * Internal interface exposed to service classes for making HTTP requests.
 * This is the same class as ConformVault but used internally by services
 * to avoid circular exports.
 */
export interface ConformVaultClient {
  request<T>(method: string, path: string, body?: unknown): Promise<T>;
  requestRaw(method: string, path: string, body?: unknown): Promise<Response>;
}

/**
 * The main ConformVault SDK client.
 *
 * @example
 * ```typescript
 * const client = new ConformVault('cvk_live_xxx');
 * const files = await client.files.list();
 * ```
 */
export class ConformVault implements ConformVaultClient {
  private readonly apiKey: string;
  private readonly baseURL: string;
  private readonly timeout: number;
  private readonly maxRetries: number;

  /** File operations (list, get, upload, download, delete). */
  public readonly files: FilesService;
  /** Folder operations (list, create, get, delete). */
  public readonly folders: FoldersService;
  /** Share link operations (list, create, delete). */
  public readonly shareLinks: ShareLinksService;
  /** Signature envelope operations (create, getStatus, downloadSigned, revoke). */
  public readonly signatures: SignaturesService;
  /** Webhook endpoint operations (list, register, delete, test). */
  public readonly webhooks: WebhooksService;
  /** Audit log operations (list). */
  public readonly audit: AuditService;
  /** API key management operations (list, create, get, revoke, rotate). */
  public readonly keys: KeysService;
  /** Bulk file operations (delete, move, download). */
  public readonly bulk: BulkService;
  /** File version operations (list, get, restore, delete). */
  public readonly versions: VersionsService;
  /** Search across files and folders. */
  public readonly search: SearchService;
  /** Trash / recycle bin operations (list, restore, delete, empty). */
  public readonly trash: TrashService;
  /** File scan report operations (getReport, list, getSummary). */
  public readonly scanReports: ScanReportsService;
  /** Compliance attestation document generation (generateLoi25). */
  public readonly attestation: AttestationService;
  /** Encryption salt sync for cross-platform E2E encryption. */
  public readonly encryption: EncryptionService;
  /** Transaction folder operations (create, list, get, update, delete, items). */
  public readonly transactions: TransactionsService;
  /** Document template operations (create, list, get, update, delete, generate). */
  public readonly templates: TemplatesService;
  /** Batch operation endpoints (create, list, get, commit, cancel). */
  public readonly batches: BatchesService;
  /** File tags and custom metadata operations. */
  public readonly metadata: MetadataService;
  /** Retention policy operations (create, list, get, update, delete). */
  public readonly retention: RetentionService;
  /** Legal hold operations (create, list, get, release, files). */
  public readonly legalHolds: LegalHoldsService;
  /** Folder permission operations (set, get, revoke). */
  public readonly permissions: PermissionsService;
  /** File comment operations (create, list, get, update, delete, replies). */
  public readonly comments: CommentsService;
  /** Storage quota information. */
  public readonly quota: QuotaService;
  /** Rate limit information. */
  public readonly rateLimit: RateLimitService;
  /** Chunked upload session operations (create, uploadChunk, getStatus, complete, cancel). */
  public readonly uploadSessions: UploadSessionsService;
  /** Asynchronous job operations (create, list, get, cancel). */
  public readonly jobs: JobsService;
  /** Activity subscription operations (subscribe, list, unsubscribe). */
  public readonly activitySubscriptions: ActivitySubscriptionsService;
  /** Security policy operations (IP, MFA, encryption salt). */
  public readonly policies: PoliciesService;
  /** Bandwidth analytics (summary, daily). */
  public readonly bandwidth: BandwidthService;
  /** User data export (GDPR/Loi 25). */
  public readonly dataExport: DataExportService;

  /**
   * Create a new ConformVault client.
   *
   * @param apiKey - Your API key (e.g. cvk_live_xxx or cvk_test_xxx).
   * @param options - Optional configuration.
   */
  constructor(apiKey: string, options?: ConformVaultOptions) {
    if (!apiKey) {
      throw new ConformVaultError('API key is required');
    }

    this.apiKey = apiKey;
    this.baseURL = (options?.baseURL ?? DEFAULT_BASE_URL).replace(/\/+$/, '');
    this.timeout = options?.timeout ?? 30_000;
    this.maxRetries = options?.maxRetries ?? 3;

    this.files = new FilesService(this);
    this.folders = new FoldersService(this);
    this.shareLinks = new ShareLinksService(this);
    this.signatures = new SignaturesService(this);
    this.webhooks = new WebhooksService(this);
    this.audit = new AuditService(this);
    this.keys = new KeysService(this);
    this.bulk = new BulkService(this);
    this.versions = new VersionsService(this);
    this.search = new SearchService(this);
    this.trash = new TrashService(this);
    this.scanReports = new ScanReportsService(this);
    this.attestation = new AttestationService(this);
    this.encryption = new EncryptionService(this);
    this.transactions = new TransactionsService(this);
    this.templates = new TemplatesService(this);
    this.batches = new BatchesService(this);
    this.metadata = new MetadataService(this);
    this.retention = new RetentionService(this);
    this.legalHolds = new LegalHoldsService(this);
    this.permissions = new PermissionsService(this);
    this.comments = new CommentsService(this);
    this.quota = new QuotaService(this);
    this.rateLimit = new RateLimitService(this);
    this.uploadSessions = new UploadSessionsService(this);
    this.jobs = new JobsService(this);
    this.activitySubscriptions = new ActivitySubscriptionsService(this);
    this.policies = new PoliciesService(this);
    this.bandwidth = new BandwidthService(this);
    this.dataExport = new DataExportService(this);
  }

  /**
   * Make an authenticated JSON request to the API.
   * Handles error mapping and automatic rate-limit retries.
   *
   * @internal Used by service classes.
   */
  async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      const url = this.baseURL + path;

      const headers: Record<string, string> = {
        'Authorization': `Bearer ${this.apiKey}`,
        'User-Agent': USER_AGENT,
        'Accept': 'application/json',
      };

      let fetchBody: BodyInit | undefined;
      if (body instanceof FormData) {
        // Let fetch set the Content-Type with boundary for multipart
        fetchBody = body;
      } else if (body !== undefined) {
        headers['Content-Type'] = 'application/json';
        fetchBody = JSON.stringify(body);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      let response: Response;
      try {
        response = await fetch(url, {
          method,
          headers,
          body: fetchBody,
          signal: controller.signal,
        });
      } catch (err: unknown) {
        clearTimeout(timeoutId);
        if (err instanceof DOMException && err.name === 'AbortError') {
          throw new ConformVaultError(`Request timed out after ${this.timeout}ms`);
        }
        throw new ConformVaultError(
          `Request failed: ${err instanceof Error ? err.message : String(err)}`,
        );
      } finally {
        clearTimeout(timeoutId);
      }

      // Rate limiting with automatic retry
      if (response.status === 429) {
        const retryAfterHeader = response.headers.get('Retry-After');
        const retryAfterSeconds = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60;
        const retryAfter = isNaN(retryAfterSeconds) ? 60 : retryAfterSeconds;

        if (attempt < this.maxRetries) {
          // Wait and retry
          const waitMs = retryAfter * 1000;
          await new Promise((resolve) => setTimeout(resolve, waitMs));
          lastError = new RateLimitError(retryAfter);
          continue;
        }

        throw new RateLimitError(retryAfter);
      }

      // Authentication error
      if (response.status === 401) {
        let message = 'unauthorized';
        try {
          const errorBody = (await response.json()) as ErrorResponse;
          if (errorBody.error) message = errorBody.error;
        } catch {
          // Use default message
        }
        throw new AuthenticationError(message);
      }

      // Other client/server errors
      if (response.status >= 400) {
        let message = response.statusText || `HTTP ${response.status}`;
        try {
          const errorBody = (await response.json()) as ErrorResponse;
          if (errorBody.error) message = errorBody.error;
        } catch {
          // Use status text
        }
        throw new APIError(response.status, message);
      }

      // 204 No Content (e.g. DELETE)
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return undefined as T;
      }

      // Parse JSON response
      try {
        return (await response.json()) as T;
      } catch {
        throw new ConformVaultError('Failed to parse JSON response');
      }
    }

    // Should not be reached, but just in case
    throw lastError ?? new ConformVaultError('Request failed after all retries');
  }

  /**
   * Make an authenticated request that returns the raw Response (for binary downloads).
   *
   * @internal Used by service classes.
   */
  async requestRaw(method: string, path: string, body?: unknown): Promise<Response> {
    const url = this.baseURL + path;

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'User-Agent': USER_AGENT,
    };

    let fetchBody: BodyInit | undefined;
    if (body instanceof Blob || body instanceof ArrayBuffer || body instanceof Uint8Array || (typeof Buffer !== 'undefined' && Buffer.isBuffer(body))) {
      // Binary body — pass through directly, let fetch set Content-Type or use octet-stream
      headers['Content-Type'] = 'application/octet-stream';
      fetchBody = body as BodyInit;
    } else if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
      fetchBody = JSON.stringify(body);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    let response: Response;
    try {
      response = await fetch(url, {
        method,
        headers,
        body: fetchBody,
        signal: controller.signal,
      });
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new ConformVaultError(`Request timed out after ${this.timeout}ms`);
      }
      throw new ConformVaultError(
        `Request failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (response.status === 401) {
      throw new AuthenticationError();
    }

    if (response.status === 429) {
      const retryAfterHeader = response.headers.get('Retry-After');
      const retryAfterSeconds = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60;
      throw new RateLimitError(isNaN(retryAfterSeconds) ? 60 : retryAfterSeconds);
    }

    if (response.status >= 400) {
      let message = response.statusText || `HTTP ${response.status}`;
      try {
        const errorBody = (await response.json()) as ErrorResponse;
        if (errorBody.error) message = errorBody.error;
      } catch {
        // Use status text
      }
      throw new APIError(response.status, message);
    }

    return response;
  }
}
