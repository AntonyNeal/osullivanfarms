# SheepSheet Infrastructure as Code (Terraform)

This directory contains Terraform configuration to provision all Azure infrastructure for the SheepSheet platform.

## 🏗️ Infrastructure Components

The Terraform configuration creates:

- **Resource Group**: `osullivanfarms-rg` (all resources in one group)
- **Function App**: Node.js 20 runtime for API endpoints (farm-advisor, mobs, farm-statistics)
- **App Service Plan**: Consumption (Y1) plan for cost-effective serverless execution
- **PostgreSQL Flexible Server**: Standard_B1ms in Australia East with 32GB storage
- **Storage Account**: For Function App artifacts and state
- **Application Insights**: API monitoring and telemetry
- **Log Analytics Workspace**: Centralized logging
- **Static Web Apps**: Production (main branch) and Staging (staging branch)

## 📋 Prerequisites

1. **Azure CLI** installed and authenticated:

   ```powershell
   az login
   az account set --subscription "<your-subscription-id>"
   ```

2. **Terraform** installed (>= 1.0):

   ```powershell
   choco install terraform
   # or download from https://www.terraform.io/downloads
   ```

3. **Azure Subscription** with permissions to create resources

4. **OpenAI API Key** from https://platform.openai.com/api-keys

## 🚀 Quick Start

### 1. Configure Variables

```powershell
cd terraform/azure
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` with your sensitive values:

```hcl
db_admin_password = "YourSecurePassword123!"
openai_api_key    = "sk-proj-..."
```

### 2. Initialize Terraform

```powershell
terraform init
```

This downloads required providers (azurerm, azapi).

### 3. Review the Plan

```powershell
terraform plan
```

This shows what will be created without making changes.

### 4. Deploy Infrastructure

```powershell
terraform apply
```

Type `yes` when prompted. Deployment takes **5-10 minutes**.

### 5. Post-Deployment Steps

After Terraform completes, follow the output instructions:

#### a. Run Database Migrations

```powershell
# Get connection details from Terraform output
$dbHost = terraform output -raw postgresql_server_fqdn
$dbName = terraform output -raw postgresql_database_name

# Run schema creation
cd ../../db
psql "host=$dbHost port=5432 dbname=$dbName user=sheepsheetadmin sslmode=require" -f schema.sql
```

#### b. Get Static Web App Deployment Tokens

```powershell
# Production token
az staticwebapp secrets list --name osullivanfarms --resource-group osullivanfarms-rg --query "properties.apiKey" -o tsv

# Staging token
az staticwebapp secrets list --name osullivanfarms-staging --resource-group osullivanfarms-rg --query "properties.apiKey" -o tsv
```

#### c. Update GitHub Secrets

Go to: `https://github.com/AntonyNeal/osullivanfarms/settings/secrets/actions`

Add/Update:

- `AZURE_STATIC_WEB_APPS_API_TOKEN` (production token)
- `AZURE_STATIC_WEB_APPS_API_TOKEN_STAGING` (staging token)

#### d. Deploy Function App Code

```powershell
cd ../../api
func azure functionapp publish osullivanfarms-api
```

#### e. Trigger GitHub Actions

Push to `main` or `staging` branch to deploy frontend:

```powershell
git push origin main
```

## 🔄 Managing Infrastructure

### View Current State

```powershell
terraform show
```

### Update Resources

1. Modify `.tf` files as needed
2. Run `terraform plan` to preview changes
3. Run `terraform apply` to apply changes

### Destroy All Resources

**⚠️ WARNING: This deletes everything!**

```powershell
terraform destroy
```

Type `yes` to confirm. Useful for complete teardown.

## 📝 Variable Reference

| Variable                 | Default                 | Description                              |
| ------------------------ | ----------------------- | ---------------------------------------- |
| `resource_group_name`    | `osullivanfarms-rg`     | Resource group name                      |
| `location`               | `East US 2`             | Primary Azure region                     |
| `db_location`            | `Australia East`        | PostgreSQL region (lower latency)        |
| `storage_account_name`   | `osullivanfarmsstorage` | Storage account (globally unique)        |
| `function_app_name`      | `osullivanfarms-api`    | Function App name                        |
| `postgresql_server_name` | `osullivanfarms-db`     | PostgreSQL server name (globally unique) |
| `static_web_app_name`    | `osullivanfarms`        | Static Web App name                      |
| `db_admin_password`      | _(required)_            | PostgreSQL admin password                |
| `openai_api_key`         | _(required)_            | OpenAI API key                           |

## 🎯 Output Reference

After `terraform apply`, get outputs:

```powershell
# All outputs
terraform output

# Specific output
terraform output function_app_url
terraform output postgresql_server_fqdn

# Sensitive output
terraform output -raw application_insights_instrumentation_key
```

## 🔐 Security Notes

1. **Never commit `terraform.tfvars`** - contains sensitive values
2. **PostgreSQL password requirements**:
   - 8+ characters
   - Uppercase + lowercase + numbers + special chars
3. **Firewall rules** created:
   - Azure Services (0.0.0.0)
   - All IPs (0.0.0.0-255.255.255.255) for initial setup
   - **Consider restricting in production!**

4. **OpenAI API Key** stored in Function App settings (encrypted at rest)

## 🐛 Troubleshooting

### "Resource already exists"

If resources exist from manual creation:

```powershell
# Import existing resource
terraform import azurerm_resource_group.main /subscriptions/<sub-id>/resourceGroups/osullivanfarms-rg

# Or destroy and recreate
terraform destroy
terraform apply
```

### "Name not available"

Storage and PostgreSQL names must be globally unique:

```hcl
# In terraform.tfvars
storage_account_name   = "osullivanfarms2024"
postgresql_server_name = "osullivanfarms-db-2024"
```

### "Authentication failed"

```powershell
az login
az account show  # Verify correct subscription
```

### PostgreSQL connection issues

```powershell
# Test connection
psql "host=osullivanfarms-db.postgres.database.azure.com port=5432 dbname=sheepsheet user=sheepsheetadmin sslmode=require"

# Check firewall rules
az postgres flexible-server firewall-rule list --resource-group osullivanfarms-rg --name osullivanfarms-db
```

## 📚 Additional Resources

- [Terraform Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [Azure Functions with Terraform](https://learn.microsoft.com/en-us/azure/azure-functions/functions-infrastructure-as-code)
- [Azure Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/)
- [PostgreSQL Flexible Server](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/)

## 🔄 Recovery Scenario

If all Azure resources are deleted:

1. `cd terraform/azure`
2. Ensure `terraform.tfvars` has your secrets
3. `terraform apply` (5-10 minutes)
4. Run database migrations from `db/schema.sql`
5. Get Static Web App tokens and update GitHub secrets
6. Deploy Function App: `func azure functionapp publish osullivanfarms-api`
7. Push code to trigger frontend deployment
8. **Total recovery time: ~15-20 minutes**

---

**Maintained by**: Julian Della Bosca
**Project**: SheepSheet Platform
**Last Updated**: November 2025
