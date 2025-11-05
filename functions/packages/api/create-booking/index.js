/**
 * DigitalOcean Function: Create Booking
 * Endpoint: POST /api/bookings
 *
 * Receives booking submission from frontend, validates data,
 * creates booking record with UTM attribution, and triggers email notifications
 */

const pg = require('pg');
const { Pool } = pg;

// Input validation
const Joi = require('joi');
const crypto = require('crypto');

// Initialize connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // DigitalOcean managed DB requires this
  },
});

// Validation schema
const bookingSchema = Joi.object({
  firstName: Joi.string().min(2).max(255).required().trim(),
  lastName: Joi.string().min(2).max(255).required().trim(),
  email: Joi.string().email().required().lowercase(),
  phone: Joi.string()
    .regex(/^\+?[0-9\s\-()]{10,}$/)
    .required(),
  dateOfBirth: Joi.date().iso().required(),
  gender: Joi.string().max(50),
  appointmentType: Joi.string().max(255).required(),
  appointmentDate: Joi.date().iso().required(),
  appointmentTime: Joi.string()
    .regex(/^\d{2}:\d{2}$/)
    .required(),
  notes: Joi.string().max(2000),
  userId: Joi.string().required(),
  utmSource: Joi.string().max(255),
  utmMedium: Joi.string().max(255),
  utmCampaign: Joi.string().max(255),
  utmContent: Joi.string().max(255),
  utmTerm: Joi.string().max(255),
  deviceType: Joi.string().max(50),
  userAgent: Joi.string().max(500),
  ipAddressHash: Joi.string().max(64),
});

/**
 * Generate confirmation number: CH-YYYYMMDD-###
 */
async function generateConfirmationNumber(client) {
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');

  // Query existing confirmations for today
  const result = await client.query(
    `SELECT confirmation_number FROM bookings 
     WHERE confirmation_number LIKE $1 
     ORDER BY confirmation_number DESC LIMIT 1`,
    [`CH-${today}-%`]
  );

  let nextNum = 1;
  if (result.rows.length > 0) {
    const lastNum = parseInt(result.rows[0].confirmation_number.split('-')[2]);
    nextNum = lastNum + 1;
  }

  return `CH-${today}-${String(nextNum).padStart(3, '0')}`;
}

/**
 * Check for duplicate bookings (same email + date + time within 1 hour)
 */
async function checkDuplicate(client, email, date, time) {
  const result = await client.query(
    `SELECT id FROM bookings 
     WHERE email = $1 
     AND appointment_date = $2 
     AND appointment_time = $3
     AND created_at > NOW() - INTERVAL '1 hour'`,
    [email, date, time]
  );

  return result.rows.length > 0;
}

/**
 * Hash IP address for privacy (don't store raw IPs)
 */
function hashIpAddress(ip) {
  if (!ip) return null;
  return crypto.createHash('sha256').update(ip).digest('hex');
}

/**
 * Get client IP from request (supports proxies)
 */
function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

/**
 * Main handler
 */
