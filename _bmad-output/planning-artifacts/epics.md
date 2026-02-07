---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments: ['_bmad-output/planning-artifacts/prd.md', '_bmad-output/planning-artifacts/architecture.md']
---

# Propper - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Propper, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

- **FR-P01:** The Plugin MUST allow the designer to select a specific Figma component layer for auditing.
- **FR-P02:** The Plugin MUST visually indicate an "Auditing" state (e.g., spinner/loader) while communicating with the Proxy.
- **FR-P03:** The Plugin MUST display a scorecard interface showing Pass/Fail status for Props, Tokens, and Accessibility checks.
- **FR-P04:** The Plugin MUST provide an "Auto-Scaffold" button for any component missing required property layers.
- **FR-P05:** The Plugin MUST generate the specific "Code Only Props" hidden frame structure (as defined by Nathan Curtis methodology) when "Auto-Scaffold" is clicked.
- **FR-P06:** The Plugin MUST gracefully handle empty states (no selection) by prompting the user to select a component.
- **FR-RE01:** The Rules Engine MUST validate component JSON against a strict schema for `Button`, `Input`, and `Card` components.
- **FR-RE02:** The Rules Engine MUST detect the absence of required boolean states (`disabled`, `loading`, `error`).
- **FR-RE03:** The Rules Engine MUST detect the absence of accessibility properties (`accessibilityLabel`, `aria-label`).
- **FR-RE04:** The Rules Engine MUST flag "Hardcoded Values" that do not map to known Design System tokens (e.g., `8px` vs `radius.md`).
- **FR-RE05:** The Rules Engine MUST support requirement levels (Error, Warning, Info) to distinguish between blocking and non-blocking issues.
- **FR-API01:** The Proxy MUST expose a secure endpoint to accept Figma layer JSON payloads.
- **FR-API02:** The Proxy MUST serve the latest `rules.json` configuration file to authenticated clients.
- **FR-API03:** The Proxy MUST sanitize input data to ensure no PII (Private Identifiable Information) or irrelevant hidden layer data is processed by the LLM.
- **FR-API04:** The Proxy MUST return a structured JSON response containing the Audit Score, Findings List, and Auto-Fix Data.
- **FR-CLI01:** The CLI MUST be callable via terminal command `propper audit <figma-url>`.
- **FR-CLI02:** The CLI MUST authenticate with Figma using a personal access token (configured via env var).
- **FR-CLI03:** The CLI MUST fetch the live component data from Figma's REST API.
- **FR-CLI04:** The CLI MUST execute the same audit logic (via the Proxy or shared library) as the Plugin to ensure parity.
- **FR-CLI05:** The CLI MUST output the audit results in human-readable text format (PASS/FAIL) to the console.

### NonFunctional Requirements

- **NFR-01 (Magic Feel):** "Auto-Scaffold" operations MUST complete in **< 1000ms** to ensure the plugin feels responsive and "magic" to the designer.
- **NFR-02 (Audit Speed):** A full component audit (Plugin -> Proxy -> LLM -> Plugin) MUST complete in **< 5 seconds** (p95) to maintain the user's flow.
- **NFR-03 (Data Ephemerality):** The Proxy MUST NOT persist any Figma layer data to disk or database. All processing is transient and stateless.
- **NFR-04 (Keyless Entry):** The Plugin MUST NOT require user account creation. It should function immediately upon installation.
- **NFR-05 (Secret Management):** LLM Provider keys MUST be injected via server-side Environment Variables and NEVER exposed in the client-side bundle.
- **NFR-06 (Demo Stability):** The Proxy MUST handle up to 50 concurrent requests without crashing or timing out (to ensuring stability during live demos and judging).

### Additional Requirements

- **Structure:** Use Custom Turborepo with `pnpm` workspaces (`apps/plugin`, `apps/proxy`, `packages/core`).
- **Shared Truth:** `rules.json` and validation logic MUST be located in `packages/core` to ensure CLI/Plugin parity.
- **Security:** Implement `x-propper-key` shared secret header authentication.
- **Infrastructure:** Deploy to Vercel Serverless (Node.js 18+).
- **Optimistic UI:** Implement optimistic updates in the Plugin UI for responsiveness.
- **Telemetry:** Implement anonymous telemetry in both proxy and plugin.

### FR Coverage Map

- FR-RE*: Epic 1 (Rules Foundation)
- FR-P*: Epic 2 (Designer Audit)
- FR-API*: Epic 2 (Designer Audit)
- FR-CLI*: Epic 3 (Developer Verification)
- NFR-01: Epic 2 (Designer Audit - implemented in Plugin)
- NFR-02: Epic 2 (Designer Audit - implemented in Proxy/Plugin)
- NFR-06: Epic 2 (Designer Audit - implemented in Proxy)

## Epic List

