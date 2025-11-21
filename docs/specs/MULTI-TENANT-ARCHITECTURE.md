# Multi-Tenant Companion Platform - Architecture Documentation

**Version:** 2.0  
**Date:** November 7, 2025  
**Status:** ✅ IMPLEMENTED & PRODUCTION READY

---

## 📋 Overview

This document describes the multi-tenant architecture for a SaaS platform designed for high-end companion (escort) booking services. The platform enables each companion to have their own branded subdomain with fully customizable styling, content, and photo galleries, while sharing a common codebase and infrastructure.

**Production Status**:

- ✅ Multi-tenant architecture implemented
- ✅ Subdomain-based routing functional
- ✅ Tenant isolation in database
- ✅ Dynamic theming system
- ✅ First tenant (Claire Hamilton) live at https://clairehamilton.vip
- ✅ Platform ready for additional tenants

**Related Documentation**:

- [docs/PLATFORM-OVERVIEW.md](./docs/PLATFORM-OVERVIEW.md) - Complete platform features
- [docs/ONBOARDING-GUIDE.md](./docs/ONBOARDING-GUIDE.md) - Add new tenants
- [docs/SUBDOMAIN-ROUTING.md](./docs/SUBDOMAIN-ROUTING.md) - Routing implementation

---

## Executive Summary

This is a comprehensive multi-tenant SaaS platform for high-end companion booking services. The platform allows each companion to have their own branded subdomain with fully customizable styling, content, and photo galleries, while sharing a common codebase and infrastructure.

### Key Features

- ✅ Subdomain-based multi-tenancy (`claire.companionconnect.app`)
- ✅ Per-companion customization (theme, content, photos)
- ✅ Comprehensive analytics and conversion tracking
- ✅ A/B testing system (especially for photo selection)
- ✅ Shared utilities, isolated branding
- ✅ Individual companion dashboards
- ✅ GDPR compliance
- ✅ Social media correlation (future)

---

## Domain & Routing Strategy

### Subdomain Architecture

**Main Platform:**

```
companionconnect.app → Platform landing page / showcase
```

**Companion Subdomains:**

```
claire.companionconnect.app    → Claire Hamilton's branded page
sophie.companionconnect.app    → Sophie's branded page
jessica.companionconnect.app   → Jessica's branded page
```

**Future Custom Domain Support:**

```
clairehamilton.com.au → CNAME → claire.companionconnect.app
```

### Why Subdomains?

1. **Premium Feel:** Each companion gets their own "web address"
2. **Trust Signal:** Consistent platform branding builds recognition
3. **Technical Simplicity:** One app, wildcard SSL, easy routing
4. **SEO Benefits:** Each subdomain independently optimized
5. **Analytics Isolation:** Easy per-subdomain tracking
6. **Custom Domain Ready:** Later support for personal domains

### Routing Logic

```typescript
// Tenant detection from subdomain
const hostname = window.location.hostname;  // e.g., "claire.companionconnect.app"
const subdomain = hostname.split('.')[0];   // e.g., "claire"

if (subdomain === 'companionconnect' || subdomain === 'www') {
  // Show platform landing page
  return <PlatformLanding />;
}

// Load tenant configuration and render tenant page
const tenant = await loadTenant(subdomain);
return <TenantPage tenant={tenant} />;
```

---

## Software Architecture

### Frontend Structure

