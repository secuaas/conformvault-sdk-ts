# Historique des Versions - ConformVault TypeScript SDK

## Version Actuelle
**0.3.0** - 2026-02-27

---

## Versions

### 0.3.0 - 2026-02-27
**Type:** Minor - ScanReports and Attestation services

### Ajouté
- **`scan_reports.ts`**: `ScanReportsService` — getReport, list (paginated), getSummary
- **`attestation.ts`**: `AttestationService` — generateLoi25 (PDF stream)
- 4 new type interfaces: `FileScanReport`, `FileScanSummary`, `ScanReportListOptions`, `ScanReportListResponse`
- Services registered in `ConformVault` client as `scanReports` and `attestation`
- All new services and types exported from `index.ts`
- VERSION bumped to `0.3.0`

### Tests effectués
- ✅ `npm run build` (ESM + CJS) — success

### 0.2.0 - 2026-02-27
**Type:** Minor - V2-4 SDK expansion: bulk, versions, search, trash services

### Ajouté
- **`bulk.ts`**: `BulkService` — delete, move, download (ZIP stream)
- **`versions.ts`**: `VersionsService` — list, get, restore, delete
- **`search.ts`**: `SearchService` — unified search across files and folders
- **`trash.ts`**: `TrashService` — list, restore, delete, empty
- 15 new type interfaces (BulkDeleteRequest, BulkMoveRequest, BulkDownloadRequest, BulkError, BulkResult, FileVersion, SearchOptions, SearchResult, SearchPagination, SearchResponse, TrashListOptions, TrashListResponse, EmptyTrashResponse)
- `requestRaw()` extended to accept optional body (needed for bulk download POST)
- Services registered in `ConformVault` client, exported from `index.ts`

### Tests effectués
- ✅ `npm run build` (ESM + CJS) — success

### 0.1.0 - 2026-02-26
**Type:** Initial release — 7 services (files, folders, sharelinks, signatures, webhooks, audit, keys)
