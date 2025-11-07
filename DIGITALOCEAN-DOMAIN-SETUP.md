# Domain Management for DigitalOcean App Platform

## Your Current App: octopus-app

**Live URL:** https://octopus-app-tw5wu.ondigitalocean.app
**App ID:** d1c88e97-20a1-4b99-a582-11828f840b64

## Current Domains Configured

✅ **Live domains in DigitalOcean:**
1. **avaliable.pro** (Primary production domain)
2. **clairehamilton.com.au** (Client domain)
3. **clairehamilton.vip** (Alternative domain)
4. **prebooking.pro** (Booking subdomain)

## Add Additional Domain to octopus-app

## Step 1: Add Domain in DigitalOcean Console

1. **Go to your app:** https://cloud.digitalocean.com/apps/
2. **Click on `octopus-app`**
3. **Go to Settings tab**
4. **Scroll to "Domains" section**
5. **Click "Add Domain"**

### Add These Domains (one at a time):

**Domain 1: Root Domain**

```
Domain: prebooking.pro
Type: Primary
```

**Domain 2: Wildcard Subdomain**

```
Domain: *.prebooking.pro
Type: Alias
```

**Domain 3: WWW (optional)**

```
Domain: www.prebooking.pro
Type: Alias
```

## Step 2: DigitalOcean Will Show DNS Records

After adding each domain, DigitalOcean will display the DNS records you need to add.

**Example records (yours will be similar):**

For `prebooking.pro`:

```
Type: CNAME
Name: @
Value: octopus-app-tw5wu.ondigitalocean.app
```

For `*.prebooking.pro`:

```
Type: CNAME
Name: *
Value: octopus-app-xxxxx.ondigitalocean.app
```

**OR it might show A records:**

```
Type: A
Name: @
Value: 162.159.140.98 (example IP)
```

## Step 3: Add Records to Namecheap

1. **Go to Namecheap:** https://ap.www.namecheap.com/
2. **Domain List → prebooking.pro → Manage**
3. **Advanced DNS tab**
4. **Add the records DigitalOcean showed you**

### If DigitalOcean gave you CNAME records:

| Type  | Host | Value                                | TTL       |
| ----- | ---- | ------------------------------------ | --------- |
| CNAME | @    | octopus-app-xxxxx.ondigitalocean.app | Automatic |
| CNAME | \*   | octopus-app-xxxxx.ondigitalocean.app | Automatic |

### If DigitalOcean gave you A records:

| Type | Host | Value          | TTL       |
| ---- | ---- | -------------- | --------- |
| A    | @    | 162.159.140.98 | Automatic |
| A    | \*   | 162.159.140.98 | Automatic |

**Important:** Use the EXACT values DigitalOcean shows you!

## Step 4: Verify Domain in DigitalOcean

After adding DNS records to Namecheap:

1. **Go back to DigitalOcean → octopus-app → Settings → Domains**
2. **Wait 15-30 minutes for DNS propagation**
3. **Click "Verify DNS Configuration" button**
4. **Status should change to "Active"**

## Step 5: SSL Certificate

DigitalOcean will automatically provision an SSL certificate once DNS is verified.

**Check status:**

- Settings → Domains → Look for "Certificate Status: Active"
- Can take 15-30 minutes after DNS verification

## Step 6: Test It Works

```powershell
# Wait for DNS to propagate (15-30 minutes)
nslookup claire.prebooking.pro

# Should show the DigitalOcean IP or CNAME

# Test in browser
Start-Process "https://claire.prebooking.pro"
```

## Current App Info from Screenshot

- **App Name:** octopus-app
- **Status:** Healthy (green checkmark)
- **Current Domain:** clairehamilton.vip
- **Git:** Connected to your GitHub repo
- **Region:** SYDI (Sydney)
- **Public IPs:**
  - 162.159.140.98
  - 172.66.0.96

## Quick Reference

After everything is set up:

- **Main site:** https://prebooking.pro
- **Claire (subdomain):** https://claire.prebooking.pro
- **Claire (custom):** https://clairehamilton.vip (already working!)
- **API:** https://prebooking.pro/api/*

## Troubleshooting

### Domain won't verify in DigitalOcean

- Double-check DNS records in Namecheap exactly match DigitalOcean
- Wait longer (DNS can take up to 48 hours, usually 15-30 min)
- Try `nslookup prebooking.pro` to check propagation

### SSL certificate not provisioning

- Ensure domain is verified first
- Wait 15-30 minutes after verification
- Check Settings → Domains for certificate status

### Still getting errors

- Make sure Namecheap nameservers are set to Namecheap BasicDNS
- Clear your browser cache
- Try incognito/private browsing mode

## Next Steps

1. ✅ Add domains in DigitalOcean (Settings → Domains)
2. ✅ Copy the DNS records DigitalOcean shows
3. ✅ Add those records to Namecheap (Advanced DNS)
4. ⏳ Wait 15-30 minutes for DNS propagation
5. ✅ Verify DNS in DigitalOcean console
6. ⏳ Wait for SSL certificate (automatic)
7. ✅ Test `claire.prebooking.pro` in browser
8. 🎉 Done!

Your code is already deployed and ready - we just need to point the domain to it!
