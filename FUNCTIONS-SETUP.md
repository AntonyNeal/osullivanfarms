# Azure Functions Deployment Setup

## Function App Details

- **Name**: osullivanfarms-api
- **URL**: https://osullivanfarms-api.azurewebsites.net
- **Resource Group**: osullivanfarms-rg
- **Runtime**: Node.js 20 on Linux

## Required GitHub Secret

Add the Function App publish profile to GitHub Secrets:

### Get Publish Profile

```powershell
az functionapp deployment list-publishing-profiles --name osullivanfarms-api --resource-group osullivanfarms-rg --xml
```

### Add to GitHub

1. Go to: https://github.com/AntonyNeal/osullivanfarms/settings/secrets/actions
2. Click "New repository secret"
3. Name: `AZURE_FUNCTIONAPP_PUBLISH_PROFILE`
4. Value: Paste the entire XML output from the command above
5. Click "Add secret"

## Deployment Workflow

### Automatic Deployment

The API automatically deploys when:

- Changes pushed to `main` branch
- Files in `api/` directory changed
- Workflow: `.github/workflows/azure-static-web-apps.yml`

### Manual Deployment

To deploy manually:

```powershell
cd api
func azure functionapp publish osullivanfarms-api
```

## API Endpoints

### Production

- **Base URL**: https://osullivanfarms-api.azurewebsites.net/api
- **Health**: https://osullivanfarms-api.azurewebsites.net/api/health
- **Routes**: /bookings, /status, /payments, /mobs

### Local Development

```powershell
cd api
npm install
func start
```

- **Local URL**: http://localhost:7071/api

## Environment Variables

Configure in Azure Portal → Function App → Configuration:

- `NODE_ENV`: production
- `DB_HOST`: osullivanfarms-db.postgres.database.azure.com
- `DB_PORT`: 5432
- `DB_NAME`: osullivanfarms
- `DB_USER`: osullivanadmin
- `DB_PASSWORD`: [Your database password]
- `DB_SSL`: require
- `SENDGRID_API_KEY`: [Your SendGrid key]
- `SENDGRID_FROM_EMAIL`: [Your verified sender]

## Testing

After deployment, test the API:

```powershell
curl https://osullivanfarms-api.azurewebsites.net/api/health
```

Expected response:

```json
{
  "message": "O'Sullivan Farms API",
  "version": "1.0.0",
  "endpoints": ["/health", "/bookings", "/status", "/payments", "/mobs"]
}
```

## Troubleshooting

### View Logs

```powershell
az webapp log tail --name osullivanfarms-api --resource-group osullivanfarms-rg
```

### Check Function Status

```powershell
az functionapp show --name osullivanfarms-api --resource-group osullivanfarms-rg --query "{state:state, defaultHostName:defaultHostName}"
```

### Redeploy

```powershell
az functionapp restart --name osullivanfarms-api --resource-group osullivanfarms-rg
```

## After Setup

Once the secret is added:

1. Delete this file: `rm FUNCTIONS-SETUP.md`
2. Commit any API changes to trigger deployment
3. Monitor deployment in GitHub Actions

The API will deploy automatically when API files change!
