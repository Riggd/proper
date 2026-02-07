# Story 3.4: CLI Output & Exit Codes

**Status:** ready-for-dev

## User Story

**As a** CI/CD Engineer,
**I want** the CLI to output a non-zero exit code if the audit fails,
**So that** I can block broken builds.

## Acceptance Criteria

1. **Given** an audit with "Error" level findings
2. **When** the command finishes
3. **Then** it exits with code `1`
4. **And** prints a red "FAIL" message with the list of errors
5. **And** accepts a `--fail-on-error` flag (default: true) to control this behavior

## Technical Requirements (Developer Guardrails)

### Architecture Compliance
- **Location:** `packages/cli`.
- **UX:** CLI best practices (colors, exit codes).

### Implementation Details
- **Chalk/Colors:** Use a library for formatted output.
- **Exit Codes:** `process.exit(1)` on error.
- **Flags:** Commander or Yargs for argument parsing.

## Tasks

- [ ] Implement result formatter (Pass/Fail, Colors).
- [ ] Implement logic for exit codes based on severity.
- [ ] Add CLI flags (`--fail-on-error`, `--json`).

## References
- [Epic 3: Developer Verification Workflow](_bmad-output/planning-artifacts/epics.md)
