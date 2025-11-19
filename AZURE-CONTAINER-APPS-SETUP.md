# Azure Container Apps API Deployment Setup

## Azure Resources Created

✅ **Container Apps Environment**: `osullivanfarms-env`
✅ **Container App**: `osullivanfarms-api`
✅ **Container Registry**: `osullivanfarmsacr`

**API URL**: `https://osullivanfarms-api.wonderfulsky-3834edbe.eastus2.azurecontainerapps.io`

## Required GitHub Secrets

Add these secrets to your GitHub repository settings:

### 1. Azure Credentials

Create a service principal and add the JSON output as `AZURE_CREDENTIALS`:

```powershell
az ad sp create-for-rbac --name "osullivanfarms-github" --role contributor --scopes /subscriptions/47b5552f-0eb8-4462-97e7-cd67e8e660b8/resourceGroups/osullivanfarms-rg --sdk-auth
```

### 2. Container Registry Credentials

Get the credentials by running:
```powershell
az acr credential show --name osullivanfarmsacr
```

Then add these secrets:
- **REGISTRY_LOGIN_SERVER**: `osullivanfarmsacr.azurecr.io`
- **REGISTRY_USERNAME**: (from the command output)
- **REGISTRY_PASSWORD**: (from the command output)

### 3. Database Credentials (from your PostgreSQL database)

- **DB_HOST**: `osullivanfarms-db.postgres.database.azure.com`
- **DB_PORT**: `5432`
- **DB_NAME**: Your database name
- **DB_USER**: Your database username
- **DB_PASSWORD**: Your database password

### 4. SendGrid Configuration

- **SENDGRID_API_KEY**: Your SendGrid API key
- **SENDGRID_FROM_EMAIL**: Your sender email address

## Testing the Deployment

Once secrets are configured and you push changes to the `api/` folder:

1. GitHub Actions will build a Docker image
2. Push it to Azure Container Registry
3. Deploy to Azure Container Apps

## Local Development

The API URL has been updated in `.env`:

```
VITE_API_BASE_URL=https://osullivanfarms-api.wonderfulsky-3834edbe.eastus2.azurecontainerapps.io/api
```

For local development, use `.env.development`:

```
VITE_API_BASE_URL=http://localhost:3001/api
```

## Manual Deployment (if needed)

Build and deploy manually:

```powershell
cd api
docker build -t osullivanfarmsacr.azurecr.io/osullivanfarms-api:latest .
az acr login --name osullivanfarmsacr
docker push osullivanfarmsacr.azurecr.io/osullivanfarms-api:latest
az containerapp update --name osullivanfarms-api --resource-group osullivanfarms-rg --image osullivanfarmsacr.azurecr.io/osullivanfarms-api:latest
```
