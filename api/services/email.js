const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API key from environment
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const SENDER_EMAIL = 'noreply@avaliable.pro';
const SENDER_NAME = 'Avaliable.pro Bookings';

/**
 * Send booking confirmation email to client
 */
async function sendClientBookingConfirmation(booking, escort, client) {
  const msg = {
    to: client.email,
    from: {
      email: SENDER_EMAIL,
      name: SENDER_NAME,
    },
    subject: `Booking Confirmation - ${escort.name}`,
    text: `
Hi ${client.name},

Your booking has been confirmed!

BOOKING DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Companion: ${escort.name}
Date: ${new Date(booking.date).toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Time: ${booking.startTime} - ${booking.endTime}
Duration: ${booking.duration} hours
Location: ${booking.location}
${booking.outcall ? 'Type: Outcall' : 'Type: Incall'}

PAYMENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Amount: $${booking.totalAmount}
Deposit Paid: $${booking.depositAmount}
Balance Due: $${booking.totalAmount - booking.depositAmount}
Payment Status: ${booking.paymentStatus}

${booking.specialRequests ? `SPECIAL REQUESTS:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${booking.specialRequests}\n\n` : ''}
BOOKING REFERENCE: ${booking.id}

If you need to make any changes or have questions, please reply to this email.

Looking forward to seeing you!

Best regards,
${escort.name}
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px; background: #f9f9f9; }
    .section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .section h2 { margin-top: 0; color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .detail-label { font-weight: bold; color: #666; }
    .detail-value { color: #333; }
    .highlight { background: #667eea; color: white; padding: 15px; border-radius: 8px; text-align: center; font-size: 18px; font-weight: bold; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>✓ Booking Confirmed</h1>
    <p>Your appointment with ${escort.name}</p>
  </div>
  
  <div class="content">
    <p>Hi ${client.name},</p>
    <p>Your booking has been confirmed! We're excited to see you.</p>
    
    <div class="section">
      <h2>📅 Booking Details</h2>
      <div class="detail-row">
        <span class="detail-label">Companion:</span>
        <span class="detail-value">${escort.name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Date:</span>
        <span class="detail-value">${new Date(booking.date).toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Time:</span>
        <span class="detail-value">${booking.startTime} - ${booking.endTime}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Duration:</span>
        <span class="detail-value">${booking.duration} hours</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Location:</span>
        <span class="detail-value">${booking.location}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Type:</span>
        <span class="detail-value">${booking.outcall ? 'Outcall' : 'Incall'}</span>
      </div>
    </div>
    
    <div class="section">
      <h2>💳 Payment Details</h2>
      <div class="detail-row">
        <span class="detail-label">Total Amount:</span>
        <span class="detail-value">$${booking.totalAmount}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Deposit Paid:</span>
        <span class="detail-value">$${booking.depositAmount}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Balance Due:</span>
        <span class="detail-value"><strong>$${booking.totalAmount - booking.depositAmount}</strong></span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Payment Status:</span>
        <span class="detail-value">${booking.paymentStatus}</span>
      </div>
    </div>
    
    ${
      booking.specialRequests
        ? `
    <div class="section">
      <h2>📝 Special Requests</h2>
      <p>${booking.specialRequests}</p>
    </div>
    `
        : ''
    }
    
    <div class="highlight">
      Booking Reference: ${booking.id}
    </div>
    
    <p style="margin-top: 30px;">If you need to make any changes or have questions, please reply to this email.</p>
    <p>Looking forward to seeing you!</p>
    <p><strong>${escort.name}</strong></p>
  </div>
  
  <div class="footer">
    <p>This is an automated confirmation from Avaliable.pro</p>
    <p>© ${new Date().getFullYear()} Avaliable.pro - Premium Companion Platform</p>
  </div>
</body>
</html>
    `.trim(),
  };

  try {
    const result = await sgMail.send(msg);
    console.log(`✓ Client confirmation email sent to ${client.email}`);
    return result;
  } catch (error) {
    console.error('✗ Failed to send client confirmation email:', error);
    if (error.response) {
      console.error('SendGrid error details:', error.response.body);
    }
    throw error;
  }
}

/**
 * Send booking notification email to escort
 */
