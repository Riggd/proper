# Story 2.4: Connect Audit Loop (Plugin -> Proxy -> Result)

**Status:** review

## User Story

**As a** Product Designer,
**I want** to see a Pass/Fail scorecard after auditing a component,
**So that** I know what needs to be fixed.

## Acceptance Criteria

1. ✅ **Given** I have selected a component and clicked "Audit"
2. ✅ **When** the Proxy returns the audit results
3. ✅ **Then** the UI updates to show a "Score" (0-100) and a list of issues
4. ✅ **And** findings are visually grouped by Severity (Errors must be fixed, Warnings are optional)
5. ✅ **And** the "Auditing" spinner disappears (<5s total time)

## Dev Agent Record

### Implementation Summary
- **Audit Service:** Implemented `performRemoteAudit(data)` in `apps/plugin/src/ui/App.tsx` using native `fetch`.
- **Authentication:** Requests authenticated with `x-propper-key` header (currently `dev-secret`).
- **Message Flow:** 
  1. UI sends `AUDIT_REQUEST` to Sandbox
  2. Sandbox extracts fresh data via `getSelectionInfo()` and sends `DATA_READY`
  3. UI receives data and calls `POST /api/audit` on Proxy
  4. Proxy transforms data, runs validation, returns scored results
  5. UI displays results with severity-based styling
- **Error Handling:** Network failures and API errors gracefully displayed to user.

### Files Modified
- `apps/plugin/src/ui/App.tsx` - Added `performRemoteAudit` function with fetch API call
- `apps/plugin/src/plugin/main.ts` - Sandbox responds to AUDIT_REQUEST with DATA_READY
- `apps/plugin/src/shared/messages.ts` - Added `DATA_READY` message type

## Tasks

- [x] Implement `auditService` in Plugin UI to call Proxy (as `performRemoteAudit`).
- [x] Build `Scorecard` UI component (integrated in results state).
- [x] Implement loading states.
- [x] Wiring: Selection -> Extract -> API Call -> Display Results.

## References
- [Epic 2: Designer Audit & Repair Workflow](_bmad-output/planning-artifacts/epics.md)

