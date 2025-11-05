# Claire Hamilton Backend Infrastructure - Implementation Guide

**Status:** Phase 1 - 40% Complete  
**Last Updated:** November 5, 2025

---

## COMPLETED ✅

### 1. Database Schema (db/schema.sql)

- ✅ `user_sessions` table - UTM tracking and session attribution
- ✅ `bookings` table - Complete booking records with status tracking
- ✅ `conversions` table - Event tracking and funnel analysis
- ✅ `email_logs` table - Email delivery tracking
- ✅ `payments` table - Structure ready for Phase 2
- ✅ `ab_test_results` table - A/B testing infrastructure
- ✅ Helper functions (generate_confirmation_number, cleanup_expired_sessions)
- ✅ Triggers for automatic timestamp updates
- ✅ Indexes optimized for analytics queries

**How to deploy:**

```bash
# Connect to DigitalOcean PostgreSQL
psql -h your-db-host -U doadmin -d defaultdb < db/schema.sql

# Or use the CLI wrapper:
# psql connection details in console output
```

### 2. UTM Capture Service (src/utils/utm.service.ts)

- ✅ Extract UTM params from URL (utm_source, utm_medium, utm_campaign, utm_content, utm_term)
- ✅ Generate persistent user_id from browser fingerprint
- ✅ Store session data in sessionStorage (persists across navigation)
- ✅ Detect device type (mobile/tablet/desktop)
- ✅ Initialize session on app load
- ✅ Track conversion events

**How to use:**

```typescript
// In App.tsx or main component
import { initializeSession, getUTMParams, trackConversion } from './utils/utm.service';

// Initialize on app load (already added to App.tsx)
useEffect(() => {
  const session = initializeSession();
  registerSession(apiBaseUrl); // Send to backend
  trackConversion('page_view');
}, []);

// In booking form before submit:
const utm = getUTMParams();
const userId = getUserId();
```

### 3. Booking API Endpoint (functions/packages/api/create-booking/index.js)

- ✅ POST /api/bookings endpoint
- ✅ Input validation using Joi schema
- ✅ Duplicate booking detection
- ✅ Confirmation number generation (CH-YYYYMMDD-###)
- ✅ Database transaction handling
- ✅ UTM attribution storage
- ✅ Conversion event creation
- ✅ Email log creation
- ✅ Error handling with proper status codes
- ✅ Email sending via SendGrid

**Request format:**

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phone": "0400000000",
  "dateOfBirth": "1990-01-15",
  "gender": "female",
  "appointmentType": "dinner-date",
  "appointmentDate": "2025-11-15",
  "appointmentTime": "19:00",
  "notes": "Any special requests",
  "userId": "user_hash_from_frontend",
  "utmSource": "instagram",
  "utmMedium": "bio_link",
  "utmCampaign": "november",
  "deviceType": "mobile",
  "userAgent": "Mozilla/5.0..."
}
```

**Response (Success - HTTP 201):**

```json
{
  "success": true,
  "appointmentId": "uuid-12345",
  "confirmationNumber": "CH-20251105-001",
  "message": "Booking submitted successfully. Check your email for confirmation."
}
```

---

## IN PROGRESS ⏳

### App.tsx Updates

- ✅ Import UTM service
- ✅ Initialize session on app load
- ✅ Track page views
- ⏳ Wire to /api/sessions/register endpoint (needs to be created)

---

## STILL TODO ❌

### 2. Frontend Integration (BookingForm.tsx)

**File to update:** `src/components/BookingForm.tsx`

**Changes needed:**

```typescript
// Add at top
import { getUTMParams, getUserId, trackConversion } from '../utils/utm.service';

