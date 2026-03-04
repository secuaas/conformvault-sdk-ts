# @conformvault/sdk

Official TypeScript SDK for the [ConformVault](https://conformvault.com) Developer API.

## Features

- Full TypeScript type definitions for all API resources
- Zero runtime dependencies (uses native `fetch`)
- Node.js 18+ (native fetch support required)
- ESM + CommonJS dual output
- Automatic rate-limit retries
- Webhook signature verification (HMAC-SHA256)
- Custom error classes for precise error handling

## Installation

```bash
npm install @conformvault/sdk
```

## Quick Start

```typescript
import { ConformVault } from '@conformvault/sdk';

const client = new ConformVault('cvk_live_your_api_key');

// List files
const files = await client.files.list({ folderId: 'folder-123' });

// Upload a file
const blob = new Blob(['Hello, ConformVault!'], { type: 'text/plain' });
const uploaded = await client.files.upload(blob, 'hello.txt');

// Create a folder
const folder = await client.folders.create({ name: 'Documents' });

// Create a signature envelope
const envelope = await client.signatures.create({
  file_id: 'file-abc',
  subject: 'NDA Agreement',
  signers: [{ email: 'signer@example.com', name: 'John Doe' }],
});
```

## Configuration

```typescript
const client = new ConformVault('cvk_live_xxx', {
  baseURL: 'https://api.conformvault.com/dev/v1', // default
  timeout: 30000,   // 30s request timeout (default)
  maxRetries: 3,    // automatic retry on 429 (default)
});
```

## Services (28)

| Service | Methods |
|---------|---------|
| `client.files` | `list`, `get`, `upload`, `download`, `delete`, `getThumbnail`, `getScanReport` |
| `client.folders` | `list`, `get`, `create`, `delete` |
| `client.shareLinks` | `list`, `create`, `delete` |
| `client.signatures` | `create`, `getStatus`, `downloadSigned`, `revoke` |
| `client.webhooks` | `list`, `register`, `delete`, `test`, `listDeliveries`, `getDelivery`, `replayDelivery`, `reEnable` |
| `client.audit` | `list`, `search`, `export`, `getStats`, `getAnomalies` |
| `client.keys` | `list`, `create`, `get`, `revoke`, `rotate` |
| `client.bulk` | `delete`, `move`, `download` |
| `client.versions` | `list`, `get`, `restore`, `delete` |
| `client.search` | `search` |
| `client.trash` | `list`, `restore`, `delete`, `empty` |
| `client.scanReports` | `getReport`, `list`, `getSummary` |
| `client.attestation` | `generateLoi25` |
| `client.encryption` | `getSalt`, `setSalt` |
| `client.transactions` | `create`, `list`, `get`, `update`, `delete`, `addItem`, `updateItem`, `deleteItem` |
| `client.templates` | `create`, `list`, `get`, `update`, `delete`, `generate`, `listDocuments` |
| `client.batches` | `create`, `list`, `get`, `commit`, `cancel` |
| `client.metadata` | `addTags`, `removeTag`, `getTags`, `listByTag`, `setMetadata`, `getMetadata`, `deleteMetadataKey` |
| `client.retention` | `create`, `list`, `get`, `update`, `delete` |
| `client.legalHolds` | `create`, `list`, `get`, `release`, `addFiles`, `removeFile` |
| `client.permissions` | `set`, `get`, `revoke` |
| `client.comments` | `create`, `list`, `get`, `update`, `delete`, `getReplies` |
| `client.quota` | `get` |
| `client.rateLimit` | `get` |
| `client.uploadSessions` | `create`, `uploadChunk`, `getStatus`, `complete`, `cancel` |
| `client.jobs` | `create`, `list`, `get`, `cancel` |
| `client.activitySubscriptions` | `subscribe`, `list`, `unsubscribe` |
| `client.policies` | `getIPPolicy`, `setIPPolicy`, `getMFAPolicy`, `setMFAPolicy`, `getEncryptionSalt`, `setEncryptionSalt` |

## Error Handling

```typescript
import {
  ConformVault,
  APIError,
  AuthenticationError,
  RateLimitError,
  isNotFound,
  isRateLimited,
} from '@conformvault/sdk';

try {
  const file = await client.files.get('nonexistent');
} catch (error) {
  if (error instanceof AuthenticationError) {
    // 401 — invalid API key
  } else if (error instanceof RateLimitError) {
    // 429 — rate limited (after all retries exhausted)
    console.log(`Retry after ${error.retryAfter} seconds`);
  } else if (isNotFound(error)) {
    // 404 — resource not found
  } else if (error instanceof APIError) {
    // Other HTTP errors (400, 403, 500, etc.)
    console.log(error.statusCode, error.message);
  }
}
```

## Webhook Signature Verification

```typescript
import { verifyWebhookSignature } from '@conformvault/sdk';

// In your webhook handler (Express, Fastify, etc.)
app.post('/webhooks/conformvault', (req, res) => {
  const signature = req.headers['x-webhook-signature'] as string;
  const rawBody = req.body; // must be the raw string/Buffer

  const isValid = verifyWebhookSignature(rawBody, signature, 'whsec_your_secret');
  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  const event = JSON.parse(rawBody);
  // Process the event...

  res.status(200).send('OK');
});
```

The signature header format is `t=<timestamp>,s0=<hmac_hex>`, where the HMAC is computed as:

```
HMAC-SHA256(timestamp + "." + payload, secret)
```

## Authentication

Use API keys prefixed with `cvk_live_` for production or `cvk_test_` for testing:

```typescript
// Production
const client = new ConformVault('cvk_live_your_key');

// Testing
const client = new ConformVault('cvk_test_your_key');
```

## API Base URL

Default: `https://api.conformvault.com/dev/v1`

## Requirements

- Node.js 18+ (native `fetch` required)
- TypeScript 5.x (for development)

## License

MIT

---

Built by [SecuAAS](https://secuaas.com) for the ConformVault platform.
