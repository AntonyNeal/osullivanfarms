# Intelligent CI/CD Workflows

This repository uses an intelligent CI/CD system with environment-based deployments.

## Workflow Structure

### 1. **Continuous Integration** (`ci.yml`)

- **Triggers**: Push to `main`, `staging`, `develop` branches; PRs to `main`, `staging`
- **Purpose**: Quality gates for all code changes
- **Jobs**:
  - Frontend: Lint, format check, type check, build verification
  - API: Lint, test (if tests exist)
- **When it runs**: Every push and PR
- **Time**: ~2-3 minutes

### 2. **Deploy Frontend** (`azure-static-web-apps.yml`)

- **Triggers**:
  - Push to `main` with changes to `src/`, `public/`, `index.html`, `vite.config.ts`, `package.json`
  - Manual dispatch
- **Purpose**: Deploy production frontend to Azure Static Web Apps
- **Environment**: Production
- **URL**: https://witty-coast-049457e0f.3.azurestaticapps.net
- **Smart Features**:
  - Only deploys when frontend code changes
  - Ignores API changes
  - PR preview deployments

### 3. **Deploy API** (`azure-api.yml`)

- **Triggers**:
  - Push to `main` with changes to `api/` directory
  - Manual dispatch
- **Purpose**: Build and deploy API container to Azure Container Apps
- **Environment**: Production
- **URL**: https://osullivanfarms-api.wonderfulsky-3834edbe.eastus2.azurecontainerapps.io
- **Smart Features**:
  - Only deploys when API code changes
  - Builds Docker container
  - Tags with commit SHA + latest
  - Environment protection (requires approval if configured)

### 4. **Deploy to Staging** (`deploy-staging.yml`)

- **Triggers**: Push to `staging` branch
- **Purpose**: Deploy to staging environment for testing
- **Environment**: Staging
- **URL**: https://kind-smoke-078aaff0f.azurestaticapps.net
- **Smart Features**:
  - Separate staging environment
  - Same API as production (can be split later)
  - Add `[deploy-api]` to commit message to trigger API deployment

### 5. **Manual Deployment** (`manual-deploy.yml`)

- **Triggers**: Manual workflow dispatch only
- **Purpose**: On-demand deployments with full control
- **Options**:
  - Choose environment: production or staging
  - Choose component: frontend, api, or both
  - Skip quality checks (use carefully)
- **Use cases**:
  - Emergency hotfixes
  - Deploy specific components
  - Testing deployments

## Branch Strategy

```
main (production)
├── Protected branch
├── Requires PR reviews
├── CI checks must pass
└── Auto-deploys to production

staging
├── Testing environment
├── Deploys to staging slot
└── Merge to main after validation

develop
├── Feature integration
└── CI checks only
```

## Required GitHub Secrets

### Azure Credentials

- `AZURE_CREDENTIALS` - Service principal JSON for Azure authentication
- `AZURE_STATIC_WEB_APPS_API_TOKEN` - Production Static Web Apps token
- `AZURE_STATIC_WEB_APPS_API_TOKEN_STAGING` - Staging Static Web Apps token

### Container Registry

- `REGISTRY_USERNAME` - Azure Container Registry username
- `REGISTRY_PASSWORD` - Azure Container Registry password

### Database

- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password

### External Services

- `SENDGRID_API_KEY` - SendGrid API key for emails
- `SENDGRID_FROM_EMAIL` - Verified sender email

## Deployment Flow

### Automatic Deployment

1. Developer pushes to `main`
2. CI workflow runs quality checks
3. If frontend changed: Frontend deploys to production
4. If API changed: API builds and deploys to Container Apps
5. GitHub sends deployment notifications

### Staging Testing

1. Create feature branch
2. Push to `staging` branch
3. Staging deployment runs
4. Test on staging URL
5. Create PR to `main`
6. CI checks run on PR
7. After approval, merge to `main`
8. Production deployment runs

### Manual Emergency Deploy

1. Go to Actions tab
2. Select "Manual Deployment Tools"
3. Click "Run workflow"
4. Choose environment and component
5. Optionally skip checks for speed
6. Monitor deployment

## Smart Features

### Path-Based Triggers

- Frontend changes only deploy frontend
- API changes only deploy API
- Documentation changes don't trigger deployments

### Environment Protection

- Production environment can require approvals
- Staging is open for faster iteration
- Manual deployments tracked separately

### Rollback Strategy

- Each API deployment tagged with commit SHA
- Latest tag always points to current production
- Rollback by redeploying previous SHA

### Cost Optimization

- Workflows only run when needed
- Path filters prevent unnecessary builds
- Caching speeds up builds

## Monitoring Deployments

### GitHub Actions UI

- View all workflows: Actions tab
- Check deployment status: Environments tab
- Review logs: Click any workflow run

### Azure Portal

- Frontend: Azure Static Web Apps
- API: Container Apps
- Logs: Container Apps → Log stream

## Troubleshooting

### Workflow Not Triggering

- Check path filters match changed files
- Verify branch name is correct
- Check if workflow file has syntax errors

### Deployment Fails

- Check GitHub Secrets are set
- Verify Azure resources exist
- Review workflow logs for errors
- Check Azure resource quotas

### API Not Updating

- Verify Docker build succeeded
- Check image was pushed to registry
- Confirm Container App pulled new image
- Review Container App logs

## Best Practices

1. **Always test on staging first** before merging to main
2. **Use manual deploy** only for emergencies
3. **Monitor deployments** in GitHub Actions
4. **Check logs** if something doesn't work as expected
5. **Keep secrets updated** when rotating credentials
