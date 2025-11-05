# Deployment Guide - Claire Hamilton Website

Complete step-by-step guide to deploy the booking system backend to DigitalOcean.

## Prerequisites

- DigitalOcean account with billing enabled
- PostgreSQL 15 managed database created
- DigitalOcean App Platform app created
- SendGrid account with verified sender domain
- GitHub repository connected to DigitalOcean App Platform

**Estimated Time: 30-45 minutes**

---

## Phase 1: Database Setup (10-15 minutes)

### Step 1: Create PostgreSQL Database

1. Go to [DigitalOcean Dashboard](https://cloud.digitalocean.com/)
2. Click **Databases** in the left sidebar
3. Click **Create Database**
4. Configuration:
   - **Engine**: PostgreSQL 15
   - **Version**: Latest 15.x
   - **Region**: Choose your nearest region (e.g., Sydney for Australia)
   - **Cluster Name**: `claire-booking-db`
   - **Number of nodes**: 1 (single node is fine for startup)
   - **DB Size**: Basic ($15/month - sufficient for startup)

5. Wait for the cluster to initialize (5-10 minutes)

### Step 2: Deploy Database Schema

Once PostgreSQL is ready:

1. From DigitalOcean Dashboard, click your database cluster
2. Click the **Connection details** tab
3. Copy the **Connection string** (looks like: `postgresql://doadmin:xxxxx@db-xxxxx.db.ondigitalocean.com:25060/defaultdb?sslmode=require`)

4. **Option A: Using psql CLI** (recommended)
   ```powershell
   # Install PostgreSQL client if needed
   choco install postgresql
   
   # Navigate to project directory
   cd c:\Users\julia\sw_website
   
   # Run schema deployment (paste your connection string)
   psql "postgresql://doadmin:password@db-host:25060/defaultdb?sslmode=require" -f db/schema.sql
   ```

5. **Option B: Using DigitalOcean Console**
   - Click **Console** tab in your database dashboard
   - Copy entire contents of `db/schema.sql`
   - Paste into the console and execute

6. **Verify deployment**:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   ORDER BY table_name;
   ```
   Should show: `ab_test_results`, `bookings`, `conversions`, `email_logs`, `payments`, `user_sessions`, `schema_version`

---

## Phase 2: Environment Variables (5-10 minutes)

### Step 1: Get SendGrid Credentials

1. Log in to [SendGrid](https://app.sendgrid.com/)
2. Go to **Settings** → **API Keys**
3. Click **Create API Key**
4. Name: `Claire Booking System`
5. Permissions: Full Access (or at least Mail Send)
6. Copy the API key immediately (won't be shown again)

### Step 2: Configure DigitalOcean App Platform Secrets

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click your app
3. Go to **Settings** → **Environment & Variables**
4. Add the following environment variables:

| Variable | Value | Source |
|----------|-------|--------|
| `DATABASE_URL` | `postgresql://doadmin:...@db-host:25060/defaultdb?sslmode=require` | From Step 1.2 above |
| `SENDGRID_API_KEY` | `SG.xxxxxxxxxxxxx` | From SendGrid API Keys page |
| `SENDGRID_FROM_EMAIL` | `bookings@clairehamilton.com.au` | Your verified sender in SendGrid |
| `CLAIRE_NOTIFICATION_EMAIL` | `claire@clairehamilton.com.au` | Claire's personal email |
| `ALLOWED_ORIGIN` | `https://clairehamilton.com.au` | Your production domain |
| `VITE_API_BASE_URL` | `https://clairehamilton.com.au` | Your production domain |
| `NODE_ENV` | `production` | Fixed value |

5. Click **Save** - DigitalOcean will redeploy your functions with new variables

---

## Phase 3: Frontend Setup (5 minutes)

### Step 1: Verify UTM Service Initialization

The `src/App.tsx` already initializes UTM tracking on app load:

```typescript
useEffect(() => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  
  // Initialize session and register with backend
  initializeSession();
  registerSession(apiBaseUrl).catch(err => console.warn('Session registration failed:', err));
  
  // Track initial page view
  trackConversion('page_view');
}, []);
```

This happens automatically when the app loads - no additional code needed.

### Step 2: Verify BookingForm Component

The `src/components/BookingForm.tsx` should have the following integration:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);

  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const response = await fetch(`${apiBaseUrl}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        bookingType: formData.bookingType,
        notes: formData.notes,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Booking failed');
    }

    const result = await response.json();
    setSuccess(true);
    // Redirect or show confirmation
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Unknown error');
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## Phase 4: Deploy & Test (10-15 minutes)

### Step 1: Deploy Functions

Functions are auto-deployed when you push to GitHub:

```powershell
# Commit all changes
cd c:\Users\julia\sw_website
git add .
git commit -m "Configure environment variables and deployment settings"
git push origin main
```

DigitalOcean will automatically deploy your functions to App Platform. Check deployment status:
- Go to App Platform dashboard
- Click your app
- Watch the **Deployments** tab for status

### Step 2: Test Booking Endpoint

Use **Postman**, **Thunder Client**, or **curl** to test:

```powershell
# Test create-booking endpoint
$body = @{
    name = "Test User"
    email = "test@example.com"
    phone = "0412345678"
    date = "2025-02-15"
    time = "10:00"
    bookingType = "30-minute consult"
    notes = "Test booking"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "https://clairehamilton.com.au/api/bookings" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body

Write-Host $response.Content
```

**Expected response**:
```json
{
  "success": true,
  "confirmation_number": "CH-20250215-001",
  "message": "Booking confirmed",
  "booking_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Step 3: Test Session Registration

```powershell
# Test register-session endpoint
$body = @{
    userId = "user-123"
    utm_source = "google"
    utm_medium = "cpc"
    utm_campaign = "q1-2025"
    utm_content = "ad-5"
    utm_term = "booking"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "https://clairehamilton.com.au/api/sessions/register" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body

Write-Host $response.Content
```

### Step 4: Test Analytics Endpoint

```powershell
# Test get-analytics endpoint
$response = Invoke-WebRequest -Uri "https://clairehamilton.com.au/api/analytics/bookings?groupBy=utm_source" `
    -Method GET

Write-Host $response.Content
```

### Step 5: Verify Emails

1. Submit a test booking through the website form
2. Check your inbox for:
   - ✅ Customer confirmation email (from `bookings@clairehamilton.com.au`)
   - ✅ Claire's notification email (to `claire@clairehamilton.com.au`)

Both should include:
- Confirmation number (e.g., `CH-20250215-001`)
- Booking details (name, date, time)
- UTM attribution data (source, medium, campaign)

---

## Phase 5: Monitoring & Troubleshooting (Ongoing)

### View Function Logs

1. DigitalOcean App Platform → Your App
2. Go to **Functions** → Select a function
3. Click **View Logs** to see:
   - API request logs
   - Error messages
   - SendGrid email delivery status

### Common Issues

**Issue: "DATABASE_URL not found"**
- Verify environment variables are set in App Platform
- Check that `DATABASE_URL` exactly matches your PostgreSQL connection string
- Ensure `?sslmode=require` is included in connection string

**Issue: "Email not being sent"**
- Verify `SENDGRID_API_KEY` is correct
- Check that `SENDGRID_FROM_EMAIL` is a verified sender in SendGrid
- Check SendGrid Activity dashboard for delivery status

**Issue: "CORS error from frontend"**
- Verify `ALLOWED_ORIGIN` matches your production domain exactly
- Clear browser cache and reload
- Check that API endpoints include proper CORS headers

**Issue: "Database connection timeout"**
- Verify database is in the same region as App Platform
- Check firewall rules in database dashboard
- Ensure connection string includes `sslmode=require`

---

## Phase 6: Security Checklist ✅

- [ ] Database has SSL enabled (`sslmode=require`)
- [ ] Secrets stored in DigitalOcean App Platform (not in code)
- [ ] `.env` files added to `.gitignore`
- [ ] API endpoints validate all inputs (Joi schemas)
- [ ] SQL queries use parameterized statements (no injection)
- [ ] CORS restricted to your domain only
- [ ] SendGrid API key has minimal required permissions
- [ ] Rate limiting configured on booking endpoint (future)
- [ ] HTTPS enforced on all API calls
- [ ] Database backups enabled (DigitalOcean automatic)

---

## Rollback Procedures

### If Backend Deployment Fails

```powershell
# View previous deployment
git log --oneline | head -5

# Revert to previous commit
git revert HEAD
git push origin main

# DigitalOcean will auto-deploy the previous version
```

### If Database Schema Breaks Bookings

```sql
-- List recent changes
SELECT * FROM schema_version ORDER BY applied_at DESC LIMIT 5;

-- Rollback to specific version (if you have versioning)
-- Or restore from DigitalOcean backup
```

---

## Performance Optimization (Optional)

### Database Tuning

```sql
-- Create composite indexes for common queries
CREATE INDEX idx_bookings_date_status ON bookings(appointment_date, status);
CREATE INDEX idx_conversions_event_date ON conversions(event, created_at);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM bookings WHERE appointment_date = NOW()::date;
```

### Function Cold Start Optimization

- Functions have ~1-2 second cold start time initially
- Subsequent calls within minutes are warm and fast (~100ms)
- Consider keeping functions warm with scheduled pings if needed

---

## Next Steps After Deployment

1. **Set up monitoring**: DigitalOcean → Alerts → Create alerts for high error rates
2. **Enable database backups**: DigitalOcean automatically backs up every day
3. **Configure custom domain**: Point your domain DNS to DigitalOcean
4. **Set up CI/CD**: GitHub Actions can run tests before deploying
5. **Implement rate limiting**: Add middleware to prevent abuse
6. **Add payment integration**: Implement Eway/PayID (Phase 2)

---

## Support Resources

- DigitalOcean Functions Docs: https://docs.digitalocean.com/products/functions/
- PostgreSQL Docs: https://www.postgresql.org/docs/
- SendGrid API Docs: https://docs.sendgrid.com/
- GitHub Issues: Check repository for known issues

---

**Deployment Complete!** 🚀

Your Claire Hamilton booking system is now live and handling bookings with UTM attribution tracking!
