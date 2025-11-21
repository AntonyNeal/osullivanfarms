# 🚀 O'Sullivan Farms Deployment Guide

Complete deployment guide for the Neo-Australian Agriculture Platform.

## 🎯 Quick Deploy Options

### Option 1: Automated Azure Deployment (Recommended)

The GitHub Actions workflow will automatically deploy when you push to main:

```bash
git push origin main
```

**Prerequisites:**

1. Azure account created
2. Static Web App resource created in Azure Portal
3. `AZURE_STATIC_WEB_APPS_API_TOKEN` secret added to GitHub

### Option 2: Manual Azure Portal Deployment

1. **Go to Azure Portal**: https://portal.azure.com
2. **Create Static Web App**:
   - Click "+ Create a resource"
   - Search for "Static Web Apps"
   - Click "Create"
3. **Configure**:
   - Subscription: Your subscription
   - Resource Group: `osullivanfarms-rg` (create new)
   - Name: `osullivanfarms`
   - Plan: Free
   - Region: East US 2
   - Source: GitHub
   - Organization: AntonyNeal
   - Repository: osullivanfarms
   - Branch: main
   - Build Presets: React
   - App location: `/`
   - Output location: `dist`
4. **Deploy**: Click "Review + create" → "Create"
5. **Get URL**: After 2-3 minutes, find your URL in the resource overview

### Option 3: Using SDK Infrastructure Module

```bash
# Check Azure CLI is configured
npm run deploy:check

# Deploy using SDK
npm run deploy:azure
```

### Option 4: Azure CLI Deployment

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

### Option 5: Azure Static Web Apps CLI

```bash
# Build the app
npm run build

# Install SWA CLI globally
npm install -g @azure/static-web-apps-cli

# Deploy
swa deploy ./dist \
  --app-name osullivanfarms \
  --env production
```

## 📋 Prerequisites

### Required

- ✅ Node.js 20+
- ✅ npm or yarn
- ✅ Git
- ✅ GitHub account with repository access

### For Azure Deployment

- ✅ Azure account (free tier available)
- ✅ Azure CLI installed (for CLI deployment)
- ✅ Azure subscription with Static Web Apps enabled

### For GitHub Actions

- ✅ Repository admin access
- ✅ Azure Static Web Apps deployment token

## 🔧 Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Application

```bash
npm run build
```

This creates a production build in the `dist/` directory.

### 3. Test Locally

```bash
npm run preview
```

Visit http://localhost:4173 to test the production build.

### 4. Configure Azure

#### Get Deployment Token

1. Go to Azure Portal
2. Navigate to your Static Web App
3. Click "Manage deployment token"
4. Copy the token

#### Add GitHub Secret

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
5. Value: Paste the token from Azure
6. Click "Add secret"

### 5. Deploy

Push to main branch or manually trigger GitHub Actions:

```bash
git add .
git commit -m "Deploy to Azure"
git push origin main
```

## 🌐 URLs After Deployment

### Default Azure URL

```
https://osullivanfarms.azurestaticapps.net
```

### Custom Domain (Optional)

```
https://www.osullivanfarms.com.au
https://osullivanfarms.com.au
```

## 🎨 What's Deployed

### Frontend Application

- ✅ React 18.3.1 + TypeScript
- ✅ Vite 7.1.2 build system
- ✅ Neo-Australian cyberpunk theme
- ✅ Interactive components (Matrix rain, Southern Cross, weather widget, etc.)
- ✅ Multi-tenant architecture
- ✅ Responsive design (mobile-first)

### Pages

- ✅ Home - Hero with interactive elements
- ✅ Services - Hay, transport, sheep management
- ✅ Prices - Agricultural pricing structure
- ✅ About - Farm information and testimonials
- ✅ Admin Dashboard - Farm operations management

### Features

- ✅ Australian flag animations
- ✅ GPS coordinates (Echuca, Victoria)
- ✅ Family-friendly humor
- ✅ Aussie mascots (Skippy, Koby, Shaun, Boomer)
- ✅ Farm facts carousel
- ✅ Interactive hay calculator
- ✅ Customer testimonials
- ✅ Live weather widget

### Configuration Files

- ✅ `staticwebapp.config.json` - Azure SWA configuration
- ✅ `.github/workflows/azure-static-web-apps.yml` - CI/CD pipeline
- ✅ `vite.config.ts` - Build configuration
- ✅ `tsconfig.json` - TypeScript configuration

## 📊 Monitoring Deployment

### GitHub Actions

1. Go to repository → Actions tab
2. Click on latest workflow run
3. Expand "Build and Deploy Job"
4. Monitor progress

### Azure Portal

