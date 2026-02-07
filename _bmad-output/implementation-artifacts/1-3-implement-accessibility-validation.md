# Story 1.3: Implement Accessibility Validation

**Status:** ready-for-dev

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

- [ ] Implement `validateAccessibility` function in `packages/core`.
- [ ] Define which components require accessibility labels.
- [ ] Write unit tests for missing accessibilty props.
- [ ] Export the validation function.

## References
- [Epic 1: Design System Rules Foundation](_bmad-output/planning-artifacts/epics.md)
