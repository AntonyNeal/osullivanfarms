# Azure Service Principal Setup Script
# Run this script to create the service principal for GitHub Actions

# Step 1: Login to Azure
Write-Host "Step 1: Logging in to Azure..." -ForegroundColor Cyan
az login

# Step 2: Get subscription ID
Write-Host "`nStep 2: Getting subscription ID..." -ForegroundColor Cyan
$subscriptionId = az account show --query id -o tsv
Write-Host "Subscription ID: $subscriptionId" -ForegroundColor Green

# Step 3: Check if resource group exists, create if not
Write-Host "`nStep 3: Checking resource group..." -ForegroundColor Cyan
$rgExists = az group exists --name osullivanfarms-rg
if ($rgExists -eq "false") {
    Write-Host "Creating resource group osullivanfarms-rg..." -ForegroundColor Yellow
    az group create --name osullivanfarms-rg --location eastus2
} else {
    Write-Host "Resource group osullivanfarms-rg already exists" -ForegroundColor Green
}

# Step 4: Create service principal
Write-Host "`nStep 4: Creating service principal..." -ForegroundColor Cyan
Write-Host "IMPORTANT: Copy the entire JSON output below!" -ForegroundColor Yellow
Write-Host "You will need to add this as AZURE_CREDENTIALS in GitHub Secrets" -ForegroundColor Yellow
Write-Host "`n========== COPY EVERYTHING BELOW ==========" -ForegroundColor Magenta

$credentials = az ad sp create-for-rbac `
  --name "osullivanfarms-github-actions" `
  --role contributor `
  --scopes "/subscriptions/$subscriptionId/resourceGroups/osullivanfarms-rg" `
  --sdk-auth

Write-Output $credentials

Write-Host "`n========== COPY EVERYTHING ABOVE ==========" -ForegroundColor Magenta

# Step 5: Instructions
Write-Host "`n`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. Copy the JSON output above" -ForegroundColor White
Write-Host "2. Go to: https://github.com/AntonyNeal/osullivanfarms/settings/secrets/actions" -ForegroundColor White
Write-Host "3. Click 'New repository secret'" -ForegroundColor White
Write-Host "4. Name: AZURE_CREDENTIALS" -ForegroundColor White
Write-Host "5. Value: Paste the entire JSON output" -ForegroundColor White
Write-Host "6. Click 'Add secret'" -ForegroundColor White
Write-Host "`n7. Then run Terraform to provision infrastructure:" -ForegroundColor White
Write-Host "   cd terraform/azure" -ForegroundColor Gray
Write-Host "   terraform init" -ForegroundColor Gray
Write-Host "   terraform apply" -ForegroundColor Gray

# Optional: Open browser to GitHub secrets page
$response = Read-Host "`nOpen GitHub Secrets page in browser? (y/n)"
if ($response -eq 'y') {
    Start-Process "https://github.com/AntonyNeal/osullivanfarms/settings/secrets/actions"
}
