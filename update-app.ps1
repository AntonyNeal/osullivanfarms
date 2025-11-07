# Update DigitalOcean App with SendGrid Environment Variables
Write-Host "`n=== Updating DigitalOcean App ===" -ForegroundColor Cyan

$token = (Get-Content .env | Select-String "DO_API_TOKEN" | ForEach-Object { $_.ToString().Split('=')[1] }).Trim()
$appId = "d1c88e97-20a1-4b99-a582-11828f840b64"

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "Fetching app..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "https://api.digitalocean.com/v2/apps/$appId" -Headers $headers -Method Get
    $spec = $response.app.spec
    
    Write-Host "App: $($spec.name)" -ForegroundColor Green
    
    $apiService = $spec.services | Where-Object { $_.name -eq "api" }
    
    if ($apiService) {
        Write-Host "Found API service" -ForegroundColor Green
        
        # Remove existing SendGrid vars
        $apiService.envs = @($apiService.envs | Where-Object { 
            $_.key -notmatch "SENDGRID|CLAIRE_NOTIFICATION" 
        })
        
        # Read SendGrid API key from .env
        $sendgridApiKey = (Get-Content .env | Select-String "SENDGRID_API_KEY" | ForEach-Object { $_.ToString().Split('=')[1] }).Trim()
        
        # Add new vars
        $apiService.envs += @{
            key = "SENDGRID_API_KEY"
            value = $sendgridApiKey
            scope = "RUN_AND_BUILD_TIME"
            type = "SECRET"
        }
        
        $apiService.envs += @{
            key = "SENDGRID_FROM_EMAIL"
            value = "bookings@clairehamilton.com.au"
            scope = "RUN_AND_BUILD_TIME"
        }
        
        $apiService.envs += @{
            key = "CLAIRE_NOTIFICATION_EMAIL"
            value = "claire@clairehamilton.com.au"
            scope = "RUN_AND_BUILD_TIME"
        }
            value = "claire@avaliable.pro"
            scope = "RUN_AND_BUILD_TIME"
        }
        
        Write-Host "Added SendGrid vars" -ForegroundColor Green
        
        $updateBody = @{ spec = $spec } | ConvertTo-Json -Depth 20
        
        Write-Host "Updating..." -ForegroundColor Yellow
        
        $updateResponse = Invoke-RestMethod -Uri "https://api.digitalocean.com/v2/apps/$appId" -Headers $headers -Method Put -Body $updateBody
        
        Write-Host "`nSUCCESS!" -ForegroundColor Green
        Write-Host "Deployment starting..." -ForegroundColor Yellow
        Write-Host "https://cloud.digitalocean.com/apps/$appId/deployments" -ForegroundColor Blue
        
    } else {
        Write-Host "ERROR: API service not found" -ForegroundColor Red
    }
    
} catch {
    Write-Host "`nFAILED" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Gray
    }
    Write-Host "`nAdd manually:" -ForegroundColor Yellow
    Write-Host "https://cloud.digitalocean.com/apps/$appId/settings" -ForegroundColor Blue
}
