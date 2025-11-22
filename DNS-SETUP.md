# DNS Setup for sheepsheet.io

## Add these DNS records in Namecheap:

### 1. Apex Domain Validation (sheepsheet.io)

- **Type**: TXT
- **Host**: `@`
- **Value**: `_qj1vbuz48wpat68vcymi8mi8s6ttcy1`
- **TTL**: Automatic

### 2. Apex Domain (sheepsheet.io) → Production

- **Type**: ALIAS or URL Redirect (301)
- **Host**: `@`
- **Value**: `witty-coast-049457e0f.3.azurestaticapps.net`
- **TTL**: Automatic

**Note**: If ALIAS isn't available, use URL Redirect to www.sheepsheet.io

### 3. WWW Subdomain (www.sheepsheet.io) → Production

- **Type**: CNAME
- **Host**: `www`
- **Value**: `witty-coast-049457e0f.3.azurestaticapps.net`
- **TTL**: Automatic

### 4. Dev Subdomain (dev.sheepsheet.io) → Staging

- **Type**: CNAME
- **Host**: `dev`
- **Value**: `kind-smoke-078aaff0f.3.azurestaticapps.net`
- **TTL**: Automatic

## After Adding DNS Records

Run these commands to configure Azure Static Web Apps:

```powershell
# Wait for DNS propagation (5-10 minutes)
Start-Sleep -Seconds 300

# Verify DNS propagation
nslookup -type=TXT sheepsheet.io
nslookup www.sheepsheet.io
nslookup dev.sheepsheet.io

# Add www subdomain to production
az staticwebapp hostname set --name osullivanfarms --resource-group osullivanfarms-rg --hostname www.sheepsheet.io

# Add dev subdomain to staging
az staticwebapp hostname set --name osullivanfarms-staging --resource-group osullivanfarms-rg --hostname dev.sheepsheet.io

# Check status
az staticwebapp hostname show --name osullivanfarms --resource-group osullivanfarms-rg --hostname sheepsheet.io
```

## Domain Configuration Summary

| Domain            | Environment | Azure Static Web App   |
| ----------------- | ----------- | ---------------------- |
| sheepsheet.io     | Production  | osullivanfarms         |
| www.sheepsheet.io | Production  | osullivanfarms         |
| dev.sheepsheet.io | Staging     | osullivanfarms-staging |

## Update After DNS is Live

Once DNS is propagated, the application configuration will be automatically updated to use the custom domain.
