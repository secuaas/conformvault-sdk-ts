# Changelog

All notable changes to the ConformVault TypeScript SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.2] - 2026-03-04

### Added
- 77 unit tests using vitest — 13 new tests for bandwidth, dataExport, comments, jobs, keys instant revocation, all services check + VERSION fix
- Test infrastructure with mock fetch and coverage for all 30 services

## [2.2.1] - 2026-03-04

### Fixed
- **Policies**: paths corrected from `/policies/ip` to `/ip-policy`, `/policies/mfa` to `/mfa-policy`; removed duplicate encryption salt methods from `policies.ts` (already in `encryption.ts`)
- **Activity Subscriptions**: path corrected from `/activity/subscriptions` to `/activity-subscriptions`
- **Comments**: rewritten from nested `/files/{id}/comments` to flat `/comments` routes; update method changed from PATCH to PUT
- **Jobs Cancel**: changed from `POST /jobs/{id}/cancel` to `DELETE /jobs/{id}`
- **Batches Cancel**: changed from `POST /batches/{id}/cancel` to `DELETE /batches/{id}`
- **Retention Update**: changed from PATCH to PUT

### Added
- `BandwidthService` — getSummary, getDaily (2 methods)
- `DataExportService` — export for GDPR/Loi 25 (1 method)
- `KeysService`: instantRevoke, getRevocationStatus (2 new methods via `/api-keys/` path)
- `BatchesService`: uploadFile (1 new method)
- New types: `BandwidthSummary`, `DailyBandwidthStats`, `KeyRevocationStatus`, `UserDataExport`
- `file_id` field added to `CreateCommentRequest`
- Total services: 28 → 30

## [2.2.0] - 2026-03-04

### Added
- **Webhooks**: `listDeliveries`, `getDelivery`, `replayDelivery`, `reEnable`
- **Audit**: `search`, `export`, `getStats`, `getAnomalies`
- **Files**: `getThumbnail`, `getScanReport`
- New service: **MetadataService** — addTags, removeTag, getTags, listByTag, setMetadata, getMetadata, deleteMetadataKey
- New service: **RetentionService** — create, list, get, update, delete
- New service: **LegalHoldsService** — create, list, get, release, addFiles, removeFile
- New service: **PermissionsService** — set, get, revoke
- New service: **CommentsService** — create, list, get, update, delete, getReplies
- New service: **QuotaService** — get
- New service: **RateLimitService** — get
- New service: **UploadSessionsService** — create, uploadChunk, getStatus, complete, cancel
- New service: **JobsService** — create, list, get, cancel
- New service: **ActivitySubscriptionsService** — subscribe, list, unsubscribe
- New service: **PoliciesService** — getIPPolicy, setIPPolicy, getMFAPolicy, setMFAPolicy, getEncryptionSalt, setEncryptionSalt
- 30+ new TypeScript interfaces
- Total services: 17 → 28

### Fixed
- `uploadChunk` now uses `requestRaw` to avoid corrupting binary data through `JSON.stringify`
- `requestRaw` correctly passes through binary bodies (Blob, ArrayBuffer, Buffer, Uint8Array) with `application/octet-stream` content type

## [2.1.2] - 2026-03-03

### Fixed
- CJS compatibility: build now generates `dist/cjs/package.json` with `"type": "commonjs"`, fixing `ERR_REQUIRE_ESM` when using `require()` from Electron or other CJS contexts

## [2.1.0] - 2026-03-02

### Added
- `TransactionsService` — create, list, get, update, delete, addItem, updateItem, deleteItem (8 methods)
- `TemplatesService` — create, list, get, update, delete, generate (binary PDF via `requestRaw`), listDocuments (7 methods)
- `BatchesService` — create, list, get, commit, cancel (5 methods)
- 20 new type interfaces for transactions, templates, and batches
- Total services: 14 → 17

## [2.0.0] - 2026-02-28

### Changed
- Major version aligned with ConformVault backend v2.0.0
- Complete SDK with 14 services covering the full Developer API

### Added
- `EncryptionService` — getSalt, setSalt (cross-platform salt sync)

## [0.3.0] - 2026-02-27

### Added
- `ScanReportsService` — getReport, list (paginated), getSummary
- `AttestationService` — generateLoi25 (PDF stream)
- New types: `FileScanReport`, `FileScanSummary`, `ScanReportListOptions`, `ScanReportListResponse`

## [0.2.0] - 2026-02-27

### Added
- `BulkService` — delete, move, download (ZIP stream)
- `VersionsService` — list, get, restore, delete
- `SearchService` — unified search across files and folders
- `TrashService` — list, restore, delete, empty
- 15 new type interfaces
- `requestRaw()` extended to accept optional body

## [0.1.0] - 2026-02-26

### Added
- Initial release with 7 services: files, folders, sharelinks, signatures, webhooks, audit, keys
- ESM and CJS dual builds
- Full Developer API coverage for core ConformVault operations
