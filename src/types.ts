// ============================================================================
// ConformVault TypeScript SDK — Type Definitions
// ============================================================================

// --- Files ---

/** Represents a stored file in ConformVault. */
export interface File {
  id: string;
  name: string;
  original_name: string;
  size: number;
  content_type: string;
  folder_id?: string | null;
  created_at: string;
}

/** Query parameters for listing files. */
export interface FileListOptions {
  folderId?: string;
  page?: number;
  limit?: number;
}

/** Response returned after uploading a file. */
export interface UploadResult {
  id: string;
  name: string;
  original_name: string;
  size: number;
  created_at: string;
}

/** Options for uploading a file. */
export interface UploadOptions {
  folderId?: string;
  contentType?: string;
}

// --- Folders ---

/** Represents a folder in the file tree. */
export interface Folder {
  id: string;
  name: string;
  path: string;
  parent_id?: string | null;
  created_at: string;
}

/** Query parameters for listing folders. */
export interface FolderListOptions {
  parentId?: string;
  page?: number;
  limit?: number;
}

/** Input for creating a folder. */
export interface CreateFolderRequest {
  name: string;
  parent_id?: string;
}

// --- Share Links ---

/** Represents a share link. */
export interface ShareLink {
  id: string;
  token: string;
  url: string;
  /** "download" or "upload" */
  type: string;
  expires_at: string;
  is_active: boolean;
  created_at: string;
}

/** Query parameters for listing share links. */
export interface ShareLinkListOptions {
  page?: number;
  limit?: number;
}

/** Input for creating a share link. */
export interface CreateShareLinkRequest {
  file_id?: string;
  folder_id?: string;
  /** "download" or "upload" */
  type: string;
  /** Expiry duration in seconds. */
  expires_in?: number;
  password?: string;
}

// --- Signatures ---

/** Represents a signature envelope. */
export interface SignatureEnvelope {
  id: string;
  provider: string;
  status: string;
  subject: string;
  message?: string | null;
  source_file_id?: string | null;
  signed_file_id?: string | null;
  expiry_days: number;
  created_at: string;
}

/** A signer in a create signature request. */
export interface CreateSignatureSigner {
  email: string;
  name: string;
  role?: string;
  sign_order?: number;
}

/** Input for creating a signature envelope. */
export interface CreateSignatureRequest {
  file_id: string;
  subject: string;
  message?: string;
  signers: CreateSignatureSigner[];
  expiry_days?: number;
}

// --- Webhooks ---

/** Represents a registered webhook endpoint. */
export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  environment: string;
  is_active: boolean;
  created_at: string;
}

/** Input for registering a webhook endpoint. */
export interface RegisterWebhookRequest {
  url: string;
  events?: string[];
  environment?: string;
}

/** Response from registering a webhook (includes the signing secret, shown once). */
export interface RegisterWebhookResponse extends WebhookEndpoint {
  secret: string;
}

// --- Audit ---

/** Represents an audit log entry. */
export interface AuditEntry {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details?: Record<string, unknown> | null;
  created_at: string;
}