// In form submission handler:
const handleConfirmSubmit = async () => {
  const utmData = getUTMParams();
  const userId = getUserId();

  const bookingData = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    dateOfBirth: formData.dateOfBirth,
    gender: formData.gender,
    appointmentType: currentStep === 'datetime' ? formData.appointmentType : '',
    appointmentDate: formData.appointmentDate,
    appointmentTime: formData.appointmentTime,
    notes: formData.notes,
    userId,
    utmSource: utmData.utm_source,
    utmMedium: utmData.utm_medium,
    utmCampaign: utmData.utm_campaign,
    utmContent: utmData.utm_content,
    utmTerm: utmData.utm_term,
    deviceType: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop',
    userAgent: navigator.userAgent,
  };

  try {
    setLoading(true);
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
    const response = await fetch(`${apiBaseUrl}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });

    const data = await response.json();

    if (data.success) {
      setCurrentStep('success');
      trackConversion(
        'booking_confirmed',
        { confirmationNumber: data.confirmationNumber },
        apiBaseUrl
      );
    } else {
      setError(data.error || 'Booking failed');
    }
  } catch (error) {
    setError('Network error: ' + error.message);
  } finally {
    setLoading(false);
  }
};
```

### 3. Session Registration Endpoint (NEW FUNCTION)

**Create:** `functions/packages/api/register-session/index.js`

```javascript
// POST /api/sessions/register
// Receives session data from frontend, creates user_sessions record
// Returns session ID

const pg = require('pg');
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function registerSession(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    userId,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm,
    referrer,
    deviceType,
    userAgent,
  } = req.body;

  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO user_sessions (
        user_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
        referrer, device_type, user_agent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (user_id) DO UPDATE SET session_end = NULL, updated_at = NOW()
      RETURNING id`,
      [
        userId,
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        utmTerm,
        referrer,
        deviceType,
        userAgent,
      ]
    );

    res.json({ sessionId: result.rows[0].id });
  } catch (error) {
    console.error('Error registering session:', error);
    res.status(500).json({ error: 'Failed to register session' });
  } finally {
    client.release();
  }
}

module.exports = registerSession;
```

### 4. Analytics Endpoint (NEW FUNCTION)

**Create:** `functions/packages/api/get-analytics/index.js`

Purpose: Return aggregated booking data by platform, campaign, time period

```javascript
// GET /api/analytics/bookings?startDate=2025-11-01&endDate=2025-11-30&groupBy=utm_source

async function getAnalytics(req, res) {
  const { startDate, endDate, groupBy = 'utm_source' } = req.query;

  const start =
    startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const end = endDate || new Date().toISOString().split('T')[0];

  const client = await pool.connect();
  try {
    const query = `
      SELECT 
        ${groupBy} as category,
        COUNT(DISTINCT user_sessions.id) as sessions,
        COUNT(DISTINCT bookings.id) as bookings,
        ROUND(100.0 * COUNT(DISTINCT bookings.id) / COUNT(DISTINCT user_sessions.id), 2) as conversion_rate
      FROM user_sessions
      LEFT JOIN bookings ON user_sessions.id = bookings.user_session_id
      WHERE user_sessions.session_start >= $1
      AND user_sessions.session_start < $2
      GROUP BY ${groupBy}
      ORDER BY bookings DESC
    `;

    const result = await client.query(query, [start, end]);
    res.json(result.rows);
  } finally {
    client.release();
  }
}
```

### 5. Environment Variables (.env)

Add these variables to your `.do/app.yaml` and `.env` files:

```yaml
# SendGrid
SENDGRID_API_KEY: (get from sendgrid.com/pricing)
SENDGRID_FROM_EMAIL: bookings@clairehamilton.com.au
CLAIRE_NOTIFICATION_EMAIL: claire@clairehamilton.com.au

# API Configuration
VITE_API_BASE_URL: https://clairehamilton.com.au
ALLOWED_ORIGIN: https://clairehamilton.com.au

# Database (already configured)
DATABASE_URL: (already in .do/app.yaml)
```

### 6. Update project.yml

```yaml
packages:
  - name: api
    environment:
      DATABASE_URL: ${DATABASE_URL}
      SENDGRID_API_KEY: ${SENDGRID_API_KEY}
      SENDGRID_FROM_EMAIL: ${SENDGRID_FROM_EMAIL}
      CLAIRE_NOTIFICATION_EMAIL: ${CLAIRE_NOTIFICATION_EMAIL}
      ALLOWED_ORIGIN: ${ALLOWED_ORIGIN}
    functions:
      - name: create-booking
        runtime: nodejs:18
        web: true
        limits:
          timeout: 60000
          memory: 256
      - name: register-session
        runtime: nodejs:18
        web: true
        limits:
          timeout: 10000
          memory: 128
      - name: get-analytics
        runtime: nodejs:18
        web: true
        limits:
          timeout: 30000
          memory: 256
      - name: get-data
        runtime: nodejs:18
        web: true
        limits:
          timeout: 60000
          memory: 256
