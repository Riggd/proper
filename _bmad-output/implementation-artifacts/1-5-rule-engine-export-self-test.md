# Story 1.5: Rule Engine Export & Self-Test

**Status:** ready-for-dev

## User Story

**As a** Developer,
**I want** to run a self-test script on the core package,
**So that** I can verify the rules engine works in isolation before integrating it into the Plugin.

## Acceptance Criteria

1. **Given** a set of mock "valid" and "invalid" component JSONs
2. **When** I run `pnpm test` in `packages/core`
3. **Then** all validation logic passes (valid components return 0 errors, invalid ones return expected errors)
4. **And** the package exports a `validate(node: JSON): AuditResult` function usable by other workspaces
5. **And** the `AuditFinding` schema includes a `severity` field ('error' | 'warning' | 'info')
6. **And** the exported module includes a `version` field (e.g., hash or semver) for parity checks

## Technical Requirements (Developer Guardrails)

### Architecture Compliance
- **Location:** `packages/core`
- **Tools:** `vitest` or `jest` (standardize on one, likely `vitest` given the Vite presence).

### Implementation Details
- **Main Export:** The `validate` function aggregates all specific validation rules (Schema, State, Accessibility, Tokens).
- **Test Suite:** Comprehensive tests covering all stories in Epic 1.

## Tasks

- [ ] Implement the aggregate `validate(node)` function.
- [ ] Define `AuditResult` and `AuditFinding` interfaces.
- [ ] Create a comprehensive test suite in `packages/core`.
- [ ] Ensure `pnpm test` runs the suite successfully.
- [ ] Verify exports in `package.json`.

## References
- [Epic 1: Design System Rules Foundation](_bmad-output/planning-artifacts/epics.md)
