// Test database connection and API endpoints
require('dotenv').config();
const db = require('./db');

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('Database URL:', process.env.DATABASE_URL ? 'Set ✅' : 'Not set ❌');

    const result = await db.query('SELECT NOW() as current_time, version()');
    console.log('✅ Database connected successfully!');
    console.log('📅 Server time:', result.rows[0].current_time);
    console.log(
      '🗄️  PostgreSQL version:',
      result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1]
    );

    console.log('\n🐑 Fetching mobs...');
    const mobs = await db.query(
      'SELECT mob_id, mob_name, breed_name, zone_name, current_stage FROM mobs'
    );
    console.log(`✅ Found ${mobs.rows.length} mobs:`);
    mobs.rows.forEach((mob) => {
      console.log(`   - ${mob.mob_name} (${mob.breed_name}) - ${mob.current_stage}`);
    });

    console.log('\n📊 Farm statistics...');
    const stats = await db.query('SELECT * FROM farm_statistics');
    console.log('✅ Stats:', JSON.stringify(stats.rows[0], null, 2));

    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
