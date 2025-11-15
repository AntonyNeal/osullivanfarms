# Azure PostgreSQL Database Setup for SheepSheet

## Option 1: Azure Database for PostgreSQL (Recommended for Production)

### 1. Create PostgreSQL Flexible Server via Azure Portal

```bash
# Set variables
$RESOURCE_GROUP = "osullivanfarms-rg"
$LOCATION = "australiaeast"
$DB_SERVER_NAME = "osullivanfarms-db"
$DB_NAME = "sheepsheet"
$ADMIN_USER = "sheepsheetadmin"
$ADMIN_PASSWORD = "Your-Secure-Password-123!"  # Change this!

# Create PostgreSQL Flexible Server
az postgres flexible-server create `
  --resource-group $RESOURCE_GROUP `
  --name $DB_SERVER_NAME `
  --location $LOCATION `
  --admin-user $ADMIN_USER `
  --admin-password $ADMIN_PASSWORD `
  --sku-name Standard_B1ms `
  --tier Burstable `
  --version 14 `
  --storage-size 32 `
  --public-access 0.0.0.0

# Create database
az postgres flexible-server db create `
  --resource-group $RESOURCE_GROUP `
  --server-name $DB_SERVER_NAME `
  --database-name $DB_NAME

# Configure firewall to allow Azure services
az postgres flexible-server firewall-rule create `
  --resource-group $RESOURCE_GROUP `
  --name $DB_SERVER_NAME `
  --rule-name AllowAzureServices `
  --start-ip-address 0.0.0.0 `
  --end-ip-address 0.0.0.0
```

### 2. Get Connection String

```bash
# Get connection details
az postgres flexible-server show `
  --resource-group $RESOURCE_GROUP `
  --name $DB_SERVER_NAME `
  --query "{fqdn:fullyQualifiedDomainName}" -o table
```

Connection string format:

```
postgresql://{admin_user}:{admin_password}@{server_name}.postgres.database.azure.com:5432/{db_name}?sslmode=require
```

Example:

```
postgresql://sheepsheetadmin:Your-Secure-Password-123!@osullivanfarms-db.postgres.database.azure.com:5432/sheepsheet?sslmode=require
```

### 3. Initialize Database Schema

Using Azure Cloud Shell or local PostgreSQL client:

```bash
# Connect to database
psql "postgresql://sheepsheetadmin@osullivanfarms-db:Your-Secure-Password-123!@osullivanfarms-db.postgres.database.azure.com:5432/sheepsheet?sslmode=require"

# Run schema file
\i db/schema-sheepsheet.sql

# Or pipe from file
psql "postgresql://..." < db/schema-sheepsheet.sql
```

### 4. Configure Static Web App Environment Variables

In Azure Portal:

1. Go to your Static Web App (witty-coast-049457e0f or kind-smoke-078aaff0f)
2. Navigate to **Configuration** → **Application settings**
3. Add the following:

```
DATABASE_URL=postgresql://sheepsheetadmin:{password}@osullivanfarms-db.postgres.database.azure.com:5432/sheepsheet?sslmode=require
DB_HOST=osullivanfarms-db.postgres.database.azure.com
DB_PORT=5432
DB_NAME=sheepsheet
DB_USER=sheepsheetadmin
DB_PASSWORD={your-password}
DB_SSL=true
```

### 5. Cost Optimization

**Burstable Tier Pricing (B1ms):**

- ~$12-15 USD/month
- 1 vCore, 2 GB RAM
- 32 GB storage
- Good for development and small production workloads

**To reduce costs further:**

```bash
# Stop server when not in use (saves ~70%)
az postgres flexible-server stop `
  --resource-group $RESOURCE_GROUP `
  --name $DB_SERVER_NAME

# Start when needed
az postgres flexible-server start `
  --resource-group $RESOURCE_GROUP `
  --name $DB_SERVER_NAME
```

---

## Option 2: Free Tier PostgreSQL (Supabase/Neon)

### Supabase (Recommended for Free Tier)

1. Sign up at https://supabase.com
2. Create new project
3. Copy connection string from Settings → Database
4. Run schema via Supabase SQL Editor or psql

**Connection String Example:**

```
postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

### Neon (Serverless PostgreSQL)

1. Sign up at https://neon.tech
2. Create project in Australia region if available
3. Copy connection string
4. Run schema

**Free Tier Limits:**

- 3 projects
- 512 MB storage per project
- Good for development

---

## Database Client Tools

### Local Development with psql

```powershell
# Install PostgreSQL client (Windows)
winget install PostgreSQL.PostgreSQL

# Connect to Azure database
psql "postgresql://sheepsheetadmin@osullivanfarms-db:password@osullivanfarms-db.postgres.database.azure.com:5432/sheepsheet?sslmode=require"
```

### GUI Tools

**Azure Data Studio:**

```powershell
winget install Microsoft.AzureDataStudio
```

**pgAdmin:**

```powershell
winget install pgAdmin.pgAdmin
```

---

## API Connection Configuration

### Update API to use PostgreSQL

Install PostgreSQL driver:

```powershell
cd api
npm install pg
```

Create `api/db.js`:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.DB_SSL === 'true'
      ? {
          rejectUnauthorized: false,
        }
      : false,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
```

### Environment Variables

Update `api/.env`:

```env
DATABASE_URL=postgresql://sheepsheetadmin:password@osullivanfarms-db.postgres.database.azure.com:5432/sheepsheet?sslmode=require
DB_SSL=true
```

---

## Security Best Practices

1. **Use Azure Key Vault for secrets:**

```bash
az keyvault create `
  --name osullivanfarms-vault `
  --resource-group $RESOURCE_GROUP `
  --location $LOCATION

az keyvault secret set `
  --vault-name osullivanfarms-vault `
  --name db-connection-string `
  --value "postgresql://..."
```

2. **Restrict network access:**

```bash
# Only allow Static Web App IP
az postgres flexible-server firewall-rule create `
  --resource-group $RESOURCE_GROUP `
  --name $DB_SERVER_NAME `
  --rule-name AllowStaticWebApp `
  --start-ip-address {static-web-app-ip} `
  --end-ip-address {static-web-app-ip}
```

3. **Enable backup:**

```bash
az postgres flexible-server parameter set `
  --resource-group $RESOURCE_GROUP `
  --server-name $DB_SERVER_NAME `
  --name backup_retention_days `
  --value 7
```

---

## Monitoring & Maintenance

### Query Database Size

```sql
SELECT
  pg_size_pretty(pg_database_size('sheepsheet')) as database_size;
```

### View Active Connections

```sql
SELECT * FROM pg_stat_activity;
```

### Backup Database

```bash
pg_dump "postgresql://..." > backup_$(date +%Y%m%d).sql
```

---

## Migration Path

1. ✅ Create Azure PostgreSQL server
2. ✅ Run schema-sheepsheet.sql
3. ✅ Test connection from local API
4. ✅ Update API endpoints to use database
5. ✅ Configure Static Web App environment variables
6. ✅ Deploy and test

## Next Steps

Run the PowerShell commands above to:

1. Create the PostgreSQL server in your Azure Resource Group
2. Initialize the schema
3. Configure your API to connect
4. Test with the sample data included in the schema
