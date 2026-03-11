# MediRecord

## Current State
- QR codes on patient records encode a URL with `?pdf=<recordId>`
- Scanning the QR triggers a PDF download (no login needed, but downloads instead of viewing)
- The `App.tsx` listens for `?pdf=` param and calls `generateAndDownloadPdf`
- `PatientRecordView` labels the QR as "Scan to download record as PDF"

## Requested Changes (Diff)

### Add
- A new public record view page (no login required) that shows the full patient record when accessed via QR scan
- `AppView` type entry for `{ page: "public-record"; recordId: bigint }`

### Modify
- QR code URL: change param from `?pdf=<recordId>` to `?record=<recordId>`
- `App.tsx`: replace the `?pdf=` handler with a `?record=` handler that sets view to `public-record` (no PDF download, no login)
- `PatientRecordView` QR label: change "Scan to download record as PDF" to "Scan to view patient record"
- The public record view reuses `PatientRecordView` with `isHospitalView={false}`, no `onBack` navigation needed (or back goes to landing)

### Remove
- The PDF auto-download on QR scan behavior

## Implementation Plan
1. Update `QRCodeSection` in `PatientRecordView.tsx`: change URL param from `pdf` to `record`, update label text
2. Update `App.tsx`:
   - Add `public-record` to `AppView` union type
   - Replace `?pdf=` effect with `?record=` effect that sets `view` to `{ page: "public-record", recordId }`
   - Add render branch for `public-record` page that shows `PatientRecordView` with `isHospitalView={false}`
3. Remove the `generateAndDownloadPdf` import from `App.tsx` (no longer used on QR scan)

## UX Notes
- Scanning a QR code opens the app and immediately shows the full patient record -- no login prompt
- The public record view is read-only (same as patient view but accessible without credentials)
- Back button on public record view returns to the landing page
