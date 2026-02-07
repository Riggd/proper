# Story 1.3: Implement Accessibility Validation

**Status:** review

## User Story

**As a** Design System Lead,
**I want** to ensure all interactive components have accessibility labels,
**So that** our products meet WCAG standards by default.

## Acceptance Criteria

1. **Given** a component JSON that lacks an `aria-label` or `accessibilityLabel` property
2. **When** I run the validation logic
3. **Then** it returns an error finding: "Missing accessibility label"
4. **And** it suggests "aria-label" as the missing property key

## Technical Requirements (Developer Guardrails)

### Architecture Compliance
- **Location:** `packages/core/src/rules`
- **Dependency:** `zod`

### Implementation Details
- **Property Check:** Logic to recursively check for accessibility properties in the node and its children if necessary (though usually at top level for components).
- **Target Components:** Primarily for interactive components like Buttons and Inputs.

## Tasks

- [x] Implement `validateAccessibility` function in `packages/core`.
- [x] Define which components require accessibility labels.
- [x] Write unit tests for missing accessibilty props.
- [x] Export the validation function.

## Dev Agent Record

### Implementation Plan
- Created `accessibilityValidation.ts` with `validateAccessibility` function
- Defined `InteractiveComponents` array: Button, Input (Card excluded as non-interactive)
- Extended `ValidationFinding` with `AccessibilityFinding` interface including `suggestedFix` field
- Implemented case-insensitive property matching for aria-label, accessibilityLabel, ariaLabel

### Completion Notes
- ✅ `validateAccessibility` validates Button and Input for accessibility labels
- ✅ Non-interactive components (Card, Unknown) skip validation
- ✅ Returns `suggestedFix: 'aria-label'` per acceptance criteria
- ✅ 7 new unit tests added covering all acceptance criteria
- ✅ All 28 tests pass (21 existing + 7 new)

## File List

**New:**
- `packages/core/src/rules/accessibilityValidation.ts`
- `packages/core/src/rules/accessibilityValidation.test.ts`

**Modified:**
- `packages/core/src/index.ts`

## Change Log

- 2026-02-07: Implemented accessibility validation for interactive components

## References
- [Epic 1: Design System Rules Foundation](_bmad-output/planning-artifacts/epics.md)
