/**
 * EXAMPLE: Integrate email service into booking creation endpoint
 *
 * Add this code to your api/routes/bookings.js or api/controllers/bookingController.js
 */

const { sendBookingConfirmation } = require('../services/email');

// Example booking creation endpoint with email integration
router.post('/bookings', async (req, res) => {
  const client = req.dbClient || (await pool.connect());

  try {
    // 1. Create the booking in database
    const {
      tenantId,
      clientName,
      clientEmail,
      clientPhone,
      date,
      startTime,
      endTime,
      duration,
      location,
      outcall,
      totalAmount,
      depositAmount,
      paymentStatus,
      specialRequests,
    } = req.body;

    const bookingQuery = `
      INSERT INTO bookings (
        tenant_id, client_name, client_email, client_phone,
        date, start_time, end_time, duration, location, outcall,
        total_amount, deposit_amount, payment_status, special_requests,
        status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'confirmed', NOW())
      RETURNING *
    `;

    const bookingResult = await client.query(bookingQuery, [
      tenantId,
      clientName,
      clientEmail,
      clientPhone,
      date,
      startTime,
      endTime,
      duration,
      location,
      outcall,
      totalAmount,
      depositAmount,
      paymentStatus,
      specialRequests,
    ]);

    const booking = bookingResult.rows[0];

    // 2. Get escort/tenant details
    const escortQuery = 'SELECT id, name, email FROM tenants WHERE id = $1';
    const escortResult = await client.query(escortQuery, [tenantId]);
    const escort = escortResult.rows[0];

    // 3. Send confirmation emails
    try {
      await sendBookingConfirmation(
        {
          id: booking.id,
          date: booking.date,
          startTime: booking.start_time,
          endTime: booking.end_time,
          duration: booking.duration,
          location: booking.location,
          outcall: booking.outcall,
          totalAmount: booking.total_amount,
          depositAmount: booking.deposit_amount,
          paymentStatus: booking.payment_status,
          specialRequests: booking.special_requests,
        },
        {
          name: escort.name,
          email: escort.email,
        },
        {
          name: booking.client_name,
          email: booking.client_email,
          phone: booking.client_phone,
        }
      );

      console.log(`✓ Booking confirmation emails sent for booking ${booking.id}`);
    } catch (emailError) {
      // Log email error but don't fail the booking
      console.error('✗ Failed to send booking confirmation emails:', emailError);
      // You might want to store this error and retry later
    }

    // 4. Return success response
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message,
    });
  } finally {
    if (!req.dbClient) {
      client.release();
    }
  }
});

/**
 * ALTERNATIVE: Send emails in background (recommended for production)
 *
 * This approach ensures the booking is created even if emails fail
 */

// After creating the booking
const booking = bookingResult.rows[0];
const escort = escortResult.rows[0];

// Send emails asynchronously (non-blocking)
sendBookingConfirmation(
  {
    id: booking.id,
    date: booking.date,
    startTime: booking.start_time,
    endTime: booking.end_time,
    duration: booking.duration,
    location: booking.location,
    outcall: booking.outcall,
    totalAmount: booking.total_amount,
    depositAmount: booking.deposit_amount,
    paymentStatus: booking.payment_status,
    specialRequests: booking.special_requests,
  },
  {
    name: escort.name,
    email: escort.email,
  },
  {
    name: booking.client_name,
    email: booking.client_email,
    phone: booking.client_phone,
  }
)
  .then(() => {
    console.log(`✓ Booking confirmation emails sent for booking ${booking.id}`);
  })
  .catch((emailError) => {
    console.error(`✗ Failed to send emails for booking ${booking.id}:`, emailError);
    // TODO: Store failed email attempt in a retry queue
  });

// Return response immediately without waiting for emails
res.status(201).json({
  success: true,
  message: 'Booking created successfully',
  data: booking,
});
