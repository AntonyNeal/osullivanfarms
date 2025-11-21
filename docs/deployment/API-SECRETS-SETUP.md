# Azure API Deployment - Required Secrets

This document lists all the GitHub Secrets that need to be configured for the API deployment workflow.

## How to Add Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret below

## Required Secrets

### Azure Authentication

#### `AZURE_CREDENTIALS`

Azure service principal credentials for authenticating with Azure.

**How to get this:**

```bash
az ad sp create-for-rbac --name "osullivanfarms-gh-actions" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/osullivanfarms-rg \
  --sdk-auth
```

The output JSON should be added as the secret value.

---

### Database Configuration

#### `DB_HOST`

PostgreSQL server hostname

- **Example**: `osullivanfarms-db.postgres.database.azure.com`
- **Get from**: Terraform output `database_host` or Azure Portal

#### `DB_PORT`

PostgreSQL port

- **Value**: `5432`

#### `DB_NAME`

Database name

- **Example**: `osullivanfarms`

#### `DB_USER`

Database admin username

- **Example**: `dbadmin`
- **Match with**: Terraform variable `db_admin_username`

#### `DB_PASSWORD`

Database admin password

- **Security**: Use a strong password
- **Match with**: Terraform variable `db_admin_password`

---

### Email Service (SendGrid)

#### `SENDGRID_API_KEY`

SendGrid API key for sending emails

- **Get from**: [SendGrid Dashboard](https://app.sendgrid.com/settings/api_keys)
- **Required for**: Booking confirmations, notifications

#### `SENDGRID_FROM_EMAIL`

Verified sender email address

- **Example**: `noreply@yourdomain.com`
- **Must be**: Verified in SendGrid

---

## Verification

After adding all secrets, you can verify by:

1. Running the workflow manually via **Actions** → **Deploy API to Azure Container Apps** → **Run workflow**
2. Check the workflow logs for any missing secrets errors
3. Test the API endpoint after deployment

## Next Steps

1. ✅ Add all required secrets to GitHub
2. ✅ Run `terraform apply` to provision Azure infrastructure
3. ✅ Trigger the API deployment workflow
4. ✅ Update `.env.development` with the new API URL (from Terraform outputs)
