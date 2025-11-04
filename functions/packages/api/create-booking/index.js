/**
 * DigitalOcean Function: Create Booking
 * URL: https://faas-region-namespace.doserverless.co/api/v1/web/api/create-booking
 */

function main(args) {
  // Handle CORS for browser requests
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle OPTIONS preflight
  if (args.__ow_method === 'options') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  try {
    const { name, email, date, time } = args;

    // Validate required fields
    if (!name || !email || !date || !time) {
      return {
        statusCode: 400,
        headers,
        body: {
          error: 'Validation error',
          message: 'Name, email, date, and time are required',
        },
      };
    }

    // Process booking logic here
    const booking = {
      id: `booking-${Date.now()}`,
      name,
      email,
      date,
      time,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    return {
      statusCode: 201,
      headers,
      body: {
        success: true,
        message: 'Booking created successfully',
        booking,
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: {
        error: 'Failed to create booking',
        message: error.message,
      },
    };
  }
}

exports.main = main;
