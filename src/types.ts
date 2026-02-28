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
