# Farm Advisor Agentic Chatbot System

## Overview

The Farm Advisor is an intelligent AI chatbot with MCP-style (Model Context Protocol) database access, research paper integration, project memory, and comprehensive instruction sets. It provides data-driven farm management advice with safety controls for write operations.

## Architecture

### 1. **Tools System** (`api/services/tools.js`)

MCP-style database access with read/write separation:

**Read Tools (Execute Immediately):**

- `get_mobs` - View mob details, breeding data, performance metrics
- `get_farm_statistics` - Farm-wide stats and averages
- `get_stage_distribution` - Mob distribution across breeding stages
- `get_mob_history` - Historical records and events for a mob

**Write Tools (Require User Confirmation):**

- `update_mob_stage` - Move a mob to a different breeding stage
- `update_mob_location` - Change a mob's paddock location
- `add_mob_note` - Record observations about a mob

**Safety Features:**

- Write operations return confirmation requests, not immediate execution
- All write operations log to `mob_events` table
- Preview shows before/after state
- User must explicitly approve changes

### 2. **Research Paper Integration** (`api/services/research.js`)

Direct LLM access to PDF research papers:

**Features:**

- Loads documents from `api/research/` folder
- Supports PDF, TXT, and MD formats
- Chunks text for better LLM context (1000 chars with 100 char overlap)
- In-memory caching (1-hour TTL)
- Keyword search across papers

**To Add Research Papers:**

1. Place PDF/TXT/MD files in `api/research/` folder
2. Papers are automatically loaded on next request
3. Content is injected into system prompt
4. LLM can reference research when answering

**Note:** PDF parsing requires `pdf-parse` library (not yet installed). Currently works with TXT/MD files.

### 3. **Instruction Set** (`api/services/instructions.js`)

Comprehensive system prompt covering:

**Core Instructions:**

- Role as Australian sheep farm advisor
- Industry benchmarks and best practices
- Tool usage guidelines
- Safety and ethics rules
- Response formatting standards

**Context Included:**

- Current farm state (mobs, stats, stages)
- Research paper summaries
- Project memory (conversation history)

**Australian Context:**

- Echuca, Victoria climate
- Metric measurements
- Australian terminology (mob, paddock, drench)
- Seasonal breeding cycles
- Local industry standards

### 4. **Project Memory** (`api/services/memory.js`)

Persistent conversation context and decision tracking:

**Memory Types:**

- `user_question` - Questions asked (importance: 4)
- `mob_stage_change` - Stage transitions (importance: 7)
- `mob_location_change` - Paddock moves (importance: 6)
- `performance_alert` - Performance issues (importance: 8)
- `decision_made` - Major decisions (importance: 9)
- `ai_insight` - Important AI observations (importance: 7)

**Features:**

- Importance scoring (1-10) for prioritization
- Automatic cleanup of old, low-importance memories (90 days, <3 importance)
- Full-text search across memories
- Metadata storage (JSON) for structured data

**Database Schema:**

```sql
CREATE TABLE agent_memory (
  memory_id SERIAL PRIMARY KEY,
  memory_type VARCHAR(50),
  content TEXT,
  metadata JSONB,
  importance INTEGER CHECK (1-10),
  created_at TIMESTAMP
);
```

### 5. **Controller** (`api/controllers/farmAdvisorController.js`)

Orchestrates AI agent with tool execution:

**OpenAI Mode (when OPENAI_API_KEY set):**

- Uses GPT-4o with function calling
- AI decides which tools to use
- Handles tool execution and confirmation flows
- Two-step process: tool call → LLM response with results

**Pattern Matching Mode (fallback):**

- Simple keyword matching for common questions
- No database writes
- Suggests OpenAI integration for advanced features

**Endpoints:**

- `POST /api/farm-advisor` - Main chat endpoint
- `POST /api/farm-advisor/confirm` - Execute confirmed write operations

## Frontend Integration

### FarmAdvisorChat Component

React component with:

- Message history (user/assistant/system)
- Tool usage indicators
- Confirmation dialogs for write operations
- OpenAI status badges
- Suggested questions

**Confirmation Flow:**

1. User requests write operation (e.g., "Move Mob 5 to Paddock 12")
2. Backend returns confirmation request
3. UI shows yellow dialog with details
4. User clicks Confirm or Cancel
5. Backend executes or cancels operation
6. System message shows result

## Setup Instructions

### 1. Database Migration

Run the agent memory migration:

```sql
-- In Azure Data Studio or psql
\i db/migrations/005_add_agent_memory.sql
```

### 2. Install Dependencies

```bash
cd api
npm install openai  # For OpenAI integration
# npm install pdf-parse  # For PDF parsing (optional)
```

### 3. Environment Variables

Add to Azure Function App Settings (or local.settings.json):

```json
{
  "OPENAI_API_KEY": "sk-..."
}
```

### 4. Deploy

```bash
git add -A
git commit -m "Add agentic chatbot system with MCP-style tools"
git push
```

## Usage Examples

### 1. Read Operations (Immediate)

**User:** "What's my best performing mob?"

