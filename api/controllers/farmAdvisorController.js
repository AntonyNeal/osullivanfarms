// Farm Advisor API Route
const { getFarmContext, buildSystemPrompt } = require('../services/farmAdvisor');

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

    // Get farm context
    const context = await getFarmContext();
    const systemPrompt = buildSystemPrompt(context);

    // For now, return a structured response without calling OpenAI
    // This allows the frontend to work immediately
    // TODO: Integrate OpenAI API for intelligent responses

    const response = await generateResponse(question, systemPrompt, context);

    res.json({
      success: true,
      question,
      response,
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

/**
 * Generate response (placeholder - will integrate OpenAI)
 */
async function generateResponse(question, systemPrompt, context) {
  const questionLower = question.toLowerCase();

  // Simple pattern matching for common questions
  // This provides immediate functionality while OpenAI integration is pending

  if (
    questionLower.includes('best') &&
    (questionLower.includes('mob') || questionLower.includes('performing'))
  ) {
    const bestMob = context.mobs.reduce((best, mob) => {
      const scanningPercent = parseFloat(mob.scanning_percent || 0);
      return scanningPercent > parseFloat(best.scanning_percent || 0) ? mob : best;
    }, context.mobs[0]);

    return `Your best performing mob is **Mob ${bestMob.mob_id} - ${bestMob.mob_name}** with a scanning percentage of ${bestMob.scanning_percent}%. This is ${bestMob.scanning_performance} performance! They're ${bestMob.breed_name} ${bestMob.status_name} in the ${bestMob.team_name} team.`;
  }

  if (questionLower.includes('scanning') && questionLower.includes('average')) {
    const avg = parseFloat(context.farmStats.avg_scanning_percent || 0).toFixed(1);
    const target = 150;
    const comparison = avg >= target ? 'above' : 'below';
    const diff = Math.abs(avg - target).toFixed(1);

    return `Your average scanning percentage across all active mobs is **${avg}%**. The industry target is ${target}%, so you're ${diff}% ${comparison} the benchmark. ${avg >= target ? "Great work! You're performing well." : "There's room for improvement - consider reviewing nutrition and ram management."}`;
  }

  if (questionLower.includes('how many') && questionLower.includes('mob')) {
    return `You currently have **${context.farmStats.total_mobs} active mobs** being tracked, with a total of **${context.farmStats.total_ewes} ewes**. ${context.stageDistribution.map((s) => `${s.mob_count} mob(s) in ${s.current_stage} stage`).join(', ')}.`;
  }

  if (questionLower.includes('worst') || questionLower.includes('struggling')) {
    const worstMob = context.mobs.reduce(
      (worst, mob) => {
        const scanningPercent = parseFloat(mob.scanning_percent || 0);
        return scanningPercent < parseFloat(worst.scanning_percent || 0) && scanningPercent > 0
          ? mob
          : worst;
      },
      context.mobs.find((m) => m.scanning_percent) || context.mobs[0]
    );

    if (worstMob.scanning_percent) {
      return `**Mob ${worstMob.mob_id} - ${worstMob.mob_name}** has the lowest scanning percentage at ${worstMob.scanning_percent}%. This is ${worstMob.scanning_performance} performance. Consider reviewing nutrition levels, ram health, and joining management for this mob.`;
    }
  }

  // Default response with farm summary
  return `I can help you with questions about your ${context.farmStats.total_mobs} active mobs and ${context.farmStats.total_ewes} ewes. Try asking:

- "What's my best performing mob?"
- "What's my average scanning percentage?"
- "How many mobs do I have?"
- "Which mob is struggling?"

Your current average scanning percentage is ${parseFloat(context.farmStats.avg_scanning_percent || 0).toFixed(1)}% across all mobs.`;
}

module.exports = {
  handleFarmAdvisorQuery,
};
