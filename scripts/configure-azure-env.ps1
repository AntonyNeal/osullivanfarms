# Configure Azure Static Web Apps Environment Variables

Write-Host "🔧 Configuring Azure Static Web Apps with database connection..." -ForegroundColor Cyan

$DATABASE_URL = "postgresql://sheepsheetadmin:SheepSheet2025!@osullivanfarms-db.postgres.database.azure.com:5432/sheepsheet?sslmode=require"
$RESOURCE_GROUP = "osullivanfarms-rg"

# Production environment
Write-Host "`n📦 Updating PRODUCTION environment (osullivanfarms)..." -ForegroundColor Green
az staticwebapp appsettings set `
  --name osullivanfarms `
  --resource-group $RESOURCE_GROUP `
  --setting-names DATABASE_URL="$DATABASE_URL"

if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ Production environment configured successfully!" -ForegroundColor Green
} else {
  Write-Host "❌ Failed to configure production environment" -ForegroundColor Red
}

# Staging environment
Write-Host "`n📦 Updating STAGING environment (osullivanfarms-staging)..." -ForegroundColor Yellow
az staticwebapp appsettings set `
  --name osullivanfarms-staging `
  --resource-group $RESOURCE_GROUP `
  --setting-names DATABASE_URL="$DATABASE_URL"

if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ Staging environment configured successfully!" -ForegroundColor Green
} else {
  Write-Host "❌ Failed to configure staging environment" -ForegroundColor Red
}

Write-Host "`n🎉 Configuration complete!" -ForegroundColor Cyan
Write-Host "The DATABASE_URL environment variable has been set in both environments."
Write-Host "The API will now connect to: osullivanfarms-db.postgres.database.azure.com"