1. Go to Azure Portal
2. Navigate to your Static Web App
3. Click "Deployment Center"
4. View deployment history and logs

### Check Deployment Status

```bash
# Via GitHub CLI
gh run list

# Via Azure CLI
az staticwebapp show \
  --name osullivanfarms \
  --resource-group osullivanfarms-rg \
  --query "defaultHostname" \
  --output tsv
```

## 🔍 Troubleshooting

### Build Fails

**Check:**

- Node version is 20+
- All dependencies installed
- No TypeScript errors: `npm run type-check`
- No lint errors: `npm run lint`

**Solution:**

```bash
npm ci
npm run lint:fix
npm run build
```

### Deployment Token Invalid

**Error:** `Invalid deployment token`

**Solution:**

1. Get new token from Azure Portal
2. Update GitHub secret
3. Re-run workflow

### Site Shows 404

**Causes:**

- Deployment still in progress (wait 2-3 minutes)
- Wrong output directory in config
- Missing `staticwebapp.config.json`

**Solution:**

- Wait for deployment to complete
- Check workflow logs
- Verify `output_location: "dist"` in workflow

### Styles Not Loading

**Causes:**

- CSP headers too restrictive
- Font URLs blocked
- Cache issues

**Solution:**

- Check `staticwebapp.config.json` CSP policy
- Clear browser cache (Ctrl+Shift+R)
- Check browser console for errors

### Azure CLI Not Found

**Error:** `az: command not found`

**Solution:**

```bash
# Windows (via winget)
winget install Microsoft.AzureCLI

# Windows (via installer)
# Download from: https://aka.ms/installazurecliwindows

# Mac (via Homebrew)
brew install azure-cli

# Linux
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Verify installation
az version
```

## 🎯 Post-Deployment Checklist

### Immediately After Deployment

- [ ] Visit site URL and verify it loads
- [ ] Test all pages (Home, Services, Prices, About, Admin)
- [ ] Verify interactive components work
- [ ] Test on mobile devices
- [ ] Check browser console for errors

### Optional Enhancements

- [ ] Add custom domain
- [ ] Configure SSL certificate (auto-provisioned by Azure)
- [ ] Set up environment variables in Azure Portal
- [ ] Enable Application Insights for monitoring
- [ ] Configure CDN for faster global access
- [ ] Set up staging environment for testing

### Custom Domain Setup

1. **In Azure Portal:**
   - Navigate to Static Web App
   - Click "Custom domains"
   - Click "+ Add"
   - Enter domain name
   - Choose validation method (CNAME)

2. **In Domain Registrar:**
   - Add CNAME record:
     - Name: `www`
     - Value: `osullivanfarms.azurestaticapps.net`
     - TTL: 3600

3. **Verify:**
   - Wait 5-15 minutes for DNS propagation
   - Azure will validate and provision SSL

## 📚 Additional Resources

### Documentation

- [Azure Static Web Apps Docs](https://learn.microsoft.com/en-us/azure/static-web-apps/)
- [GitHub Actions for Azure](https://github.com/Azure/static-web-apps-deploy)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [SDK Infrastructure Guide](./sdk/INFRASTRUCTURE-GUIDE.md)

### Support

- [Azure Static Web Apps Issues](https://github.com/Azure/static-web-apps/issues)
- [Project Documentation](./DOCUMENTATION-INDEX.md)
- [Quick Reference](./QUICK_REFERENCE.md)

## 💰 Cost Estimate

### Azure Static Web Apps - Free Tier

- ✅ 100 GB bandwidth/month
- ✅ 250 MB storage
- ✅ Custom domains + SSL
- ✅ Global CDN
- ✅ Perfect for demo/sample sites!

**Total Cost: $0/month** 🎉

### If You Need More (Standard Tier)

- 💰 $9/month
- Unlimited bandwidth
- 500 MB storage
- Additional custom domains

## 🆘 Getting Help

### Quick Fixes

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clean build
rm -rf dist
npm run build

# Check Azure login
az login
az account show

# Re-deploy via GitHub Actions
git commit --allow-empty -m "Trigger deployment"
git push
```

### Contact

- **GitHub Issues**: [Report a problem](https://github.com/AntonyNeal/osullivanfarms/issues)
- **Azure Support**: [Azure Portal Support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade)
- **Documentation**: See `AZURE-DEPLOYMENT.md` and `DOCUMENTATION-INDEX.md`

---

## 🇦🇺 G'day and Good Luck! 🦘

Your Neo-Australian O'Sullivan Farms site is ready to go live. Follow the steps above, and you'll be fair dinkum online in no time!

**She'll be right, mate!** 🌾
