# Story 2.2: Proxy API Setup & Core Integration

**Status:** ready-for-dev

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

- [ ] Initialize `apps/proxy` with Next.js.
- [ ] Implement POST `/api/audit` endpoint.
- [ ] Add `x-propper-key` validation.
- [ ] Integrate `packages/core` validation logic.
- [ ] Test with `curl` or Postman.

## References
- [Epic 2: Designer Audit & Repair Workflow](_bmad-output/planning-artifacts/epics.md)
