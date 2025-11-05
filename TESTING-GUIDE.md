# Testing Guide - Claire Hamilton Booking System

Complete testing procedures to validate the booking system end-to-end.

## Test Environment Setup

Before testing, ensure:
- ✅ Database schema deployed to PostgreSQL
- ✅ Environment variables configured in DigitalOcean App Platform
- ✅ SendGrid credentials valid
- ✅ Frontend app deployed (or running locally with `npm run dev`)
- ✅ Functions deployed to DigitalOcean

---

## Unit 1: Database Testing (5 minutes)

### Test 1.1: Schema Validation

```sql
-- Connect to your database
psql "postgresql://doadmin:password@db-host:25060/defaultdb?sslmode=require"

-- Verify all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- Expected output:
-- ab_test_results
-- bookings
-- conversions
-- email_logs
-- payments
-- user_sessions
-- schema_version
```

### Test 1.2: Helper Functions

```sql
-- Test confirmation number generation
SELECT generate_confirmation_number();
-- Expected: CH-20250215-001 (format: CH-YYYYMMDD-###)

-- Test current timestamp
SELECT NOW();
-- Should return current UTC timestamp
```

### Test 1.3: Indexes

```sql
-- Verify indexes are created
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY indexname;

-- Look for these indexes:
-- idx_bookings_confirmation_number
-- idx_bookings_email_date
-- idx_conversions_event
-- idx_conversions_utm_source
-- idx_email_logs_booking_id
-- idx_user_sessions_user_id
-- idx_user_sessions_expires_at
```

---

## Unit 2: Frontend Testing (10 minutes)

### Test 2.1: UTM Parameter Extraction

1. Open your website with UTM parameters:
   ```
   https://clairehamilton.com.au?utm_source=google&utm_medium=cpc&utm_campaign=q1_2025&utm_content=ad_5&utm_term=booking
   ```

2. Open browser Developer Tools → Console

3. Verify session is initialized:
   ```javascript
   // Should output the session object
   console.log(localStorage.getItem('claire_session'));
   console.log(sessionStorage.getItem('claire_current_session'));
   ```

4. Expected output:
   ```json
   {
     "userId": "hash-based-id",
     "sessionId": "session-uuid",
     "utm_source": "google",
     "utm_medium": "cpc",
     "utm_campaign": "q1_2025",
     "utm_content": "ad_5",
     "utm_term": "booking",
     "createdAt": "2025-02-15T10:00:00Z"
   }
   ```

### Test 2.2: Session Registration API Call

Check Network tab in Developer Tools:

1. Open Network tab → Filter by `XHR`
2. Reload the page
3. Look for POST request to `/api/sessions/register`
4. Verify:
   - ✅ Status: 200 OK
   - ✅ Response includes `sessionId`, `userId`, `createdAt`

Expected response:
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user-5f7b8c9a",
  "createdAt": "2025-02-15T10:00:00Z"
}
```

### Test 2.3: Booking Form Renders

1. Navigate to booking form page
2. Verify form displays all fields:
   - ✅ Full Name
   - ✅ Email
   - ✅ Phone
   - ✅ Date picker
   - ✅ Time picker
   - ✅ Booking Type dropdown
   - ✅ Notes textarea
   - ✅ Submit button

3. Verify form styling (Tailwind CSS):
   - ✅ Professional layout with Claire's branding
   - ✅ Responsive on mobile/tablet/desktop
   - ✅ Input validation feedback
   - ✅ Loading state during submission

---

## Unit 3: API Testing (15 minutes)

### Test 3.1: Create Booking Endpoint

Use Postman, Thunder Client, or PowerShell:

```powershell
# Test create-booking endpoint
$apiUrl = "https://clairehamilton.com.au/api/bookings"
$headers = @{
    "Content-Type" = "application/json"
    "Origin" = "https://clairehamilton.com.au"
}