### Epic 1: Design System Rules Foundation
**Goal:** Establish the centralized "Source of Truth" for component validation that powers all downstream tools.
**User Value:** As a Design System Lead, I can define strict validation rules for components (Button, Input, Card) once, ensuring consistency across both Design and Code.
**FRs Covered:** FR-RE01, FR-RE02, FR-RE03, FR-RE04, FR-RE05

### Story 1.1: Initialize Core Package & Component Schemas

As a Design System Developer,
I want a centralized `packages/core` workspace with Zod schemas for Button, Input, and Card,
So that I can enforce a consistent data structure across both the Plugin and CLI.

**Acceptance Criteria:**

**Given** a clean Monorepo environment
**When** I create `packages/core` and install `zod`
**Then** I can import a `ComponentSchema` that defines the shape of a Figma Node (id, name, type, children)
**And** the schema uses a `ComponentRegistry` pattern (e.g., Union or Map) to allow easy addition of new components without rewrites
**And** I can import specific schemas for `Button`, `Input`, and `Card` that validate their identifying properties (e.g., name starts with "Button")

### Story 1.2: Implement Boolean State Validation

As a Design System Lead,
I want the rules engine to flag components that are missing required boolean states (disabled, loading, error),
So that designers don't hand off incomplete component sets.

**Acceptance Criteria:**

**Given** a Figma Component Set JSON with missing "Disabled=True" variant
**When** I run the `validateComponent` function
**Then** it returns an error finding: "Missing required state: disabled"
**And** the finding type is marked as "Error" (blocking)

### Story 1.3: Implement Accessibility Validation

As a Design System Lead,
I want to ensure all interactive components have accessibility labels,
So that our products meet WCAG standards by default.

**Acceptance Criteria:**

**Given** a component JSON that lacks an `aria-label` or `accessibilityLabel` property
**When** I run the validation logic
**Then** it returns an error finding: "Missing accessibility label"
**And** it suggests "aria-label" as the missing property key

### Story 1.4: Implement Token Usage Validation

As a Design System Lead,
I want to detect hardcoded values that don't match our design tokens,
So that the codebase remains maintainable and themeable.

**Acceptance Criteria:**

**Given** a component with a hardcoded `border-radius: 7px` (where token is 8px)
**When** I run the validation logic
**Then** it returns a warning finding: "Hardcoded value detected: 7px"
**And** it suggests the closest token match if available (e.g., `radius.md = 8px`)

### Story 1.5: Rule Engine Export & Self-Test

As a Developer,
I want to run a self-test script on the core package,
So that I can verify the rules engine works in isolation before integrating it into the Plugin.

**Acceptance Criteria:**

**Given** a set of mock "valid" and "invalid" component JSONs
**When** I run `pnpm test` in `packages/core`
**Then** all validation logic passes (valid components return 0 errors, invalid ones return expected errors)
**And** the package exports a `validate(node: JSON): AuditResult` function usable by other workspaces
**And** the `AuditFinding` schema includes a `severity` field ('error' | 'warning' | 'info')
**And** the exported module includes a `version` field (e.g., hash or semver) for parity checks

### Epic 2: Designer Audit & Repair Workflow
**Goal:** Empower designers to deliver "Code-Ready" assets by auditing and auto-fixing components within Figma.
**User Value:** As a Product Designer, I can instantly validate my components against the system rules and use "Auto-Scaffold" to fix missing properties without needing to know the technical details.
**FRs Covered:** FR-P01, FR-P02, FR-P03, FR-P04, FR-P05, FR-P06, FR-API01, FR-API02, FR-API03, FR-API04

### Story 2.1: Plugin UI Scaffold & Communication

As a Product Designer,
I want to open the Propper plugin in Figma and see a clean interface,
So that I can start the auditing process.

**Acceptance Criteria:**

**Given** I have the Propper plugin installed
**When** I run the plugin
**Then** the UI opens with an "Idle" state prompting me to select a component
**And** the UI establishes a message stream with the plugin sandbox (main thread)

### Story 2.2: Proxy API Setup & Core Integration

As a Developer,
I want a Vercel Proxy endpoint that validates components using the core rules engine,
So that the logic is centralized and secure.

**Acceptance Criteria:**

**Given** a POST request to `/api/audit` with component JSON
**When** the request includes a valid `x-propper-key` (matches `process.env.PROPPER_SHARED_SECRET`)
**Then** the proxy runs `validateComponent()` from `packages/core`
**And** returns a JSON response with score and findings

### Story 2.3: Implement Component Selection & Extraction

As a Product Designer,
I want the plugin to recognize when I select a Button, Input, or Card,
So that it knows which validation rules to apply.

**Acceptance Criteria:**

**Given** I select a Component Set in Figma
**When** I click "Audit" in the plugin
**Then** the plugin extracts the full layer tree as JSON
**And** identifies the component type (e.g., "Button") based on the name
**And** if I select a non-component frame or an ambiguous selection, it shows an "Unknown Component" state instead of crashing

