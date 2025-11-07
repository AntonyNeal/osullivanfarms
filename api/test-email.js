require('dotenv').config();
const { sendTestEmail, sendBookingConfirmation } = require('./services/email');

// Test email address - CHANGE THIS to your email
const TEST_EMAIL = process.argv[2] || 'your-email@example.com';

console.log('\n🧪 Testing SendGrid Email Service\n');
console.log('═══════════════════════════════════════════════════════════\n');

// Test 1: Send simple test email
async function testSimpleEmail() {
  console.log('Test 1: Sending simple test email...');
  console.log(`   To: ${TEST_EMAIL}\n`);

  try {
    await sendTestEmail(TEST_EMAIL);
    console.log('   ✓ Test email sent successfully!\n');
    return true;
  } catch (error) {
    console.error('   ✗ Failed to send test email\n');
    console.error('   Error:', error.message);
    return false;
  }
}

// Test 2: Send booking confirmation emails
async function testBookingConfirmation() {
  console.log('Test 2: Sending booking confirmation emails...\n');

  // Mock booking data
  const mockBooking = {
    id: 'TEST-' + Date.now(),
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    startTime: '7:00 PM',
    endTime: '11:00 PM',
    duration: 4,
    location: 'Sydney CBD',
    outcall: false,
    totalAmount: 2000,
    depositAmount: 500,
    paymentStatus: 'Deposit Paid',
    specialRequests: 'Prefer discreet location, dinner included',
  };

  const mockEscort = {
    name: 'Claire Hamilton',
    email: TEST_EMAIL, // Send to test email
  };

  const mockClient = {
    name: 'John Smith',
    email: TEST_EMAIL, // Send to test email
    phone: '+61 412 345 678',
  };

  try {
    await sendBookingConfirmation(mockBooking, mockEscort, mockClient);
    console.log('   ✓ Booking confirmation emails sent successfully!\n');
    return true;
  } catch (error) {
    console.error('   ✗ Failed to send booking confirmation\n');
    console.error('   Error:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  if (TEST_EMAIL === 'your-email@example.com') {
    console.error('❌ ERROR: Please provide your email address as an argument\n');
    console.log('Usage: node test-email.js your-email@example.com\n');
    process.exit(1);
  }

  console.log(`Testing with email: ${TEST_EMAIL}\n`);
  console.log('═══════════════════════════════════════════════════════════\n');

  const test1 = await testSimpleEmail();
  const test2 = await testBookingConfirmation();

  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('📊 Test Results:\n');
  console.log(`   Simple Test Email: ${test1 ? '✓ PASSED' : '✗ FAILED'}`);
  console.log(`   Booking Confirmation: ${test2 ? '✓ PASSED' : '✗ FAILED'}`);
  console.log('\n═══════════════════════════════════════════════════════════\n');

  if (test1 && test2) {
    console.log('✅ All tests passed! Check your email inbox.\n');
    console.log('Next steps:');
    console.log("1. Check spam/junk folder if you don't see the emails");
    console.log('2. Integrate email service into your booking endpoint');
    console.log('3. Set up sender authentication in SendGrid (optional)\n');
  } else {
    console.log('❌ Some tests failed. Check the error messages above.\n');
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  console.error('\n❌ Unexpected error:', error);
  process.exit(1);
});
