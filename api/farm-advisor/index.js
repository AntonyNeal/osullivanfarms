module.exports = async function (context, req) {
  context.log('[FarmAdvisor] Function invoked');

  try {
    const { question } = req.body || {};

    if (!question || typeof question !== 'string') {
      context.log('[FarmAdvisor] Invalid question:', question);
      context.res = {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Question is required',
        }),
      };
      return;
    }

    context.log('[FarmAdvisor] Processing question:', question);

    // TEMPORARY: Return a simple response to test endpoint
    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        question,
        response: 'Farm advisor endpoint is working - dedicated Azure Function',
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    context.log.error('[FarmAdvisor] Error:', error);
    context.res = {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Failed to process farm advisor query',
        message: error.message,
      }),
    };
  }
};
