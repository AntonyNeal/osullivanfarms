# Quick Deploy Script for SheepSheet Infrastructure
# Run this after configuring terraform.tfvars

Write-Host "🏗️  SheepSheet Infrastructure Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "✓ Checking prerequisites..." -ForegroundColor Yellow

# Check Azure CLI
try {
    $azVersion = az version --output json 2>$null | ConvertFrom-Json
    Write-Host "  ✓ Azure CLI installed: $($azVersion.'azure-cli')" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Azure CLI not found. Install from: https://aka.ms/installazurecli" -ForegroundColor Red
    exit 1
}

# Check Terraform
try {
    $tfVersion = terraform version -json 2>$null | ConvertFrom-Json
    Write-Host "  ✓ Terraform installed: $($tfVersion.terraform_version)" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Terraform not found. Install from: https://www.terraform.io/downloads" -ForegroundColor Red
    exit 1
}

# Check Azure login
try {
    $account = az account show 2>$null | ConvertFrom-Json
    Write-Host "  ✓ Azure authenticated: $($account.name)" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Not logged into Azure. Running 'az login'..." -ForegroundColor Yellow
    az login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ✗ Azure login failed" -ForegroundColor Red
        exit 1
    }
}

# Check terraform.tfvars exists
if (-not (Test-Path "terraform.tfvars")) {
    Write-Host ""
    Write-Host "⚠️  terraform.tfvars not found!" -ForegroundColor Red
    Write-Host "   Copy terraform.tfvars.example to terraform.tfvars and fill in your secrets:" -ForegroundColor Yellow
    Write-Host "   - db_admin_password" -ForegroundColor Yellow
    Write-Host "   - openai_api_key" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "📋 Terraform Plan" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host ""

# Initialize Terraform
Write-Host "Initializing Terraform..." -ForegroundColor Yellow
terraform init
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Terraform init failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Creating execution plan..." -ForegroundColor Yellow
terraform plan -out=tfplan
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Terraform plan failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🚀 Ready to Deploy" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will create:"
Write-Host "  • Resource Group: osullivanfarms-rg"
Write-Host "  • Function App: osullivanfarms-api"
Write-Host "  • PostgreSQL: osullivanfarms-db (Australia East)"
Write-Host "  • Static Web Apps: osullivanfarms + osullivanfarms-staging"
Write-Host "  • Storage, App Insights, Log Analytics"
Write-Host ""
Write-Host "Estimated deployment time: 5-10 minutes" -ForegroundColor Yellow
Write-Host ""

$confirmation = Read-Host "Proceed with deployment? (yes/no)"
if ($confirmation -ne "yes") {
    Write-Host "Deployment cancelled" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🔨 Deploying Infrastructure..." -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Cyan
Write-Host ""

terraform apply tfplan
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Terraform apply failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Infrastructure Deployed Successfully!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Get outputs
$functionAppUrl = terraform output -raw function_app_url
$dbHost = terraform output -raw postgresql_server_fqdn
$dbName = terraform output -raw postgresql_database_name

Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Run database migrations:" -ForegroundColor Yellow
Write-Host "   cd ../../db"
Write-Host "   psql `"host=$dbHost port=5432 dbname=$dbName user=sheepsheetadmin sslmode=require`" -f schema.sql"
Write-Host ""
Write-Host "2. Get Static Web App deployment tokens:" -ForegroundColor Yellow
Write-Host "   az staticwebapp secrets list --name osullivanfarms --resource-group osullivanfarms-rg --query `"properties.apiKey`" -o tsv"
Write-Host ""
Write-Host "3. Update GitHub repository secrets with the tokens" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Deploy Function App code:" -ForegroundColor Yellow
Write-Host "   cd ../../api"
Write-Host "   func azure functionapp publish osullivanfarms-api"
Write-Host ""
Write-Host "5. Test the API:" -ForegroundColor Yellow
Write-Host "   Invoke-RestMethod -Uri `"$functionAppUrl/farm-statistics`" -Method GET"
Write-Host ""
Write-Host "🎉 Your SheepSheet infrastructure is ready!" -ForegroundColor Green
