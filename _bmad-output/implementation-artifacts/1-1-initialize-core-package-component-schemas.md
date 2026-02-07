# Story 1.1: Initialize Core Package & Component Schemas

**Status:** ready-for-dev

## User Story

**As a** Design System Developer,
**I want** a centralized `packages/core` workspace with Zod schemas for Button, Input, and Card,
**So that** I can enforce a consistent data structure across both the Plugin and CLI.

## Acceptance Criteria

1. **Given** a clean Monorepo environment
2. **When** I create `packages/core` and install `zod`
3. **Then** I can import a `ComponentSchema` that defines the shape of a Figma Node (id, name, type, children)
4. **And** the schema uses a `ComponentRegistry` pattern (e.g., Union or Map) to allow easy addition of new components without rewrites
5. **And** I can import specific schemas for `Button`, `Input`, and `Card` that validate their identifying properties (e.g., name starts with "Button")

## Technical Requirements (Developer Guardrails)

### Architecture Compliance
- **Location:** `packages/core` (Shared Truth).
- **Dependencies:** `zod` (Validation), `typescript` (Types).
- **Exports:** Must export schemas and types for consumption by `apps/plugin` and `apps/proxy`.
- **No Side Effects:** This package must be pure logic/data. No Node.js APIs (fs, net) or DOM access.

### File Structure Requirements
```text
packages/core/
├── package.json
├── tsconfig.json          # Extends root config
├── src/
│   ├── index.ts           # Public API barrier
│   ├── types/
│   │   └── figma.ts       # Shared TS interfaces (Node, Layer)
│   └── rules/
│       ├── registry.ts    # ComponentRegistry
│       ├── schemas.ts     # Zod Schemas
│       └── schemas.test.ts # Co-located tests
```

### Naming Conventions
- **Zod Schemas:** `PascalCase` (e.g., `ButtonSchema`, `ComponentSchema`).
- **Files:** `kebab-case` (e.g., `registry.ts`).

### Implementation Details
- **ComponentRegistry:** Should be extensible. Consider a discriminated union of schemas or a map of schema validators.
- **Figma Node Shape:** Align with Figma Plugin API `SceneNode` but simplified for our needs (id, name, type, children).
- **Identification:** `Button` components identified by name starting with "Button" (or specific variant properties if available in the schema).

## Tasks

- [ ] Initialize `packages/core` workspace.
- [ ] Install `zod` dependency.
- [ ] Configure `package.json` and `tsconfig.json`.
- [ ] Define `ComponentSchema` (base node props) in `src/rules/schemas.ts`.
- [ ] Implement `ButtonSchema`, `InputSchema`, `CardSchema`.
- [ ] Create `ComponentRegistry` in `src/rules/registry.ts`.
- [ ] Export everything via `src/index.ts`.
- [ ] Write unit tests to verify valid/invalid node structures.

## References
- [Epic 1: Design System Rules Foundation](_bmad-output/planning-artifacts/epics.md)
- [Architecture: Shared Truth](_bmad-output/planning-artifacts/architecture.md#shared-truth)
