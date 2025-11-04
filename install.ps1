# Installation Script for SW Website
# Run with: .\install.ps1

Write-Host "Setting up SW Website..." -ForegroundColor Cyan
Write-Host ""

# Check Node.js version
Write-Host "Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Node.js is not installed. Please install Node.js 20+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}
Write-Host "Node.js $nodeVersion detected" -ForegroundColor Green
Write-Host ""

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "Frontend dependencies installed" -ForegroundColor Green
Write-Host ""

# Install API dependencies
Write-Host "Installing API dependencies..." -ForegroundColor Yellow
Set-Location api
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install API dependencies" -ForegroundColor Red
    exit 1
}
Set-Location ..
Write-Host "API dependencies installed" -ForegroundColor Green
Write-Host ""

# Create .env file if it doesn't exist
if (-Not (Test-Path .env)) {
    Write-Host "Creating .env file from example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host ".env file created - please update with your values" -ForegroundColor Green
} else {
    Write-Host ".env file already exists" -ForegroundColor Blue
}
Write-Host ""

# Initialize Husky
Write-Host "Setting up Git hooks..." -ForegroundColor Yellow
npm run prepare
if ($LASTEXITCODE -eq 0) {
    Write-Host "Git hooks configured" -ForegroundColor Green
} else {
    Write-Host "WARNING: Git hooks setup skipped (Git may not be initialized)" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Update .env file with your configuration"
Write-Host "  2. Run 'npm run dev' to start the frontend"
Write-Host "  3. Run 'cd api && npm run dev' to start the API (in a separate terminal)"
Write-Host ""
Write-Host "For more information, see README.md and DEVELOPMENT.md" -ForegroundColor Cyan
