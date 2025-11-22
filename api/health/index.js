module.exports = async function (context, req) {
  context.res = {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: "O'Sullivan Farms API",
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: ['/health', '/bookings', '/status', '/payments', '/mobs'],
    }),
  };
};
