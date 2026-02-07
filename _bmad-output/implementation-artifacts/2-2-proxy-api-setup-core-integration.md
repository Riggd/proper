# Story 2.2: Proxy API Setup & Core Integration

**Status:** review

## User Story

**As a** Developer,
**I want** a Vercel Proxy endpoint that validates components using the core rules engine,
**So that** the logic is centralized and secure.

## Acceptance Criteria

1. **Given** a POST request to `/api/audit` with component JSON
2. **When** the request includes a valid `x-propper-key` (matches `process.env.PROPPER_SHARED_SECRET`)
3. **Then** the proxy runs `validateComponent()` from `packages/core`
4. **And** returns a JSON response with score and findings

## Technical Requirements (Developer Guardrails)

### Architecture Compliance
- **Location:** `apps/proxy` (Next.js).
- **Security:** Environment variables for secrets.
- **Integration:** Import `validate` from `packages/core`.

### Implementation Details
- **Framework:** Next.js API Routes (App Router preferred).
- **Authentication:** Middleware or check in handler for `x-propper-key`.
- **Validation:** Use `zod` schema to validate incoming request body before processing.

## Tasks

- [x] Initialize `apps/proxy` with Next.js.
- [x] Implement POST `/api/audit` endpoint.
- [x] Add `x-propper-key` validation.
- [x] Integrate `packages/core` validation logic.
- [x] Test with `curl` or Postman.

## Dev Agent Record

### Implementation
- Created `transform.ts` to convert Figma node JSON to `FigmaComponentSet`
- Created App Router API route at `/api/audit`
- Integrated `validate()` and `VERSION` from `@proper/core`

### Completion Notes
- ✅ GET /api/audit returns health + version
- ✅ POST /api/audit validates components
- ✅ Auth rejects requests without valid key (tested)

## File List

**New:**
- `apps/proxy/src/lib/transform.ts`
- `apps/proxy/src/app/api/audit/route.ts`

## Change Log

- 2026-02-07: Implemented proxy API with core integration

## References
- [Epic 2](_bmad-output/planning-artifacts/epics.md)
