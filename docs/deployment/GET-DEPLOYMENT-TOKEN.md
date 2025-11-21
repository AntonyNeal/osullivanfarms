# How to Fix GitHub Actions Deployment

## The Problem

GitHub Actions is failing because it doesn't have the Azure Static Web Apps deployment token.

## Solution: Add the Deployment Token to GitHub Secrets

### Step 1: Get the Deployment Token from Azure

#### Option A: Using Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Static Web App: **osullivanfarms** (production)
3. In the left menu, click **"Overview"**
4. Click **"Manage deployment token"** at the top
5. Copy the deployment token

#### Option B: Using Azure CLI (PowerShell)

```powershell
az staticwebapp secrets list --name osullivanfarms --resource-group osullivanfarms-rg --query "properties.apiKey" -o tsv
```

### Step 2: Add the Token to GitHub Secrets

1. Go to your GitHub repository: https://github.com/AntonyNeal/osullivanfarms
2. Click **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **"New repository secret"**
5. Name: `AZURE_STATIC_WEB_APPS_API_TOKEN_WITTY_COAST_049457E0F`
6. Value: Paste the deployment token from Step 1
7. Click **"Add secret"**

### Step 3: Re-run the Failed Workflow

1. Go to the **Actions** tab in GitHub
2. Click on the failed workflow run
3. Click **"Re-run all jobs"**

---

## For Staging Environment

If you also need to deploy to staging, repeat the process:

**Staging deployment token:**

```powershell
az staticwebapp secrets list --name osullivanfarms-staging --resource-group osullivanfarms-rg --query "properties.apiKey" -o tsv
```

**GitHub Secret Name:** `AZURE_STATIC_WEB_APPS_API_TOKEN_KIND_SMOKE_078AAFF0F`

---

## Current Workflow Configuration

Your workflow is set to deploy on pushes to `main` branch. Since you're working on `staging` branch, you have two options:

### Option 1: Create a Staging Workflow (Recommended)

Create `.github/workflows/azure-static-web-apps-staging.yml` that deploys `staging` branch to the staging environment.

### Option 2: Merge to Main

Merge your `staging` branch to `main` to trigger the production deployment.

---

## Quick PowerShell Commands

Run these from your repo directory:

```powershell
# Get production deployment token
az staticwebapp secrets list --name osullivanfarms --resource-group osullivanfarms-rg --query "properties.apiKey" -o tsv

# Get staging deployment token
az staticwebapp secrets list --name osullivanfarms-staging --resource-group osullivanfarms-rg --query "properties.apiKey" -o tsv
```

Then add these to GitHub Secrets as shown in Step 2 above.
