# Changelog

All notable changes to the ConformVault TypeScript SDK will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