/** Query parameters for listing audit entries. */
export interface AuditListOptions {
  eventType?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

// --- API Keys ---

/** Represents a developer API key. */
export interface APIKey {
  id: string;
  name: string;
  prefix: string;
  environment: string;
  scopes: string[];
  expires_at?: string | null;
  created_at: string;
}

/** Input for creating an API key. */
export interface CreateAPIKeyRequest {
  name: string;
  environment: string;
  scopes: string[];
}

/** Response from creating an API key (includes the full key, shown once). */
export interface CreateAPIKeyResponse extends APIKey {
  key: string;
}

// --- Bulk Operations ---

/** Input for bulk-deleting files. */
export interface BulkDeleteRequest {
  file_ids: string[];
}

/** Input for bulk-moving files. */
export interface BulkMoveRequest {
  file_ids: string[];
  folder_id: string;
}

/** Input for bulk-downloading files as a ZIP. */
export interface BulkDownloadRequest {
  file_ids: string[];
}

/** Error detail for a single item in a bulk operation. */
export interface BulkError {
  file_id: string;
  error: string;
}

/** Result summary from a bulk operation. */
export interface BulkResult {
  succeeded: number;
  failed: number;
  errors?: BulkError[];
}

// --- File Versions ---

/** Represents a version of a file. */
export interface FileVersion {
  id: string;
  file_id: string;
  version: number;
  size: number;
  created_at: string;
}

// --- Search ---

/** Query parameters for search operations. */
export interface SearchOptions {
  /** Resource types: "files", "folders", or "files,folders". */
  types?: string;
  /** Limit search to a specific folder. */
  folderId?: string;
  /** Page number (1-based). */
  page?: number;
  /** Results per page. */
  pageSize?: number;
}

/** A single search result. */
export interface SearchResult {
  id: string;
  /** "file" or "folder" */
  type: string;
  name: string;
  path: string;
  size: number;
  content_type: string;
  created_at: string;
}

/** Pagination metadata for search results. */
export interface SearchPagination {
  page: number;
  page_size: number;
  total: number;
}

/** Response from a search operation. */
export interface SearchResponse {
  data: SearchResult[];
  pagination: SearchPagination;
}

// --- Trash ---

/** Query parameters for listing trashed files. */
export interface TrashListOptions {
  page?: number;
  limit?: number;
}

/** Response from listing trashed files. */
export interface TrashListResponse {
  data: File[];
  pagination: Record<string, unknown>;
}

/** Response from emptying the trash. */
export interface EmptyTrashResponse {
  message: string;
  files_deleted: number;
}

// --- Scan Reports ---

/** Represents a ClamAV file scan report. */
export interface FileScanReport {
  id: string;
  file_id: string;
  organization_id: string;
  scan_engine: string;
  engine_version?: string;
  scan_status: string;
  threat_name?: string;
  file_size?: number;
  mime_type?: string;
  scan_duration_ms?: number;
  scanned_at: string;
}

/** Aggregate scan statistics for an organization. */
export interface FileScanSummary {
  total_scans: number;
  clean_count: number;
  infected_count: number;
  error_count: number;
  skipped_count: number;
  scan_engine: string;
  engine_version: string;
}

/** Query parameters for listing scan reports. */
export interface ScanReportListOptions {
  limit?: number;
  offset?: number;
}

/** Paginated response from listing scan reports. */
export interface ScanReportListResponse {
  reports: FileScanReport[];
  total: number;
  limit: number;
  offset: number;
}

// --- Generic API Responses ---

/** Wraps a paginated list response. */
export interface ListResponse<T> {
  data: T[];
}

/** Wraps a single-item response. */
export interface DataResponse<T> {
  data: T;
}

/** Wraps a message-only response. */
export interface MessageResponse {
  message: string;
}

/** Wraps an error response. */
export interface ErrorResponse {
  error: string;
}

// --- Transaction Folders ---

/** Represents a transaction folder. */
export interface TransactionFolder {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  due_date?: string | null;
  progress?: TransactionProgress | null;
  items?: TransactionFolderItem[];
  created_at: string;
  updated_at: string;
}

/** A single item in a transaction folder. */
export interface TransactionFolderItem {
  id: string;
  transaction_id: string;
  label: string;
  description?: string | null;
  required: boolean;
  status: string;
  file_id?: string | null;
  created_at: string;
  updated_at: string;
}

/** Completion statistics for a transaction folder. */
export interface TransactionProgress {
  total: number;
  completed: number;
  pending: number;
}

/** Response wrapping a single transaction folder. */
export interface TransactionFolderResponse extends TransactionFolder {}

/** Paginated response for listing transaction folders. */
export interface TransactionListResponse {
  data: TransactionFolder[];
  page: number;
  limit: number;
  total: number;
}

/** Input for creating a transaction folder. */
export interface CreateTransactionRequest {
  name: string;
  description?: string;
  due_date?: string;
}

/** Input for updating a transaction folder. */
export interface UpdateTransactionRequest {
  name?: string;
  description?: string;
  status?: string;
  due_date?: string;
}

/** Input for adding an item to a transaction folder. */
export interface CreateTransactionItemRequest {
  label: string;
  description?: string;
  required?: boolean;
}

/** Input for updating a transaction folder item. */
export interface UpdateTransactionItemRequest {
  label?: string;
  description?: string;
  required?: boolean;
  status?: string;
  file_id?: string;
}

// --- Document Templates ---

/** Represents a document template. */
export interface DocumentTemplate {
  id: string;
  name: string;
  description?: string | null;
  content_type: string;
  fields?: string[];
  created_at: string;
  updated_at: string;
}

/** A document generated from a template. */
export interface GeneratedDocument {
  id: string;
  template_id: string;
  name: string;
  size: number;
  status: string;
  file_id?: string;
  created_at: string;
}

/** Paginated response for listing templates. */
export interface TemplateListResponse {
  data: DocumentTemplate[];
  page: number;
  limit: number;
  total: number;
}

/** Input for creating a template. */
export interface CreateTemplateRequest {
  name: string;
  content_type: string;
  description?: string;
  fields?: string[];
}

/** Input for updating a template. */
export interface UpdateTemplateRequest {
  name?: string;
  description?: string;
  fields?: string[];
}

/** Input for generating a document from a template. */
export interface GenerateDocumentRequest {
  data: Record<string, string>;
  filename?: string;
}

// --- Batch Operations (V2) ---

/** Represents a batch operation. */
export interface BatchOperation {
  id: string;
  status: string;
  type: string;
  total: number;
  completed: number;
  failed: number;
  items?: BatchOperationItem[];
  created_at: string;
  updated_at: string;
}

/** A single item within a batch operation. */
export interface BatchOperationItem {
  id: string;
  index: number;
  filename: string;
  size: number;
  mime_type: string;
  status: string;
  file_id?: string;
  error?: string;
}

/** Response wrapping a single batch operation. */
export interface BatchOperationResponse extends BatchOperation {}

/** Paginated response for listing batch operations. */
export interface BatchListResponse {
  data: BatchOperation[];
  page: number;
  limit: number;
  total: number;
}

/** Input for creating a batch operation. */
export interface CreateBatchRequest {
  type: string;
  folder_id?: string;
  items: CreateBatchItemDef[];
}

/** Defines a single item in a batch creation request. */
export interface CreateBatchItemDef {
  filename: string;
  size: number;
  mime_type: string;
}

// --- Client Options ---

/** Configuration options for the ConformVault client. */
export interface ConformVaultOptions {
  /** Base URL for the API. Defaults to https://api.conformvault.com/dev/v1 */
  baseURL?: string;
  /** Request timeout in milliseconds. Defaults to 30000 (30s). */
  timeout?: number;
  /** Maximum number of automatic retries on rate-limit (429) responses. Defaults to 3. */
  maxRetries?: number;
}

// --- Webhook Delivery types ---

export interface WebhookDelivery {
  id: string;
  webhook_id: string;
  event_type: string;
  status: string;
  http_status: number;
  request_body?: string;
  response_body?: string;
  created_at: string;
  delivered_at?: string;
}

// --- Audit extended types ---

export interface AuditSearchOptions {
  query?: string;
  eventType?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface AuditExportOptions {
  format?: string;
  eventType?: string;
  from?: string;
  to?: string;
}

export interface AuditStats {
  total_events: number;
  events_by_type: Record<string, number>;
  events_by_day: Record<string, number>;
}

export interface AuditAnomaly {
  id: string;
  type: string;
  description: string;
  severity: string;
  detected_at: string;
}

// --- File Metadata & Tags types ---

export interface FileTag {
  tag: string;
  created_at: string;
}

export interface AddTagsRequest {
  tags: string[];
}

export interface SetMetadataRequest {
  metadata: Record<string, string>;
}

// --- Retention Policy types ---

export interface RetentionPolicy {
  id: string;
  name: string;
  retention_days: number;
  auto_delete: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateRetentionPolicyRequest {
  name: string;
  retention_days: number;
  auto_delete?: boolean;
}

export interface UpdateRetentionPolicyRequest {
  name?: string;
  retention_days?: number;
  auto_delete?: boolean;
}

// --- Legal Hold types ---

export interface LegalHold {
  id: string;
  name: string;
  description: string;
  status: string;
  file_count: number;
  created_at: string;
  released_at?: string;
}

export interface CreateLegalHoldRequest {
  name: string;
  description?: string;
}

export interface AddLegalHoldFilesRequest {
  file_ids: string[];
}

export interface LegalHoldFile {
  file_id: string;
  added_at: string;
}

// --- Folder Permission types ---

export interface FolderPermission {
  folder_id: string;
  user_id: string;
  permission: string;
  granted_at: string;
}

export interface SetFolderPermissionRequest {
  user_id: string;
  permission: string;
}

// --- Comment types ---

export interface Comment {
  id: string;
  file_id: string;
  content: string;
  author_id: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentRequest {
  file_id: string;
  content: string;
  parent_id?: string;
}

export interface UpdateCommentRequest {
  content: string;
}

// --- Quota types ---

export interface QuotaInfo {
  used_bytes: number;
  total_bytes: number;
  file_count: number;
  max_file_count: number;
}

// --- Rate Limit types ---

export interface RateLimitInfo {
  requests_per_minute: number;
  requests_remaining: number;
  reset_at: string;
}

// --- Upload Session types ---

export interface UploadSession {
  id: string;
  filename: string;
  total_size: number;
  chunk_size: number;
  chunks_uploaded: number;
  total_chunks: number;
  status: string;
  created_at: string;
  expires_at: string;
}

export interface CreateUploadSessionRequest {
  filename: string;
  total_size: number;
  content_type?: string;
  folder_id?: string;
}

// --- Job types ---

export interface Job {
  id: string;
  type: string;
  status: string;
  progress: number;
  result?: unknown;
  error?: string;
  created_at: string;
  completed_at?: string;
}

export interface CreateJobRequest {
  type: string;
  params?: Record<string, unknown>;
}

// --- Activity Subscription types ---

export interface ActivitySubscription {
  id: string;
  event_types: string[];
  callback_url: string;
  created_at: string;
}

export interface CreateActivitySubscriptionRequest {
  event_types: string[];
  callback_url: string;
}

// --- IP Policy types ---

export interface IPPolicy {
  enabled: boolean;
  allowed_ips: string[];
  denied_ips: string[];
}

export interface SetIPPolicyRequest {
  enabled: boolean;
  allowed_ips?: string[];
  denied_ips?: string[];
}

// --- MFA Policy types ---

export interface MFAPolicy {
  enabled: boolean;
  required_for: string[];
}

export interface SetMFAPolicyRequest {
  enabled: boolean;
  required_for?: string[];
}

// --- Encryption Salt types ---

export interface EncryptionSalt {
  salt: string;
}

export interface SetEncryptionSaltRequest {
  salt: string;
}
