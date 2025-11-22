// Azure Functions HTTP Trigger - Routes all requests through Express app
const app = require('../index');

module.exports = async function (context, req) {
  context.log('HTTP trigger function processed a request.');

  try {
    // Get the result from the Express app handler
    const result = await app(context, req);

    // Set the response
    context.res = result;
  } catch (error) {
    context.log.error('Error processing request:', error);
    context.res = {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
      }),
    };
  }
};

// Updated 2025-11-22

// Redeploy 2025-11-22 18:50
