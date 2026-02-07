# Story 2.8: Deploy Proxy Server to Vercel

**Status:** ready-for-dev

## User Story

**As a** Product Designer using the Figma plugin,
**I want** the audit service to be available on a production server,
**So that** I can audit components without running a local development server.

## Acceptance Criteria

1. **Given** I have the Figma plugin installed
2. **When** I select a component and click "Audit"
3. **Then** the plugin connects to the Vercel-hosted proxy (not localhost)
4. **And** the audit results are returned within 5 seconds
5. **And** the API is secured with a shared secret

## Technical Requirements (Developer Guardrails)

### Architecture Compliance
- **Location:** `apps/proxy` deployed to Vercel
- **Plugin Config:** Configurable proxy URL (env-based or build-time)
- **Security:** Environment variable for `PROPPER_SHARED_SECRET`

### Implementation Details

#### 1. Vercel Deployment
- Deploy `apps/proxy` as a Next.js app to Vercel
- Configure environment variables:
  - `PROPPER_SHARED_SECRET` - API authentication key
- Verify CORS is working from Figma sandbox

#### 2. Plugin Configuration
- Make proxy URL configurable (not hardcoded to localhost)
- Options:
  - Build-time constant in `vite.config.ts`
  - Runtime configuration via plugin settings
- Default to production URL, with dev override

#### 3. Testing
- Verify audit works from Figma plugin → Vercel proxy
- Test error handling for network failures
- Confirm <5s response time

### Deployment Steps
```bash
# From apps/proxy directory
cd apps/proxy

# Install Vercel CLI if needed
npm i -g vercel

# Deploy to Vercel
vercel

# Set environment variables
vercel env add PROPPER_SHARED_SECRET

# Deploy to production
vercel --prod
```

### Plugin URL Configuration
Update `apps/plugin/src/ui/App.tsx`:
```typescript
const PROXY_URL = import.meta.env.VITE_PROXY_URL || 'https://propper-proxy.vercel.app';
```

## Tasks

- [ ] Deploy `apps/proxy` to Vercel
- [ ] Set `PROPPER_SHARED_SECRET` environment variable in Vercel
- [ ] Update plugin to use configurable proxy URL
- [ ] Add `VITE_PROXY_URL` build variable for development
- [ ] Test end-to-end from Figma plugin to Vercel
- [ ] Document deployment process in README

## Dependencies
- Story 2.2 (Proxy API setup) - Completed
- Story 2.4 (Audit loop) - Completed
- CORS fix - Completed

## References
- [Epic 2: Designer Audit & Repair Workflow](_bmad-output/planning-artifacts/epics.md)
- [Vercel Next.js Deployment](https://vercel.com/docs/frameworks/nextjs)
