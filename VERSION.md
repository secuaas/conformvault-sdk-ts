# Historique des Versions - ConformVault TypeScript SDK

## Version Actuelle
**2.1.2** - 2026-03-03

---

## Versions

### 2.1.2 - 2026-03-03
**Commit:** `pending`
**Type:** Patch - Fix CJS compatibility for Electron (ERR_REQUIRE_ESM)

### Corrigé
- Build script now generates `dist/cjs/package.json` with `"type": "commonjs"` to override root `"type": "module"`, fixing `require()` from CJS contexts (Electron main process)

### Tests effectués
- ✅ `npm run build` (ESM + CJS) — success
- ✅ CJS `require('./dist/cjs/index.js')` — success
- ✅ ESM `import` — success
- ✅ Electron desktop app loads without ERR_REQUIRE_ESM

---

### 2.1.1 - 2026-03-03
**Commit:** `1436b3f`
**Type:** Patch - Add CHANGELOG.md

### Ajouté
- `CHANGELOG.md` — Keep a Changelog format, extracted from VERSION.md history

### Tests effectués
- ✅ `npm run build` (ESM + CJS) — success

---

### 2.1.0 - 2026-03-02
**Commit:** `66bbcb9`
**Type:** Minor - Transactions, Templates, Batches services

### Ajouté
- **`transactions.ts`**: `TransactionsService` — create, list, get, update, delete, addItem, updateItem, deleteItem (8 methods)
- **`templates.ts`**: `TemplatesService` — create, list, get, update, delete, generate (binary PDF via `requestRaw`), listDocuments (7 methods)
- **`batches.ts`**: `BatchesService` — create, list, get, commit, cancel (5 methods)
- 20 new type interfaces in `types.ts`: `TransactionFolder`, `TransactionFolderItem`, `TransactionProgress`, `TransactionFolderResponse`, `TransactionListResponse`, `CreateTransactionRequest`, `UpdateTransactionRequest`, `CreateTransactionItemRequest`, `UpdateTransactionItemRequest`, `DocumentTemplate`, `GeneratedDocument`, `TemplateListResponse`, `CreateTemplateRequest`, `UpdateTemplateRequest`, `GenerateDocumentRequest`, `BatchOperation`, `BatchOperationItem`, `BatchOperationResponse`, `BatchListResponse`, `CreateBatchRequest`, `CreateBatchItemDef`
- Services registered in `ConformVault` client as `transactions`, `templates`, `batches`
- All new services and types exported from `index.ts`
- Total services: 14 → 17

### Tests effectués
- ✅ `npm run build` (ESM + CJS) — success

---

### 2.0.0 - 2026-02-28
**Type:** Major - ConformVault SDK v2.0 — All Developer API services

### Résumé
Version majeure alignée avec le backend v2.0.0. SDK complet avec 14 services
couvrant l'ensemble du Developer API ConformVault.

### Services (14)
- `files`, `folders`, `shareLinks`, `signatures`, `webhooks`, `audit`, `keys` (v0.1.0)
- `bulk`, `versions`, `search`, `trash` (v0.2.0)
- `scanReports`, `attestation` (v0.3.0)
- `encryption` (v0.4.0 → v2.0.0)

### Tests effectués
- ✅ `npx tsc --noEmit` — success
- ✅ `npm run build` (ESM + CJS) — success

### 0.4.0 - 2026-02-28
**Type:** Minor - EncryptionService for cross-platform salt sync

### Ajouté
- **`encryption.ts`**: `EncryptionService` — `getSalt()` (returns null on 404), `setSalt(saltBase64)`
- `EncryptionSaltResponse` type interface
- Service registered in `ConformVault` client as `encryption`
- Exported from `index.ts`

### Tests effectués
- ✅ `npx tsc --noEmit` — success
- ✅ `npm run build` (ESM + CJS) — success

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
