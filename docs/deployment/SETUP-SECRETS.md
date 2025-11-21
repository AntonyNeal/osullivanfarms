# GitHub Secrets Configuration

Add these secrets to: https://github.com/AntonyNeal/osullivanfarms/settings/secrets/actions

## Container Registry Secrets

```
REGISTRY_USERNAME
osullivanfarmsacr
```

```
REGISTRY_PASSWORD
[REDACTED]
```

## Database Secrets

```
DB_HOST
osullivanfarms-db.postgres.database.azure.com
```

```
DB_PORT
5432
```

```
DB_NAME
osullivanfarms
```

```
DB_USER
osullivanadmin
```

```
DB_PASSWORD
[Your database password from initial setup]
```

## SendGrid Secrets

```
SENDGRID_API_KEY
[Your SendGrid API key]
```

```
SENDGRID_FROM_EMAIL
[Your verified sender email]
```

## Azure Credentials

Run this command to get the service principal JSON:

```powershell
az ad sp create-for-rbac --name "osullivanfarms-github" --role contributor --scopes /subscriptions/47b5552f-0eb8-4462-97e7-cd67e8e660b8/resourceGroups/osullivanfarms-rg --sdk-auth
```

Add the entire JSON output as secret `AZURE_CREDENTIALS`

## Steps to Add Secrets

1. Go to: https://github.com/AntonyNeal/osullivanfarms/settings/secrets/actions
2. Click "New repository secret"
3. Enter the secret name (e.g., `REGISTRY_USERNAME`)
4. Paste the value
5. Click "Add secret"
6. Repeat for all secrets

## After Adding Secrets

Delete this file:

```powershell
Remove-Item SETUP-SECRETS.md
```

Then test the deployment:

```powershell
# Push to main to trigger deployment
git add .
git commit -m "Configure CI/CD workflows"
git push
```

Or use manual deployment:

1. Go to Actions tab
2. Select "Manual Deployment Tools"
3. Choose "production" and "api"
4. Click "Run workflow"
