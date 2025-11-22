// Farm Advisor API Route

/**
 * POST /api/farm-advisor
 * Process user questions and return AI-generated farm advice
 */
async function handleFarmAdvisorQuery(req, res) {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Question is required',
      });
    }

    console.log('[FarmAdvisor] Processing question:', question);

    // TEMPORARY: Return a simple response to test endpoint
    res.json({
      success: true,
      question,
      response: 'Farm advisor endpoint is working. Clean controller file.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[FarmAdvisor] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process farm advisor query',
      message: error.message,
    });
  }
}

module.exports = {
  handleFarmAdvisorQuery,
};
