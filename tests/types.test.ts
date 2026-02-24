import { describe, it, expect } from 'vitest';
import type {
  File,
  Folder,
  ShareLink,
  SignatureEnvelope,
  WebhookEndpoint,
  AuditEntry,
  APIKey,
  CreateFolderRequest,
  CreateShareLinkRequest,
  CreateSignatureRequest,
  CreateSignatureSigner,
  RegisterWebhookRequest,
  CreateAPIKeyRequest,
  CreateAPIKeyResponse,
  RegisterWebhookResponse,
  FileListOptions,
  FolderListOptions,
  ShareLinkListOptions,
  AuditListOptions,
  UploadOptions,
  UploadResult,
  ListResponse,
  DataResponse,
  MessageResponse,
  ErrorResponse,
  ConformVaultOptions,
} from '../src/index.js';

/**
 * These tests verify that the type definitions are structurally correct
 * by creating objects that conform to each interface. If TypeScript compilation
 * succeeds, the types are valid.
 */
describe('Type definitions', () => {
  it('File type should have correct shape', () => {
    const file: File = {
      id: 'f1',
      name: 'test.pdf',
      original_name: 'test.pdf',
      size: 1024,
      content_type: 'application/pdf',
      created_at: '2026-01-01T00:00:00Z',
    };
    expect(file.id).toBe('f1');
  });

  it('File type should allow optional folder_id', () => {
    const file: File = {
      id: 'f1',
      name: 'test.pdf',
      original_name: 'test.pdf',
      size: 1024,
      content_type: 'application/pdf',
      folder_id: 'fld1',
      created_at: '2026-01-01T00:00:00Z',
    };
    expect(file.folder_id).toBe('fld1');

    const fileNoFolder: File = {
      id: 'f2',
      name: 'test2.pdf',
      original_name: 'test2.pdf',
      size: 512,
      content_type: 'application/pdf',
      folder_id: null,
      created_at: '2026-01-01T00:00:00Z',
    };
    expect(fileNoFolder.folder_id).toBeNull();
  });

  it('Folder type should have correct shape', () => {
    const folder: Folder = {
      id: 'fld1',
      name: 'Documents',
      path: '/Documents',
      created_at: '2026-01-01T00:00:00Z',
    };
    expect(folder.name).toBe('Documents');
  });

  it('ShareLink type should have correct shape', () => {
    const link: ShareLink = {
      id: 'sl1',
      token: 'abc123',
      url: 'https://app.conformvault.com/s/abc123',
      type: 'download',
      expires_at: '2026-12-31T00:00:00Z',
      is_active: true,
      created_at: '2026-01-01T00:00:00Z',
    };
    expect(link.type).toBe('download');
  });

  it('SignatureEnvelope type should have correct shape', () => {
    const envelope: SignatureEnvelope = {
      id: 'env-1',
      provider: 'boldsign',
      status: 'sent',
      subject: 'NDA',
      expiry_days: 30,
      created_at: '2026-01-01T00:00:00Z',
    };
    expect(envelope.status).toBe('sent');

    // With optional fields
    const envelopeWithOptionals: SignatureEnvelope = {
      id: 'env-2',
      provider: 'boldsign',
      status: 'completed',
      subject: 'Contract',
      message: 'Please sign',
      source_file_id: 'f1',
      signed_file_id: 'f2',
      expiry_days: 30,
      created_at: '2026-01-01T00:00:00Z',
    };
    expect(envelopeWithOptionals.message).toBe('Please sign');
  });

  it('WebhookEndpoint type should have correct shape', () => {
    const webhook: WebhookEndpoint = {
      id: 'wh1',
      url: 'https://example.com/webhook',
      events: ['file.uploaded', 'file.deleted'],
      environment: 'live',
      is_active: true,
      created_at: '2026-01-01T00:00:00Z',
    };
    expect(webhook.events).toHaveLength(2);
  });

  it('AuditEntry type should have correct shape', () => {
    const entry: AuditEntry = {
      id: 'a1',
      action: 'file.uploaded',
      resource_type: 'file',
      resource_id: 'f1',
      created_at: '2026-01-01T00:00:00Z',
    };
    expect(entry.action).toBe('file.uploaded');

    const entryWithDetails: AuditEntry = {
      id: 'a2',
      action: 'file.deleted',
      resource_type: 'file',
      resource_id: 'f2',
      details: { reason: 'manual', ip: '192.168.1.1' },
      created_at: '2026-01-01T00:00:00Z',
    };
    expect(entryWithDetails.details).toBeDefined();
  });

  it('APIKey type should have correct shape', () => {
    const key: APIKey = {
      id: 'k1',
      name: 'Production Key',
      prefix: 'cvk_live_abc',
      environment: 'live',
      scopes: ['files:read', 'files:write'],
      created_at: '2026-01-01T00:00:00Z',
    };
    expect(key.scopes).toContain('files:read');

    const keyWithExpiry: APIKey = {
      id: 'k2',
      name: 'Temp Key',
      prefix: 'cvk_test_xyz',
      environment: 'test',
      scopes: ['files:read'],
      expires_at: '2026-06-01T00:00:00Z',
      created_at: '2026-01-01T00:00:00Z',
    };
    expect(keyWithExpiry.expires_at).toBe('2026-06-01T00:00:00Z');
  });

  it('CreateFolderRequest should have correct shape', () => {
    const req: CreateFolderRequest = { name: 'New Folder' };
    expect(req.name).toBe('New Folder');

    const reqWithParent: CreateFolderRequest = { name: 'Sub Folder', parent_id: 'fld1' };
    expect(reqWithParent.parent_id).toBe('fld1');
  });

  it('CreateShareLinkRequest should have correct shape', () => {
    const req: CreateShareLinkRequest = {
      file_id: 'f1',
      type: 'download',
      expires_in: 3600,
    };
    expect(req.type).toBe('download');
  });

  it('CreateSignatureRequest should have correct shape', () => {
    const signer: CreateSignatureSigner = {
      email: 'signer@example.com',
      name: 'John Doe',
      role: 'signer',
      sign_order: 1,
    };

    const req: CreateSignatureRequest = {
      file_id: 'f1',
      subject: 'NDA Agreement',
      message: 'Please sign this NDA',
      signers: [signer],
      expiry_days: 14,
    };
    expect(req.signers).toHaveLength(1);
  });

  it('RegisterWebhookRequest should have correct shape', () => {
    const req: RegisterWebhookRequest = {
      url: 'https://example.com/hook',
      events: ['file.uploaded'],
      environment: 'live',
    };
    expect(req.url).toBe('https://example.com/hook');
  });

  it('RegisterWebhookResponse should extend WebhookEndpoint', () => {
    const resp: RegisterWebhookResponse = {
      id: 'wh1',
      url: 'https://example.com/hook',
      events: ['file.uploaded'],
      environment: 'live',
      is_active: true,
      created_at: '2026-01-01T00:00:00Z',
      secret: 'whsec_abc',
    };
    expect(resp.secret).toBe('whsec_abc');
    expect(resp.id).toBe('wh1');
  });

  it('CreateAPIKeyRequest should have correct shape', () => {
    const req: CreateAPIKeyRequest = {
      name: 'My Key',
      environment: 'test',
      scopes: ['files:read'],
    };
    expect(req.scopes).toHaveLength(1);
  });

  it('CreateAPIKeyResponse should extend APIKey', () => {
    const resp: CreateAPIKeyResponse = {
      id: 'k1',
      name: 'My Key',
      prefix: 'cvk_test_xyz',
      environment: 'test',
      scopes: ['files:read'],
      created_at: '2026-01-01T00:00:00Z',
      key: 'cvk_test_xyz_full_secret',
    };
    expect(resp.key).toBe('cvk_test_xyz_full_secret');
  });

  it('list option types should have correct shapes', () => {
    const fileOpts: FileListOptions = { folderId: 'fld1', page: 1, limit: 20 };
    expect(fileOpts.folderId).toBe('fld1');

    const folderOpts: FolderListOptions = { parentId: 'root', page: 1, limit: 10 };
    expect(folderOpts.parentId).toBe('root');

    const shareLinkOpts: ShareLinkListOptions = { page: 1, limit: 50 };
    expect(shareLinkOpts.page).toBe(1);

    const auditOpts: AuditListOptions = {
      eventType: 'file.uploaded',
      from: '2026-01-01',
      to: '2026-12-31',
      page: 1,
      limit: 100,
    };
    expect(auditOpts.eventType).toBe('file.uploaded');
  });

  it('UploadOptions should have correct shape', () => {
    const opts: UploadOptions = { folderId: 'fld1', contentType: 'application/pdf' };
    expect(opts.contentType).toBe('application/pdf');
  });

  it('UploadResult should have correct shape', () => {
    const result: UploadResult = {
      id: 'f1',
      name: 'test.pdf',
      original_name: 'test.pdf',
      size: 1024,
      created_at: '2026-01-01T00:00:00Z',
    };
    expect(result.id).toBe('f1');
  });

  it('generic response types should have correct shapes', () => {
    const listResp: ListResponse<File> = {
      data: [
        { id: 'f1', name: 'test.pdf', original_name: 'test.pdf', size: 1024, content_type: 'application/pdf', created_at: '2026-01-01T00:00:00Z' },
      ],
    };
    expect(listResp.data).toHaveLength(1);

    const dataResp: DataResponse<Folder> = {
      data: { id: 'fld1', name: 'Docs', path: '/Docs', created_at: '2026-01-01T00:00:00Z' },
    };
    expect(dataResp.data.name).toBe('Docs');

    const msgResp: MessageResponse = { message: 'success' };
    expect(msgResp.message).toBe('success');

    const errResp: ErrorResponse = { error: 'not found' };
    expect(errResp.error).toBe('not found');
  });

  it('ConformVaultOptions should have correct shape', () => {
    const opts: ConformVaultOptions = {
      baseURL: 'https://custom.api.com',
      timeout: 5000,
      maxRetries: 5,
    };
    expect(opts.baseURL).toBe('https://custom.api.com');
  });
});
