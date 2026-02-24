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
  // Webhooks
  WebhookEndpoint,
  RegisterWebhookRequest,
  RegisterWebhookResponse,
  // Audit
  AuditEntry,
  AuditListOptions,
  // API Keys
  APIKey,
  CreateAPIKeyRequest,
  CreateAPIKeyResponse,
  // Generic
  ListResponse,
  DataResponse,
  MessageResponse,
  ErrorResponse,
  // Options
  ConformVaultOptions,
} from './types.js';
