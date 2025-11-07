# Update DigitalOcean App with SendGrid Environment Variables
Write-Host "`n=== Updating DigitalOcean App with SendGrid Config ===" -ForegroundColor Cyan

# Read API token from .env
$token = (Get-Content .env | Select-String "DO_API_TOKEN" | ForEach-Object { $_.ToString().Split('=')[1] }).Trim()
$appId = "d1c88e97-20a1-4b99-a582-11828f840b64"

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "Fetching current app configuration..." -ForegroundColor Yellow

try {
    # Get current app spec
    $response = Invoke-RestMethod -Uri "https://api.digitalocean.com/v2/apps/$appId" -Headers $headers -Method Get
    $spec = $response.app.spec
    
    Write-Host "Current app: $($spec.name)" -ForegroundColor Green
    
    # Find the API service
    $apiService = $spec.services | Where-Object { $_.name -eq "api" }
    
    if ($apiService) {
        Write-Host "Found 'api' service with $($apiService.envs.Count) existing env vars" -ForegroundColor Green
        
        # Read SendGrid API key from .env file
        $sendgridApiKey = (Get-Content .env | Select-String "SENDGRID_API_KEY" | ForEach-Object { $_.ToString().Split('=')[1] }).Trim()
        
        # Add SendGrid environment variables
        $sendgridVars = @(
            @{
                key = "SENDGRID_API_KEY"
                value = $sendgridApiKey
                scope = "RUN_AND_BUILD_TIME"
                type = "SECRET"
            },
            @{
                key = "SENDGRID_FROM_EMAIL"
                value = "bookings@clairehamilton.com.au"
                scope = "RUN_AND_BUILD_TIME"
            },
            @{
                key = "CLAIRE_NOTIFICATION_EMAIL"
                value = "claire@clairehamilton.com.au"
                scope = "RUN_AND_BUILD_TIME"
            }
        )
        
        # Remove any existing SendGrid vars first
        $apiService.envs = @($apiService.envs | Where-Object { 
            $_.key -notmatch "SENDGRID|CLAIRE_NOTIFICATION" 
        })
        
        # Add new SendGrid vars
        foreach ($var in $sendgridVars) {
            $apiService.envs += $var
        }
        
        Write-Host "Added 3 SendGrid environment variables" -ForegroundColor Green
        Write-Host "Total env vars now: $($apiService.envs.Count)" -ForegroundColor White
        
        # Prepare update body
        $updateBody = @{
            spec = $spec
        } | ConvertTo-Json -Depth 20
        
        Write-Host "`nSending update to DigitalOcean..." -ForegroundColor Yellow
        
        # Update the app
        $updateResponse = Invoke-RestMethod -Uri "https://api.digitalocean.com/v2/apps/$appId" `
            -Headers $headers `
            -Method Put `
            -Body $updateBody
        
        Write-Host "`n✓ SUCCESS! App updated successfully" -ForegroundColor Green
        Write-Host "✓ SendGrid environment variables added" -ForegroundColor Green
        Write-Host "✓ Deployment will start automatically" -ForegroundColor Green
        Write-Host "`nDeployment ID: $($updateResponse.deployment.id)" -ForegroundColor Cyan
        Write-Host "`nMonitor deployment at:" -ForegroundColor Yellow
        Write-Host "https://cloud.digitalocean.com/apps/$appId/deployments" -ForegroundColor Blue
        
    } else {
        Write-Host "ERROR: Could not find 'api' service in app spec" -ForegroundColor Red
    }
    
} catch {
    Write-Host "`n✗ FAILED to update app" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`nResponse:" -ForegroundColor Yellow
    Write-Host $_.ErrorDetails.Message -ForegroundColor Gray
    Write-Host "`nYou will need to add the variables manually in the dashboard:" -ForegroundColor Yellow
    Write-Host "https://cloud.digitalocean.com/apps/$appId/settings" -ForegroundColor Blue
}
