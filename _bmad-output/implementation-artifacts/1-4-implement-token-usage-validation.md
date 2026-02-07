# Story 1.4: Implement Token Usage Validation

**Status:** ready-for-dev

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

- [ ] Define the Token Map (hardcoded for now or loaded from config).
- [ ] Implement `validateTokenUsage` function in `packages/core`.
- [ ] Implement "closest match" logic.
- [ ] Write unit tests for hardcoded values.
- [ ] Export the validation function.

## References
- [Epic 1: Design System Rules Foundation](_bmad-output/planning-artifacts/epics.md)