```
src/
├── core/                          # Shared utilities (all tenants)
│   ├── components/
│   │   ├── BookingForm/          # Generic booking form with validation
│   │   ├── PhotoGallery/         # A/B testable gallery component
│   │   ├── PricingTable/         # Pricing display component
│   │   ├── TestimonialCarousel/  # Testimonials slider
│   │   ├── CTAButton/            # A/B testable call-to-action
│   │   ├── HeroSection/          # Hero with A/B testable photos
│   │   └── ContactSection/       # Contact form/info
│   │
│   ├── hooks/
│   │   ├── useAnalytics.ts       # Track events and conversions
│   │   ├── useABTest.ts          # A/B test assignment and tracking
│   │   ├── useTenant.ts          # Get current tenant context
│   │   ├── useSession.ts         # Session management
│   │   └── useBooking.ts         # Booking submission
│   │
│   ├── services/
│   │   ├── analytics.service.ts  # Analytics API
│   │   ├── booking.service.ts    # Booking API
│   │   ├── abtest.service.ts     # A/B test API
│   │   └── tenant.service.ts     # Tenant configuration API
│   │
│   ├── utils/
│   │   ├── tracking.ts           # UTM, fingerprinting, session
│   │   ├── theme.ts              # Dynamic theming utilities
│   │   └── validation.ts         # Form validation
│   │
│   └── providers/
│       ├── TenantProvider.tsx    # Tenant context
│       ├── ThemeProvider.tsx     # Dynamic theme provider
│       └── AnalyticsProvider.tsx # Analytics context
│
├── tenants/                       # Per-companion customization
│   ├── _template/                # Starter template for new companions
│   │   ├── theme.config.ts
│   │   ├── content.config.ts
│   │   ├── photos.config.ts
│   │   ├── styles.module.css
│   │   └── README.md
│   │
│   ├── claire/                   # Claire Hamilton
│   │   ├── theme.config.ts       # Colors, fonts, spacing
│   │   ├── content.config.ts     # Bio, services, pricing, contact
│   │   ├── photos.config.ts      # Photo variants for A/B testing
│   │   ├── styles.module.css     # Custom CSS overrides
│   │   └── Page.tsx              # Custom layout (optional)
│   │
│   ├── sophie/
│   │   └── ...
│   │
│   └── jessica/
│       └── ...
│
├── platform/                      # Platform-level pages
│   ├── Landing.tsx               # Main platform page
│   ├── AdminDashboard.tsx        # Platform admin (you)
│   ├── CompanionDashboard.tsx    # Companion analytics view
│   └── NotFound.tsx              # 404 page
│
├── App.tsx                        # Main app with tenant router
└── main.tsx                       # Entry point
```

### Tenant Configuration Pattern

Each companion has three configuration files:

**1. Theme Configuration**

```typescript
// tenants/claire/theme.config.ts
export const theme: TenantTheme = {
  colors: {
    primary: '#8B4789', // Purple
    secondary: '#D4AF37', // Gold
    accent: '#F4E6D8', // Cream
    background: '#FFFFFF',
    text: '#2C2C2C',
  },
  fonts: {
    heading: 'Playfair Display',
    body: 'Montserrat',
  },
  layout: 'elegant', // 'elegant' | 'modern' | 'minimal'
  spacing: 'comfortable', // 'compact' | 'comfortable' | 'spacious'
};
```

**2. Content Configuration**

```typescript
// tenants/claire/content.config.ts
export const content: TenantContent = {
  name: 'Claire Hamilton',
  tagline: "Sydney's Premier Luxury Companion",
  bio: 'With a passion for creating unforgettable experiences...',

  services: [
    {
      name: 'Dinner Date',
      description: 'Elegant companionship for social events',
      duration: '3 hours',
      price: 1500,
    },
    // ... more services
  ],

  pricing: {
    hourly: 800,
    overnight: 5000,
    weekend: 12000,
  },

  contact: {
    email: 'claire@companionconnect.app',
    phone: '+61 4XX XXX XXX',
    availableHours: '10:00 - 22:00 AEST',
  },

  socialMedia: {
    instagram: '@claire_hamilton',
    twitter: '@clairehamilton',
  },

  seo: {
    title: 'Claire Hamilton - Premium Sydney Companion',
    description: 'Luxury companionship services in Sydney...',
    keywords: ['sydney companion', 'luxury escort', 'high-end'],
  },
};
```

**3. Photos Configuration (A/B Testing)**

```typescript
// tenants/claire/photos.config.ts
export const photos: TenantPhotos = {
  hero: {
    control: 'https://spaces.digitalocean.com/tenants/claire/hero-1.jpg',
    variants: [
      { id: 'variantA', url: '...hero-2.jpg', weight: 0.5 },
      { id: 'variantB', url: '...hero-3.jpg', weight: 0.5 },
    ],
  },

  gallery: [
    { id: 1, url: '...gallery-1.jpg', alt: 'Elegant evening wear' },
    { id: 2, url: '...gallery-2.jpg', alt: 'Professional headshot' },
    { id: 3, url: '...gallery-3.jpg', alt: 'Casual setting' },
    // ... more photos
  ],

  testimonials: [{ id: 1, photo: '...testimonial-bg.jpg' }],
};
```

