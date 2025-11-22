// Simple test endpoint to verify services load
async function testServices(req, res) {
  const results = {};

  try {
    const { getFarmContext } = require('../services/farmAdvisor');
    results.farmAdvisor = 'OK';
  } catch (e) {
    results.farmAdvisor = `ERROR: ${e.message}`;
  }

  try {
    const tools = require('../services/tools');
    results.tools = 'OK';
  } catch (e) {
    results.tools = `ERROR: ${e.message}`;
  }

  try {
    const instructions = require('../services/instructions');
    results.instructions = 'OK';
  } catch (e) {
    results.instructions = `ERROR: ${e.message}`;
  }

  try {
    const research = require('../services/research');
    results.research = 'OK';
  } catch (e) {
    results.research = `ERROR: ${e.message}`;
  }

  try {
    const memory = require('../services/memory');
    results.memory = 'OK';
  } catch (e) {
    results.memory = `ERROR: ${e.message}`;
  }

  res.json({
    success: true,
    services: results,
  });
}

module.exports = { testServices };
