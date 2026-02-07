# Story 1.5: Rule Engine Export & Self-Test

**Status:** review

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

- [x] Implement the aggregate `validate(node)` function.
- [x] Define `AuditResult` and `AuditFinding` interfaces.
- [x] Create a comprehensive test suite in `packages/core`.
- [x] Ensure `pnpm test` runs the suite successfully.
- [x] Verify exports in `package.json`.

## Dev Agent Record

### Implementation Plan
- Created `validate.ts` with aggregate `validate` function calling all rule validators
- Defined `AuditResult` with componentId, componentName, passed, findings, validatedAt, version
- Defined `AuditFinding` with severity ('error' | 'warning' | 'info'), message, nodeId, rule, suggestedFix, suggestedToken
- Added `VERSION` constant ('1.0.0') for parity checks

### Completion Notes
- ✅ `validate` aggregates booleanState, accessibility, and tokenUsage validators
- ✅ `AuditFinding` includes severity field as required
- ✅ `VERSION` exported for parity checks
- ✅ 5 new tests: valid component (0 errors), invalid component (expected errors), hardcoded warning, severity field validation, VERSION export
- ✅ All 41 tests pass (36 existing + 5 new)

## File List

**New:**
- `packages/core/src/rules/validate.ts`
- `packages/core/src/rules/validate.test.ts`

**Modified:**
- `packages/core/src/index.ts`

## Change Log

- 2026-02-07: Implemented aggregate validate function with AuditResult and VERSION exports

## References
- [Epic 1: Design System Rules Foundation](_bmad-output/planning-artifacts/epics.md)
