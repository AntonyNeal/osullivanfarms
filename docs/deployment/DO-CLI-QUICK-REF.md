# DigitalOcean CLI - Quick Reference

## Setup (1 minute)

1. **Get your API token:**

   ```
   https://cloud.digitalocean.com/account/api/tokens → Generate New Token → Copy
   ```

2. **Set environment variable (choose one):**

   **Temporary (current session):**

   ```powershell
   $env:DO_API_TOKEN = "dop_v1_your_token_here"
   ```

   **Permanent (all sessions):**

   ```powershell
   # Edit your profile
   notepad $PROFILE

   # Add this line:
   $env:DO_API_TOKEN = "dop_v1_your_token_here"

   # Save and reload
   . $PROFILE
   ```

## Quick Commands

```powershell
# Navigate to project
cd c:\Users\julia\sw_website

# List your apps
.\scripts\do-cli.ps1 -Command "apps list"

# List databases
.\scripts\do-cli.ps1 -Command "databases list"

# Get database connection details
.\scripts\do-cli.ps1 -Command "databases get pg-xyz-1"

# Get account info
.\scripts\do-cli.ps1 -Command "account get"

# Get help
.\scripts\do-cli.ps1 -Command "help"
```

## Create an Alias (optional)

```powershell
# Add to your profile:
notepad $PROFILE

# Add:
Set-Alias -Name do -Value "c:\Users\julia\sw_website\scripts\do-cli.ps1"

# Then use:
do -Command "apps list"
do -Command "databases list"
```

## Next: Deploy Booking Backend

Once you have the CLI working:

1. **Get your database connection info:**

   ```powershell
   do -Command "databases list"
   do -Command "databases get [database-id]"
   ```

2. **Create the booking database schema** (see TECHNICAL-ANALYSIS-REPORT.md)

3. **Deploy booking API function** (see Phase 1 roadmap)

4. **Wire frontend to backend** (update BookingForm.tsx)

## Troubleshooting

| Problem                | Solution                                      |
| ---------------------- | --------------------------------------------- |
| "DO_API_TOKEN not set" | Run: `$env:DO_API_TOKEN = "your_token"`       |
| "401 Unauthorized"     | Token expired → get new one from DO console   |
| "No results found"     | Token valid but no resources in that category |
| Script not found       | Use full path: `.\scripts\do-cli.ps1`         |

---

**Full setup guide:** See `DO-CLI-SETUP.md`

**Technical roadmap:** See `TECHNICAL-ANALYSIS-REPORT.md`
