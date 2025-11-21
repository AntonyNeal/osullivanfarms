# Azure API Deployment Guide

This guide walks you through deploying the O'Sullivan Farms API to Azure Container Apps using Terraform and GitHub Actions.

## Prerequisites

- Azure CLI installed and logged in (`az login`)
- Terraform installed (v1.0+)
- Azure subscription with appropriate permissions
- GitHub repository with Actions enabled

## Step 1: Provision Azure Infrastructure

Navigate to the Terraform directory and initialize:

```bash
cd terraform/azure
terraform init
```

Create a `terraform.tfvars` file with your configuration:

```hcl
resource_group_name = "osullivanfarms-rg"
location            = "eastus2"
project_name        = "osullivanfarms"
db_admin_username   = "dbadmin"
db_admin_password   = "YourSecurePassword123!"  # Change this!
```

Review the plan:

```bash
terraform plan
```

Apply the configuration:

```bash
terraform apply
```

**Note the outputs** - you'll need these for GitHub Secrets:

- `container_registry_name`
- `container_registry_login_server`
- `database_host`
- `api_url`

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
# Get the API URL from Terraform
cd terraform/azure
API_URL=$(terraform output -raw api_url)

# Test health endpoint
curl $API_URL/health
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

```env
VITE_API_BASE_URL=<your-api-url-from-terraform-output>
```

Restart your frontend dev server to pick up the changes.

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
cd terraform/azure
terraform destroy
```

**Warning**: This will permanently delete all data!