### Story 2.4: Connect Audit Loop (Plugin -> Proxy -> Result)

As a Product Designer,
I want to see a Pass/Fail scorecard after auditing a component,
So that I know what needs to be fixed.

**Acceptance Criteria:**

**Given** I have selected a component and clicked "Audit"
**When** the Proxy returns the audit results
**Then** the UI updates to show a "Score" (0-100) and a list of issues
**And** findings are visually grouped by Severity (Errors must be fixed, Warnings are optional)
**And** the "Auditing" spinner disappears (<5s total time)

### Story 2.5: Implement "Auto-Scaffold" Layer Generation

As a Product Designer,
I want to click "Auto-Fix" to automatically generate missing property layers,
So that I don't have to manually create weird hidden frames like "Code Only Props".

**Acceptance Criteria:**

**Given** an audit result with a missing "accessibilityLabel" prop
**When** I click the "Auto-Scaffold" button
**Then** the plugin creates a new variant property or hidden layer structure in Figma
**And** specifically creates a Frame named `"Code only props"` containing text layers for each prop (Nathan Curtis pattern)
**And** the component structure matches the "Code Only Props" spec

### Story 2.6: Optimistic UI & Polish

As a Product Designer,
I want the plugin to feel instant and magical,
So that it doesn't interrupt my design flow.

**Acceptance Criteria:**

**Given** I click "Auto-Scaffold"
**When** the operation starts
**Then** the UI immediately shows a "Fixed" state (optimistic update)
**And** the actual Figma layer change completes in the background (<1000ms perceived)
**And** if the backend operation fails, the UI reverts to the "Audit Failed" state and shows an error toast

### Epic 3: Developer Verification Workflow
**Goal:** Enable zero-friction handoff by allowing developers to verify design readiness in their native environment.
**User Value:** As a Developer, I can run a single CLI command to verify that a Figma component implements the required API contract before I start coding.
**FRs Covered:** FR-CLI01, FR-CLI02, FR-CLI03, FR-CLI04, FR-CLI05

### Story 3.1: CLI Scaffold & MCP Client Implementation

As a Developer,
I want the CLI to act as a client for the `figma-console` MCP server,
So that I can leverage the existing Desktop Bridge for local design access.

**Acceptance Criteria:**

**Given** the `figma-console` MCP server is running (or spawned by the CLI)
**When** I run `propper audit`
**Then** the CLI connects via standard MCP protocol (stdio or SSE)
**And** verifies the connection by listing available tools (e.g., `figma_get_selection`)

### Story 3.2: Implement Component Audit via URL

As a Developer,
I want to provide a Figma Share URL to the CLI to audit a specific component,
So that I can clearly reference the design intent.

**Acceptance Criteria:**

**Given** a Figma URL (e.g., `figma.com/design/abc?node-id=123`)
**When** I run `propper audit <url>`
**Then** the CLI extracts the Node ID
**And** calls the `figma_get_node` (or compliant) tool on the MCP server
**And** retrieves the read-only JSON data for validation

### Story 3.3: Integrate Core Rules Engine (Parity)

As a Developer,
I want the CLI to use the EXACT same validation logic as the Designer Plugin,
So that "Pass" means the same thing for everyone.

**Acceptance Criteria:**

**Given** the CLI has fetched a component's JSON
**When** it runs the audit
**Then** it imports `validateComponent` from `packages/core` (not duplicated logic)
**And** produces the same array of "Findings" as the Plugin would
**And** logs a warning if the CLI's rules version differs from the component's (if metadata available)

### Story 3.4: CLI Output & Exit Codes

As a CI/CD Engineer,
I want the CLI to output a non-zero exit code if the audit fails,
So that I can block broken builds.

**Acceptance Criteria:**

**Given** an audit with "Error" level findings
**When** the command finishes
**Then** it exits with code `1`
**And** prints a red "FAIL" message with the list of errors
**And** accepts a `--fail-on-error` flag (default: true) to control this behavior

**Given** an audit with only "Warning" or "Info" findings (or no findings)
**When** the command finishes
**Then** it exits with code `0`
**And** prints a green "PASS" message

### Story 3.5: Local Pre-Commit Verification Hook

As a Lead Developer,
I want to prevent committing code if the associated design isn't ready,
So that I enforce the design contract locally before code even leaves my machine.

**Acceptance Criteria:**

**Given** a repository with a `husky` pre-commit hook
**When** I commit changes
**Then** the hook checks if Figma is open and the design passes audit
**And** blocks the commit if the design fails
**And** executes instantly (<1s) using the local bridge
**And** logs a warning and PASSES (allows commit) if Figma Bridge is unreachable, UNLESS `PROPPER_STRICT=true` is set
