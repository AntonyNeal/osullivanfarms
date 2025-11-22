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
 * Handle query with OpenAI function calling
 */
async function handleWithOpenAI(question, conversationHistory, systemPrompt, farmContext) {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
    { role: 'user', content: question },
  ];

  // First API call - let AI decide if it needs tools
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    tools: TOOLS,
    tool_choice: 'auto',
    temperature: 0.7,
    max_tokens: 1000,
  });

  const responseMessage = completion.choices[0].message;

  // Check if AI wants to use tools
  if (responseMessage.tool_calls) {
    const toolResults = [];

    for (const toolCall of responseMessage.tool_calls) {
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);

      console.log(`[FarmAdvisor] AI calling tool: ${functionName}`, functionArgs);

      // Execute the tool
      const result = await executeTool(functionName, functionArgs);

      // Check if this tool requires confirmation
      if (result.requiresConfirmation) {
        // Return confirmation request to frontend
        return {
          success: true,
          requiresConfirmation: true,
          toolCall: {
            id: toolCall.id,
            name: functionName,
            args: functionArgs,
          },
          confirmationData: result.confirmationData,
          question,
          timestamp: new Date().toISOString(),
        };
      }

      // For read operations, add result to context
      toolResults.push({
        tool_call_id: toolCall.id,
        role: 'tool',
        name: functionName,
        content: JSON.stringify(result),
      });
    }

    // Second API call - AI responds with tool results
    const finalMessages = [
      ...messages,
      responseMessage,
      ...toolResults.map((r) => ({
        role: 'tool',
        tool_call_id: r.tool_call_id,
        content: r.content,
      })),
    ];

    const finalCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: finalMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const finalResponse = finalCompletion.choices[0].message.content;

    // Save important responses to memory (ignore errors)
    try {
      if (finalResponse.includes('performing well') || finalResponse.includes('concern')) {
        await autoSaveMemory('ai_insight', {
          question,
          response: finalResponse,
          tools_used: responseMessage.tool_calls.map((t) => t.function.name),
        });
      }
    } catch (memoryError) {
      console.log('[FarmAdvisor] Memory save failed:', memoryError.message);
    }

    return {
      success: true,
      question,
      response: finalResponse,
      toolsUsed: responseMessage.tool_calls.map((t) => t.function.name),
      timestamp: new Date().toISOString(),
    };
  }

  // No tools needed - direct response
  return {
    success: true,
    question,
    response: responseMessage.content,
    timestamp: new Date().toISOString(),
  };
}

/**
 * POST /api/farm-advisor/confirm
 * Execute a confirmed write operation
 */
async function handleConfirmedOperation(req, res) {
  try {
    const { toolCall, confirmed } = req.body;

    if (!confirmed) {
      return res.json({
        success: true,
        message: 'Operation cancelled by user',
        cancelled: true,
      });
    }

    console.log('[FarmAdvisor] Executing confirmed operation:', toolCall.name);

    // Execute the confirmed tool
    const result = await executeConfirmedTool(toolCall.name, toolCall.args);

    // Save to memory (ignore errors)
    try {
      await autoSaveMemory(`${toolCall.name}_executed`, {
        tool: toolCall.name,
        args: toolCall.args,
        result,
      });
    } catch (memoryError) {
      console.log('[FarmAdvisor] Memory save failed:', memoryError.message);
    }

    return res.json({
      success: true,
      message: result.message,
      data: result.data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[FarmAdvisor] Error executing confirmed operation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute operation',
      message: error.message,
    });
  }
}

/**
 * Pattern matching fallback (when OpenAI not available)
 */
async function handleWithPatternMatching(question, context) {
  const questionLower = question.toLowerCase();

  // Check for write operation requests
  if (questionLower.includes('move') && questionLower.includes('mob')) {
    return {
      success: true,
      response:
        'I can help you move a mob to a different location. However, I need OpenAI integration to be set up to handle write operations with confirmation. For now, please use the mob management interface to make this change directly.\n\nTo enable full AI capabilities, add your OPENAI_API_KEY to the environment variables.',
      needsOpenAI: true,
    };
  }

  // Delegate to existing pattern matching
  return {
    success: true,
    question,
    response: await generateResponse(question, '', context),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Categorize question for memory storage
 */
function categorizeQuestion(question) {
  const q = question.toLowerCase();

  if (q.includes('scan')) return 'scanning';
  if (q.includes('mark')) return 'marking';
  if (q.includes('wean')) return 'weaning';
  if (q.includes('lamb')) return 'lambing';
  if (q.includes('mob') || q.includes('perform')) return 'mob_performance';
  if (q.includes('move') || q.includes('paddock')) return 'mob_movement';
  if (q.includes('best') || q.includes('worst')) return 'comparison';

  return 'general';
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