---

## Database Architecture

### Technology: DigitalOcean Managed PostgreSQL

**Why PostgreSQL?**

- ✅ Best managed database on DigitalOcean
- ✅ JSONB for flexible configuration storage
- ✅ Excellent analytics query performance
- ✅ Automatic backups & point-in-time recovery
- ✅ Strong ACID guarantees for bookings
- ✅ PostGIS for future location features

### Schema Design

See `db/schema.sql` for the complete schema. Key tables:

#### 1. **tenants** - Companion Profiles

```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subdomain VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  custom_domain VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active',
  theme_config JSONB NOT NULL,
  content_config JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. **sessions** - User Visits

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  session_token VARCHAR(255) UNIQUE NOT NULL,
  fingerprint VARCHAR(255),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  country VARCHAR(2),
  device_type VARCHAR(20),
  browser VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. **ab_tests** - A/B Test Definitions

```sql
CREATE TABLE ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  name VARCHAR(100) NOT NULL,
  element_type VARCHAR(50),
  variants JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  winner_variant_id VARCHAR(50),
  started_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. **ab_assignments** - User Variant Assignments

```sql
CREATE TABLE ab_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  test_id UUID REFERENCES ab_tests(id),
  variant_id VARCHAR(50) NOT NULL,
  assigned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(session_id, test_id)
);
```

#### 5. **events** - Conversion Tracking

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id),
  tenant_id UUID REFERENCES tenants(id),
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB,
  page_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_tenant_created ON events(tenant_id, created_at DESC);
```

#### 6. **bookings** - Booking Submissions

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  session_id UUID REFERENCES sessions(id),
  client_name VARCHAR(100) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  service_type VARCHAR(100),
  preferred_date TIMESTAMP,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  conversion_path JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 7. **social_media_metrics** - Social Correlation (Future)

```sql
CREATE TABLE social_media_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id),
  platform VARCHAR(50),
  metric_date DATE NOT NULL,
  followers INT,
  engagement_rate DECIMAL(5,2),
  posts_count INT,
  reach INT,
  imported_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, platform, metric_date)
);
```

---

## Cloud Infrastructure (DigitalOcean)

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│              DNS (DigitalOcean Networking)              │
│  *.companionconnect.app → App Platform                  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│         App Platform (Auto-scaling Deployment)          │
│  • Containers: 1-3 (based on load)                      │
│  • SSL: Wildcard (*.companionconnect.app)              │
│  • Environment: Production                              │
│  • Build: npm run build                                 │
│  • Runtime: Node.js 20                                  │
└─────────────────────────────────────────────────────────┘
         ↓                    ↓                    ↓
┌──────────────────┬────────────────────┬─────────────────┐
│   PostgreSQL     │   Spaces + CDN     │   Functions     │
│   • 1GB Dev DB   │   • Photo storage  │   • Analytics   │
│   • Daily backup │   • Static assets  │   • A/B tests   │
│   • Private net  │   • Global CDN     │   • Webhooks    │
└──────────────────┴────────────────────┴─────────────────┘
```

### Cost Breakdown

| Resource         | Configuration                        | Monthly Cost   |
| ---------------- | ------------------------------------ | -------------- |
| **App Platform** | Basic (512MB RAM, 1 container)       | $12            |
| **PostgreSQL**   | Dev Database (1GB RAM, 10GB storage) | $15            |
| **Spaces**       | 250GB storage + CDN                  | $5             |
| **Functions**    | 1M invocations/month                 | $1.85          |
| **Domain**       | companionconnect.app                 | $12/year       |
| **Total**        |                                      | **~$34/month** |

**Scaling (10 companions, high traffic):**

- App Platform Professional: $24/mo
- PostgreSQL 4GB: $60/mo
- Spaces 1TB: $20/mo
- **Total: ~$105/month**

---

## Git Workflow & Branching Strategy

### Repository Structure: Monorepo

