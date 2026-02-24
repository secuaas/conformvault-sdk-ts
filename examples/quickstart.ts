/**
 * ConformVault TypeScript SDK — Quick Start Example
 *
 * This example demonstrates basic usage of the ConformVault SDK.
 * Replace 'cvk_live_xxx' with your actual API key.
 */

import {
  ConformVault,
  verifyWebhookSignature,
  APIError,
  AuthenticationError,
  RateLimitError,
  isNotFound,
} from '@conformvault/sdk';

async function main() {
  // --- Initialize the client ---
  const client = new ConformVault('cvk_live_xxx', {
    // baseURL: 'https://api.conformvault.com/dev/v1', // default
    // timeout: 30000, // 30s default
    // maxRetries: 3, // automatic retry on 429
  });

  try {
    // --- Files ---

    // List all files
    const files = await client.files.list();
    console.log('Files:', files.length);

    // List files in a specific folder
    const folderFiles = await client.files.list({ folderId: 'folder-123', page: 1, limit: 20 });
    console.log('Folder files:', folderFiles.length);

    // Upload a file
    const content = new Blob(['Hello, ConformVault!'], { type: 'text/plain' });
    const uploaded = await client.files.upload(content, 'hello.txt', {
      folderId: 'folder-123',
    });
    console.log('Uploaded:', uploaded.id, uploaded.name);

    // Get file details
    const file = await client.files.get(uploaded.id);
    console.log('File:', file.name, file.size, 'bytes');

    // Download a file
    const downloadResp = await client.files.download(uploaded.id);
    const downloadedContent = await downloadResp.text();
    console.log('Downloaded:', downloadedContent);

    // Delete a file
    await client.files.delete(uploaded.id);
    console.log('File deleted');

    // --- Folders ---

    // Create a folder
    const folder = await client.folders.create({ name: 'My Documents' });
    console.log('Created folder:', folder.id, folder.path);

    // List folders
    const folders = await client.folders.list();
    console.log('Folders:', folders.length);

    // Get folder details
    const folderDetail = await client.folders.get(folder.id);
    console.log('Folder:', folderDetail.name);

    // Delete a folder
    await client.folders.delete(folder.id);

    // --- Share Links ---

    // Create a download share link
    const shareLink = await client.shareLinks.create({
      file_id: 'some-file-id',
      type: 'download',
      expires_in: 86400, // 24 hours
      password: 'optional-password',
    });
    console.log('Share link:', shareLink.url);

    // List share links
    const shareLinks = await client.shareLinks.list({ page: 1, limit: 10 });
    console.log('Share links:', shareLinks.length);

    // Delete a share link
    await client.shareLinks.delete(shareLink.id);

    // --- Signatures ---

    // Create a signature envelope
    const envelope = await client.signatures.create({
      file_id: 'document-file-id',
      subject: 'NDA Agreement',
      message: 'Please review and sign this NDA.',
      signers: [
        { email: 'signer@example.com', name: 'John Doe', role: 'signer', sign_order: 1 },
      ],
      expiry_days: 14,
    });
    console.log('Signature envelope:', envelope.id, envelope.status);

    // Check signature status
    const status = await client.signatures.getStatus(envelope.id);
    console.log('Status:', status.status);

    // Download signed document (when completed)
    if (status.status === 'completed') {
      const signedDoc = await client.signatures.downloadSigned(envelope.id);
      console.log('Signed document downloaded, content-type:', signedDoc.headers.get('content-type'));
    }

    // Revoke a pending signature
    // await client.signatures.revoke(envelope.id);

    // --- Webhooks ---

    // Register a webhook
    const webhook = await client.webhooks.register({
      url: 'https://your-server.com/webhooks/conformvault',
      events: ['file.uploaded', 'file.deleted', 'signature.completed'],
      environment: 'live',
    });
    console.log('Webhook registered:', webhook.id);
    console.log('Secret (save this!):', webhook.secret);

    // List webhooks
    const webhooks = await client.webhooks.list();
    console.log('Webhooks:', webhooks.length);

    // Test a webhook
    await client.webhooks.test(webhook.id);
    console.log('Test event sent');

    // Delete a webhook
    await client.webhooks.delete(webhook.id);

    // --- Audit ---

    // List audit entries
    const auditEntries = await client.audit.list({
      eventType: 'file.uploaded',
      from: '2026-01-01',
      to: '2026-12-31',
      page: 1,
      limit: 50,
    });
    console.log('Audit entries:', auditEntries.length);

    // --- API Keys ---

    // List API keys
    const keys = await client.keys.list();
    console.log('API keys:', keys.length);

    // Create a new API key
    const newKey = await client.keys.create({
      name: 'CI/CD Pipeline',
      environment: 'test',
      scopes: ['files:read', 'files:write'],
    });
    console.log('New key (save this!):', newKey.key);

    // Get key details
    const keyDetail = await client.keys.get(newKey.id);
    console.log('Key:', keyDetail.name, keyDetail.prefix);

    // Rotate a key
    const rotated = await client.keys.rotate(newKey.id);
    console.log('Rotated key:', rotated.key);

    // Revoke a key
    await client.keys.revoke(newKey.id);
    console.log('Key revoked');

  } catch (error) {
    // --- Error Handling ---
    if (error instanceof AuthenticationError) {
      console.error('Authentication failed. Check your API key.');
    } else if (error instanceof RateLimitError) {
      console.error(`Rate limited. Retry after ${error.retryAfter} seconds.`);
    } else if (error instanceof APIError) {
      if (isNotFound(error)) {
        console.error('Resource not found.');
      } else {
        console.error(`API error ${error.statusCode}: ${error.message}`);
      }
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

// --- Webhook Signature Verification ---
// Use this in your webhook handler (e.g. Express, Fastify, etc.)

function handleWebhookRequest(rawBody: string, signatureHeader: string) {
  const secret = 'whsec_your_webhook_secret';

  const isValid = verifyWebhookSignature(rawBody, signatureHeader, secret);
  if (!isValid) {
    console.error('Invalid webhook signature!');
    return;
  }

  const event = JSON.parse(rawBody);
  console.log('Verified webhook event:', event);
}

main().catch(console.error);
