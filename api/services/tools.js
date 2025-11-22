const db = require('../db');

/**
 * Farm Advisor Tools - MCP-style database access system
 * Read operations: Execute immediately
 * Write operations: Require user confirmation
 */

// Tool definitions for OpenAI function calling
const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'get_mobs',
      description:
        'Get information about all active mobs including breeding data, locations, and performance metrics',
      parameters: {
        type: 'object',
        properties: {
          mob_id: {
            type: 'integer',
            description: 'Optional: Filter by specific mob ID',
          },
          stage: {
            type: 'string',
            description:
              'Optional: Filter by breeding stage (Pre-Joining, Joining, Scanning, Lambing, Marking, Weaning)',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_farm_statistics',
      description:
        'Get farm-wide statistics including total mobs, ewes, and average performance metrics',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_stage_distribution',
      description: 'Get the distribution of mobs across different breeding stages with ewe counts',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_mob_history',
      description: 'Get historical records for a specific mob including breeding cycles and events',
      parameters: {
        type: 'object',
        properties: {
          mob_id: {
            type: 'integer',
            description: 'The mob ID to get history for',
          },
          limit: {
            type: 'integer',
            description: 'Maximum number of records to return (default 10)',
          },
        },
        required: ['mob_id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_mob_stage',
      description:
        'Update the breeding stage of a mob. REQUIRES USER CONFIRMATION. Use when user wants to move a mob to the next stage.',
      parameters: {
        type: 'object',
        properties: {
          mob_id: {
            type: 'integer',
            description: 'The mob ID to update',
          },
          new_stage: {
            type: 'string',
            description: 'The new breeding stage',
            enum: ['Pre-Joining', 'Joining', 'Scanning', 'Lambing', 'Marking', 'Weaning'],
          },
          notes: {
            type: 'string',
            description: 'Optional notes about the stage change',
          },
        },
        required: ['mob_id', 'new_stage'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_mob_location',
      description:
        'Update the location/paddock of a mob. REQUIRES USER CONFIRMATION. Use when user wants to move a mob to a different paddock.',
      parameters: {
        type: 'object',
        properties: {
          mob_id: {
            type: 'integer',
            description: 'The mob ID to update',
          },
          new_location: {
            type: 'string',
            description: 'The new paddock/location name',
          },
          notes: {
            type: 'string',
            description: 'Optional notes about the move',
          },
        },
        required: ['mob_id', 'new_location'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'add_mob_note',
      description:
        'Add a note/observation about a mob. REQUIRES USER CONFIRMATION. Use when user wants to record observations.',
      parameters: {
        type: 'object',
        properties: {
          mob_id: {
            type: 'integer',
            description: 'The mob ID to add note to',
          },
          note: {
            type: 'string',
            description: 'The note content',
          },
          category: {
            type: 'string',
            description: 'Note category',
            enum: ['health', 'nutrition', 'breeding', 'general'],
          },
        },
        required: ['mob_id', 'note'],
      },
    },
  },
];

// Read-only operations (execute immediately)
const READ_OPERATIONS = {
  get_mobs: async (args) => {
    let query = 'SELECT * FROM mob_kpi_summary WHERE is_active = TRUE';
    const params = [];

    if (args.mob_id) {
      params.push(args.mob_id);
      query += ` AND mob_id = $${params.length}`;
    }

    if (args.stage) {
      params.push(args.stage);
      query += ` AND current_stage = $${params.length}`;
    }

    query += ' ORDER BY last_updated DESC';

    const result = await db.query(query, params);
    return {
      success: true,
      data: result.rows,
      count: result.rows.length,
    };
  },

  get_farm_statistics: async () => {
    const result = await db.query(`
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

    return {
      success: true,
      data: result.rows[0],
    };
  },

  get_stage_distribution: async () => {
    const result = await db.query(`
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
      success: true,
      data: result.rows,
    };
  },

  get_mob_history: async (args) => {
    const limit = args.limit || 10;
    const result = await db.query(
      `
      SELECT 
        event_date,
        event_type,
        description,
        created_at
      FROM mob_events
      WHERE mob_id = $1
      ORDER BY event_date DESC, created_at DESC
      LIMIT $2
    `,
      [args.mob_id, limit]
    );

    return {
      success: true,
      data: result.rows,
      count: result.rows.length,
    };
  },
};

// Write operations (require confirmation)
const WRITE_OPERATIONS = {
  update_mob_stage: {
    requiresConfirmation: true,
    prepare: async (args) => {
      // Get current mob data
      const mobResult = await db.query('SELECT * FROM mobs WHERE mob_id = $1', [args.mob_id]);

      if (mobResult.rows.length === 0) {
        throw new Error(`Mob ${args.mob_id} not found`);
      }

      const mob = mobResult.rows[0];

      return {
        action: 'Update Mob Stage',
        details: {
          mob: `Mob ${mob.mob_id} - ${mob.mob_name}`,
          currentStage: mob.current_stage,
          newStage: args.new_stage,
          notes: args.notes || 'None',
        },
        preview: `This will move Mob ${mob.mob_id} (${mob.mob_name}) from "${mob.current_stage}" to "${args.new_stage}"`,
      };
    },
    execute: async (args) => {
      const result = await db.query(
        `
        UPDATE mobs 
        SET current_stage = $1, updated_at = NOW()
        WHERE mob_id = $2
        RETURNING *
      `,
        [args.new_stage, args.mob_id]
      );

      // Log the event
      await db.query(
        `
        INSERT INTO mob_events (mob_id, event_type, description, event_date)
        VALUES ($1, 'stage_change', $2, NOW())
      `,
        [args.mob_id, `Stage changed to ${args.new_stage}. ${args.notes || ''}`]
      );

      return {
        success: true,
        message: `Successfully updated mob ${args.mob_id} to stage "${args.new_stage}"`,
        data: result.rows[0],
      };
    },
  },

  update_mob_location: {
    requiresConfirmation: true,
    prepare: async (args) => {
      const mobResult = await db.query('SELECT * FROM mobs WHERE mob_id = $1', [args.mob_id]);

      if (mobResult.rows.length === 0) {
        throw new Error(`Mob ${args.mob_id} not found`);
      }

      const mob = mobResult.rows[0];

      return {
        action: 'Update Mob Location',
        details: {
          mob: `Mob ${mob.mob_id} - ${mob.mob_name}`,
          currentLocation: mob.current_location || 'Not set',
          newLocation: args.new_location,
          notes: args.notes || 'None',
        },
        preview: `This will move Mob ${mob.mob_id} (${mob.mob_name}) from "${mob.current_location || 'current location'}" to "${args.new_location}"`,
      };
    },
    execute: async (args) => {
      const result = await db.query(
        `
        UPDATE mobs 
        SET current_location = $1, updated_at = NOW()
        WHERE mob_id = $2
        RETURNING *
      `,
        [args.new_location, args.mob_id]
      );

      // Log the event
      await db.query(
        `
        INSERT INTO mob_events (mob_id, event_type, description, event_date)
        VALUES ($1, 'location_change', $2, NOW())
      `,
        [args.mob_id, `Moved to ${args.new_location}. ${args.notes || ''}`]
      );

      return {
        success: true,
        message: `Successfully moved mob ${args.mob_id} to "${args.new_location}"`,
        data: result.rows[0],
      };
    },
  },

  add_mob_note: {
    requiresConfirmation: true,
    prepare: async (args) => {
      const mobResult = await db.query('SELECT * FROM mobs WHERE mob_id = $1', [args.mob_id]);

      if (mobResult.rows.length === 0) {
        throw new Error(`Mob ${args.mob_id} not found`);
      }

      const mob = mobResult.rows[0];

      return {
        action: 'Add Mob Note',
        details: {
          mob: `Mob ${mob.mob_id} - ${mob.mob_name}`,
          category: args.category || 'general',
          note: args.note,
        },
        preview: `This will add a ${args.category || 'general'} note to Mob ${mob.mob_id} (${mob.mob_name})`,
      };
    },
    execute: async (args) => {
      // Log the event
      const result = await db.query(
        `
        INSERT INTO mob_events (mob_id, event_type, description, event_date)
        VALUES ($1, $2, $3, NOW())
        RETURNING *
      `,
        [args.mob_id, args.category || 'general', args.note]
      );

      return {
        success: true,
        message: `Successfully added note to mob ${args.mob_id}`,
        data: result.rows[0],
      };
    },
  },
};

/**
 * Execute a tool function
 */
async function executeTool(toolName, args) {
  try {
    // Check if it's a read operation
    if (READ_OPERATIONS[toolName]) {
      const result = await READ_OPERATIONS[toolName](args);
      return {
        ...result,
        toolName,
        requiresConfirmation: false,
      };
    }

    // Check if it's a write operation
    if (WRITE_OPERATIONS[toolName]) {
      const operation = WRITE_OPERATIONS[toolName];

      // For write operations, return a confirmation request
      const confirmationData = await operation.prepare(args);

      return {
        requiresConfirmation: true,
        toolName,
        args,
        confirmationData,
      };
    }

    throw new Error(`Unknown tool: ${toolName}`);
  } catch (error) {
    console.error(`[Tools] Error executing ${toolName}:`, error);
    return {
      success: false,
      error: error.message,
      toolName,
    };
  }
}

/**
 * Execute a confirmed write operation
 */
async function executeConfirmedTool(toolName, args) {
  try {
    if (!WRITE_OPERATIONS[toolName]) {
      throw new Error(`Unknown write operation: ${toolName}`);
    }

    const operation = WRITE_OPERATIONS[toolName];
    const result = await operation.execute(args);

    return {
      ...result,
      toolName,
      confirmed: true,
    };
  } catch (error) {
    console.error(`[Tools] Error executing confirmed ${toolName}:`, error);
    return {
      success: false,
      error: error.message,
      toolName,
    };
  }
}

module.exports = {
  TOOLS,
  executeTool,
  executeConfirmedTool,
  READ_OPERATIONS,
  WRITE_OPERATIONS,
};
