# Database Connection Details

## Azure PostgreSQL Flexible Server

**Status:** ✅ Deployed and Schema Initialized

### Connection Information

```
Host:     osullivanfarms-db.postgres.database.azure.com
Port:     5432
Database: sheepsheet
Username: sheepsheetadmin
Password: SheepSheet2025!
SSL Mode: require
```

### Connection String

```
postgresql://sheepsheetadmin:SheepSheet2025!@osullivanfarms-db.postgres.database.azure.com:5432/sheepsheet?sslmode=require
```

### Environment Variable Format

```bash
DATABASE_URL="postgresql://sheepsheetadmin:SheepSheet2025!@osullivanfarms-db.postgres.database.azure.com:5432/sheepsheet?sslmode=require"
```

## Schema Status

✅ **Deployed:** November 16, 2025

### Tables Created:
- `mobs` - Core mob tracking with breeding lifecycle
- `mob_history` - Audit trail for changes
- `paddocks` - Location management
- `breeding_events` - Event logging with JSONB data
- `farm_settings` - Configuration

### Views Created:
- `mob_kpi_summary` - Calculated KPIs per mob
- `farm_statistics` - Farm-wide aggregates

### Sample Data:
- 2 sample mobs (Merino Ewes, Dohne Maidens)
- 3 sample paddocks

## Next Steps

1. ✅ Database created and schema deployed
2. ⏳ Create API endpoints to connect to database
3. ⏳ Update frontend to use real API data
4. ⏳ Add database connection string to Azure Static Web Apps environment variables
5. ⏳ Test full stack integration

## Firewall Rules

- **DevMachine:** 159.196.168.42 (your current IP)
- **AllowAllWindowsAzureIps:** 0.0.0.0 (for Azure services)

**Note:** Your IP is whitelisted. If you change networks, add the new IP via:
```powershell
az postgres flexible-server firewall-rule create \
  --resource-group osullivanfarms-rg \
  --name osullivanfarms-db \
  --rule-name "NewLocation" \
  --start-ip-address <YOUR_NEW_IP> \
  --end-ip-address <YOUR_NEW_IP>
```
