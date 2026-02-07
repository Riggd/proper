# Story 3.5: Local Pre-Commit Verification Hook

**Status:** ready-for-dev

## User Story

**As a** Lead Developer,
**I want** to prevent committing code if the associated design isn't ready,
**So that** I enforce the design contract locally before code even leaves my machine.

## Acceptance Criteria

1. **Given** a repository with a `husky` pre-commit hook
2. **When** I commit changes
3. **Then** the hook checks if Figma is open and the design passes audit
4. **And** blocks the commit if the design fails
5. **And** executes instantly (<1s) using the local bridge
6. **And** logs a warning and PASSES (allows commit) if Figma Bridge is unreachable, UNLESS `PROPPER_STRICT=true` is set

## Technical Requirements (Developer Guardrails)

### Architecture Compliance
- **Location:** Root `.husky`.
- **Integration:** Calls `propper audit` (CLI).

### Implementation Details
- **Husky:** Setup git hooks.
- **Logic:** Script to determine if it should run (e.g., if Figma URL is present in PR description or commit message? Or just checks current open file in Figma if using Desktop Bridge). The requirement implies checking "associated design". Might need a mapping or convention. For now, assume it tries to audit the specific component if referenced, or maybe just checks connection.
- *Refinement:* Story 3.2 allows auditing via URL. Hook needs to know *what* to audit. Maybe looks for `Figma: <url>` in commit message? Or just general "health check"?
- *Correction:* AC says "checks if Figma is open and the design passes audit". This implies the Desktop Bridge can check the *active* selection.
- **Strategy:** `propper audit --active` (new flag?) or just default behavior connects to bridge and checks selection.

## Tasks

- [ ] Install `husky`.
- [ ] Create `pre-commit` hook.
- [ ] Add logic to call standard CLI audit.
- [ ] Handle "Bridge Unreachable" case gracefully (warn & pass).

## References
- [Epic 3: Developer Verification Workflow](_bmad-output/planning-artifacts/epics.md)
