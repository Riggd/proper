# Story 2.7: Implement Anonymous Telemetry

**Status:** ready-for-dev

## User Story

**As a** Maintainer,
**I can** see how many audits are running and catch crash rates early.

## Acceptance Criteria

1. **Given** an audit is performed (via Plugin or CLI)
2. **When** the operation completes
3. **Then** an anonymous event is sent to the telemetry service (e.g., PostHog/Vercel Analytics)
4. **And** the payload includes ONLY: Event Type (Audit/Fix), Success/Fail Status, and Error Code
5. **And** NO PII (File Names, Layer Names, User IDs) is transmitted

## Technical Requirements (Developer Guardrails)

### Architecture Compliance
- **Location:** `apps/proxy/lib/telemetry`, `apps/plugin/src/shared/analytics`.
- **Service:** PostHog or Vercel Analytics (free tiers).

### Implementation Details
- **Client-Side:** Track UI events (clicks, flows).
- **Server-Side:** Track API validation results (success/fail rates) without sensitive data.
- **Privacy:** Strict no-PII policy.

## Tasks

- [ ] Set up Telemetry provider project.
- [ ] Implement wrapper service in Proxy and Plugin.
- [ ] Instrument key events (Audit Start, Audit Complete, Auto-Fix).
- [ ] Verify no PII is sent.

## References
- [Epic 2: Designer Audit & Repair Workflow](_bmad-output/planning-artifacts/epics.md)
