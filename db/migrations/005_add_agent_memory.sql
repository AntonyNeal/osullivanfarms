-- Migration: Add agent_memory table for AI chatbot context
-- Purpose: Store conversation history, decisions, and farm events for continuity

CREATE TABLE IF NOT EXISTS agent_memory (
  memory_id SERIAL PRIMARY KEY,
  memory_type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  importance INTEGER DEFAULT 5 CHECK (importance >= 1 AND importance <= 10),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_agent_memory_type ON agent_memory(memory_type);
CREATE INDEX IF NOT EXISTS idx_agent_memory_importance ON agent_memory(importance DESC);
CREATE INDEX IF NOT EXISTS idx_agent_memory_created ON agent_memory(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_memory_content ON agent_memory USING gin(to_tsvector('english', content));

-- Add mob_events table if it doesn't exist (for tool operations)
CREATE TABLE IF NOT EXISTS mob_events (
  event_id SERIAL PRIMARY KEY,
  mob_id INTEGER NOT NULL REFERENCES mobs(mob_id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(100) DEFAULT 'system'
);

CREATE INDEX IF NOT EXISTS idx_mob_events_mob ON mob_events(mob_id);
CREATE INDEX IF NOT EXISTS idx_mob_events_date ON mob_events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_mob_events_type ON mob_events(event_type);

-- Add comments for documentation
COMMENT ON TABLE agent_memory IS 'Stores AI agent conversation context, decisions, and important farm events for continuity';
COMMENT ON COLUMN agent_memory.memory_type IS 'Type of memory: mob_stage_change, mob_location_change, performance_alert, user_question, decision_made, etc.';
COMMENT ON COLUMN agent_memory.importance IS 'Importance score 1-10 (10=critical, 1=trivial). Used for prioritization and cleanup.';
COMMENT ON COLUMN agent_memory.metadata IS 'Additional structured data related to the memory (mob_id, stage, location, etc.)';

COMMENT ON TABLE mob_events IS 'Records all events and changes for each mob (stage changes, location moves, notes, etc.)';
