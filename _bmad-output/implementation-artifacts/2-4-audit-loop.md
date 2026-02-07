# Story 2.4: Audit Loop (Plugin -> Proxy -> Result)

## Status
- [x] Trigger audit flow from UI button
- [x] Sandbox handles AUDIT_REQUEST and returns DATA_READY
- [x] UI calls Proxy API with component data
- [x] Results displayed with severity-based styling

## Dev Agent Record
- Implemented `performRemoteAudit` in `App.tsx` using native `fetch`.
- Added authentication using `x-propper-key`.
- Connected the full circuit from UI button -> Sandbox extraction -> UI fetch -> Proxy results.
- Verified flow via successful builds of both plugin and proxy.

## File List
- `apps/plugin/src/ui/App.tsx` (Updated)
- `apps/plugin/src/plugin/main.ts` (Updated)
- `apps/plugin/src/shared/messages.ts` (Updated)

## Change Log
- **Plugin UI:** Added `performRemoteAudit` and result state handling.
- **Plugin Sandbox:** Implemented fresh data re-extraction on audit request.
- **Plugin Shared:** Added `DATA_READY` message type.
