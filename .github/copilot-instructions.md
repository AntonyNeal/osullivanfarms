# AI Coding Agent Instructions for O'Sullivan Farms Platform

## Architecture Overview

This is a **multi-tenant service booking platform** with a React/TypeScript frontend and Azure Functions Node.js backend. The platform uses subdomain-based tenant routing where each tenant gets isolated content, theme, and photo configurations.

**Critical Architecture Pattern:**
- Frontend: React 18 + Vite + Tailwind CSS + TanStack Query
- Backend: Express app wrapped in Azure Functions v3 (Node.js 20)
- Database: PostgreSQL with connection pooling via `pg`
- Deployment: GitHub Actions → Azure Static Web Apps (frontend) + Azure Functions (API)

## Azure Functions Integration Pattern

**CRITICAL**: The API uses a hybrid Express + Azure Functions architecture:

1. `api/index.js` exports an async function that bridges Azure Functions to Express
2. Individual function folders (`api/HttpTrigger/`, `api/health/`, `api/mobs/`) import from `api/index.js`
3. The HttpTrigger catch-all route (`/{*restOfPath}`) routes everything through Express
4. Express routes are defined WITHOUT `/api` prefix (Azure Functions adds it)

**Common Pitfall**: DO NOT call Express app directly as `app(req, res)`. The bridge pattern uses:
```javascript
// Create mock Express req/res objects
app(mockReq, mockRes, (err) => { /* handle 404/errors */ });
```

When making changes to API routing:
- Edit `api/index.js` for Express routes
- Keep `api/HttpTrigger/index.js` as a thin wrapper
- Test locally with `func start` in `api/` directory
- Check that `package.json` main is `"index.js"` NOT `"server.js"`

## Multi-Tenant System

Tenants are configured in `src/tenants/{tenant-name}/`:
- `content.config.ts` - Services, pricing, contact info, bio
- `theme.config.ts` - Colors, fonts, layout preferences  
- `photos.config.ts` - Hero images, galleries, testimonials
- `index.ts` - Exports combined configuration

**Tenant Detection**: `src/core/hooks/useTenant.ts` extracts subdomain from `window.location.hostname` and loads the matching tenant config. Falls back to `demo` tenant.

## Development Workflow

### Local Development
```bash
# Frontend (port 5173)
npm run dev

# API locally (port 7071)
cd api && func start

# Run tests
npm run test:unit:run        # Frontend Vitest tests
npm run test                 # Playwright e2e tests
cd api && npm test           # API Jest tests
```

### Deployment
- Push to `main` branch triggers GitHub Actions workflow
- Path filters detect frontend vs API changes (`.github/workflows/azure-static-web-apps.yml`)
- Deployment uses Node 20 (enforced in `engines` field)

### Testing API Locally
```powershell
# Test specific endpoint
Invoke-RestMethod -Uri "http://localhost:7071/api/HttpTrigger/health" -Method GET

# Test with POST body
Invoke-RestMethod -Uri "http://localhost:7071/api/HttpTrigger/farm-advisor" -Method POST -Body (@{question="Test"} | ConvertTo-Json) -ContentType "application/json"
```

## Key Conventions

### TypeScript Patterns
- All tenant configs use strict typing from `src/core/types/tenant.types.ts`
- Use `@/` path alias for absolute imports (configured in `vite.config.ts`)
- Zod schemas for API validation (see `src/types/`)

### State Management
- Use TanStack Query for server state (API calls)
- React Context for theme/tenant state (`src/core/contexts/TenantContext.tsx`)
- NO Redux or similar - keep state local or in React Query cache

### Styling
- Tailwind utility classes preferred over CSS modules
- Theme colors accessed via `theme.config.ts` and applied dynamically
- Responsive: mobile-first with `sm:`, `md:`, `lg:` breakpoints

### Database Access
**CRITICAL**: Use the connection pool from `api/db.js`:
```javascript
const db = require('./db');
const result = await db.query('SELECT * FROM mobs');
```
NEVER create new `pg.Pool()` instances in route handlers.

## Common Tasks

### Adding a New API Endpoint
1. Add Express route in `api/index.js` (WITHOUT `/api` prefix)
2. Route automatically available at `/api/HttpTrigger/{your-route}`
3. Or create dedicated function folder like `api/health/` for standalone endpoints

### Adding a New Tenant
1. Copy `src/tenants/_template/` to `src/tenants/{subdomain}/`
2. Update `content.config.ts`, `theme.config.ts`, `photos.config.ts`
3. Test by accessing `{subdomain}.localhost:5173`

### Debugging Azure Functions Issues
- Check `api/package.json` main field is `"index.js"`
- Verify `api/HttpTrigger/function.json` route is `HttpTrigger/{*restOfPath}`
- Look for crashes during `func start` - often means Express integration issue
- Azure logs at: Azure Portal → Function App → Log Stream (but often non-functional)

## Known Issues & Workarounds

1. **Azure Log Stream doesn't show output**: Use local `func start` for debugging
2. **500 errors with no logs**: Usually means Node process crashed - check Express bridge code
3. **CORS errors**: Verify origin in `api/index.js` CORS configuration matches your domain
4. **"Unable to connect to remote server"**: Function runtime crashed - check for unhandled Promise rejections

## SDK & Generators

The platform includes powerful SDK tools in `sdk/`:
- Theme Generator: `node sdk/index.js theme`
- App Generator: Natural language → tenant config
- Asset Generator: Get image specs
- Content Auditor: Find template placeholders

See `sdk/README.md` for detailed usage.

## External Dependencies

- **PostgreSQL**: Connection via `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` env vars
- **SendGrid**: Email service (optional, controlled by `SENDGRID_API_KEY`)
- **Azure**: Deployment target (requires `AZURE_STATIC_WEB_APPS_API_TOKEN`)

## Important Files

- `api/index.js` - Main Express app + Azure Functions bridge
- `api/HttpTrigger/index.js` - Azure Functions entry point
- `src/core/hooks/useTenant.ts` - Tenant detection logic
- `.github/workflows/azure-static-web-apps.yml` - CI/CD pipeline
- `vite.config.ts` - Frontend build configuration with chunking strategy
