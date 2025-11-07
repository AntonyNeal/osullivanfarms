# Companion SDK

TypeScript/JavaScript SDK for the Companion Platform API. Provides clean, type-safe data sources for building companion websites.

## Installation

### NPM (recommended for build tools)
```bash
npm install @clairehamilton/companion-sdk
```

### CDN (for direct browser use)
```html
<script src="https://cdn.clairehamilton.vip/companion-sdk@1.0.0.js"></script>
```

## Quick Start

### ESM (Modern)
```typescript
import { TenantDataSource, BookingDataSource, AnalyticsDataSource } from '@clairehamilton/companion-sdk';

// Get current tenant
const tenant = await TenantDataSource.getCurrent();

// Initialize analytics
const sessionId = await AnalyticsDataSource.initialize(tenant.id);

// Create a booking
const booking = await BookingDataSource.create({
  tenantId: tenant.id,
  locationId: 1,
  clientName: 'John Doe',
  clientEmail: 'john@example.com',
  clientPhone: '+1234567890',
  serviceType: 'makeup',
  startDate: '2025-01-15',
  endDate: '2025-01-15',
  durationHours: 3,
});
```

### CommonJS (Node.js)
```javascript
const { TenantDataSource, BookingDataSource } = require('@clairehamilton/companion-sdk');

async function main() {
  const tenant = await TenantDataSource.getBySubdomain('claire');
  console.log(tenant);
}
```

### Browser (CDN)
```html
<script src="https://cdn.clairehamilton.vip/companion-sdk@1.0.0.js"></script>
<script>
  const { TenantDataSource, AnalyticsDataSource } = window.CompanionSDK;
  
  (async () => {
    const tenant = await TenantDataSource.getCurrent();
    await AnalyticsDataSource.initialize(tenant.id);
  })();
</script>
```

## Data Sources

### TenantDataSource

Manage tenant information and discovery.

```typescript
// Get tenant by subdomain
const tenant = await TenantDataSource.getBySubdomain('claire');

// Get tenant by custom domain
const tenant = await TenantDataSource.getByDomain('clairehamilton.vip');

// Auto-detect current tenant from hostname
const tenant = await TenantDataSource.getCurrent();

// List all tenants (admin only)
const { data, pagination } = await TenantDataSource.list(1, 20);
```

### AvailabilityDataSource

Check availability and calendar slots.

```typescript
// Get availability calendar
const slots = await AvailabilityDataSource.getCalendar(
  tenantId,
  '2025-01-01',
  '2025-12-31'
);

// Check specific date
const { available, slot } = await AvailabilityDataSource.checkDate(
  tenantId,
  '2025-01-15'
);

// Get list of available dates
const dates = await AvailabilityDataSource.getAvailableDates(
  tenantId,
  '2025-01-01',
  '2025-01-31'
);
```

### LocationDataSource

Retrieve location information.

```typescript
// Get all locations for tenant
const locations = await LocationDataSource.getByTenant(tenantId);

// Get locations grouped by country
const grouped = await LocationDataSource.getGroupedByCountry(tenantId);
// { "Australia": [...], "New Zealand": [...] }

// Get only locations with availability
const available = await LocationDataSource.getAvailable(tenantId);
```

### BookingDataSource

Create and manage bookings.

```typescript
// Create booking
const booking = await BookingDataSource.create({
  tenantId: 1,
  locationId: 5,
  clientName: 'Jane Smith',
  clientEmail: 'jane@example.com',
  clientPhone: '+1234567890',
  serviceType: 'hair_styling',
  startDate: '2025-02-14',
  endDate: '2025-02-14',
  durationHours: 4,
  specialRequests: 'Bridal styling',
  utmSource: 'instagram',
  utmCampaign: 'valentine_promo',
});

// Get booking by ID
const booking = await BookingDataSource.getById(123);

// Update status
await BookingDataSource.confirm(123);
await BookingDataSource.cancel(123, 'Client requested cancellation');

// Get tenant bookings
const { data, pagination } = await BookingDataSource.getByTenant(
  tenantId,
  'confirmed', // status filter
  1,           // page
  20           // limit
);
```

### AnalyticsDataSource

Track user sessions and events.

```typescript
// Initialize session (automatic tracking)
const sessionId = await AnalyticsDataSource.initialize(tenantId, {
  utmSource: 'google',
  utmCampaign: 'summer_2025',
});

// Track custom events
await AnalyticsDataSource.track(
  'button_click',
  'engagement',
  'book_now_cta',
  1
);

// Manual session creation
const session = await AnalyticsDataSource.createSession({
  tenantId: 1,
  utmSource: 'facebook',
  utmMedium: 'cpc',
});

// Get analytics summary
const summary = await AnalyticsDataSource.getSummary(
  tenantId,
  '2025-01-01',
  '2025-01-31'
);
// { totalSessions, uniqueVisitors, totalPageViews, bounceRate, ... }
```

## TypeScript Support

Full TypeScript definitions included:

```typescript
import type { 
  Tenant, 
  Booking, 
  AvailabilitySlot, 
  Location,
  AnalyticsSummary 
} from '@clairehamilton/companion-sdk';

const tenant: Tenant = await TenantDataSource.getCurrent();
```

## Configuration

### Custom API Endpoint

```typescript
import { ApiClient, TenantDataSource } from '@clairehamilton/companion-sdk';

// Override base URL
const client = new ApiClient('https://api.example.com');
TenantDataSource['client'] = client; // Access private client
```

### Error Handling

```typescript
try {
  const tenant = await TenantDataSource.getBySubdomain('invalid');
} catch (error) {
  console.error('Failed to fetch tenant:', error.message);
}
```

## Examples

### Complete Booking Flow

```typescript
import { 
  TenantDataSource, 
  AvailabilityDataSource, 
  BookingDataSource,
  AnalyticsDataSource 
} from '@clairehamilton/companion-sdk';

async function bookingFlow() {
  // 1. Detect tenant
  const tenant = await TenantDataSource.getCurrent();
  
  // 2. Initialize analytics
  const sessionId = await AnalyticsDataSource.initialize(tenant.id);
  
  // 3. Check availability
  const { available } = await AvailabilityDataSource.checkDate(
    tenant.id,
    '2025-03-20'
  );
  
  if (!available) {
    await AnalyticsDataSource.track('availability_check', 'booking', 'date_unavailable');
    throw new Error('Date not available');
  }
  
  // 4. Create booking
  const booking = await BookingDataSource.create({
    tenantId: tenant.id,
    locationId: 1,
    clientName: 'Sarah Johnson',
    clientEmail: 'sarah@example.com',
    clientPhone: '+61412345678',
    serviceType: 'makeup',
    startDate: '2025-03-20',
    endDate: '2025-03-20',
    durationHours: 3,
  });
  
  // 5. Track conversion
  await AnalyticsDataSource.track('booking_created', 'conversion', 'makeup', booking.id);
  
  return booking;
}
```

## Browser Compatibility

- Modern browsers (ES2020+)
- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+

## License

MIT

## Support

- Repository: https://github.com/AntonyNeal/sw_website
- Issues: https://github.com/AntonyNeal/sw_website/issues
