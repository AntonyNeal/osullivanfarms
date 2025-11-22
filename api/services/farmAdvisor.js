const db = require('../db');

/**
 * Farm Advisor Service
 * Builds context from farm data for AI responses
 */

/**
 * Get comprehensive farm context for AI advisor
 */
async function getFarmContext() {
  try {
    // Get all mobs with KPIs
    const mobsResult = await db.query(`
      SELECT * FROM mob_kpi_summary 
      WHERE is_active = TRUE 
      ORDER BY last_updated DESC
    `);

    // Get farm-wide statistics
    const statsResult = await db.query(`
      SELECT 
        COUNT(*) as total_mobs,
        SUM(ewes_joined) as total_ewes,
        AVG(scanning_percent) as avg_scanning_percent,
        AVG(marking_percent) as avg_marking_percent,
        AVG(weaning_percent) as avg_weaning_percent,
        MAX(scanning_percent) as best_scanning_percent,
        MIN(scanning_percent) as worst_scanning_percent
      FROM mobs
      WHERE is_active = TRUE
    `);

    // Get stage distribution
    const stagesResult = await db.query(`
      SELECT 
        current_stage,
        COUNT(*) as mob_count,
        SUM(ewes_joined) as total_ewes
      FROM mobs
      WHERE is_active = TRUE
      GROUP BY current_stage
      ORDER BY 
        CASE current_stage
          WHEN 'Pre-Joining' THEN 1
          WHEN 'Joining' THEN 2
          WHEN 'Scanning' THEN 3
          WHEN 'Lambing' THEN 4
          WHEN 'Marking' THEN 5
          WHEN 'Weaning' THEN 6
          ELSE 7
        END
    `);

    return {
      mobs: mobsResult.rows,
      farmStats: statsResult.rows[0],
      stageDistribution: stagesResult.rows,
    };
  } catch (error) {
    console.error('[FarmAdvisor] Error building context:', error);
    throw error;
  }
}

/**
 * Build system prompt for AI with farm context
 */
function buildSystemPrompt(context) {
  const { mobs, farmStats, stageDistribution } = context;

  return `You are an expert AI farm advisor for O'Sullivan Farms, a sheep farming operation in Echuca, Victoria, Australia.

**Farm Context:**
- Total Active Mobs: ${farmStats.total_mobs}
- Total Ewes: ${farmStats.total_ewes}
- Average Scanning %: ${parseFloat(farmStats.avg_scanning_percent || 0).toFixed(1)}%
- Best Scanning %: ${parseFloat(farmStats.best_scanning_percent || 0).toFixed(1)}%

**Current Mob Distribution:**
${stageDistribution.map((s) => `- ${s.current_stage}: ${s.mob_count} mob(s), ${s.total_ewes} ewes`).join('\n')}

**Individual Mobs:**
${mobs
  .map(
    (m) => `
Mob ${m.mob_id} - ${m.mob_name}:
- Breed: ${m.breed_name}, Team: ${m.team_name}, Zone: ${m.zone_name}
- Stage: ${m.current_stage}, Location: ${m.current_location}
- Ewes Joined: ${m.ewes_joined}, Rams: ${m.rams_in}
- Scanning: ${m.scanning_percent || 'N/A'}% (${m.scanning_performance || 'Not scanned'})
- Marking: ${m.marking_percent || 'N/A'}%
- Weaning: ${m.weaning_percent || 'N/A'}%
`
  )
  .join('\n')}

**Industry Benchmarks:**
- Target Scanning: 150% (excellent performance)
- Target Marking: 130%
- Target Weaning: 125%
- Recommended Ram Ratio: 1 ram per 50 ewes

**Your Role:**
- Provide practical, Australian-context farming advice
- Reference specific mob data when answering
- Compare performance to industry benchmarks
- Use Australian terminology and measurements (metric)
- Be encouraging but honest about performance
- Offer specific, actionable recommendations

Answer questions clearly and concisely. Reference mob numbers and specific data when relevant.`;
}

module.exports = {
  getFarmContext,
  buildSystemPrompt,
};
