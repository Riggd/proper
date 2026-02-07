# Story 1.4: Implement Token Usage Validation

**Status:** review

## User Story

**As a** Design System Lead,
**I want** to detect hardcoded values that don't match our design tokens,
**So that** the codebase remains maintainable and themeable.

## Acceptance Criteria

1. **Given** a component with a hardcoded `border-radius: 7px` (where token is 8px)
2. **When** I run the validation logic
3. **Then** it returns a warning finding: "Hardcoded value detected: 7px"
4. **And** it suggests the closest token match if available (e.g., `radius.md = 8px`)

## Technical Requirements (Developer Guardrails)

### Architecture Compliance
- **Location:** `packages/core/src/rules`
- **Dependency:** `zod`

### Implementation Details
- **Token Map:** Need a representation of the design tokens (values mapped to names).
- **Value Matching:** Logic to compare extraction values against the token map.
- **Fuzzy Matching/Suggestions:** Logic to find the closest token value.

## Tasks

- [x] Define the Token Map (hardcoded for now or loaded from config).
- [x] Implement `validateTokenUsage` function in `packages/core`.
- [x] Implement "closest match" logic.
- [x] Write unit tests for hardcoded values.
- [x] Export the validation function.

## Dev Agent Record

### Implementation Plan
- Created `TokenMap` with `radius` and `spacing` categories
- Implemented `validateTokenUsage` to check for hardcoded values in CSS properties
- Implemented `findClosestToken` with fuzzy matching (max 4px distance)
- Created `TokenFinding` type extending `ValidationFinding` with `suggestedToken` and `suggestedValue`

### Completion Notes
- ✅ `TokenMap` defines radius (none, sm, md, lg, xl, full) and spacing (none, xs, sm, md, lg, xl, 2xl)
- ✅ Validates border-radius, borderRadius, padding, margin, gap properties
- ✅ Returns Warning type findings with closest token suggestions
- ✅ 8 new unit tests covering all acceptance criteria
- ✅ All 36 tests pass (28 existing + 8 new)

## File List

**New:**
- `packages/core/src/rules/tokenUsageValidation.ts`
- `packages/core/src/rules/tokenUsageValidation.test.ts`

**Modified:**
- `packages/core/src/index.ts`

## Change Log

- 2026-02-07: Implemented token usage validation with fuzzy matching for closest token suggestions

## References
- [Epic 1: Design System Rules Foundation](_bmad-output/planning-artifacts/epics.md)
