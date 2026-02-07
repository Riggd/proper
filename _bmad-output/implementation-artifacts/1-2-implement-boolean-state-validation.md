# Story 1.2: Implement Boolean State Validation

**Status:** review

## User Story

**As a** Design System Lead,
**I want** the rules engine to flag components that are missing required boolean states (disabled, loading, error),
**So that** designers don't hand off incomplete component sets.

## Acceptance Criteria

1. **Given** a Figma Component Set JSON with missing "Disabled=True" variant
2. **When** I run the `validateComponent` function
3. **Then** it returns an error finding: "Missing required state: disabled"
4. **And** the finding type is marked as "Error" (blocking)

## Technical Requirements (Developer Guardrails)

### Architecture Compliance
- **Location:** `packages/core/src/rules`
- **Dependency:** `zod`
- **Integration:** Must extend the `ComponentSchema` from Story 1.1.

### Implementation Details
- **Variant Validation:** Logic to check if a Component Set contains specific variant properties.
- **Configurable Rules:** The list of required states should be defined in a way that can be updated (e.g., a constant or config file).

## Tasks

- [x] Implement `validateBooleanState` function in `packages/core`.
- [x] Define the list of required states for each component type (e.g., Button needs disabled, loading).
- [x] Write unit tests for missing states.
- [x] Export the validation function for use in the main `validate` loop.

## Dev Agent Record

### Implementation Plan
- Added `FigmaComponentSet`, `FigmaVariant`, and `ValidationFinding` types to `figma.ts`
- Created `booleanStateValidation.ts` with `validateBooleanState` function
- Defined `RequiredStates` config object mapping component types to required boolean states
- Implemented case-insensitive state matching for variant names and properties

### Completion Notes
- ✅ `validateBooleanState` validates Button (disabled, loading), Input (disabled, error), Card (disabled)
- ✅ Unknown component types skip validation gracefully
- ✅ 7 new unit tests added covering all acceptance criteria
- ✅ All 21 tests pass (14 existing + 7 new)

## File List

**New:**
- `packages/core/src/rules/booleanStateValidation.ts`
- `packages/core/src/rules/booleanStateValidation.test.ts`

**Modified:**
- `packages/core/src/types/figma.ts`
- `packages/core/src/index.ts`

## Change Log

- 2026-02-07: Implemented boolean state validation with configurable required states per component type

## References
- [Epic 1: Design System Rules Foundation](_bmad-output/planning-artifacts/epics.md)
