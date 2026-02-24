import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  ConformVault,
  DEFAULT_BASE_URL,
  VERSION,
  APIError,
  AuthenticationError,
  RateLimitError,
  ConformVaultError,
  isNotFound,
  isRateLimited,
} from '../src/index.js';

// Helper to create a mock Response
function mockResponse(
  status: number,
  body: unknown,
  headers?: Record<string, string>,
): Response {
  const headersObj = new Headers(headers);
  return new Response(JSON.stringify(body), {
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: headersObj,
  });
}

describe('ConformVault Client', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create a client with default options', () => {
      const client = new ConformVault('cvk_test_abc');
      expect(client).toBeDefined();
      expect(client.files).toBeDefined();
      expect(client.folders).toBeDefined();
      expect(client.shareLinks).toBeDefined();
      expect(client.signatures).toBeDefined();
      expect(client.webhooks).toBeDefined();
      expect(client.audit).toBeDefined();
      expect(client.keys).toBeDefined();
    });

    it('should accept custom baseURL', () => {
      const client = new ConformVault('cvk_test_abc', {
        baseURL: 'https://custom.api.com/v1',
      });
      expect(client).toBeDefined();
    });

    it('should throw if API key is empty', () => {
      expect(() => new ConformVault('')).toThrow(ConformVaultError);
      expect(() => new ConformVault('')).toThrow('API key is required');
    });

    it('should strip trailing slashes from baseURL', () => {
      fetchSpy.mockResolvedValueOnce(mockResponse(200, { data: [] }));

      const client = new ConformVault('cvk_test_abc', {
        baseURL: 'https://api.example.com/v1/',
      });
      client.files.list();

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://api.example.com/v1/files',
        expect.any(Object),
      );
    });
  });

  describe('files.list', () => {
    it('should list files with proper auth headers', async () => {
      fetchSpy.mockResolvedValueOnce(
        mockResponse(200, {
          data: [
            { id: 'f1', name: 'test.pdf', original_name: 'test.pdf', size: 1024, content_type: 'application/pdf', created_at: '2026-01-01T00:00:00Z' },
            { id: 'f2', name: 'doc.txt', original_name: 'doc.txt', size: 512, content_type: 'text/plain', created_at: '2026-01-02T00:00:00Z' },
          ],
        }),
      );

      const client = new ConformVault('cvk_test_key');
      const files = await client.files.list();

      expect(files).toHaveLength(2);
      expect(files[0].id).toBe('f1');
      expect(files[1].name).toBe('doc.txt');

      // Verify request details
      const [url, init] = fetchSpy.mock.calls[0];
      expect(url).toBe(`${DEFAULT_BASE_URL}/files`);
      expect((init as RequestInit).method).toBe('GET');
      const headers = (init as RequestInit).headers as Record<string, string>;
      expect(headers['Authorization']).toBe('Bearer cvk_test_key');
      expect(headers['User-Agent']).toBe(`conformvault-ts/${VERSION}`);
    });

    it('should pass query parameters for filtering', async () => {
      fetchSpy.mockResolvedValueOnce(mockResponse(200, { data: [] }));

      const client = new ConformVault('cvk_test_key');
      await client.files.list({ folderId: 'folder-123', page: 2, limit: 10 });

      const [url] = fetchSpy.mock.calls[0];
      expect(url).toContain('folder_id=folder-123');
      expect(url).toContain('page=2');
      expect(url).toContain('limit=10');
    });
  });

  describe('files.get', () => {
    it('should get a file by ID', async () => {
      fetchSpy.mockResolvedValueOnce(
        mockResponse(200, {
          data: { id: 'f1', name: 'test.pdf', original_name: 'test.pdf', size: 1024, content_type: 'application/pdf', created_at: '2026-01-01T00:00:00Z' },
        }),
      );

      const client = new ConformVault('cvk_test_key');
      const file = await client.files.get('f1');

      expect(file.id).toBe('f1');
      expect(file.name).toBe('test.pdf');
    });
  });

  describe('files.delete', () => {
    it('should delete a file by ID', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(null, { status: 204 }));

      const client = new ConformVault('cvk_test_key');
      await expect(client.files.delete('f1')).resolves.toBeUndefined();

      const [url, init] = fetchSpy.mock.calls[0];
      expect(url).toBe(`${DEFAULT_BASE_URL}/files/f1`);
      expect((init as RequestInit).method).toBe('DELETE');
    });
  });

  describe('folders', () => {
    it('should list folders with parentId filter', async () => {
      fetchSpy.mockResolvedValueOnce(
        mockResponse(200, {
          data: [
            { id: 'fld1', name: 'Documents', path: '/Documents', created_at: '2026-01-01T00:00:00Z' },
          ],
        }),
      );

      const client = new ConformVault('cvk_test_key');
      const folders = await client.folders.list({ parentId: 'root' });

      expect(folders).toHaveLength(1);
      expect(folders[0].name).toBe('Documents');

      const [url] = fetchSpy.mock.calls[0];
      expect(url).toContain('parent_id=root');
    });

    it('should create a folder', async () => {
      fetchSpy.mockResolvedValueOnce(
        mockResponse(200, {
          data: { id: 'fld2', name: 'New Folder', path: '/New Folder', created_at: '2026-01-01T00:00:00Z' },
        }),
      );

      const client = new ConformVault('cvk_test_key');
      const folder = await client.folders.create({ name: 'New Folder' });

      expect(folder.id).toBe('fld2');
      expect(folder.name).toBe('New Folder');

      const [, init] = fetchSpy.mock.calls[0];
      expect((init as RequestInit).method).toBe('POST');
      const body = JSON.parse((init as RequestInit).body as string);
      expect(body.name).toBe('New Folder');
    });

    it('should get a folder by ID', async () => {
      fetchSpy.mockResolvedValueOnce(
        mockResponse(200, {
          data: { id: 'fld1', name: 'Documents', path: '/Documents', created_at: '2026-01-01T00:00:00Z' },
        }),
      );

      const client = new ConformVault('cvk_test_key');
      const folder = await client.folders.get('fld1');

      expect(folder.id).toBe('fld1');
    });

    it('should delete a folder', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(null, { status: 204 }));

      const client = new ConformVault('cvk_test_key');
      await expect(client.folders.delete('fld1')).resolves.toBeUndefined();
    });
  });

  describe('shareLinks', () => {
    it('should list share links', async () => {
      fetchSpy.mockResolvedValueOnce(
        mockResponse(200, {
          data: [
            { id: 'sl1', token: 'abc', url: 'https://app.conformvault.com/s/abc', type: 'download', expires_at: '2026-12-31T00:00:00Z', is_active: true, created_at: '2026-01-01T00:00:00Z' },
          ],
        }),
      );

      const client = new ConformVault('cvk_test_key');
      const links = await client.shareLinks.list();

      expect(links).toHaveLength(1);
      expect(links[0].type).toBe('download');
    });

    it('should create a share link', async () => {
      fetchSpy.mockResolvedValueOnce(
        mockResponse(200, {
          data: { id: 'sl2', token: 'xyz', url: 'https://app.conformvault.com/s/xyz', type: 'upload', expires_at: '2026-12-31T00:00:00Z', is_active: true, created_at: '2026-01-01T00:00:00Z' },
        }),
      );

      const client = new ConformVault('cvk_test_key');
      const link = await client.shareLinks.create({
        folder_id: 'fld1',
        type: 'upload',
        expires_in: 86400,
      });

      expect(link.type).toBe('upload');
    });
  });

  describe('signatures', () => {
    it('should create a signature envelope', async () => {
      fetchSpy.mockResolvedValueOnce(
        mockResponse(201, {
          data: {
            id: 'env-123',
            provider: 'boldsign',
            status: 'sent',
            subject: 'NDA Agreement',
            expiry_days: 30,
            created_at: '2026-01-01T00:00:00Z',
          },
        }),
      );

      const client = new ConformVault('cvk_test_key');
      const envelope = await client.signatures.create({
        file_id: 'file-abc',
        subject: 'NDA Agreement',
        signers: [{ email: 'signer@example.com', name: 'John Doe' }],
      });

      expect(envelope.id).toBe('env-123');
      expect(envelope.status).toBe('sent');
      expect(envelope.subject).toBe('NDA Agreement');
    });

    it('should get signature status', async () => {
      fetchSpy.mockResolvedValueOnce(
        mockResponse(200, {
          data: {
            id: 'env-123',
            provider: 'boldsign',
            status: 'completed',
            subject: 'NDA Agreement',
            expiry_days: 30,
            created_at: '2026-01-01T00:00:00Z',
          },
        }),
      );

      const client = new ConformVault('cvk_test_key');
      const envelope = await client.signatures.getStatus('env-123');

      expect(envelope.status).toBe('completed');
    });

    it('should revoke a signature', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(null, { status: 204 }));

      const client = new ConformVault('cvk_test_key');
      await expect(client.signatures.revoke('env-123')).resolves.toBeUndefined();

      const [url, init] = fetchSpy.mock.calls[0];
      expect(url).toBe(`${DEFAULT_BASE_URL}/signatures/env-123/revoke`);
      expect((init as RequestInit).method).toBe('POST');
    });
  });

  describe('webhooks', () => {
    it('should list webhook endpoints', async () => {
      fetchSpy.mockResolvedValueOnce(
        mockResponse(200, {
          data: [
            { id: 'wh1', url: 'https://example.com/webhook', events: ['file.uploaded'], environment: 'live', is_active: true, created_at: '2026-01-01T00:00:00Z' },
          ],
        }),
      );

      const client = new ConformVault('cvk_test_key');
      const webhooks = await client.webhooks.list();

      expect(webhooks).toHaveLength(1);
      expect(webhooks[0].events).toContain('file.uploaded');
    });

    it('should register a webhook', async () => {
      fetchSpy.mockResolvedValueOnce(
        mockResponse(200, {
          data: {
            id: 'wh2',
            url: 'https://example.com/hook',
            events: ['file.uploaded', 'file.deleted'],
            environment: 'live',
            is_active: true,
            created_at: '2026-01-01T00:00:00Z',
            secret: 'whsec_abc123',
          },
          message: 'webhook registered',
        }),
      );

      const client = new ConformVault('cvk_test_key');
      const webhook = await client.webhooks.register({
        url: 'https://example.com/hook',
        events: ['file.uploaded', 'file.deleted'],
      });

      expect(webhook.id).toBe('wh2');
      expect(webhook.secret).toBe('whsec_abc123');
    });

    it('should test a webhook', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(null, { status: 204 }));

      const client = new ConformVault('cvk_test_key');
      await expect(client.webhooks.test('wh1')).resolves.toBeUndefined();

      const [url, init] = fetchSpy.mock.calls[0];
      expect(url).toBe(`${DEFAULT_BASE_URL}/webhooks/wh1/test`);
      expect((init as RequestInit).method).toBe('POST');
    });
  });

  describe('audit', () => {
    it('should list audit entries with filters', async () => {
      fetchSpy.mockResolvedValueOnce(
        mockResponse(200, {
          data: [
            { id: 'a1', action: 'file.uploaded', resource_type: 'file', resource_id: 'f1', created_at: '2026-01-01T00:00:00Z' },
          ],
        }),
      );

      const client = new ConformVault('cvk_test_key');
      const entries = await client.audit.list({
        eventType: 'file.uploaded',
        from: '2026-01-01',
        to: '2026-01-31',
        page: 1,
        limit: 50,
      });

      expect(entries).toHaveLength(1);
      expect(entries[0].action).toBe('file.uploaded');

      const [url] = fetchSpy.mock.calls[0];
      expect(url).toContain('event_type=file.uploaded');
      expect(url).toContain('from=2026-01-01');
      expect(url).toContain('to=2026-01-31');
      expect(url).toContain('page=1');
      expect(url).toContain('limit=50');
    });
  });

  describe('keys', () => {
    it('should list API keys', async () => {
      fetchSpy.mockResolvedValueOnce(
        mockResponse(200, {
          data: [
            { id: 'k1', name: 'Production Key', prefix: 'cvk_live_abc', environment: 'live', scopes: ['files:read', 'files:write'], created_at: '2026-01-01T00:00:00Z' },
          ],
        }),
      );

      const client = new ConformVault('cvk_test_key');
      const keys = await client.keys.list();

      expect(keys).toHaveLength(1);
      expect(keys[0].name).toBe('Production Key');
    });

    it('should create an API key', async () => {
      fetchSpy.mockResolvedValueOnce(
        mockResponse(200, {
          data: {
            id: 'k2',
            name: 'New Key',
            prefix: 'cvk_test_xyz',
            environment: 'test',
            scopes: ['files:read'],
            created_at: '2026-01-01T00:00:00Z',
            key: 'cvk_test_xyz_full_secret',
          },
        }),
      );

      const client = new ConformVault('cvk_test_key');
      const newKey = await client.keys.create({
        name: 'New Key',
        environment: 'test',
        scopes: ['files:read'],
      });

      expect(newKey.key).toBe('cvk_test_xyz_full_secret');
    });

    it('should get a key by ID', async () => {
      fetchSpy.mockResolvedValueOnce(
        mockResponse(200, {
          data: { id: 'k1', name: 'Production Key', prefix: 'cvk_live_abc', environment: 'live', scopes: ['files:read'], created_at: '2026-01-01T00:00:00Z' },
        }),
      );

      const client = new ConformVault('cvk_test_key');
      const key = await client.keys.get('k1');

      expect(key.id).toBe('k1');
    });

    it('should revoke a key', async () => {
      fetchSpy.mockResolvedValueOnce(new Response(null, { status: 204 }));

      const client = new ConformVault('cvk_test_key');
      await expect(client.keys.revoke('k1')).resolves.toBeUndefined();
    });

    it('should rotate a key', async () => {
      fetchSpy.mockResolvedValueOnce(
        mockResponse(200, {
          data: {
            id: 'k1',
            name: 'Production Key',
            prefix: 'cvk_live_new',
            environment: 'live',
            scopes: ['files:read'],
            created_at: '2026-01-01T00:00:00Z',
            key: 'cvk_live_new_rotated_secret',
          },
        }),
      );

      const client = new ConformVault('cvk_test_key');
      const rotated = await client.keys.rotate('k1');

      expect(rotated.key).toBe('cvk_live_new_rotated_secret');

      const [url, init] = fetchSpy.mock.calls[0];
      expect(url).toBe(`${DEFAULT_BASE_URL}/keys/k1/rotate`);
      expect((init as RequestInit).method).toBe('POST');
    });
  });

  describe('error handling', () => {
    it('should throw APIError on 404', async () => {
      fetchSpy.mockResolvedValueOnce(
        mockResponse(404, { error: 'file not found' }),
      );

      const client = new ConformVault('cvk_test_key');
      try {
        await client.files.get('nonexistent');
        expect.unreachable('should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(APIError);
        expect((err as APIError).statusCode).toBe(404);
        expect(isNotFound(err)).toBe(true);
      }
    });

    it('should throw AuthenticationError on 401', async () => {
      fetchSpy.mockResolvedValueOnce(
        mockResponse(401, { error: 'invalid api key' }),
      );

      const client = new ConformVault('cvk_bad_key');
      try {
        await client.files.list();
        expect.unreachable('should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(AuthenticationError);
        expect(err).toBeInstanceOf(APIError);
        expect((err as AuthenticationError).statusCode).toBe(401);
      }
    });

    it('should throw RateLimitError on 429 after retries exhausted', async () => {
      // Return 429 for all attempts (maxRetries + 1)
      for (let i = 0; i < 4; i++) {
        fetchSpy.mockResolvedValueOnce(
          mockResponse(429, { error: 'rate limited' }, { 'Retry-After': '0' }),
        );
      }

      const client = new ConformVault('cvk_test_key', { maxRetries: 3 });
      try {
        await client.files.list();
        expect.unreachable('should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(RateLimitError);
        expect(isRateLimited(err)).toBe(true);
      }
    });

    it('should retry on 429 and succeed', async () => {
      // First call: 429, second call: success
      fetchSpy
        .mockResolvedValueOnce(
          mockResponse(429, { error: 'rate limited' }, { 'Retry-After': '0' }),
        )
        .mockResolvedValueOnce(
          mockResponse(200, { data: [{ id: 'f1', name: 'test.pdf', original_name: 'test.pdf', size: 1024, content_type: 'application/pdf', created_at: '2026-01-01T00:00:00Z' }] }),
        );

      const client = new ConformVault('cvk_test_key', { maxRetries: 1 });
      const files = await client.files.list();

      expect(files).toHaveLength(1);
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    it('should throw APIError on 500', async () => {
      fetchSpy.mockResolvedValueOnce(
        mockResponse(500, { error: 'internal server error' }),
      );

      const client = new ConformVault('cvk_test_key');
      try {
        await client.files.list();
        expect.unreachable('should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(APIError);
        expect((err as APIError).statusCode).toBe(500);
      }
    });
  });

  describe('constants', () => {
    it('should export correct DEFAULT_BASE_URL', () => {
      expect(DEFAULT_BASE_URL).toBe('https://api.conformvault.com/dev/v1');
    });

    it('should export correct VERSION', () => {
      expect(VERSION).toBe('0.1.0');
    });
  });
});
