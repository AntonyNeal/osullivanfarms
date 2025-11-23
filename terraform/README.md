# 🏗️ SheepSheet Infrastructure as Code

Complete disaster recovery and infrastructure provisioning for the SheepSheet platform.

## 🎯 What This Does

This IaC setup allows you to:

- ✅ **Rebuild entire infrastructure** from scratch in ~15 minutes
- ✅ **Disaster recovery** - delete everything and recreate identically
- ✅ **Consistent deployments** - same infrastructure every time
- ✅ **Version controlled** - infrastructure changes tracked in git
- ✅ **Multi-environment** - production and staging automatically configured

## 📦 What Gets Created

### Azure Resources (8 total)

1. **Resource Group**: `osullivanfarms-rg` (East US 2)
2. **Function App**: `osullivanfarms-api` - Node.js 20 API backend
3. **App Service Plan**: `EastUS2LinuxDynamicPlan` - Consumption (Y1)
4. **PostgreSQL Server**: `osullivanfarms-db` - Standard_B1ms (Australia East)
5. **Storage Account**: `osullivanfarmsstorage` - Function artifacts
6. **Application Insights**: API monitoring and telemetry
7. **Log Analytics Workspace**: Centralized logging
8. **Static Web Apps**: Production (`main`) + Staging (`staging`)

### Configuration Included

- ✅ CORS settings for cross-origin API access
- ✅ Environment variables (DB connection, OpenAI key)
- ✅ PostgreSQL firewall rules for Azure services
- ✅ Application Insights integration
- ✅ Node.js 20 runtime configuration

## 🚀 Quick Start (15-Minute Recovery)

### Prerequisites

```powershell
# Install Azure CLI
winget install Microsoft.AzureCLI

# Install Terraform
choco install terraform

# Login to Azure
az login
```

### Deploy Infrastructure

```powershell
# 1. Navigate to terraform directory
cd terraform/azure

# 2. Create secrets file
cp terraform.tfvars.example terraform.tfvars

# 3. Edit terraform.tfvars with your values:
#    - db_admin_password (complex password)
#    - openai_api_key (from platform.openai.com)

# 4. Run automated deploy script
.\deploy.ps1
```

**Deployment time**: 5-10 minutes

### Post-Deployment Steps

#### 1. Run Database Migrations (2 minutes)

```powershell
# Get database connection details
cd terraform/azure
$dbHost = terraform output -raw postgresql_server_fqdn
$dbName = terraform output -raw postgresql_database_name

# Apply schema
cd ../../db
psql "host=$dbHost port=5432 dbname=$dbName user=sheepsheetadmin sslmode=require" -f schema.sql
```

#### 2. Configure GitHub Actions (3 minutes)

```powershell
# Get deployment tokens
az staticwebapp secrets list --name osullivanfarms --resource-group osullivanfarms-rg --query "properties.apiKey" -o tsv

# Add to GitHub Secrets:
# https://github.com/AntonyNeal/osullivanfarms/settings/secrets/actions
# - AZURE_STATIC_WEB_APPS_API_TOKEN
```

#### 3. Deploy Function App Code (2 minutes)

```powershell
cd api
func azure functionapp publish osullivanfarms-api
```

#### 4. Deploy Frontend (automatic via GitHub Actions)

```powershell
git push origin main  # Triggers deployment
```

**Total recovery time**: ~15-20 minutes from zero to fully operational

## 📁 Directory Structure

```
terraform/azure/
├── main.tf                     # Core infrastructure definitions
├── variables.tf                # Configurable parameters
├── outputs.tf                  # Values exported after deployment
├── terraform.tfvars.example    # Template for secrets
├── deploy.ps1                  # Automated deployment script
├── README.md                   # Detailed documentation
└── .gitignore                  # Excludes sensitive files
```

## 🔐 Security & Secrets

### Required Secrets (in terraform.tfvars)

```hcl
db_admin_password = "ComplexPassword123!"  # PostgreSQL admin
openai_api_key    = "sk-proj-..."         # OpenAI API key
```

### Never Commit

- ❌ `terraform.tfvars` (contains secrets)
- ❌ `*.tfstate` (contains infrastructure state)
- ❌ `.terraform/` (downloaded providers)

All excluded via `.gitignore`.

## 🔄 Common Operations

### View Current Infrastructure

```powershell
cd terraform/azure
terraform show
```

### Update Resources

```powershell
# Modify .tf files as needed
terraform plan     # Preview changes
terraform apply    # Apply changes
```

### Get Output Values

```powershell
terraform output                          # All outputs
terraform output function_app_url         # Specific value
terraform output -raw openai_api_key      # Sensitive value
```

### Complete Teardown

```powershell
terraform destroy  # ⚠️ Deletes everything!
```

## 🐛 Troubleshooting

### "Resource already exists"

```powershell
# Import existing resource
terraform import azurerm_resource_group.main /subscriptions/<sub-id>/resourceGroups/osullivanfarms-rg

# Or destroy and recreate
terraform destroy
terraform apply
```

### "Name not available" (globally unique resources)

```hcl
# In terraform.tfvars, change names:
storage_account_name   = "osullivanfarms2024"
postgresql_server_name = "osullivanfarms-db-2024"
```

### PostgreSQL Connection Issues

```powershell
# Test connection
psql "host=osullivanfarms-db.postgres.database.azure.com port=5432 dbname=sheepsheet user=sheepsheetadmin sslmode=require"

# Check firewall rules
az postgres flexible-server firewall-rule list --resource-group osullivanfarms-rg --name osullivanfarms-db
```

## 📊 Cost Estimate

Monthly Azure costs (approximate):

- **Function App** (Consumption): ~$0-5 (pay per execution)
- **PostgreSQL** (Standard_B1ms): ~$25-30
- **Storage Account** (Standard_LRS): ~$1-2
- **Static Web Apps** (Free tier): $0
- **Application Insights**: ~$0-5 (first 5GB free)

**Total**: ~$30-45/month

## 📚 Documentation

- **Detailed Terraform Docs**: `terraform/azure/README.md`
- **Database Schema**: `db/schema.sql`
- **API Documentation**: `api/README.md`
- **GitHub Actions**: `.github/workflows/azure-static-web-apps.yml`

## 🎓 Learn More

- [Terraform Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [Azure Functions IaC](https://learn.microsoft.com/en-us/azure/azure-functions/functions-infrastructure-as-code)
- [Azure Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/)

## ✅ Success Criteria

After deployment, verify:

```powershell
# API endpoints working
Invoke-RestMethod -Uri "https://osullivanfarms-api.azurewebsites.net/api/farm-statistics" -Method GET

# Database accessible
psql "host=osullivanfarms-db.postgres.database.azure.com port=5432 dbname=sheepsheet user=sheepsheetadmin sslmode=require" -c "SELECT COUNT(*) FROM mobs;"

# Frontend deployed
Start-Process "https://sheepsheet.io"
```

## 🆘 Support

Issues or questions:

- **Email**: julian.dellabosca@gmail.com
- **Repository**: https://github.com/AntonyNeal/osullivanfarms

---

**Infrastructure as Code = Peace of Mind** 🛡️

Delete everything with confidence. Rebuild in 15 minutes. Every time.