```
companion-platform/
├── .github/workflows/       # CI/CD pipelines
├── frontend/               # React app
├── functions/              # DigitalOcean Functions
├── infrastructure/         # Terraform IaC
├── db/                     # Database schemas
└── docs/                   # Documentation
```

### Branching Strategy

```
main (production)
  ├── develop (staging)
  ├── tenant/claire (Claire's customizations)
  ├── tenant/sophie (Sophie's customizations)
  ├── tenant/jessica (Jessica's customizations)
  └── feature/* (platform features)
```

### Adding a New Companion

**Step 1: Create Branch**

```bash
git checkout -b tenant/emma develop
```

**Step 2: Copy Template**

```bash
cp -r src/tenants/_template src/tenants/emma
```

**Step 3: Customize**

```bash
# Edit theme.config.ts, content.config.ts, photos.config.ts
```

**Step 4: Upload Photos**

```bash
doctl spaces upload emma-photos/ tenants/emma/ --recursive
```

**Step 5: Database Entry**

```sql
INSERT INTO tenants (subdomain, name, theme_config, content_config, status)
VALUES ('emma', 'Emma Rose', '{"colors": {...}}', '{"name": "Emma Rose", ...}', 'preview');
```

**Step 6: Preview**

```bash
git push origin tenant/emma
# Preview at: preview-emma.companionconnect.app
```

**Step 7: Production**

```bash
git checkout main
git merge tenant/emma
git push origin main
# Live at: emma.companionconnect.app
```

---

## A/B Testing System

### Implementation Flow

1. **Define Test** (in database or config)
2. **Assign Variant** (on first visit, sticky session)
3. **Track Events** (photo views, clicks, bookings)
4. **Analyze Results** (conversion rate by variant)
5. **Declare Winner** (manual or automatic)

### Code Example

```typescript
// hooks/useABTest.ts
export function useABTest(testName: string) {
  const { tenant } = useTenant();
  const { sessionId } = useSession();

  return useQuery({
    queryKey: ['ab-test', testName, sessionId],
    queryFn: async () => {
      // Check existing assignment
      const existing = await getAssignment(sessionId, testName);
      if (existing) return existing;

      // Assign new variant (weighted random)
      const variant = await assignVariant(sessionId, testName);

      // Track assignment
      trackEvent('ab_test_assigned', {
        test_name: testName,
        variant: variant.id,
      });

      return variant;
    },
  });
}

// Component usage
function HeroSection() {
  const variant = useABTest('hero_photo');

  return (
    <img
      src={variant?.photo_url}
      alt="Hero"
      onLoad={() => trackEvent('hero_photo_viewed', {
        variant: variant.id
      })}
    />
  );
}
```

### A/B Test Dashboard

Companions can see:

- Test name and status
- Variant performance (views, conversions, rate)
- Statistical significance
- Winning variant recommendation

---

## Analytics & Tracking

### Tracked Events

| Event Type     | Description               | Data Captured             |
| -------------- | ------------------------- | ------------------------- |
| `page_view`    | Page load                 | URL, referrer, UTM params |
| `photo_click`  | Gallery photo clicked     | Photo ID, position        |
| `pricing_view` | Pricing table viewed      | Duration                  |
| `form_start`   | Booking form interaction  | Field                     |
| `form_submit`  | Booking submitted         | Service type              |
| `email_click`  | Email link clicked        | -                         |
| `phone_click`  | Phone number clicked      | -                         |
| `social_click` | Social media link clicked | Platform                  |

### Conversion Funnel

```
Page View → Photo Engagement → Pricing View → Form Start → Booking Submit
   100%           60%              40%           20%           10%
```

### Companion Dashboard Metrics

Each companion sees:

- **Overview:** Visits, unique visitors, bookings, conversion rate
- **Traffic Sources:** Instagram, Twitter, Direct, Google (with conversion rates)
- **A/B Test Results:** Active tests with variant performance
- **Conversion Funnel:** Drop-off at each stage
- **Journey Analytics:** Common paths to booking
- **Social Correlation:** (Future) Engagement vs. bookings

---

## Security & Privacy

### GDPR Compliance

