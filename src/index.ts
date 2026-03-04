// ============================================================================
// ConformVault TypeScript SDK — Public API
// ============================================================================

// Main client
export { ConformVault, DEFAULT_BASE_URL, VERSION } from './client.js';
export type { ConformVaultClient } from './client.js';

// Error classes
export {
  ConformVaultError,
  APIError,
  RateLimitError,
  AuthenticationError,
  isNotFound,
  isRateLimited,
} from './errors.js';

// Service classes
export { FilesService } from './files.js';
export { FoldersService } from './folders.js';
export { ShareLinksService } from './sharelinks.js';
export { SignaturesService } from './signatures.js';
export { WebhooksService } from './webhooks.js';
export { AuditService } from './audit.js';
export { KeysService } from './keys.js';
export { BulkService } from './bulk.js';
export { VersionsService } from './versions.js';
export { SearchService } from './search.js';
export { TrashService } from './trash.js';
export { ScanReportsService } from './scan_reports.js';
export { AttestationService } from './attestation.js';
export { EncryptionService } from './encryption.js';
export { TransactionsService } from './transactions.js';
export { TemplatesService } from './templates.js';
export { BatchesService } from './batches.js';
export { MetadataService } from './metadata.js';
export { RetentionService } from './retention.js';
export { LegalHoldsService } from './legal_holds.js';
export { PermissionsService } from './permissions.js';
export { CommentsService } from './comments.js';
export { QuotaService, RateLimitService } from './quota.js';
export { UploadSessionsService } from './upload_sessions.js';
export { JobsService } from './jobs.js';
export { ActivitySubscriptionsService } from './activity_subscriptions.js';
export { PoliciesService } from './policies.js';
export { BandwidthService } from './bandwidth.js';
export { DataExportService } from './data_export.js';

// Webhook signature verification
export { verifyWebhookSignature } from './webhooks.js';

// All types
export type {
  // Files
  File,
  FileListOptions,
  UploadResult,
  UploadOptions,
  // Folders
  Folder,
  FolderListOptions,
  CreateFolderRequest,
  // Share Links
  ShareLink,
  ShareLinkListOptions,
  CreateShareLinkRequest,
  // Signatures
  SignatureEnvelope,
  CreateSignatureSigner,
  CreateSignatureRequest,
  PDFPageDimension,
  PDFFieldSuggestion,
  PDFAnalysisResult,
  AnalyzePDFRequest,
  EmbeddedSignLinkResponse,
  // Webhooks
  WebhookEndpoint,
  WebhookListOptions,
  RegisterWebhookRequest,
  RegisterWebhookResponse,
  // Audit
  AuditEntry,
  AuditListOptions,
  // API Keys
  APIKey,
  KeyListOptions,
  CreateAPIKeyRequest,
  CreateAPIKeyResponse,
  // Bulk Operations
  BulkDeleteRequest,
  BulkMoveRequest,
  BulkDownloadRequest,
  BulkError,
  BulkResult,
  // File Versions
  FileVersion,
  // Search
  SearchOptions,
  SearchResult,
  SearchPagination,
  SearchResponse,
  // Trash
  TrashListOptions,
  TrashListResponse,
  EmptyTrashResponse,
  // Scan Reports
  FileScanReport,
  FileScanSummary,
  ScanReportListOptions,
  ScanReportListResponse,
  // Generic
  ListResponse,
  DataResponse,
  MessageResponse,
  ErrorResponse,
  // Transaction Folders
  TransactionFolder,
  TransactionFolderItem,
  TransactionProgress,
  TransactionFolderResponse,
  TransactionListResponse,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  CreateTransactionItemRequest,
  UpdateTransactionItemRequest,
  // Document Templates
  DocumentTemplate,
  GeneratedDocument,
  TemplateListResponse,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  GenerateDocumentRequest,
  // Batch Operations
  BatchOperation,
  BatchOperationItem,
  BatchOperationResponse,
  BatchListResponse,
  CreateBatchRequest,
  CreateBatchItemDef,
  // Options
  ConformVaultOptions,
  // Webhook Deliveries
  WebhookDelivery,
  // Audit extended
  AuditSearchOptions,
  AuditExportOptions,
  AuditStats,
  AuditAnomaly,
  // File Metadata & Tags
  FileTag,
  AddTagsRequest,
  SetMetadataRequest,
  // Retention Policies
  RetentionPolicy,
  CreateRetentionPolicyRequest,
  UpdateRetentionPolicyRequest,
  // Legal Holds
  LegalHold,
  CreateLegalHoldRequest,
  AddLegalHoldFilesRequest,
  LegalHoldFile,
  // Folder Permissions
  FolderPermission,
  SetFolderPermissionRequest,
  // Comments
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  // Quota
  QuotaInfo,
  // Rate Limit
  RateLimitInfo,
  // Upload Sessions
  UploadSession,
  CreateUploadSessionRequest,
  // Jobs
  Job,
  CreateJobRequest,
  // Activity Subscriptions
  ActivitySubscription,
  CreateActivitySubscriptionRequest,
  // IP Policy
  IPPolicy,
  SetIPPolicyRequest,
  // MFA Policy
  MFAPolicy,
  SetMFAPolicyRequest,
  // Encryption Salt
  EncryptionSalt,
  SetEncryptionSaltRequest,
} from './types.js';

// Bandwidth types
export type { BandwidthSummary, DailyBandwidthStats } from './bandwidth.js';

// Key revocation types
export type { KeyRevocationStatus } from './keys.js';

// Data export types
export type { UserDataExport } from './data_export.js';

// Encryption salt types
export type { EncryptionSaltResponse } from './encryption.js';
