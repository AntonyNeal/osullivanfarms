/**
 * DigitalOcean Function: Get Data
 * URL: https://faas-region-namespace.doserverless.co/api/v1/web/api/get-data
 */

function main(args) {
  // Handle CORS for browser requests
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
    const data = {
      message: 'Hello from DigitalOcean Functions',
      timestamp: new Date().toISOString(),
      params: args,
    };

    return {
      statusCode: 200,
      headers,
      body: data,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: {
        error: 'Failed to fetch data',
        message: error.message,
      },
    };
  }
}

exports.main = main;
