# Quick Start Checklist - Claire Hamilton Booking System

Complete deployment checklist for getting the booking system live in production.

**Estimated Total Time: 45-60 minutes**

---

## Pre-Deployment (5 minutes)

- [ ] **DigitalOcean Account**: Sign up at https://digitalocean.com with billing enabled
- [ ] **GitHub Repository**: Forked or connected to your DigitalOcean account
- [ ] **SendGrid Account**: Created at https://sendgrid.com with verified sender domain
- [ ] **Domain Name**: Registered and ready (e.g., clairehamilton.com.au)

---

## Phase 1: Database Setup (15 minutes)

### Database Creation

- [ ] **Step 1**: Go to [DigitalOcean Dashboard](https://cloud.digitalocean.com/)
- [ ] **Step 2**: Click **Databases** → **Create Database**
- [ ] **Step 3**: Select PostgreSQL 15, choose region (Sydney recommended)
- [ ] **Step 4**: Set name to `claire-booking-db`
- [ ] **Step 5**: Wait for cluster to initialize (5-10 minutes)

### Schema Deployment

- [ ] **Step 6**: Copy PostgreSQL connection string from DigitalOcean dashboard
- [ ] **Step 7**: Open PowerShell and run:
  ```powershell
  cd c:\Users\julia\sw_website
  psql "your_connection_string_here?sslmode=require" -f db/schema.sql
  ```
- [ ] **Step 8**: Verify deployment by checking tables exist:
  ```sql
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public' ORDER BY table_name;
  ```
  Expected tables: `ab_test_results`, `bookings`, `conversions`, `email_logs`, `payments`, `user_sessions`, `schema_version`

---

## Phase 2: SendGrid Setup ✅ COMPLETED

- [x] **Step 1**: Log in to [SendGrid](https://app.sendgrid.com/)
- [x] **Step 2**: Go to **Settings** → **API Keys**
- [x] **Step 3**: Click **Create API Key** with "Full Access" permissions
- [x] **Step 4**: Copy API key (saved securely)
- [x] **Step 5**: Create verified sender (julian.dellabosca@gmail.com for testing)
- [x] **Step 6**: Authenticate domain `avaliable.pro`
- [x] **Step 7**: Add DNS records to Namecheap
- [x] **Step 8**: Verify domain authentication

**Current Configuration**:

- `SENDGRID_API_KEY`: Stored securely in environment variables
- `SENDGRID_FROM_EMAIL`: `bookings@avaliable.pro` (authenticated domain)
- `CLAIRE_NOTIFICATION_EMAIL`: `claire@avaliable.pro`

**Status**: ✅ Domain authenticated, excellent deliverability, professional sender address

---

## Phase 3: Environment Configuration ✅ COMPLETED

### Get Database Connection String

- [x] Go to DigitalOcean Database cluster
- [x] Click **Connection details** tab
- [x] Copy connection string (format: `postgresql://doadmin:pass@host:25060/defaultdb?sslmode=require`)

### Configure DigitalOcean App Platform

- [x] **Step 1**: Go to [App Platform](https://cloud.digitalocean.com/apps)
- [x] **Step 2**: Create or select your app
- [x] **Step 3**: Go to **Settings** → **Environment & Variables**
- [x] **Step 4**: Add these environment variables:

| Variable                    | Value                                | Status |
| --------------------------- | ------------------------------------ | ------ |
| `DATABASE_URL`              | Paste connection string from above   | ✅     |
| `SENDGRID_API_KEY`          | Your SendGrid API key from dashboard | ✅     |
| `SENDGRID_FROM_EMAIL`       | bookings@avaliable.pro               | ✅     |
| `CLAIRE_NOTIFICATION_EMAIL` | claire@avaliable.pro                 | ✅     |
| `ALLOWED_ORIGIN`            | https://clairehamilton.com.au        | ✅     |
| `VITE_API_BASE_URL`         | https://clairehamilton.com.au        | ✅     |
| `NODE_ENV`                  | production                           | ✅     |

- [x] **Step 5**: Click **Save** (App Platform will auto-redeploy)

**Deployment Completed**: November 7, 2025  
**Deployment ID**: ba288711-bd52-4606-aae7-f9823fe8a863  
**Status**: LIVE at https://avaliable.pro

---

## Phase 4: Deploy Backend (5 minutes)

### Push Code to GitHub

- [ ] **Step 1**: Open PowerShell
- [ ] **Step 2**: Navigate to project:
  ```powershell
  cd c:\Users\julia\sw_website
  ```
- [ ] **Step 3**: Check status:
  ```powershell
  git status
  ```
- [ ] **Step 4**: If changes exist, commit:
  ```powershell
  git add .
  git commit -m "Configure production environment"
  ```
- [ ] **Step 5**: Push to GitHub:
  ```powershell
  git push origin main
  ```

### Verify Deployment

- [ ] **Step 6**: Go to App Platform dashboard
- [ ] **Step 7**: Click your app
- [ ] **Step 8**: Watch **Deployments** tab until status shows "Active"
- [ ] **Step 9**: Verify all functions deployed:
  - [ ] create-booking
  - [ ] register-session
  - [ ] get-analytics

---

## Phase 5: Testing (15 minutes)

### Quick API Test

**Using PowerShell**:

```powershell
# Test booking creation
$headers = @{
    "Content-Type" = "application/json"
    "Origin" = "https://clairehamilton.com.au"
}

$body = @{
    name = "Test User"
    email = "test@example.com"
    phone = "0412345678"
    date = "2025-03-15"
    time = "14:00"
    bookingType = "30-minute consult"
    notes = "Test booking"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "https://clairehamilton.com.au/api/bookings" `
    -Method POST `
    -Headers $headers `
    -Body $body

$response.Content | ConvertFrom-Json | Format-List
```

### Email Verification

- [ ] **Step 1**: Submit test booking through the form (or use PowerShell above)
- [ ] **Step 2**: Check test email inbox for confirmation email within 1 minute
- [ ] **Step 3**: Check Claire's email for notification
- [ ] **Step 4**: Verify both emails contain:
  - ✅ Confirmation number (format: CH-YYYYMMDD-###)
  - ✅ Booking details
  - ✅ Professional formatting

### Database Verification

```sql
-- Query booking
SELECT * FROM bookings ORDER BY created_at DESC LIMIT 1;

-- Query session
SELECT * FROM user_sessions ORDER BY created_at DESC LIMIT 1;

-- Query email logs
SELECT * FROM email_logs ORDER BY created_at DESC LIMIT 2;
```

---

## Phase 6: Analytics Verification (5 minutes)

### Test Analytics Endpoint

```powershell
$headers = @{"Origin" = "https://clairehamilton.com.au"}

$response = Invoke-WebRequest -Uri "https://clairehamilton.com.au/api/analytics/bookings?groupBy=utm_source" `
    -Method GET `
    -Headers $headers

$response.Content | ConvertFrom-Json | Format-List
```

Expected output structure:

```json
{
  "period": { "start": "...", "end": "..." },
  "groupBy": "utm_source",
  "data": [
    { "utm_source": "direct", "sessions": 1, "bookings": 1, "conversion_rate": 100 }
  ],
  "totals": { ... }
}
```

---

## Post-Deployment Verification ✅

- [ ] Booking form submits without errors
- [ ] Confirmation emails received within 1 minute
- [ ] Claire notification emails received
- [ ] Database records created correctly
- [ ] Analytics endpoint returns data
- [ ] No errors in DigitalOcean function logs
- [ ] HTTPS working (check lock icon in browser)
- [ ] Responsive design on mobile/tablet

---

## Security Checklist ✅

- [ ] Database SSL enabled (`sslmode=require` in connection string)
- [ ] Secrets stored in DigitalOcean App Platform (not in code)
- [ ] `.env` files excluded from git (.gitignore)
- [ ] API validates all inputs (Joi schemas)
- [ ] SQL queries use parameterized statements
- [ ] CORS restricted to your domain
- [ ] SendGrid API key has minimal permissions
- [ ] HTTPS enforced for all API calls

---

## Common Issues & Solutions

### "Database connection failed"

- ✅ Verify `DATABASE_URL` in App Platform environment variables
- ✅ Check PostgreSQL cluster is "running" in DigitalOcean
- ✅ Ensure connection string ends with `?sslmode=require`
- ✅ Try connecting locally with psql to verify

### "Email not being sent"

- ✅ Verify `SENDGRID_API_KEY` is correct
- ✅ Check `SENDGRID_FROM_EMAIL` is a verified sender in SendGrid
- ✅ Go to SendGrid Activity → Mail Activity to see delivery status
- ✅ Check DigitalOcean function logs for SendGrid errors

### "CORS error on API calls"

- ✅ Verify `ALLOWED_ORIGIN` matches your domain exactly
- ✅ Check browser console for specific CORS error
- ✅ Ensure request has correct `Origin` header

### "Booking validation errors"

- ✅ Email must be valid format: `user@domain.com`
- ✅ Phone must be Australian format: `0X XXXX XXXX` or `04XX XXX XXX`
- ✅ Date must be ISO format: `YYYY-MM-DD` and in the future
- ✅ Time must be `HH:MM` format

---

## What's Next After Deployment

1. **Monitor Performance**
   - Watch DigitalOcean logs for errors
   - Set up alerts for high error rates
   - Monitor API response times

2. **Test Complete Flow**
   - Follow [TESTING-GUIDE.md](./TESTING-GUIDE.md) for comprehensive testing
   - Test on multiple devices (mobile, tablet, desktop)
   - Test with different UTM parameters

3. **Optimize Analytics**
   - Set up Google Analytics 4 integration
   - Track conversion funnel
   - Monitor attribution by source/medium/campaign

4. **Phase 2 Features** (Optional)
   - Implement payment integration (Eway/PayID)
   - Set up A/B testing experiments
   - Add advanced privacy analytics

5. **Production Hardening** (Recommended)
   - Implement rate limiting on booking endpoint
   - Set up database backups
   - Add request logging and monitoring
   - Configure CDN for static assets

---

## Resource Links

| Task                   | Link                                                     |
| ---------------------- | -------------------------------------------------------- |
| Full Deployment Guide  | [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)             |
| Comprehensive Testing  | [TESTING-GUIDE.md](./TESTING-GUIDE.md)                   |
| Backend Architecture   | [BACKEND-IMPLEMENTATION.md](./BACKEND-IMPLEMENTATION.md) |
| DigitalOcean Dashboard | https://cloud.digitalocean.com/                          |
| SendGrid Dashboard     | https://app.sendgrid.com/                                |
| PostgreSQL Docs        | https://www.postgresql.org/docs/                         |
| DigitalOcean Docs      | https://docs.digitalocean.com/                           |

---

## Support

If you encounter issues:

1. Check the relevant guide above (DEPLOYMENT-GUIDE.md or TESTING-GUIDE.md)
2. Review DigitalOcean function logs for error details
3. Check SendGrid Activity dashboard for email delivery status
4. Query database directly to verify records are being created
5. Review browser console for client-side errors

---

## Success Criteria ✅

After completing this checklist, you should have:

✅ PostgreSQL database with complete schema deployed
✅ All API endpoints (create-booking, register-session, get-analytics) functional
✅ Email notifications working (customer confirmation + Claire notification)
✅ UTM tracking capturing user attribution data
✅ Analytics endpoint aggregating conversion data
✅ Booking form collecting submissions with validation
✅ Complete booking flow from website visitor to database record to emails

**Estimated time to completion: 45-60 minutes**

---

**Deployment completed!** 🚀 Your Claire Hamilton booking system is now live!