- ✅ Cookie consent banner (per tenant, customizable)
- ✅ IP anonymization (last octet masked: `170.64.229.xxx`)
- ✅ Data retention: 2 years, then automatic deletion
- ✅ Right to be forgotten: Delete session data on request
- ✅ Privacy policy per tenant
- ✅ No personal data sold or shared

### Security Measures

- ✅ HTTPS enforced (wildcard SSL certificate)
- ✅ Database encryption at rest (managed by DigitalOcean)
- ✅ Environment variables for secrets
- ✅ Rate limiting (5 bookings/hour per IP)
- ✅ CSRF protection on forms
- ✅ Input sanitization (XSS prevention)
- ✅ SQL injection protection (parameterized queries)

---

## Development Workflow

### Local Development

```bash
# 1. Clone repository
git clone https://github.com/AntonyNeal/companion-platform.git
cd companion-platform

# 2. Install dependencies
npm install

# 3. Set environment variables
cp .env.example .env
# Edit .env with database credentials

# 4. Run database migrations
npm run db:migrate

# 5. Seed initial data (optional)
npm run db:seed

# 6. Start development server
npm run dev
# App runs at http://localhost:5173
# Test tenants: http://claire.localhost:5173
```

### Testing Locally

**Test Subdomain Routing:**

1. Edit your hosts file:

   ```
   # Windows: C:\Windows\System32\drivers\etc\hosts
   # Mac/Linux: /etc/hosts

   127.0.0.1 claire.localhost
   127.0.0.1 sophie.localhost
   ```

2. Visit `http://claire.localhost:5173`

### Deployment

**Automatic via GitHub Actions:**

```bash
git push origin main
# Triggers CI/CD pipeline:
# 1. Run tests
# 2. Build production bundle
# 3. Deploy to App Platform
# 4. Deploy Functions
# 5. Run health checks
```

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2) ← CURRENT

- [x] Architecture documentation
- [ ] PostgreSQL database setup
- [ ] Database schema implementation
- [ ] Tenant routing system
- [ ] Theme provider
- [ ] Template structure

### Phase 2: Core Features (Weeks 3-4)

- [ ] Reusable components (BookingForm, Gallery, etc.)
- [ ] Analytics tracking
- [ ] Session management
- [ ] Basic companion dashboard

### Phase 3: A/B Testing (Weeks 5-6)

- [ ] A/B test framework
- [ ] Photo variant testing
- [ ] A/B analytics dashboard

### Phase 4: Polish & Scale (Weeks 7-8)

- [ ] Onboard first 5 companions
- [ ] Performance optimization
- [ ] SEO per tenant
- [ ] Mobile optimization

### Phase 5: Advanced Features (Future)

- [ ] Social media API integration
- [ ] Self-service companion portal
- [ ] Payment integration
- [ ] Advanced attribution modeling

---

## Success Metrics

### Platform KPIs

- Number of active tenants: Target 5 in first month, 20 in year 1
- Platform uptime: 99.9%
- Average page load time: < 2 seconds
- Total bookings/month: Growth metric

### Per-Tenant KPIs

- Unique visitors/month
- Booking conversion rate (target: 5-10%)
- Average session duration (target: > 3 minutes)
- Photo engagement rate
- A/B test win rate (% of tests with clear winner)

---

## FAQ & Troubleshooting

### How do I add a new companion?

See "Adding a New Companion" section above.

### How do I test subdomain routing locally?

Edit your hosts file to point subdomains to localhost.

### Can companions have custom domains?

Yes, future feature. CNAME their domain to their subdomain.

### How is analytics isolated per companion?

All queries filter by `tenant_id`.

### What if a companion wants to leave?

Set their status to 'inactive', subdomain returns 404.

### How do I backup the database?

DigitalOcean automatic daily backups. Manual: `pg_dump` via connection string.

---

## Next Steps

1. **Set up PostgreSQL database** on DigitalOcean
2. **Create database schema** with all tables
3. **Restructure frontend** for multi-tenant architecture
4. **Implement tenant routing**
5. **Build template structure**
6. **Migrate Claire's site** to new structure

---

**Document Version:** 1.0  
**Last Updated:** November 7, 2025  
**Maintained By:** Development Team  
**Questions:** See README.md or create GitHub issue
