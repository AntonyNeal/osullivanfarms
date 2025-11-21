# DigitalOcean CLI Setup Guide

## Overview

Since `doctl` isn't available on your system, this PowerShell wrapper provides CLI-like commands for managing your DigitalOcean infrastructure directly through the REST API.

## Quick Start

### Step 1: Get Your API Token

1. Go to https://cloud.digitalocean.com/account/api/tokens
2. Click "Generate New Token"
3. Name it: `pw-cli-token`
4. Select scopes: **Read** + **Write**
5. Copy the token (you'll only see it once)

### Step 2: Set Environment Variable

**Option A: Temporary (current session only)**

```powershell
$env:DO_API_TOKEN = "your_token_here"
```

**Option B: Permanent (all future sessions)**

Add to your PowerShell profile:

```powershell
# Edit your profile
notepad $PROFILE

# Add this line:
$env:DO_API_TOKEN = "your_token_here"

# Save and reload
. $PROFILE
```

### Step 3: Test the CLI

```powershell
cd c:\Users\julia\sw_website
.\scripts\do-cli.ps1 -Command "account get"
```

You should see your DigitalOcean account information.

## Available Commands

### Apps Management

```powershell
# List all apps
.\scripts\do-cli.ps1 -Command "apps list"

# Get details for specific app
.\scripts\do-cli.ps1 -Command "apps get sw-website-app-001"
```

### Database Management

```powershell
# List all databases
.\scripts\do-cli.ps1 -Command "databases list"

# Get details for specific database
.\scripts\do-cli.ps1 -Command "databases get pg-db-001"
```

### Functions Management

```powershell
# List all function namespaces
.\scripts\do-cli.ps1 -Command "functions list"
```

### Domain Management

```powershell
# List all domains
.\scripts\do-cli.ps1 -Command "domains list"
```

### Account Information

```powershell
# Get account details
.\scripts\do-cli.ps1 -Command "account get"
```

## Usage Examples

### Check Your Current Deployment

```powershell
# See all your apps
.\scripts\do-cli.ps1 -Command "apps list"

# Output:
# ID    Name           Status    Created
# ─────────────────────────────────────────
# xyz1  sw-website     active    2025-11-05
```

### Check Database Status

```powershell
.\scripts\do-cli.ps1 -Command "databases list"

# Output:
# ID         Name           Engine      Version  Status   Region
# ────────────────────────────────────────────────────────────────
# pg-xyz-1   sw_website_db  PostgreSQL  15       active   nyc3
```

### Get Connection Details

```powershell
# Get full database connection info
.\scripts\do-cli.ps1 -Command "databases get pg-xyz-1"

# Output shows:
# Host: ...
# Port: 25060
# User: doadmin
# Database: sw_website
```

## Creating an Alias

Make it easier to use by creating a PowerShell alias:

```powershell
# Add to your profile
notepad $PROFILE

# Add these lines:
Set-Alias -Name do -Value c:\Users\julia\sw_website\scripts\do-cli.ps1

# Save and reload profile
. $PROFILE

# Now you can use:
do -Command "apps list"
do -Command "databases list"
```

## Troubleshooting

### "API Error: 401 Unauthorized"

- ❌ Your API token is invalid or expired
- ✅ Generate a new token from https://cloud.digitalocean.com/account/api/tokens
- ✅ Make sure you copied the entire token (no extra spaces)

### "Error: DO_API_TOKEN environment variable not set"

- ✅ Run: `$env:DO_API_TOKEN = "your_token"`
- ✅ Or set it permanently in your PowerShell profile

### "The term 'do-cli.ps1' is not recognized"

- ✅ Use the full path: `.\scripts\do-cli.ps1`
- ✅ Or create an alias (see above)

### "Unexpected token '}' in expression"

- ✅ Make sure you're running PowerShell 5.1 or later
- ✅ Run: `$PSVersionTable.PSVersion`

## Next Steps

Once you have the CLI working:

1. **Check your current infrastructure:**

   ```powershell
   do -Command "apps list"
   do -Command "databases list"
   ```

2. **Get your database connection details:**

   ```powershell
   do -Command "databases get <database-id>"
   ```

3. **Create the booking database schema:**
   - Use the connection details above
   - Connect to PostgreSQL with pgAdmin or DBeaver
   - Run the SQL schema from the technical report

4. **Deploy your booking API:**
   - Create DigitalOcean Function for bookings
   - Test with sample requests
   - Wire frontend to new endpoint

## API Token Security

⚠️ **Important:** Never commit your API token to git!

```bash
# Make sure .gitignore includes environment files
echo "*.env" >> .gitignore
echo ".env.local" >> .gitignore
```

If you accidentally expose a token:

1. Go to https://cloud.digitalocean.com/account/api/tokens
2. Click the token and delete it
3. Generate a new token
4. Update your environment variable

## More Information

- DigitalOcean API Docs: https://docs.digitalocean.com/reference/api/
- PowerShell REST: https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-restmethod/

---

Once you've set up the CLI, you can start working on deploying the booking backend. See the technical analysis report for the full implementation roadmap.
