# Story 3.3: Integrate Core Rules Engine (Parity)

**Status:** ready-for-dev

## User Story

**As a** Developer,
**I want** the CLI to use the EXACT same validation logic as the Designer Plugin,
**So that** "Pass" means the same thing for everyone.

## Acceptance Criteria

1. **Given** the CLI has fetched a component's JSON
2. **When** it runs the audit
3. **Then** it imports `validateComponent` from `packages/core` (not duplicated logic)
4. **And** produces the same array of "Findings" as the Plugin would
5. **And** logs a warning if the CLI's rules version differs from the component's (if metadata available)

## Technical Requirements (Developer Guardrails)

### Architecture Compliance
- **Location:** `packages/cli`.
- **Dependency:** `packages/core`.

### Implementation Details
- **Import:** Direct import of `validate` function.
- **Execution:** Pass the JSON from MCP to the validator.
- **Output:** Structure results for display.

## Tasks

- [ ] Import `validateComponent` from `@propper/core`.
- [ ] Feed MCP data into validator.
- [ ] Handle validation results.

## References
- [Epic 3: Developer Verification Workflow](_bmad-output/planning-artifacts/epics.md)
