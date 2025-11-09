# Azure Static Web Apps Deployment Guide

## 🇦🇺 O'Sullivan Farms - Azure Deployment

This guide will help you deploy the Neo-Australian O'Sullivan Farms website to Azure Static Web Apps.

## Prerequisites

1. **Azure Account**: [Create free account](https://azure.microsoft.com/free/)
2. **Azure CLI** (optional): For command-line deployment
3. **GitHub Account**: Repository is already set up

## Quick Deployment Steps

### Option 1: Azure Portal (Easiest)

#### Step 1: Create Static Web App

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **Create a resource** → Search for **Static Web App**
3. Click **Create**

#### Step 2: Configure Basic Settings

- **Subscription**: Choose your subscription
- **Resource Group**: Create new → `osullivanfarms-rg`
- **Name**: `osullivanfarms` (will become osullivanfarms.azurestaticapps.net)
- **Plan type**: Free (perfect for demo/sample)
- **Region**: East US 2 (or closest to you)

#### Step 3: Configure Deployment

- **Source**: GitHub
- **Organization**: AntonyNeal
- **Repository**: osullivanfarms
- **Branch**: main

#### Step 4: Build Details

- **Build Presets**: React
- **App location**: `/`
- **Api location**: _(leave empty)_
- **Output location**: `dist`

#### Step 5: Review + Create

1. Click **Review + create**
2. Click **Create**
3. Wait 2-3 minutes for deployment

#### Step 6: Get Your URL

- Once created, go to your Static Web App resource
- Find **URL**: `https://osullivanfarms.azurestaticapps.net`
- Your site is live! 🎉

### Option 2: Azure CLI (Advanced)

```bash
# Login to Azure
az login

# Create resource group
az group create --name osullivanfarms-rg --location eastus2

# Create static web app
az staticwebapp create \
  --name osullivanfarms \
  --resource-group osullivanfarms-rg \
  --source https://github.com/AntonyNeal/osullivanfarms \
  --location eastus2 \
  --branch main \
  --app-location "/" \
  --output-location "dist" \
  --login-with-github
```

### Option 3: Manual Build + Deploy

```bash
# 1. Build production bundle
npm run build

# 2. Install Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# 3. Deploy
swa deploy ./dist --app-name osullivanfarms
```

## Configuration Files

### ✅ Already Created

1. **staticwebapp.config.json** - Azure-specific configuration
   - SPA routing (all routes serve index.html)
   - Security headers
   - MIME types

2. **.github/workflows/azure-static-web-apps.yml** - GitHub Actions CI/CD
   - Auto-deploys on push to main
   - Builds with Vite
   - Handles pull request previews

## Custom Domain Setup

### Add Custom Domain

1. In Azure Portal, go to your Static Web App
2. Click **Custom domains** in left menu
3. Click **+ Add**
4. Enter: `www.osullivanfarms.com.au`
5. Choose **CNAME** validation
6. Copy the CNAME record

### Configure DNS

Add these records to your domain registrar:

```
Type: CNAME
Name: www
Value: osullivanfarms.azurestaticapps.net
TTL: 3600
```

For apex domain (osullivanfarms.com.au):

```
Type: ALIAS or ANAME
Name: @
Value: osullivanfarms.azurestaticapps.net
TTL: 3600
```

### SSL Certificate

- Azure automatically provisions SSL certificates
- Wait 5-15 minutes after DNS propagation
- Certificate auto-renews

## Environment Variables

If you need API keys or environment variables:

1. Go to Azure Portal → Your Static Web App
2. Click **Configuration** in left menu
3. Add application settings:
   - `VITE_API_BASE_URL`: Your API endpoint
   - Any other `VITE_*` variables

## GitHub Secrets Setup

The GitHub Actions workflow needs this secret:

1. Go to Azure Portal → Your Static Web App
2. Click **Manage deployment token**
3. Copy the token
4. Go to GitHub → Settings → Secrets and variables → Actions
5. Create new secret:
   - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Value: _paste token_

## Monitoring & Analytics

### View Deployment Logs

- GitHub: Actions tab → Latest workflow run
- Azure Portal: Deployment Center → View logs

### Performance Monitoring

1. Azure Portal → Your Static Web App
2. Click **Application Insights** (optional)
3. Enable for detailed analytics

### Check Build Status

Badge for README:

```markdown
[![Azure Static Web Apps](https://github.com/AntonyNeal/osullivanfarms/actions/workflows/azure-static-web-apps.yml/badge.svg)](https://github.com/AntonyNeal/osullivanfarms/actions/workflows/azure-static-web-apps.yml)
```

## Costs

### Free Tier Includes:

- ✅ 100 GB bandwidth/month
- ✅ 250 MB storage
- ✅ Custom domains + SSL
- ✅ Global CDN
- ✅ GitHub integration

**Perfect for demo/sample sites!**

### If You Need More:

- Standard tier: $9/month
- Unlimited bandwidth
- 500 MB storage

## Troubleshooting

### Build Fails

Check GitHub Actions logs:

1. Go to repository → Actions tab
2. Click failed workflow
3. Expand failed step

Common issues:

- Missing `AZURE_STATIC_WEB_APPS_API_TOKEN` secret
- Node version mismatch (needs 20+)
- Build command errors

### Site Shows 404

- Wait 2-3 minutes for first deployment
- Check `output_location: "dist"` in workflow
- Verify `staticwebapp.config.json` exists

### Styles Not Loading

- Check CSP headers in `staticwebapp.config.json`
- Verify font URLs in `neo-australian.css`
- Clear browser cache

## Next Steps

1. ✅ Build completes successfully
2. ✅ Deploy to Azure Static Web Apps
3. 🎯 Add custom domain
4. 🎯 Configure SSL
5. 🎯 Share the URL!

## Resources

- [Azure Static Web Apps Docs](https://learn.microsoft.com/en-us/azure/static-web-apps/)
- [GitHub Actions for Azure](https://github.com/Azure/static-web-apps-deploy)
- [Custom Domain Guide](https://learn.microsoft.com/en-us/azure/static-web-apps/custom-domain)

---

## Your URLs

After deployment:

- **Default Azure URL**: `https://osullivanfarms.azurestaticapps.net`
- **Custom Domain** (when configured): `https://www.osullivanfarms.com.au`

🇦🇺 **Fair dinkum deployment - no worries!** 🦘