```

### 7. Update functions/packages/api/package.json

```json
{
  "name": "api",
  "version": "1.0.0",
  "dependencies": {
    "pg": "^8.11.0",
    "joi": "^17.11.0",
    "@sendgrid/mail": "^8.1.0"
  }
}
```

---

## DEPLOYMENT CHECKLIST

### Step 1: Deploy Database Schema

```bash
# Run SQL from db/schema.sql against your DigitalOcean PostgreSQL database
do -Command "databases get [your-db-id]"
# Get connection details, then:
psql -h host -U doadmin -d defaultdb < db/schema.sql
```

### Step 2: Add Environment Variables

In DigitalOcean App Platform Console:

1. Go to Settings
2. Add new environment variables for SendGrid
3. Redeploy

### Step 3: Deploy Functions

```bash
# Using DigitalOcean CLI wrapper (PowerShell):
# functions/ are deployed automatically when you push to GitHub
git add .
git commit -m "Add backend infrastructure for bookings"
git push origin main
```

### Step 4: Test Booking Flow

1. Visit: `clairehamilton.com.au?utm_source=test&utm_medium=direct`
2. Open browser console to see session initialized
3. Click "Book Now"
4. Fill out form
5. Submit
6. Check email for confirmation
7. Check DigitalOcean PostgreSQL for booking record

### Step 5: Verify Analytics

```bash
# Query analytics endpoint (after first booking):
curl https://clairehamilton.com.au/api/analytics/bookings
```

---

## WHAT'S NOT YET IMPLEMENTED

### Phase 2 Features (Planned)

- ❌ Payment processing (PayID/Eway integration)
- ❌ A/B testing allocation and result tracking
- ❌ Advanced analytics dashboard
- ❌ Admin authentication
- ❌ SMS/WhatsApp notifications

### Known Limitations

- SendGrid emails sent inline (no background queue yet)
- No retry logic for failed email sends (currently logs error)
- Analytics endpoint doesn't support complex filtering
- No admin UI for viewing bookings

---

## SECURITY NOTES

✅ **Already implemented:**

- SQL parameterized queries (prevents injection)
- Input validation with Joi
- IP address hashing (privacy protection)
- PII encryption at rest (DigitalOcean managed)
- HTTPS/TLS enforcement
- CORS whitelisting

⚠️ **Still to add:**

- Rate limiting on booking endpoint (10 req/min per IP)
- CSRF token validation
- Request signing for internal functions
- API key authentication for admin endpoints

---

## FILE STRUCTURE REFERENCE

```
sw_website/
├── db/
│   └── schema.sql                    ✅ CREATED
├── src/
│   ├── utils/
│   │   └── utm.service.ts           ✅ CREATED
│   ├── components/
│   │   └── BookingForm.tsx          ⏳ NEEDS UPDATE
│   └── App.tsx                       ✅ PARTIALLY UPDATED
├── functions/packages/api/
│   ├── create-booking/
│   │   └── index.js                 ✅ CREATED
│   ├── register-session/            ❌ NEEDS TO CREATE
│   ├── get-analytics/               ❌ NEEDS TO CREATE
│   └── package.json                 ⏳ NEEDS UPDATE
└── .do/
    └── app.yaml                     ⏳ NEEDS ENV VAR UPDATE
```

---

## NEXT IMMEDIATE STEPS

1. **Update BookingForm.tsx** with API call (30 min)
2. **Create register-session function** (45 min)
3. **Create get-analytics function** (1 hour)
4. **Set up SendGrid account** (15 min)
5. **Deploy to DigitalOcean** (10 min)
6. **End-to-end testing** (1 hour)

**Total: 3.5-4 hours**

---

## SUPPORT RESOURCES

- DigitalOcean Functions: https://docs.digitalocean.com/products/functions/
- SendGrid Setup: https://sendgrid.com/docs/for-developers/sending-email/quickstart-nodejs/
- PostgreSQL Connection: https://www.postgresql.org/docs/15/libpq-connect.html
- Joi Validation: https://joi.dev/api/

---

**Generated:** November 5, 2025  
**Version:** 1.0 - Phase 1 (40% complete)
