# Story 1.2: Implement Boolean State Validation

**Status:** ready-for-dev

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

- [ ] Implement `validateBooleanState` function in `packages/core`.
- [ ] Define the list of required states for each component type (e.g., Button needs disabled, loading).
- [ ] Write unit tests for missing states.
- [ ] Export the validation function for use in the main `validate` loop.

## References
- [Epic 1: Design System Rules Foundation](_bmad-output/planning-artifacts/epics.md)