$body = @{
    name = "John Test User"
    email = "john.test@example.com"
    phone = "0412345678"
    date = "2025-03-15"
    time = "14:00"
    bookingType = "30-minute consult"
    notes = "Please test booking from deployment guide"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri $apiUrl `
    -Method POST `
    -Headers $headers `
    -Body $body

$response.Content | ConvertFrom-Json | Format-List
```

**Expected response (HTTP 200)**:
```json
{
  "success": true,
  "confirmation_number": "CH-20250315-001",
  "message": "Booking confirmed and confirmation email sent",
  "booking_id": "550e8400-e29b-41d4-a716-446655440000",
  "email_sent": true
}
```

### Test 3.2: Booking Validation Tests

**Test 3.2a: Invalid Email**
```powershell
$body = @{
    name = "Test User"
    email = "invalid-email"  # Missing @ symbol
    phone = "0412345678"
    date = "2025-03-15"
    time = "14:00"
    bookingType = "30-minute consult"
    notes = "Test"
} | ConvertTo-Json
```

**Expected response (HTTP 400)**:
```json
{
  "error": "Validation failed",
  "details": "Invalid email format"
}
```

**Test 3.2b: Invalid Phone**
```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    phone = "123"  # Too short
    date = "2025-03-15"
    time = "14:00"
    bookingType = "30-minute consult"
    notes = "Test"
} | ConvertTo-Json
```

**Expected response (HTTP 400)**:
```json
{
  "error": "Validation failed",
  "details": "Invalid phone format"
}
```

**Test 3.2c: Past Date**
```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    phone = "0412345678"
    date = "2020-01-01"  # Past date
    time = "14:00"
    bookingType = "30-minute consult"
    notes = "Test"
} | ConvertTo-Json
```

**Expected response (HTTP 400)**:
```json
{
  "error": "Validation failed",
  "details": "Booking date must be in the future"
}
```

### Test 3.3: Duplicate Prevention

Submit the same booking twice (within 1 hour):

```powershell
# First submission
Invoke-WebRequest -Uri $apiUrl -Method POST -Headers $headers -Body $body

# Second submission (same email, date, time within 1 hour)
$response = Invoke-WebRequest -Uri $apiUrl -Method POST -Headers $headers -Body $body
```

**Expected response (HTTP 409)**:
```json
{
  "error": "Duplicate booking",
  "message": "A booking with this email and time already exists within the last hour"
}
```

### Test 3.4: Session Registration Endpoint

```powershell
$sessionUrl = "https://clairehamilton.com.au/api/sessions/register"
$sessionBody = @{
    userId = "test-user-123"
    utm_source = "google"
    utm_medium = "organic"
    utm_campaign = "q1_2025"
    utm_content = "blog_post"
    utm_term = "booking_system"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri $sessionUrl `
    -Method POST `
    -Headers $headers `
    -Body $sessionBody

$response.Content | ConvertFrom-Json | Format-List
```

**Expected response (HTTP 200)**:
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "test-user-123",
  "createdAt": "2025-02-15T10:00:00Z"
}
```

### Test 3.5: Analytics Endpoint

```powershell
$analyticsUrl = "https://clairehamilton.com.au/api/analytics/bookings?groupBy=utm_source"

$response = Invoke-WebRequest -Uri $analyticsUrl -Method GET -Headers $headers

$response.Content | ConvertFrom-Json | Format-List
```

**Expected response (HTTP 200)**:
```json
{
  "period": {
    "start": "2025-01-01T00:00:00Z",
    "end": "2025-02-15T23:59:59Z"
  },
  "groupBy": "utm_source",
  "data": [
    {
      "utm_source": "google",
      "sessions": 245,
      "bookings": 12,
      "conversion_rate": 4.9,
      "paid_bookings": 5
    },
    {
      "utm_source": "organic",
      "sessions": 89,
      "bookings": 7,
      "conversion_rate": 7.9,
      "paid_bookings": 3
    }
  ],
  "totals": {
    "sessions": 334,
    "bookings": 19,
    "conversion_rate": 5.7
  }
}
```

### Test 3.6: Invalid Analytics Parameter

```powershell
$analyticsUrl = "https://clairehamilton.com.au/api/analytics/bookings?groupBy=invalid_field"

$response = Invoke-WebRequest -Uri $analyticsUrl -Method GET -Headers $headers
```

**Expected response (HTTP 400)**:
```json
{
  "error": "Invalid groupBy parameter",
  "message": "groupBy must be one of: utm_source, utm_medium, utm_campaign, booking_type, status"
}
```

---

## Unit 4: Email Testing (10 minutes)

### Test 4.1: Customer Confirmation Email

1. Submit a booking through the form with a real email address
2. Check your inbox within 1 minute
3. Verify email contains:
   - ✅ "Booking Confirmation" subject line
   - ✅ Confirmation number (e.g., CH-20250315-001)
   - ✅ Booking date and time
   - ✅ Your name
   - ✅ Professional HTML template with Claire's branding
   - ✅ Call-to-action button

**Sample email content**:
```
Subject: Your Booking Confirmation - CH-20250315-001

Hello John,

Thank you for booking with Claire Hamilton. Your appointment has been confirmed!

Confirmation Number: CH-20250315-001
Date: Saturday, March 15, 2025
Time: 2:00 PM
Session Type: 30-minute consult

We look forward to working with you.

Best regards,
Claire Hamilton
```

### Test 4.2: Claire Notification Email

1. Submit same booking
2. Check Claire's email (`CLAIRE_NOTIFICATION_EMAIL`)
3. Verify email contains:
   - ✅ "New Booking Received" subject line
   - ✅ Customer name, email, phone
   - ✅ Booking date and time
   - ✅ UTM attribution (source, medium, campaign)
   - ✅ Session ID
   - ✅ Confirmation number

**Sample notification content**:
```
Subject: New Booking Received - CH-20250315-001

New booking from John Test User

Email: john.test@example.com
Phone: 0412345678
Date: Saturday, March 15, 2025 at 2:00 PM
Session Type: 30-minute consult

Attribution:
- Source: google
- Medium: cpc
- Campaign: q1_2025
- Content: ad_5

Confirmation: CH-20250315-001
Session ID: 550e8400-e29b-41d4-a716-446655440000
```

### Test 4.3: SendGrid Delivery Status

1. Log in to [SendGrid](https://app.sendgrid.com/)
2. Go to **Activity** → **Mail Activity**
3. Look for emails sent to your test address
4. Verify status: ✅ Delivered

---

## Unit 5: Database State Validation (10 minutes)

### Test 5.1: User Session Record

```sql
-- Query the user_sessions table
SELECT * FROM user_sessions 
ORDER BY created_at DESC 
LIMIT 1;

-- Expected columns populated:
-- session_id: UUID
-- user_id: Hash-based ID
-- utm_source: google
-- utm_medium: cpc
-- utm_campaign: q1_2025
-- utm_content: ad_5
-- utm_term: booking
-- page_count: 1
-- created_at: Current timestamp
-- updated_at: Current timestamp
-- session_end: NULL (session still active)
```

### Test 5.2: Booking Record

```sql
-- Query the bookings table
SELECT * FROM bookings 
ORDER BY created_at DESC 
LIMIT 1;

-- Expected columns populated:
-- booking_id: UUID
-- confirmation_number: CH-20250315-001
-- customer_name: John Test User
-- customer_email: john.test@example.com
-- customer_phone: 0412345678
-- appointment_date: 2025-03-15
-- appointment_time: 14:00
-- booking_type: 30-minute consult
-- notes: Test booking
-- status: confirmed
-- created_at: Current timestamp
-- updated_at: Current timestamp
```

### Test 5.3: Email Log Record

```sql
-- Query the email_logs table
SELECT * FROM email_logs 
ORDER BY created_at DESC 
LIMIT 2;

-- Expected 2 records:
-- 1. Customer confirmation email
-- 2. Claire notification email

-- Each should have:
-- email_log_id: UUID
-- booking_id: UUID (from above)
-- email_type: confirmation OR notification
-- recipient_email: customer email OR claire email
-- sent_at: Current timestamp
-- delivery_status: sent
```

### Test 5.4: Conversion Event

```sql
-- Query the conversions table
SELECT * FROM conversions 
WHERE booking_id = (SELECT booking_id FROM bookings ORDER BY created_at DESC LIMIT 1);

-- Expected record:
-- conversion_id: UUID
-- session_id: UUID
-- booking_id: UUID
-- event: booking_submitted
-- created_at: Current timestamp
```

---

## Unit 6: Performance Testing (5 minutes)

### Test 6.1: API Response Time

```powershell
# Measure booking creation time
$timer = [System.Diagnostics.Stopwatch]::StartNew()

$response = Invoke-WebRequest -Uri $apiUrl `
    -Method POST `
    -Headers $headers `
    -Body $body

$timer.Stop()

Write-Host "Response time: $($timer.ElapsedMilliseconds)ms"

# Expected: 200-500ms (cold start), 50-150ms (warm)
```

### Test 6.2: Database Query Performance

```sql
-- Check slow query logs
SELECT query, calls, mean_exec_time 
FROM pg_stat_statements 
WHERE mean_exec_time > 100 
ORDER BY mean_exec_time DESC;

-- Analyze common queries
EXPLAIN ANALYZE 
SELECT * FROM bookings 
WHERE appointment_date = CURRENT_DATE;
```

---

## Unit 7: Security Testing (10 minutes)

### Test 7.1: CORS Validation

```powershell
# Test request from invalid origin
$headers = @{
    "Content-Type" = "application/json"
    "Origin" = "https://evil-site.com"  # Invalid origin
}

$response = Invoke-WebRequest -Uri $apiUrl `
    -Method POST `
    -Headers $headers `
    -Body $body -ErrorAction SilentlyContinue

# Should fail with CORS error (expected)
Write-Host "Response: $($response.StatusCode)"
```

### Test 7.2: SQL Injection Prevention

```powershell
# Attempt SQL injection in booking name
$body = @{
    name = "'); DROP TABLE bookings; --"
    email = "test@example.com"
    phone = "0412345678"
    date = "2025-03-15"
    time = "14:00"
    bookingType = "30-minute consult"
    notes = "Test"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri $apiUrl `
    -Method POST `
    -Headers $headers `
    -Body $body

# Should reject as invalid (not execute)
$response.Content | ConvertFrom-Json
```

### Test 7.3: Input Sanitization

```powershell
# Test with special characters
$body = @{
    name = "<script>alert('xss')</script>"
    email = "test@example.com"
    phone = "0412345678"
    date = "2025-03-15"
    time = "14:00"
    bookingType = "30-minute consult"
    notes = "Test"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri $apiUrl `
    -Method POST `
    -Headers $headers `
    -Body $body

# Should sanitize or reject
$response.Content | ConvertFrom-Json
```

---

## Integration Testing Checklist ✅

| Test | Status | Notes |
|------|--------|-------|
| Database schema deployed | ⏳ | Check schema_version table |
| Frontend UTM service initializes | ⏳ | Check console logs |
| Booking form renders correctly | ⏳ | Visual verification |
| Session registration works | ⏳ | Check network tab |
| Create booking succeeds | ⏳ | Check HTTP 200 response |
| Booking validation works | ⏳ | Test invalid inputs |
| Duplicate detection works | ⏳ | Submit twice within 1 hour |
| Customer email received | ⏳ | Check inbox |
| Claire notification received | ⏳ | Check Claire's email |
| Analytics endpoint works | ⏳ | Query groupBy utm_source |
| Database records created | ⏳ | Query user_sessions, bookings, emails |
| Performance acceptable | ⏳ | Response time < 500ms |
| CORS validation works | ⏳ | Test invalid origin |
| SQL injection prevented | ⏳ | Attempt injection |
| Input sanitization works | ⏳ | Test special characters |

---

## Troubleshooting Failed Tests

### "CORS Error" on API calls
- Verify `ALLOWED_ORIGIN` environment variable matches your domain exactly
- Check browser console for specific CORS error message
- Ensure request has `Origin` header set correctly

### "Email not being sent"
- Verify `SENDGRID_API_KEY` is correct in environment variables
- Confirm `SENDGRID_FROM_EMAIL` is a verified sender in SendGrid
- Check SendGrid Activity dashboard for delivery failures
- Look for SendGrid errors in DigitalOcean function logs

### "Database connection error"
- Verify `DATABASE_URL` connection string is correct
- Ensure database is accepting connections (check firewall)
- Confirm PostgreSQL cluster is in "running" state in DigitalOcean dashboard
- Check that connection string includes `sslmode=require`

### "Validation errors on valid input"
- Review Joi schema in `functions/packages/api/create-booking/index.js`
- Check phone regex pattern: `^0[2-9]\d{8}$` (Australian format)
- Ensure email format is standard: `user@domain.com`
- Date must be ISO format: `YYYY-MM-DD` and in the future

---

## Test Results Summary

After running all tests above, create a summary:

```
Testing Complete!

Passed: __ / 15 tests
Failed: __ / 15 tests
Warnings: __ 

Critical Issues: None
Minor Issues: __

System Status: ✅ Ready for Production
```

---

**Next Steps After Testing**:
1. Deploy to production if all tests pass
2. Monitor DigitalOcean logs for errors
3. Set up alerts for high error rates
4. Collect user feedback on booking experience
5. Monitor analytics for conversion rate

---

For questions or issues, refer to `BACKEND-IMPLEMENTATION.md` or `DEPLOYMENT-GUIDE.md`.
