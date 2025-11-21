# 🎉 O'Sullivan Farms - Azure Staging Environment Setup

## ✅ Staging Environment Created Successfully

### 📍 Staging URL
```
https://kind-smoke-078aaff0f.3.azurestaticapps.net
```

---

## 🔧 Setup Instructions

### 1. Add GitHub Secret for Staging

The staging deployment token has been generated. You need to add it to GitHub:

**Steps:**
1. Go to: https://github.com/AntonyNeal/osullivanfarms/settings/secrets/actions
2. Click **"New repository secret"**
3. Name: `AZURE_STATIC_WEB_APPS_API_TOKEN_STAGING`
4. Value: 
   ```
   f14ad8fa3a358d92fd9e626768b8c728286b1ddf8332260aff367353184120c103-6ecbbc01-4831-4151-b579-5d224b5676a000f2220078aaff0f
   ```
5. Click **"Add secret"**

---

## 🌿 Branch Strategy

### Production Environment
- **Branch:** `main`
- **URL:** https://witty-coast-049457e0f.3.azurestaticapps.net
- **Secret:** `AZURE_STATIC_WEB_APPS_API_TOKEN` (already configured)
- **Workflow:** `.github/workflows/azure-static-web-apps-*.yml` (existing)

### Staging Environment
- **Branch:** `staging` or `develop`
- **URL:** https://kind-smoke-078aaff0f.3.azurestaticapps.net
- **Secret:** `AZURE_STATIC_WEB_APPS_API_TOKEN_STAGING` (needs to be added)
- **Workflow:** `.github/workflows/azure-static-web-apps-staging.yml` (just created)

---

## 🚀 Deployment Workflow

### For Staging Deployments:
```bash
# Create and switch to staging branch
git checkout -b staging

# Make your changes, then push
git add .
git commit -m "Your changes"
git push origin staging
```

### For Production Deployments:
```bash
# Merge staging to main when ready
git checkout main
git merge staging
git push origin main
```

---

## 🔄 Preview Environments

Both environments support **Pull Request previews**:
- When you open a PR to `main`, a preview environment is automatically created
- The preview URL will be posted as a comment on the PR
- Preview environments are automatically deleted when the PR is closed

---

## 📊 Resource Details

### Staging Static Web App
- **Name:** osullivanfarms-staging
- **Resource Group:** osullivanfarms-rg
- **Location:** East US 2
- **SKU:** Free Tier
- **Provider:** GitHub
- **Repository:** https://github.com/AntonyNeal/osullivanfarms
- **Build Config:**
  - App Location: `/`
  - Output Location: `dist`
  - Build Command: `npm ci && npm run build` (defined in workflow)

---

## 🎯 Next Steps

1. **Add the staging secret to GitHub** (see instructions above)
2. **Create staging branch:**
   ```bash
   git checkout -b staging
   git push origin staging
   ```
3. **Verify deployment:** Visit https://kind-smoke-078aaff0f.3.azurestaticapps.net
4. **Monitor:** Check GitHub Actions at https://github.com/AntonyNeal/osullivanfarms/actions

---

## 💡 Tips

- **Test features on staging** before merging to production
- **Use environment-specific .env files** if needed
- **Monitor both environments** in Azure Portal
- **Set up custom domains** for each environment if desired

---

## 🔗 Useful Links

- **Azure Portal - Staging:** https://portal.azure.com/#@life-psychology.com.au/resource/subscriptions/47b5552f-0eb8-4462-97e7-cd67e8e660b8/resourceGroups/osullivanfarms-rg/providers/Microsoft.Web/staticSites/osullivanfarms-staging/staticsite
- **GitHub Actions:** https://github.com/AntonyNeal/osullivanfarms/actions
- **GitHub Secrets:** https://github.com/AntonyNeal/osullivanfarms/settings/secrets/actions
