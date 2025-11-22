# Azure API Deployment Guide

This guide walks you through deploying the O'Sullivan Farms API to Azure Container Apps using Azure CLI and GitHub Actions.

## Prerequisites

- Azure CLI installed and logged in (`az login`)
- Azure subscription with appropriate permissions
- GitHub repository with Actions enabled

## Step 1: Provision Azure Infrastructure

### Create Resource Group

```bash
az group create \
  --name osullivanfarms-rg \
  --location eastus2
```

### Create Container Registry

```bash
az acr create \
  --resource-group osullivanfarms-rg \
  --name osullivanfarmsacr \
  --sku Basic
```

### Create PostgreSQL Database

```bash
az postgres flexible-server create \
  --resource-group osullivanfarms-rg \
  --name osullivanfarms-db \
  --location eastus2 \
  --admin-user dbadmin \
  --admin-password 'YourSecurePassword123!' \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 14 \
  --public-access 0.0.0.0
```

### Create Database

```bash
az postgres flexible-server db create \
  --resource-group osullivanfarms-rg \
  --server-name osullivanfarms-db \
  --database-name osullivanfarms
```

### Create Container App Environment

```bash
az containerapp env create \
  --name osullivanfarms-env \
  --resource-group osullivanfarms-rg \
  --location eastus2
```

### Create Container App

```bash
az containerapp create \
  --name osullivanfarms-api \
  --resource-group osullivanfarms-rg \
  --environment osullivanfarms-env \
  --image mcr.microsoft.com/azuredocs/containerapps-helloworld:latest \
  --target-port 8080 \
  --ingress external \
  --cpu 0.25 \
  --memory 0.5Gi
```

**Note these values** - you'll need them for GitHub Secrets:

- Container Registry: `osullivanfarmsacr.azurecr.io`
- Database Host: `osullivanfarms-db.postgres.database.azure.com`
- Database Name: `osullivanfarms`
- Database User: `dbadmin`

## Step 2: Configure GitHub Secrets

Follow the instructions in [API-SECRETS-SETUP.md](./API-SECRETS-SETUP.md) to add all required secrets to your GitHub repository.

## Step 3: Deploy the API

### Option A: Automatic Deployment

Push changes to the `api/` directory on the `main` branch, and the workflow will automatically deploy.

### Option B: Manual Deployment

1. Go to **Actions** → **Deploy API to Azure Container Apps**
2. Click **Run workflow**
3. Select the `main` branch
4. Click **Run workflow**

## Step 4: Verify Deployment

### Check Health Endpoint

```bash
# Get the API URL
API_URL=$(az containerapp show \
  --name osullivanfarms-api \
  --resource-group osullivanfarms-rg \
  --query "properties.configuration.ingress.fqdn" -o tsv)

# Test health endpoint
curl https://$API_URL/health
```

Expected response:

```json
{
  "status": "healthy",
  "timestamp": "2025-11-21T08:00:00.000Z",
  "uptime": 123.45
}
```

### Check Container App Logs

```bash
az containerapp logs show \
  --name osullivanfarms-api \
  --resource-group osullivanfarms-rg \
  --follow
```

## Step 5: Update Frontend Configuration

Update `.env.development` to point to your deployed API:

```bash
# Get the API URL
API_URL=$(az containerapp show \
  --name osullivanfarms-api \
  --resource-group osullivanfarms-rg \
  --query "properties.configuration.ingress.fqdn" -o tsv)

echo "VITE_API_BASE_URL=https://$API_URL/api"
```

Add the output to your `.env.development` file and restart your frontend dev server.

## Troubleshooting

### 500 Errors

If the API returns 500 errors:

1. Check Container App logs: `az containerapp logs show ...`
2. Verify environment variables are set correctly
3. Check database connectivity
4. Ensure CORS allows your frontend origin

### Database Connection Issues

```bash
# Test database connection
az postgres flexible-server connect \
  --name osullivanfarms-db \
  --admin-user dbadmin \
  --database-name osullivanfarms
```

### Container Registry Authentication

```bash
# Get ACR credentials
az acr credential show --name osullivanfarmsacr

# Test login
docker login osullivanfarmsacr.azurecr.io
```

## Updating the API

1. Make changes to code in `api/` directory
2. Commit and push to `main` branch
3. Workflow automatically builds and deploys
4. Monitor deployment in GitHub Actions

## Cost Optimization

The configuration uses cost-effective tiers:

- Container Registry: Basic SKU
- Container App: 0.25 vCPU, 0.5 GiB memory
- PostgreSQL: B_Standard_B1ms (burstable)

Estimated monthly cost: ~$50-75 USD

## Cleanup

To destroy all resources:

```bash
az group delete --name osullivanfarms-rg --yes
```

**Warning**: This will permanently delete all data!
