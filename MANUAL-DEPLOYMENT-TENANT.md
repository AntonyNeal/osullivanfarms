# Manual Deployment Steps - Tenant API

## Step 1: Update DigitalOcean App Spec

1. **Go to DigitalOcean Console:**
   - Navigate to: https://cloud.digitalocean.com/apps
   - Find and click on your app: `octopus-app` (or `claire-hamilton-website`)

2. **Update the App Spec:**
   - Click "Settings" tab
   - Scroll down to "App Spec"
   - Click "Edit" or "Edit App Spec"
3. **Replace the spec with this:**

```yaml
name: claire-hamilton-website
region: nyc

# API Service (Backend - Express API)
services:
  - name: api
    github:
      repo: AntonyNeal/sw_website
      branch: main
      deploy_on_push: true
    source_dir: /api
    build_command: npm install
    run_command: node server.js
    http_port: 8080
    instance_count: 1
    instance_size_slug: basic-xxs
    envs:
      - key: DATABASE_URL
        scope: RUN_TIME
        type: SECRET
        value: ${DATABASE_URL}
      - key: DB_HOST
        scope: RUN_TIME
        value: ${DB_HOST}
      - key: DB_PORT
        scope: RUN_TIME
        value: '${DB_PORT}'
      - key: DB_NAME
        scope: RUN_TIME
        value: ${DB_NAME}
      - key: DB_USER
        scope: RUN_TIME
        value: ${DB_USER}
      - key: DB_PASSWORD
        scope: RUN_TIME
        type: SECRET
        value: ${DB_PASSWORD}
      - key: DB_SSL
        scope: RUN_TIME
        value: require
      - key: NODE_ENV
        scope: RUN_TIME
        value: production
    routes:
      - path: /api

  # Web Service (Frontend - Static Site)
  - name: frontend
    github:
      repo: AntonyNeal/sw_website
      branch: main
      deploy_on_push: true
    build_command: npm install && npm run build
    run_command: npm run start
    http_port: 8080
    instance_count: 1
    instance_size_slug: basic-xxs
    envs:
      - key: VITE_GA_MEASUREMENT_ID
        value: ${GA_MEASUREMENT_ID}
      - key: VITE_API_BASE_URL
        value: https://${APP_DOMAIN}/api
      - key: VITE_FUNCTIONS_URL
        value: ${FUNCTIONS_URL}
    routes:
      - path: /

# Database
databases:
  - name: companion-platform-db
    engine: PG
    version: '16'
    production: true
    cluster_name: companion-platform-db

# Domains
domains:
  - domain: clairehamilton.com
    type: PRIMARY
  - domain: www.clairehamilton.com
    type: ALIAS
  - domain: clairehamilton.vip
    type: ALIAS
  - domain: prebooking.pro
    type: ALIAS
  - domain: '*.prebooking.pro'
    type: ALIAS
```

4. **Click "Save"** - This will trigger a new deployment

5. **Wait for deployment** (usually 5-10 minutes)
   - Watch the "Activity" tab for progress
   - Wait for both services to show "Active" status

## Step 2: Verify Tenant API

Once deployment completes, test the endpoints:

### Test 1: Health Check

```powershell
Invoke-RestMethod -Uri "https://octopus-app-s8m2n.ondigitalocean.app/api/health" -Method GET
```

**Expected output:**

```json
{
  "status": "healthy",
  "timestamp": "2025-11-07T...",
  "service": "sw-website-api"
}
```

### Test 2: Get Tenant by Subdomain

```powershell
Invoke-RestMethod -Uri "https://octopus-app-s8m2n.ondigitalocean.app/api/tenants/claire" -Method GET
```

**Expected output:**

```json
{
  "success": true,
  "data": {
    "id": "9daa3c12-bdec-4dc0-993d-7f9f8f391557",
    "name": "Claire Hamilton",
    "subdomain": "claire",
    ...
  }
}
```

### Test 3: Get Tenant by Domain

```powershell
Invoke-RestMethod -Uri "https://octopus-app-s8m2n.ondigitalocean.app/api/tenants/domain/clairehamilton.vip" -Method GET
```

### Test 4: List All Tenants

```powershell
Invoke-RestMethod -Uri "https://octopus-app-s8m2n.ondigitalocean.app/api/tenants" -Method GET
```

## Troubleshooting

### If deployment fails:

1. Check "Runtime Logs" in the DigitalOcean console
2. Look for errors like:
   - "Cannot find module" - Missing dependencies
   - "ECONNREFUSED" - Database connection issues
   - "Port already in use" - Port configuration issue

### Common fixes:

- Ensure `api/package.json` exists (it might need to be created)
- Check that database credentials are correct
- Verify the `source_dir: /api` points to the correct folder

## Next Steps

Once all 4 tests pass:
✅ Tenant API is deployed and working
➡️ Ready to deploy Availability API (next iteration)

Let me know the results and I'll proceed with the next API deployment!
