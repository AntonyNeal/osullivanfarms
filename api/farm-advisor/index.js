const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

// Initialize OpenAI (lazy - only if OPENAI_API_KEY is set)
let openai = null;
function getOpenAI() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

// Load research knowledge (cached after first load)
let researchKnowledge = null;
function loadResearchKnowledge() {
  if (researchKnowledge) return researchKnowledge;

  try {
    const knowledgePath = path.join(__dirname, '../research/farm-advisor-knowledge.md');
    researchKnowledge = fs.readFileSync(knowledgePath, 'utf-8');
    return researchKnowledge;
  } catch (error) {
    console.error('[FarmAdvisor] Failed to load research knowledge:', error);
    return null;
  }
}

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

    // Load research knowledge
    const knowledge = loadResearchKnowledge();

    // Check if OpenAI is available
    const ai = getOpenAI();

    let response;
    if (ai && knowledge) {
      // Use OpenAI with research knowledge context
      context.log('[FarmAdvisor] Using OpenAI with research knowledge');

      const completion = await ai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are an experienced sheep farmer and advisor from O'Sullivan Farms in Echuca, Victoria, Australia. You have decades of hands-on experience managing sheep breeding operations and know the industry inside and out. 

Draw on the following practical experience when answering questions:

${knowledge}

Answer questions naturally as if you're sharing advice from your years of farming experience. Use conversational language and speak from a place of practical, field-tested knowledge. Don't mention "research" or "data" - just share what you know works from experience.`,
          },
          {
            role: 'user',
            content: question,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      response = completion.choices[0].message.content;
    } else {
      // Fallback response without OpenAI
      context.log('[FarmAdvisor] OpenAI not available - using fallback response');
      response =
        `Farm advisor endpoint is working! Your question: "${question}"\n\n` +
        (knowledge
          ? `Research knowledge loaded successfully (${knowledge.length} characters). To get AI-powered responses, configure OPENAI_API_KEY environment variable.`
          : 'Research knowledge not available. Please ensure farm-advisor-knowledge.md exists.');
    }

    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        question,
        response,
        usedAI: !!ai,
        hasKnowledge: !!knowledge,
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
