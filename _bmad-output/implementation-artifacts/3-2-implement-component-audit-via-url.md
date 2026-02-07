# Story 3.2: Implement Component Audit via URL

**Status:** ready-for-dev

## User Story

**As a** Developer,
**I want** to provide a Figma Share URL to the CLI to audit a specific component,
**So that** I can clearly reference the design intent.

## Acceptance Criteria

1. **Given** a Figma URL (e.g., `figma.com/design/abc?node-id=123`)
2. **When** I run `propper audit <url>`
3. **Then** the CLI extracts the Node ID
4. **And** calls the `figma_get_node` (or compliant) tool on the MCP server
5. **And** retrieves the read-only JSON data for validation

## Technical Requirements (Developer Guardrails)

### Architecture Compliance
- **Location:** `packages/cli`.
- **Integration:** MCP Server tool calls.

### Implementation Details
- **URL Parsing:** Regex to extract File Key and Node ID.
- **MCP Call:** Execute tool `figma_get_node(node_id)`.
- **Data Handling:** Receive JSON payload.

## Tasks

- [ ] Implement command argument parsing (`propper audit <url>`).
- [ ] Implement URL parser.
- [ ] Call `figma_get_node` via MCP.
- [ ] Log retrieved data for verification.

## References
- [Epic 3: Developer Verification Workflow](_bmad-output/planning-artifacts/epics.md)