**AI Actions:**

- Calls `get_mobs` tool
- Analyzes scanning percentages
- Returns data-driven answer

**Response:** "Your best performing mob is Mob 1 - Merino Ewes with 143% scanning..."

### 2. Write Operations (Requires Confirmation)

**User:** "Move Mob 2 to Paddock 15"

**AI Actions:**

- Calls `update_mob_location` tool
- Returns confirmation request

**Confirmation Dialog:**

```
⚠️ Update Mob Location

This will move Mob 2 (Dorper Ewes) from "Paddock 12" to "Paddock 15"

Details:
- mob: Mob 2 - Dorper Ewes
- currentLocation: Paddock 12
- newLocation: Paddock 15

[Cancel] [Confirm]
```

### 3. Research Integration

**User:** "What does the research say about twin lambs?"

**AI Actions:**

- Searches loaded research papers for "twin lambs"
- Retrieves relevant chunks
- Synthesizes answer with farm data

### 4. Memory System

Automatically tracks:

- Important questions and answers
- Stage changes and moves
- Performance alerts
- User decisions

Provides continuity across sessions.

## Tool Execution Flow

```
User Question
    ↓
[Load Context]
- Farm data (mobs, stats)
- Research papers
- Project memory
    ↓
[Build System Prompt]
- Instructions
- Context summaries
- Tool definitions
    ↓
[OpenAI API Call #1]
- Send question + context
- AI decides if tools needed
    ↓
[Tool Execution]
→ Read Tool: Execute immediately
→ Write Tool: Return confirmation
    ↓
[If Write Tool]
→ Show confirmation dialog
→ Wait for user approval
→ Execute on confirmation
    ↓
[OpenAI API Call #2]
- Send tool results
- AI generates final response
    ↓
[Save to Memory]
- Log question
- Log tool usage
- Log insights
    ↓
Response to User
```

## Safety Features

### 1. Write Operation Controls

- **Preview:** Shows before/after state
- **Confirmation:** Explicit user approval required
- **Validation:** Checks mob IDs exist
- **Audit Trail:** All changes logged to `mob_events`

### 2. Scope Boundaries

AI instructed to:

- Focus on farm management and breeding cycles
- Refer to veterinarian for health concerns
- Defer to agronomist for soil/pasture issues
- Avoid legal/financial advice

### 3. Data Integrity

- No historical record modifications
- No deletions without explicit operations
- All write operations logged with timestamps
- Failed operations don't corrupt data

## Performance Considerations

### 1. Caching

- Research papers: 1-hour TTL
- Farm context: Fetched per request
- Memory: Database-backed, indexed

### 2. Database Indexes

```sql
-- Agent memory indexes
CREATE INDEX idx_agent_memory_type ON agent_memory(memory_type);
CREATE INDEX idx_agent_memory_importance ON agent_memory(importance DESC);
CREATE INDEX idx_agent_memory_created ON agent_memory(created_at DESC);
CREATE INDEX idx_agent_memory_content ON agent_memory USING gin(to_tsvector('english', content));
```

### 3. Token Optimization

- Context summaries (not full data)
- Chunked research papers
- Top 10-20 recent memories
- Efficient tool definitions

## Cost Management

### OpenAI API Costs

- Model: GPT-4o (~$2.50/1M input tokens, ~$10/1M output)
- Typical query: 2000-3000 tokens input, 500-1000 output
- Estimated: $0.01-0.03 per conversation

### Optimization Strategies

1. Use pattern matching for simple queries
2. Cache research paper context
3. Limit memory to recent/important items
4. Efficient tool definitions
5. Consider GPT-3.5-turbo for basic queries

## Troubleshooting

### "OpenAI library not installed"

```bash
cd api
npm install openai
```

### "Agent memory table not yet initialized"

```sql
\i db/migrations/005_add_agent_memory.sql
```

### "PDF parsing not yet implemented"

```bash
cd api
npm install pdf-parse
```

Then restart the API.

### Confirmation dialogs not showing

1. Check browser console for errors
2. Verify `/farm-advisor/confirm` endpoint exists
3. Ensure `pendingConfirmation` state updates

## Future Enhancements

### 1. Vector Database

Replace keyword search with semantic similarity:

- Integrate Azure Cognitive Search or Pinecone
- Embed research papers and memories
- RAG (Retrieval Augmented Generation)

### 2. Advanced Tools

Additional database operations:

- `create_mob` - Add new mob
- `update_breeding_data` - Update KPIs
- `generate_report` - Export data
- `schedule_event` - Plan activities

### 3. Multi-Modal

- Image analysis (mob photos, paddock conditions)
- Voice input/output
- Chart generation

### 4. Automation

- Scheduled memory cleanup
- Automatic performance alerts
- Proactive recommendations

## Contributing

When adding new tools:

1. Define in `TOOLS` array with JSON schema
2. Add to `READ_OPERATIONS` or `WRITE_OPERATIONS`
3. For write ops, implement `prepare()` and `execute()`
4. Update system instructions
5. Test confirmation flow

## License

Part of O'Sullivan Farms sheep management system.