async function booking(req, res) {
  // Set CORS headers
  res.setHeader(
    'Access-Control-Allow-Origin',
    process.env.ALLOWED_ORIGIN || 'https://clairehamilton.com.au'
  );
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.json({ success: false, error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' });
    return;
  }

  let client;
  try {
    // Parse and validate request body
    let body = req.body;
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }

    // Validate input
    const { error, value } = bookingSchema.validate(body, { abortEarly: false });
    if (error) {
      res.statusCode = 400;
      res.json({
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.details.map((e) => e.message),
      });
      return;
    }

    // Get database connection
    client = await pool.connect();

    // Check for duplicates
    const isDuplicate = await checkDuplicate(
      client,
      value.email,
      value.appointmentDate,
      value.appointmentTime
    );
    if (isDuplicate) {
      res.statusCode = 409;
      res.json({
        success: false,
        error: 'Duplicate booking detected. Please check your email for existing bookings.',
        code: 'DUPLICATE_BOOKING',
      });
      return;
    }

    // Generate confirmation number
    const confirmationNumber = await generateConfirmationNumber(client);

    // Get user IP (hashed for privacy)
    const clientIp = getClientIp(req);
    const ipHash = hashIpAddress(clientIp);

    // Start transaction
    await client.query('BEGIN');

    try {
      // Find user session (created earlier by /api/sessions/register)
      const sessionResult = await client.query(
        `SELECT id FROM user_sessions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [value.userId]
      );

      const userSessionId = sessionResult.rows[0]?.id || null;

      // Create booking
      const bookingResult = await client.query(
        `INSERT INTO bookings (
          first_name, last_name, email, phone, date_of_birth, gender,
          appointment_type, appointment_date, appointment_time, notes,
          confirmation_number, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
          user_session_id, created_ip_hash, user_agent, status, payment_status
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
        ) RETURNING id`,
        [
          value.firstName,
          value.lastName,
          value.email,
          value.phone,
          value.dateOfBirth,
          value.appointmentDate,
          value.appointmentTime,
          value.notes,
          confirmationNumber,
          value.utmSource || null,
          value.utmMedium || null,
          value.utmCampaign || null,
          value.utmContent || null,
          value.utmTerm || null,
          userSessionId,
          ipHash,
          value.userAgent || null,
          'pending',
          'unpaid',
        ]
      );

      const bookingId = bookingResult.rows[0].id;

      // Create conversion event
      await client.query(
        `INSERT INTO conversions (user_session_id, booking_id, event_type, event_data)
         VALUES ($1, $2, $3, $4)`,
        [
          userSessionId,
          bookingId,
          'booking_confirmed',
          JSON.stringify({
            appointmentType: value.appointmentType,
            appointmentDate: value.appointmentDate,
            device: value.deviceType,
          }),
        ]
      );

      // Create email log records
      await client.query(
        `INSERT INTO email_logs (recipient_email, email_type, subject, booking_id, status)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          value.email,
          'booking_confirmation',
          `Booking Confirmed - ${confirmationNumber}`,
          bookingId,
          'pending',
        ]
      );

      if (process.env.CLAIRE_NOTIFICATION_EMAIL) {
        await client.query(
          `INSERT INTO email_logs (recipient_email, email_type, subject, booking_id, status)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            process.env.CLAIRE_NOTIFICATION_EMAIL,
            'claire_notification',
            `New Booking: ${value.firstName} ${value.lastName} - ${value.appointmentDate}`,
            bookingId,
            'pending',
          ]
        );
      }

      // Commit transaction
      await client.query('COMMIT');

      // Queue email sends (async, don't wait)
      queueEmailSends(bookingId, value).catch((e) => {
        console.error('Error queuing emails:', e);
      });

      // Return success response
      res.statusCode = 201;
      res.json({
        success: true,
        appointmentId: bookingId,
        confirmationNumber,
        message: 'Booking submitted successfully. Check your email for confirmation.',
      });
    } catch (txError) {
      // Rollback on error
      await client.query('ROLLBACK');
      throw txError;
    }
  } catch (err) {
    console.error('Booking error:', {
      error: err.message,
      code: err.code,
      stack: err.stack,
    });

    res.statusCode = 500;
    res.json({
      success: false,
      error: 'Failed to create booking. Please try again or contact support.',
      code: 'BOOKING_ERROR',
    });
  } finally {
    if (client) {
      client.release();
    }
  }
}

/**
 * Queue email sends (non-blocking)
 * In production, use a queue like Bull or RabbitMQ
 * For now, use serverless to call send-emails function
 */
async function queueEmailSends(bookingId, bookingData) {
  try {
    // Option 1: Call the send-emails function via HTTP (if deployed)
    // const response = await fetch(`${process.env.FUNCTIONS_BASE_URL}/api/send-emails`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ bookingId, bookingData }),
    // });

    // Option 2: Use SendGrid directly (simpler for now)
    await sendBookingEmails(bookingId, bookingData);
  } catch (error) {
    console.error('Error queueing emails:', error);
    // Log to database but don't fail the booking
  }
}

/**
 * Send booking confirmation emails via SendGrid
 */
async function sendBookingEmails(bookingId, bookingData) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY not set, skipping email sends');
    return;
  }

  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const confirmationNumber = bookingData.confirmationNumber || 'N/A';
  const customerName = `${bookingData.firstName} ${bookingData.lastName}`;
  const appointmentDate = new Date(bookingData.appointmentDate).toLocaleDateString('en-AU');
  const appointmentTime = bookingData.appointmentTime;

  try {
    // Email 1: Customer confirmation
    await sgMail.send({
      to: bookingData.email,
      from: process.env.SENDGRID_FROM_EMAIL || 'bookings@clairehamilton.com.au',
      subject: `Booking Confirmed - ${confirmationNumber}`,
      html: generateCustomerEmailHTML(
        customerName,
        confirmationNumber,
        appointmentDate,
        appointmentTime
      ),
      text: generateCustomerEmailText(
        customerName,
        confirmationNumber,
        appointmentDate,
        appointmentTime
      ),
    });

    // Email 2: Claire's notification
    if (process.env.CLAIRE_NOTIFICATION_EMAIL) {
      await sgMail.send({
        to: process.env.CLAIRE_NOTIFICATION_EMAIL,
        from: process.env.SENDGRID_FROM_EMAIL || 'bookings@clairehamilton.com.au',
        subject: `New Booking: ${customerName} - ${appointmentDate}`,
        text: generateClaireNotificationText(bookingData, confirmationNumber),
      });
    }

    // Update email logs to 'sent'
    const client = await pool.connect();
    try {
      await client.query(
        `UPDATE email_logs SET status = 'sent', sent_at = NOW() 
         WHERE booking_id = $1 AND status = 'pending'`,
        [bookingId]
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error sending emails:', error);
    // Log failure but don't block
  }
}

/**
 * Email templates
 */
function generateCustomerEmailHTML(name, confirmation, date, time) {
  return `
    <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f9a8d4 0%, #ffd4e5 100%); padding: 30px; text-align: center; color: #333; }
          .content { padding: 20px; background: #fafafa; }
          .confirmation { font-size: 24px; font-weight: bold; color: #c94d7e; margin: 20px 0; }
          .details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { font-size: 12px; color: #666; text-align: center; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmed!</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for booking with Claire Hamilton. Your booking has been confirmed!</p>
            
            <div class="confirmation">
              Confirmation #${confirmation}
            </div>
            
            <div class="details">
              <strong>Appointment Details:</strong><br>
              Date: ${date}<br>
              Time: ${time}<br>
            </div>
            
            <p><strong>Cancellation Policy:</strong><br>
            24 hours notice required for cancellations. Text to confirm your booking.
            </p>
            
            <p><strong>Questions?</strong><br>
            Text or WhatsApp: 0400 000 000<br>
            Email: claire@clairehamilton.com.au
            </p>
            
            <p>Looking forward to meeting you!</p>
            <p>Claire</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateCustomerEmailText(name, confirmation, date, time) {
  return `
Booking Confirmed!

Hi ${name},

Thank you for booking with Claire Hamilton. Your booking has been confirmed!

CONFIRMATION #${confirmation}

Appointment Details:
Date: ${date}
Time: ${time}

Cancellation Policy:
24 hours notice required for cancellations. Text to confirm your booking.

Questions?
Text or WhatsApp: 0400 000 000
Email: claire@clairehamilton.com.au

Looking forward to meeting you!
Claire

---
This is an automated message. Please do not reply to this email.
  `;
}

function generateClaireNotificationText(booking, confirmation) {
  return `
New Booking Received

Customer: ${booking.firstName} ${booking.lastName}
Email: ${booking.email}
Phone: ${booking.phone}
Date of Birth: ${booking.dateOfBirth}
Gender: ${booking.gender}

Appointment:
Type: ${booking.appointmentType}
Date: ${booking.appointmentDate}
Time: ${booking.appointmentTime}

Notes: ${booking.notes || 'None'}

Attribution:
Platform: ${booking.utmSource || 'Direct'}
Campaign: ${booking.utmCampaign || 'None'}
Device: ${booking.deviceType || 'Unknown'}

Confirmation #: ${confirmation}
  `;
}

module.exports = booking;
