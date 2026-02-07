# Story 3.1: CLI Scaffold & MCP Client Implementation

**Status:** ready-for-dev

## User Story

**As a** Developer,
**I want** the CLI to act as a client for the `figma-console` MCP server,
**So that** I can leverage the existing Desktop Bridge for local design access.

## Acceptance Criteria

1. **Given** the `figma-console` MCP server is running (or spawned by the CLI)
2. **When** I run `propper audit`
3. **Then** the CLI connects via standard MCP protocol (stdio or SSE)
4. **And** verifies the connection by listing available tools (e.g., `figma_get_selection`)

## Technical Requirements (Developer Guardrails)

### Architecture Compliance
- **Location:** `packages/cli` (if separate) or `apps/cli`. Ideally, this is `packages/cli` or a script in `apps/proxy` if lightweight. *Correction from architecture:* `apps/cli` likely needed or integrated into workflow. Architecture mentions CLI component. Let's assume `apps/cli` or `packages/cli`. Starter template has `apps/proxy` and `apps/plugin`. We might need to add `packages/cli`.

### Implementation Details
- **MCP Client:** Use an MCP SDK or implement basic client logic (JSON-RPC over stdio).
- **Discovery:** Locate the `figma-console` server (usually run via `npx` or local path).

## Tasks

- [ ] Initialize `packages/cli`.
- [ ] Implement MCP Client logic.
- [ ] Connect to `figma-console`.
- [ ] Verify connection with `list_tools`.

## References
- [Epic 3: Developer Verification Workflow](_bmad-output/planning-artifacts/epics.md)
