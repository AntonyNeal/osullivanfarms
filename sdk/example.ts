/**
 * SDK Usage Example
 * Demonstrates how to use the Companion SDK in a real application
 */

import { 
  TenantDataSource, 
  AvailabilityDataSource,
  LocationDataSource,
  BookingDataSource,
  AnalyticsDataSource,
  type Tenant,
  type AvailabilitySlot,
  type Booking
} from './src/index';

async function exampleUsage() {
  try {
    console.log('🚀 Companion SDK Example\n');

    // 1. Get current tenant
    console.log('1️⃣ Fetching tenant...');
    const tenant: Tenant = await TenantDataSource.getBySubdomain('claire');
    console.log(`   ✅ Tenant: ${tenant.name} (${tenant.subdomain})`);
    console.log(`   📧 Email: ${tenant.email}`);
    console.log(`   🌐 Domain: ${tenant.customDomain || 'N/A'}\n`);

    // 2. Initialize analytics
    console.log('2️⃣ Initializing analytics...');
    const sessionId = await AnalyticsDataSource.initialize(tenant.id, {
      utmSource: 'example',
      utmMedium: 'sdk_test',
      utmCampaign: 'demo',
    });
    console.log(`   ✅ Session: ${sessionId}\n`);

    // 3. Get locations
    console.log('3️⃣ Fetching locations...');
    const locations = await LocationDataSource.getByTenant(parseInt(tenant.id));
    console.log(`   ✅ Found ${locations.length} locations:`);
    locations.forEach(loc => {
      console.log(`      - ${loc.city}, ${loc.country} (${loc.locationType})`);
      if (loc.availableDatesCount) {
        console.log(`        Available dates: ${loc.availableDatesCount}`);
      }
    });
    console.log('');

    // 4. Check availability
    console.log('4️⃣ Checking availability...');
    const testDate = '2025-12-02';
    const { available, slot } = await AvailabilityDataSource.checkDate(
      parseInt(tenant.id),
      testDate
    );
    console.log(`   📅 Date: ${testDate}`);
    console.log(`   ${available ? '✅' : '❌'} Status: ${available ? 'Available' : 'Not Available'}`);
    if (slot) {
      console.log(`   ⏰ Time: ${slot.timeSlotStart || 'All Day'}`);
    }
    console.log('');

    // 5. Get availability calendar
    console.log('5️⃣ Fetching availability calendar...');
    const calendar = await AvailabilityDataSource.getCalendar(
      parseInt(tenant.id),
      '2025-12-01',
      '2025-12-31'
    );
    const availableSlots = calendar.filter(s => s.status === 'available');
    console.log(`   ✅ Total slots: ${calendar.length}`);
    console.log(`   📅 Available: ${availableSlots.length}`);
    console.log(`   🚫 Booked: ${calendar.filter(s => s.status === 'booked').length}\n`);

    // 6. Get tenant bookings
    console.log('6️⃣ Fetching bookings...');
    const { data: bookings, pagination } = await BookingDataSource.getByTenant(
      parseInt(tenant.id)
    );
    console.log(`   ✅ Total bookings: ${pagination.total}`);
    console.log(`   📄 Current page: ${pagination.page} of ${pagination.totalPages}`);
    if (bookings.length > 0) {
      console.log(`   Latest booking:`);
      const latest = bookings[0];
      console.log(`      - Client: ${latest.clientName}`);
      console.log(`      - Date: ${latest.startDate}`);
      console.log(`      - Status: ${latest.status}`);
    }
    console.log('');

    // 7. Get analytics summary
    console.log('7️⃣ Fetching analytics...');
    const summary = await AnalyticsDataSource.getSummary(
      parseInt(tenant.id),
      '2025-01-01',
      '2025-12-31'
    );
    console.log(`   📊 Analytics Summary:`);
    console.log(`      - Total Bookings: ${summary.totalBookings}`);
    console.log(`      - Confirmed: ${summary.confirmedBookings}`);
    console.log(`      - Pending: ${summary.pendingBookings}`);
    console.log(`      - Conversion Rate: ${summary.conversionRate}%`);
    console.log('');

    console.log('✨ All operations completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
  }
}

// Run example
exampleUsage();
