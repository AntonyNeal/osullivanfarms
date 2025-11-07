/**
 * Seed Claire's Tenant Data with Locations and Availability
 *
 * Inserts minimal configuration for Claire Hamilton into the tenants table,
 * plus location and availability data for booking functionality.
 * Design, content, and styling remain in frontend code for full artistic control.
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read database credentials from .env
const envFile = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
const getEnvVar = (key) => {
  const match = envFile.match(new RegExp(`${key}=(.+)`));
  return match ? match[1].trim() : null;
};

const client = new Client({
  host: getEnvVar('DB_HOST'),
  port: parseInt(getEnvVar('DB_PORT')),
  database: getEnvVar('DB_NAME'),
  user: getEnvVar('DB_USER'),
  password: getEnvVar('DB_PASSWORD'),
  ssl: { rejectUnauthorized: false },
});

async function seedClaire() {
  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Step 1: Create/Update Tenant
    const claireTenant = {
      subdomain: 'claire',
      custom_domain: 'clairehamilton.com.au', // Updated to new domain
      name: 'Claire Hamilton',
      email: 'info@clairehamilton.vip',
      status: 'active',
      theme_config: {},
      content_config: {
        booking_enabled: true,
        analytics_enabled: true,
        ab_testing_enabled: true,
        availability_enabled: true, // Enable availability tracking
        social_media: {
          twitter: 'https://x.com/ClaireSydney_',
        },
      },
    };

    console.log("📝 Step 1: Inserting Claire's tenant record...\n");

    const tenantResult = await client.query(
      `INSERT INTO tenants (
        subdomain, custom_domain, name, email, status, theme_config, content_config
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (subdomain) 
      DO UPDATE SET
        custom_domain = EXCLUDED.custom_domain,
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        status = EXCLUDED.status,
        theme_config = EXCLUDED.theme_config,
        content_config = EXCLUDED.content_config,
        updated_at = NOW()
      RETURNING id, subdomain, name, created_at`,
      [
        claireTenant.subdomain,
        claireTenant.custom_domain,
        claireTenant.name,
        claireTenant.email,
        claireTenant.status,
        JSON.stringify(claireTenant.theme_config),
        JSON.stringify(claireTenant.content_config),
      ]
    );

    const tenantId = tenantResult.rows[0].id;
    console.log('✅ Tenant created!');
    console.log('   ID:', tenantId);
    console.log('   Subdomain:', tenantResult.rows[0].subdomain);

    // Step 2: Add Home Location (Sydney)
    console.log('\n📍 Step 2: Adding home location (Sydney)...\n');

    // First, check if location exists
    const existingLocation = await client.query(
      `SELECT id, city FROM locations WHERE tenant_id = $1 AND city = $2`,
      [tenantId, 'Sydney']
    );

    let locationId;
    if (existingLocation.rows.length > 0) {
      locationId = existingLocation.rows[0].id;
      console.log('✅ Home location exists:', existingLocation.rows[0].city);
    } else {
      const sydneyLocation = await client.query(
        `INSERT INTO locations (
          tenant_id, location_type, city, state_province, country, country_name,
          latitude, longitude, available_from, is_current, is_public, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id, city, location_type`,
        [
          tenantId,
          'home',
          'Sydney',
          'NSW',
          'AU',
          'Australia',
          -33.8688, // Sydney coordinates
          151.2093,
          '2024-01-01', // Always available from home location
          true, // is_current (currently at this location)
          true, // is_public (show on website)
          'Home base - Sydney, Australia',
        ]
      );
      locationId = sydneyLocation.rows[0].id;
      console.log('✅ Home location added:', sydneyLocation.rows[0].city);
    }

    // Step 3: Add Sample Availability Calendar
    console.log('\n📅 Step 3: Adding availability calendar...\n');

    const today = new Date();
    const availabilityDates = [];

    // Add next 90 days of availability
    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

      // Skip past dates
      if (date < today) continue;

      // Available Tuesday through Saturday (skip Sunday/Monday for example)
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 1) {
        availabilityDates.push({
          date: date.toISOString().split('T')[0],
          status: 'available',
        });
      }
    }

    // Insert availability in batch
    let inserted = 0;
    for (const avail of availabilityDates) {
      try {
        await client.query(
          `INSERT INTO availability_calendar (
            tenant_id, date, status, is_all_day
          ) VALUES ($1, $2, $3, $4)`,
          [tenantId, avail.date, avail.status, true]
        );
        inserted++;
      } catch (err) {
        // Skip if already exists
        if (err.code !== '23505') {
          throw err;
        }
      }
    }

    console.log(`✅ Added ${availabilityDates.length} available dates`);
    console.log(
      '   Date range:',
      availabilityDates[0]?.date,
      'to',
      availabilityDates[availabilityDates.length - 1]?.date
    );

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log("🎉 Claire's complete tenant setup finished!\n");
    console.log('Tenant Details:');
    console.log('  ID:', tenantId);
    console.log('  Subdomain: claire');
    console.log('  Custom Domain: clairehamilton.com.au');
    console.log('  Status: active');
    console.log('\n📍 Locations:');
    console.log('  ✓ Sydney (home base)');
    console.log('\n📅 Availability:');
    console.log(`  ✓ ${availabilityDates.length} dates available`);
    console.log('  ✓ Tuesday-Saturday (example schedule)');
    console.log('\n✨ Features Enabled:');
    console.log('  ✓ Booking system');
    console.log('  ✓ Availability tracking');
    console.log('  ✓ Analytics');
    console.log('  ✓ A/B testing');
    console.log('\n🎨 Frontend design remains in: src/tenants/claire/');
    console.log('   All design/content controlled by frontend code.');
    console.log('='.repeat(60));

    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    await client.end();
  }
}

seedClaire();
