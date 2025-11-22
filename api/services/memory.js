const db = require('../db');

/**
 * Project Memory Service
 * Manages conversation context, key decisions, and farm events for the AI agent
 */

/**
 * Load recent memory for the AI agent
 */
async function loadMemory(limit = 20) {
  try {
    const result = await db.query(
      `
      SELECT 
        memory_id,
        memory_type,
        content,
        metadata,
        importance,
        created_at
      FROM agent_memory
      ORDER BY importance DESC, created_at DESC
      LIMIT $1
    `,
      [limit]
    );

    return {
      memories: result.rows,
      count: result.rows.length,
    };
  } catch (error) {
    console.error('[Memory] Error loading memories:', error);
    // If table doesn't exist yet, return empty
    return {
      memories: [],
      count: 0,
      note: 'Agent memory table not yet initialized',
    };
  }
}

/**
 * Save a new memory
 */
async function saveMemory(memoryType, content, metadata = {}, importance = 5) {
  try {
    const result = await db.query(
      `
      INSERT INTO agent_memory (memory_type, content, metadata, importance)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [memoryType, content, JSON.stringify(metadata), importance]
    );

    return {
      success: true,
      memory: result.rows[0],
    };
  } catch (error) {
    console.error('[Memory] Error saving memory:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Build memory context for system prompt
 */
async function buildMemoryContext(limit = 10) {
  const memoryData = await loadMemory(limit);

  if (memoryData.memories.length === 0) {
    return null;
  }

  let context = `**Recent Conversation & Decision Memory:**\n\n`;

  for (const memory of memoryData.memories) {
    const date = new Date(memory.created_at).toLocaleDateString('en-AU');
    context += `- [${date}] ${memory.content}\n`;

    // Add metadata if important
    if (memory.metadata && Object.keys(memory.metadata).length > 0) {
      context += `  Details: ${JSON.stringify(memory.metadata)}\n`;
    }
  }

  context += `\nUse this memory to maintain context across conversations and provide continuity in advice.\n`;

  return context;
}

/**
 * Auto-save important events as memories
 */
async function autoSaveMemory(eventType, data) {
  let content = '';
  let importance = 5;
  let metadata = {};

  switch (eventType) {
    case 'mob_stage_change':
      content = `Mob ${data.mob_id} moved to ${data.new_stage} stage`;
      importance = 7;
      metadata = { mob_id: data.mob_id, stage: data.new_stage };
      break;

    case 'mob_location_change':
      content = `Mob ${data.mob_id} relocated to ${data.new_location}`;
      importance = 6;
      metadata = { mob_id: data.mob_id, location: data.new_location };
      break;

    case 'performance_alert':
      content = `Performance alert: ${data.message}`;
      importance = 8;
      metadata = data;
      break;

    case 'user_question':
      content = `User asked: ${data.question}`;
      importance = 4;
      metadata = { question: data.question, category: data.category };
      break;

    case 'decision_made':
      content = `Decision: ${data.decision}`;
      importance = 9;
      metadata = data;
      break;

    default:
      content = JSON.stringify(data);
      importance = 5;
  }

  return await saveMemory(eventType, content, metadata, importance);
}

/**
 * Clean old, low-importance memories (keep database lean)
 */
async function cleanOldMemories(daysToKeep = 90, minImportance = 3) {
  try {
    const result = await db.query(
      `
      DELETE FROM agent_memory
      WHERE created_at < NOW() - INTERVAL '${daysToKeep} days'
      AND importance < $1
      RETURNING memory_id
    `,
      [minImportance]
    );

    console.log(`[Memory] Cleaned ${result.rows.length} old memories`);

    return {
      success: true,
      deletedCount: result.rows.length,
    };
  } catch (error) {
    console.error('[Memory] Error cleaning memories:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get memory statistics
 */
async function getMemoryStats() {
  try {
    const result = await db.query(`
      SELECT 
        COUNT(*) as total_memories,
        COUNT(CASE WHEN importance >= 8 THEN 1 END) as high_importance,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as recent_memories,
        MAX(created_at) as last_memory_at
      FROM agent_memory
    `);

    return {
      success: true,
      stats: result.rows[0],
    };
  } catch (error) {
    console.error('[Memory] Error getting stats:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Search memories by content or type
 */
async function searchMemories(query, memoryType = null, limit = 20) {
  try {
    let sql = `
      SELECT *
      FROM agent_memory
      WHERE content ILIKE $1
    `;
    const params = [`%${query}%`];

    if (memoryType) {
      params.push(memoryType);
      sql += ` AND memory_type = $${params.length}`;
    }

    sql += ` ORDER BY importance DESC, created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await db.query(sql, params);

    return {
      success: true,
      memories: result.rows,
      count: result.rows.length,
    };
  } catch (error) {
    console.error('[Memory] Error searching memories:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

module.exports = {
  loadMemory,
  saveMemory,
  buildMemoryContext,
  autoSaveMemory,
  cleanOldMemories,
  getMemoryStats,
  searchMemories,
};