async function sendEscortBookingNotification(booking, escort, client) {
  const msg = {
    to: escort.email,
    from: {
      email: SENDER_EMAIL,
      name: SENDER_NAME,
    },
    subject: `New Booking - ${client.name}`,
    text: `
Hi ${escort.name},

You have a new booking!

CLIENT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${client.name}
Email: ${client.email}
Phone: ${client.phone}

BOOKING DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date: ${new Date(booking.date).toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Time: ${booking.startTime} - ${booking.endTime}
Duration: ${booking.duration} hours
Location: ${booking.location}
${booking.outcall ? 'Type: Outcall' : 'Type: Incall'}

PAYMENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Amount: $${booking.totalAmount}
Deposit Received: $${booking.depositAmount}
Balance Due: $${booking.totalAmount - booking.depositAmount}
Payment Status: ${booking.paymentStatus}

${booking.specialRequests ? `SPECIAL REQUESTS:\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${booking.specialRequests}\n\n` : ''}
BOOKING REFERENCE: ${booking.id}

View full details in your admin dashboard:
https://avaliable.pro/admin

Best regards,
Avaliable.pro Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px; background: #f9f9f9; }
    .section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .section h2 { margin-top: 0; color: #28a745; border-bottom: 2px solid #28a745; padding-bottom: 10px; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .detail-label { font-weight: bold; color: #666; }
    .detail-value { color: #333; }
    .highlight { background: #28a745; color: white; padding: 15px; border-radius: 8px; text-align: center; font-size: 18px; font-weight: bold; }
    .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎉 New Booking!</h1>
    <p>You have a new client appointment</p>
  </div>
  
  <div class="content">
    <p>Hi ${escort.name},</p>
    <p>Great news! You have a new booking.</p>
    
    <div class="section">
      <h2>👤 Client Details</h2>
      <div class="detail-row">
        <span class="detail-label">Name:</span>
        <span class="detail-value">${client.name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Email:</span>
        <span class="detail-value">${client.email}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Phone:</span>
        <span class="detail-value">${client.phone}</span>
      </div>
    </div>
    
    <div class="section">
      <h2>📅 Booking Details</h2>
      <div class="detail-row">
        <span class="detail-label">Date:</span>
        <span class="detail-value">${new Date(booking.date).toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Time:</span>
        <span class="detail-value">${booking.startTime} - ${booking.endTime}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Duration:</span>
        <span class="detail-value">${booking.duration} hours</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Location:</span>
        <span class="detail-value">${booking.location}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Type:</span>
        <span class="detail-value">${booking.outcall ? 'Outcall' : 'Incall'}</span>
      </div>
    </div>
    
    <div class="section">
      <h2>💳 Payment Details</h2>
      <div class="detail-row">
        <span class="detail-label">Total Amount:</span>
        <span class="detail-value">$${booking.totalAmount}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Deposit Received:</span>
        <span class="detail-value">$${booking.depositAmount}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Balance Due:</span>
        <span class="detail-value"><strong>$${booking.totalAmount - booking.depositAmount}</strong></span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Payment Status:</span>
        <span class="detail-value">${booking.paymentStatus}</span>
      </div>
    </div>
    
    ${
      booking.specialRequests
        ? `
    <div class="section">
      <h2>📝 Special Requests</h2>
      <p>${booking.specialRequests}</p>
    </div>
    `
        : ''
    }
    
    <div class="highlight">
      Booking Reference: ${booking.id}
    </div>
    
    <div style="text-align: center;">
      <a href="https://avaliable.pro/admin" class="button">View in Admin Dashboard →</a>
    </div>
    
    <p style="margin-top: 30px;">Please confirm receipt of this booking notification.</p>
  </div>
  
  <div class="footer">
    <p>This is an automated notification from Avaliable.pro</p>
    <p>© ${new Date().getFullYear()} Avaliable.pro - Premium Companion Platform</p>
  </div>
</body>
</html>
    `.trim(),
  };

  try {
    const result = await sgMail.send(msg);
    console.log(`✓ Escort notification email sent to ${escort.email}`);
    return result;
  } catch (error) {
    console.error('✗ Failed to send escort notification email:', error);
    if (error.response) {
      console.error('SendGrid error details:', error.response.body);
    }
    throw error;
  }
}

/**
 * Send both confirmation emails for a booking
 */
async function sendBookingConfirmation(booking, escort, client) {
  try {
    await Promise.all([
      sendClientBookingConfirmation(booking, escort, client),
      sendEscortBookingNotification(booking, escort, client),
    ]);
    console.log('✓ All booking confirmation emails sent successfully');
    return { success: true };
  } catch (error) {
    console.error('✗ Error sending booking confirmation emails:', error);
    throw error;
  }
}

/**
 * Send test email to verify SendGrid configuration
 */
async function sendTestEmail(to) {
  const msg = {
    to,
    from: {
      email: SENDER_EMAIL,
      name: SENDER_NAME,
    },
    subject: 'Test Email - Avaliable.pro',
    text: 'This is a test email from your Avaliable.pro booking platform. If you received this, SendGrid is configured correctly!',
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; background: #f9f9f9; }
    .success { background: #28a745; color: white; padding: 20px; border-radius: 8px; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <h1>✓ Test Email</h1>
  </div>
  <div class="content">
    <div class="success">
      <h2>SendGrid is Working!</h2>
      <p>Your email configuration is set up correctly.</p>
    </div>
    <p style="margin-top: 30px;">This is a test email from your <strong>Avaliable.pro</strong> booking platform.</p>
    <p>If you received this, your SendGrid integration is configured correctly and ready to send booking confirmations!</p>
    <p><small>Sent at: ${new Date().toISOString()}</small></p>
  </div>
</body>
</html>
    `,
  };

  try {
    const result = await sgMail.send(msg);
    console.log(`✓ Test email sent to ${to}`);
    return result;
  } catch (error) {
    console.error('✗ Failed to send test email:', error);
    if (error.response) {
      console.error('SendGrid error details:', error.response.body);
    }
    throw error;
  }
}

module.exports = {
  sendBookingConfirmation,
  sendClientBookingConfirmation,
  sendEscortBookingNotification,
  sendTestEmail,
};
